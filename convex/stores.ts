import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { authorizeUser } from "./helper/helper";

export const add = mutation({
  args: { name: v.string(), url: v.string(), whatsapp: v.string() },
  handler: async (ctx, args) => {
    //Need to check for basic plan here also
    const identity = await authorizeUser(ctx, "No Auth: add stores");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();

    const stores = await ctx.db
      .query("stores")
      .withIndex("by_token", (q) => {
        return q.eq("owner_identifier", identity.tokenIdentifier);
      })
      .collect();

    if (user?.plan === "basic" && stores.length === 1) {
      throw new Error("Plan Basic Limit: Add Store");
    }
    //check if there is same store name
    const storeName = await ctx.db
      .query("stores")
      .withIndex("by_url", (q) => {
        return q.eq("url", args.url);
      })
      .collect();
    if (storeName.length > 0) {
      throw new ConvexError("URL sudah terpakai");
    }

    const store = await ctx.db.insert("stores", {
      name: args.name,
      url: args.url,
      whatsapp: args.whatsapp,
      owner_identifier: identity?.tokenIdentifier,
    });
    if (user) {
      await ctx.db.patch(user._id, { default_store: store });
    }

    return store;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await authorizeUser(ctx, "No Auth: get store");
    const stores = await ctx.db
      .query("stores")
      .withIndex("by_token", (q) => {
        return q.eq("owner_identifier", identity.tokenIdentifier);
      })
      .collect();

    return stores;
  },
});

export const getSingleStore = query({
  args: {
    id: v.id("stores"),
  },
  handler: async (ctx, args) => {
    await authorizeUser(ctx, "No Auth: get single store");
    const store = await ctx.db.get(args.id);
    return store;
  },
});

export const updateStore = mutation({
  args: {
    id: v.id("stores"),
    formData: v.object({
      name: v.string(),
      url: v.string(),
      whatsapp: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, args.formData);
  },
});
