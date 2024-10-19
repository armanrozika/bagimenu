import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { authorizeUser } from "./helper/helper";

export const get = query({
  args: {
    id: v.union(v.id("categories"), v.literal("ALL")),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const identity = await authorizeUser(ctx, "No Auth: get products");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");

    if (args.id === "ALL") {
      const products = await ctx.db
        .query("products")
        .withIndex("by_store", (q) => {
          return q.eq("store_id", user.default_store!);
        })
        .order("desc")
        .paginate(args.paginationOpts);

      return products;
    } else {
      const products = await ctx.db
        .query("products")
        .filter((q) => {
          return q.and(
            q.eq(q.field("store_id"), user.default_store),
            q.eq(q.field("category_id"), args.id)
          );
        })
        .order("desc")
        .paginate(args.paginationOpts);
      return products;
    }
  },
});

export const getProduct = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    return product;
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    image_url: v.string(),
    category_id: v.union(v.id("categories"), v.literal("ALL")),
  },
  handler: async (ctx, args) => {
    const identity = await authorizeUser(ctx, "No Auth: add products");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");
    if (user.default_store) {
      await ctx.db.insert("products", {
        name: args.name,
        price: args.price,
        is_active: true,
        image_url: args.image_url,
        store_id: user.default_store,
        category_id: args.category_id,
      });
    }
  },
});

export const patch = mutation({
  args: {
    id: v.id("products"),
    formData: v.object({
      name: v.string(),
      price: v.number(),
      image_url: v.string(),
      category_id: v.union(v.id("categories"), v.literal("ALL")),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await authorizeUser(ctx, "No Auth: add categories");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");
    const product = await ctx.db.get(args.id);
    if (product?.store_id !== user.default_store) {
      throw new Error("default_store Don't Match: patch product");
    }
    await ctx.db.patch(args.id, args.formData);
  },
});

export const deleteProduct = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    const identity = await authorizeUser(ctx, "No Auth: add categories");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");
    const product = await ctx.db.get(args.id);
    if (product?.store_id !== user.default_store) {
      throw new Error("default_store Don't Match: delete product");
    }
    await ctx.db.delete(args.id);
  },
});

export const searchProduct = query({
  args: {
    searchParams: v.string(),
    categoryId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await authorizeUser(ctx, "No Auth: search product");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");
    if (!user.default_store) return;
    if (args.categoryId === "ALL") {
      const products = await ctx.db
        .query("products")
        .withSearchIndex("search_name", (q) => {
          return q
            .search("name", args.searchParams)
            .eq("store_id", user.default_store!);
        })
        .collect();
      return products;
    } else {
      const products = await ctx.db
        .query("products")
        .withSearchIndex("search_name", (q) => {
          return q
            .search("name", args.searchParams)
            .eq("store_id", user.default_store!);
        })
        .filter((q) => q.eq(q.field("category_id"), args.categoryId))
        .collect();
      return products;
    }
  },
});
