import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { mutation, query } from "./_generated/server";
import { authorizeUser } from "./helper/helper";
import { Id } from "./_generated/dataModel";

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
    if (!product) return;
    const productTags = await ctx.db
      .query("productTags")
      .withIndex("by_productId", (q) => {
        return q.eq("product_id", product?._id);
      })
      .collect();
    const tagsIds = productTags.map((tag) => {
      return tag.tag_id;
    });
    return {
      ...product,
      tags: tagsIds,
    };
  },
});

export const add = mutation({
  args: {
    name: v.string(),
    price: v.number(),
    image_url: v.string(),
    category_id: v.union(v.id("categories"), v.literal("ALL")),
    notes: v.string(),
    tag_ids: v.array(v.id("tags")),
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
      const product = await ctx.db.insert("products", {
        name: args.name,
        price: args.price,
        is_active: true,
        image_url: args.image_url,
        store_id: user.default_store,
        category_id: args.category_id,
        notes: args.notes,
      });
      const promises: Promise<Id<"productTags">>[] = [];
      args.tag_ids.forEach((tag_id) => {
        const inserts = ctx.db.insert("productTags", {
          tag_id: tag_id,
          product_id: product,
        });
        promises.push(inserts);
      });
      await Promise.all(promises);
    }
  },
});

export const patch = mutation({
  args: {
    id: v.id("products"),
    tag_ids: v.array(v.id("tags")),
    formData: v.object({
      name: v.string(),
      price: v.number(),
      image_url: v.string(),
      category_id: v.union(v.id("categories"), v.literal("ALL")),
      notes: v.string(),
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
    const productTags = await ctx.db
      .query("productTags")
      .withIndex("by_productId", (q) => {
        return q.eq("product_id", product?._id);
      })
      .collect();
    const promises: Promise<void>[] = [];
    productTags.forEach((productTag) => {
      const inserts = ctx.db.delete(productTag._id);
      promises.push(inserts);
    });
    await Promise.all(promises);

    //add new one
    const promisesAdd: Promise<Id<"productTags">>[] = [];
    args.tag_ids.forEach((tag_id) => {
      const inserts = ctx.db.insert("productTags", {
        tag_id: tag_id,
        product_id: args.id,
      });
      promisesAdd.push(inserts);
    });
    await Promise.all(promises);
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
