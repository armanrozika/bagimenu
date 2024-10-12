import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
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
