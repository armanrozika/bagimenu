import { v } from "convex/values";
import { query } from "./_generated/server";

export const getProductByCategory = query({
  args: {
    id: v.union(v.id("categories"), v.literal("ALL")),
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

    if (args.id === "ALL") {
      const products = await ctx.db
        .query("products")
        .withIndex("by_store", (q) => {
          return q.eq("store_id", store?._id);
        })
        .collect();
      return products;
    } else {
      const products = await ctx.db
        .query("products")
        .filter((q) => {
          return q.and(
            q.eq(q.field("store_id"), store._id),
            q.eq(q.field("category_id"), args.id)
          );
        })
        .collect();
      return products;
    }
  },
});
