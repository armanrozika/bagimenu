import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { authorizeUser } from "./helper/helper";

export const add = internalMutation({
  args: {
    store_id: v.id("stores"),
    invoice_id: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("notifications", {
      ...args,
      is_read: false,
    });
  },
});

export const get = query({
  handler: async (ctx) => {
    const identity = await authorizeUser(ctx, "No Auth: get notifications");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");
    const notifications = await ctx.db
      .query("notifications")
      .filter((q) => {
        return q.and(
          q.eq(q.field("is_read"), false),
          q.eq(q.field("store_id"), user.default_store)
        );
      })
      .collect();

    return notifications;
  },
});
