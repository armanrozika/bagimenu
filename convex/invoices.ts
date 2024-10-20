import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
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
    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => {
        return q.and(
          q.eq(q.field("status"), "LEAD"),
          q.eq(q.field("store_id"), user.default_store)
        );
      })
      .collect();

    return invoices;
  },
});

//get invoices with date filter
export const getInvoicesReport = query({
  args: {
    time: v.string(),
    date: v.number(),
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
    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => {
        return q.and(
          q.neq(q.field("status"), "LEAD"),
          q.gt(q.field("_creationTime"), args.date),
          q.eq(q.field("store_id"), user.default_store)
        );
      })
      .collect();

    return invoices;
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
