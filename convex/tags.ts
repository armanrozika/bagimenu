import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";
import { authorizeUser } from "./helper/helper";

export const add = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const identity = await authorizeUser(ctx, "No Auth: add categories");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");
    if (user.default_store) {
      await ctx.db.insert("tags", {
        name: args.name,
        store_id: user.default_store,
      });
    }
  },
});

export const addProductTags = mutation({
  args: {
    tag_ids: v.array(v.id("tags")),
    product_id: v.id("products"),
  },
  handler: async (ctx, args) => {
    const identity = await authorizeUser(ctx, "No Auth: add productTags");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");
    if (user.default_store) {
      const promises: Promise<Id<"productTags">>[] = [];

      args.tag_ids.forEach((tag_id) => {
        const inserts = ctx.db.insert("productTags", {
          tag_id: tag_id,
          product_id: args.product_id,
        });
        promises.push(inserts);
      });

      await Promise.all(promises);
    }
  },
});

export const get = query({
  handler: async (ctx) => {
    const identity = await authorizeUser(ctx, "No Auth: get tags");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");
    if (!user.default_store) {
      return "no_default_store";
    }
    const tags = await ctx.db
      .query("tags")
      .withIndex("by_store", (q) => {
        return q.eq("store_id", user.default_store!);
      })
      .collect();
    return tags;
  },
});

export const getPublicTag = query({
  args: {
    store_url: v.string(),
  },
  handler: async (ctx, args) => {
    const store = await ctx.db
      .query("stores")
      .withIndex("by_url", (q) => {
        return q.eq("url", args.store_url);
      })
      .unique();
    if (!store) return;
    const tags = await ctx.db
      .query("tags")
      .withIndex("by_store", (q) => {
        return q.eq("store_id", store?._id);
      })
      .collect();
    return tags;
  },
});

export const deleteTag = mutation({
  args: { tag_id: v.id("tags") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.tag_id);
  },
});
