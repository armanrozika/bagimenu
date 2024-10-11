import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const add = mutation({
  args: { name: v.string(), url: v.string(), whatsapp: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Forbidden: add store");
    }
    const toko = await ctx.db.insert("stores", {
      name: args.name,
      url: args.url,
      whatsapp: args.whatsapp,
      owner_identifier: identity?.tokenIdentifier,
    });

    return toko;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Forbidden: add store");
    }
    const stores = await ctx.db
      .query("stores")
      .withIndex("by_token", (q) => {
        return q.eq("owner_identifier", identity.tokenIdentifier);
      })
      .collect();

    return stores;
  },
});
