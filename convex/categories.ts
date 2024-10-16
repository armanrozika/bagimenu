import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { authorizeUser } from "./helper/helper";
import { Id } from "./_generated/dataModel";

export const get = query({
  handler: async (ctx) => {
    const identity = await authorizeUser(ctx, "No Auth: view categories");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");
    if (user.default_store) {
      const categories = await ctx.db
        .query("categories")
        .withIndex("by_store", (q) => {
          return q.eq("store_id", user.default_store as Id<"stores">);
        })
        .collect();
      return categories;
    } else {
      return "no_default_store";
    }
  },
});

export const add = mutation({
  args: {
    name: v.string(),
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
    if (user.default_store) {
      await ctx.db.insert("categories", {
        name: args.name,
        store_id: user.default_store,
      });
    }
  },
});

export const patch = mutation({
  args: {
    id: v.id("categories"),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await authorizeUser(ctx, "No Auth: patch categories");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");
    const category = await ctx.db.get(args.id);
    if (category?.store_id !== user.default_store) {
      throw new Error("default_store Don't Match: patch category");
    }
    await ctx.db.patch(args.id, { name: args.name });
  },
});

export const remove = mutation({
  args: {
    id: v.id("categories"),
  },
  handler: async (ctx, args) => {
    const identity = await authorizeUser(ctx, "No Auth: delete category");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");
    const category = await ctx.db.get(args.id);
    if (category?.store_id !== user.default_store) {
      throw new Error("default_store Don't Match: delete category");
    }
    await ctx.db.delete(args.id);
  },
});
