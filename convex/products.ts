import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authorizeUser } from "./helper/helper";

export const get = query({
  handler: async (ctx) => {
    const identity = await authorizeUser(ctx, "No Auth: get products");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();

    if (user) {
      if (user.default_store) {
        const products = await ctx.db
          .query("products")
          .withIndex("by_toko", (q) => {
            return q.eq("store_id", user.default_store!);
          })
          .collect();
        return products;
      } else {
        return "no store";
      }
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
  },
  handler: async (ctx, args) => {
    const identity = await authorizeUser(ctx, "No Auth: add products");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();

    if (user) {
      if (!user.default_store) return;
      const res = await ctx.db.insert("products", {
        name: args.name,
        price: args.price,
        is_active: true,
        image_url: args.image_url,
        store_id: user.default_store,
      });
      return res;
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
    }),
  },
  handler: async (cts, args) => {
    await cts.db.patch(args.id, args.formData);
  },
});

export const deleteProduct = mutation({
  args: {
    id: v.id("products"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
