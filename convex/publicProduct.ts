import { v } from "convex/values";
import { query } from "./_generated/server";

export const getProductByCategory = query({
  args: {
    id: v.union(v.id("categories"), v.literal("ALL")),
  },
  handler: async (ctx, args) => {
    if (args.id === "ALL") {
      const products = await ctx.db.query("products").collect();
      return products;
    } else {
      const products = await ctx.db
        .query("products")
        .withIndex("by_category", (q) => {
          return q.eq("category_id", args.id);
        })
        .collect();
      return products;
    }
  },
});
