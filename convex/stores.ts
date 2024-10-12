import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authorizeUser } from "./helper/helper";

export const add = mutation({
  args: { name: v.string(), url: v.string(), whatsapp: v.string() },
  handler: async (ctx, args) => {
    const identity = await authorizeUser(ctx, "No Auth: add stores");

    const stores = await ctx.db.insert("stores", {
      name: args.name,
      url: args.url,
      whatsapp: args.whatsapp,
      owner_identifier: identity?.tokenIdentifier,
    });

    return stores;
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
