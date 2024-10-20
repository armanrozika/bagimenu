import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { authorizeUser } from "./helper/helper";

export const add = mutation({
  args: {
    invoice_id: v.string(),
    product_name: v.string(),
    product_price: v.number(),
    is_success: v.boolean(),
    store_id: v.id("stores"),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("invoices", {
      ...args,
      status: "LEAD",
    });
    await ctx.runMutation(internal.notifications.add, {
      store_id: args.store_id,
      invoice_id: args.invoice_id,
    });
  },
});

export const get = query({
  handler: async (ctx) => {
    const identity = await authorizeUser(ctx, "No Auth: get invoices");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");
    if (!user.default_store) throw new Error("No Store");

    const invoices = await ctx.db
      .query("invoices")
      .withIndex("by_store", (q) => {
        return q.eq("store_id", user.default_store!);
      })
      .collect();
    return invoices;
  },
});

export const getNotification = query({
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
      .query("invoices")
      .filter((q) => {
        return q.and(
          q.eq(q.field("status"), "LEAD"),
          q.eq(q.field("store_id"), user.default_store)
        );
      })
      .collect();

    return notifications;
  },
});

//get invoices with date filter
export const getNotificationToday = query({
  args: {
    time: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await authorizeUser(ctx, "No Auth: get notifications");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");
    const filterTime = () => {
      if (args.time === "DAY") {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        return yesterday.toString();
      }
      if (args.time === "MONTH") {
        const thisMonth = new Date();
        thisMonth.setDate(thisMonth.getDate() - (thisMonth.getDate() - 1));
        thisMonth.setHours(0, 0, 0, 0);
        return thisMonth.toString();
      }
    };

    const notifications = await ctx.db
      .query("invoices")
      .filter((q) => {
        return q.and(
          q.neq(q.field("status"), "LEAD"),
          q.gt(q.field("_creationTime"), Date.parse(filterTime() as string)),
          q.eq(q.field("store_id"), user.default_store)
        );
      })
      .collect();

    return notifications;
  },
});

export const patch = mutation({
  args: {
    _id: v.id("invoices"),
    store_id: v.id("stores"),
    status: v.union(v.literal("PAID"), v.literal("CANCELED")),
  },
  handler: async (ctx, args) => {
    const identity = await authorizeUser(ctx, "No Auth: get notifications");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");
    const store = await ctx.db.get(args.store_id);
    if (store?._id !== user.default_store) {
      throw new Error("default_store Don't Match: patch invoice");
    }
    await ctx.db.patch(args._id, {
      status: args.status,
    });
  },
});
