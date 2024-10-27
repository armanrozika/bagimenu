import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";
import { query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { asyncMap } from "convex-helpers";
import { getAll, getManyFrom } from "convex-helpers/server/relationships";

export const getProductByCategory = query({
  args: {
    category_id: v.union(v.id("categories"), v.literal("ALL")),
    store_url: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const store = await ctx.db
      .query("stores")
      .withIndex("by_url", (q) => {
        return q.eq("url", args.store_url);
      })
      .unique();

    if (args.category_id === "ALL") {
      const products = await ctx.db
        .query("products")
        .withIndex("by_store", (q) => {
          return q.eq("store_id", store?._id as Id<"stores">);
        })
        .order("desc")
        .paginate(args.paginationOpts);
      return products;
    } else {
      const products = await ctx.db
        .query("products")
        .filter((q) => {
          return q.and(
            q.eq(q.field("store_id"), store?._id as Id<"stores">),
            q.eq(q.field("category_id"), args.category_id)
          );
        })
        .order("desc")
        .paginate(args.paginationOpts);
      return products;
    }
  },
});

export const getStoreDetail = query({
  args: {
    store_url: v.string(),
  },
  handler: async (ctx, args) => {
    const store = await ctx.db
      .query("stores")
      .withIndex("by_url", (q) => {
        return q.eq("url", args.store_url);
      })
      .unique();

    const categories = await ctx.db
      .query("categories")
      .withIndex("by_store", (q) => {
        return q.eq("store_id", store?._id as Id<"stores">);
      })
      .collect();

    return {
      store: store,
      categories,
    };
  },
});

export const searchProduct = query({
  args: {
    searchParams: v.string(),
    categoryId: v.string(),
    store_url: v.string(),
  },
  handler: async (ctx, args) => {
    const store = await ctx.db
      .query("stores")
      .withIndex("by_url", (q) => {
        return q.eq("url", args.store_url);
      })
      .unique();

    if (args.categoryId === "ALL") {
      const products = await ctx.db
        .query("products")
        .withSearchIndex("search_name", (q) => {
          return q
            .search("name", args.searchParams)
            .eq("store_id", store?._id!);
        })
        .collect();
      return products;
    } else {
      const products = await ctx.db
        .query("products")
        .withSearchIndex("search_name", (q) => {
          return q
            .search("name", args.searchParams)
            .eq("store_id", store?._id!);
        })
        .filter((q) => q.eq(q.field("category_id"), args.categoryId))
        .collect();
      return products;
    }
  },
});

export const getProductsByTags = query({
  args: {
    tagIds: v.array(v.id("tags")),
  },
  handler: async (ctx, args) => {
    const productIds = new Set<Id<"products">>();
    const allProductTags: Promise<
      {
        _id: Id<"productTags">;
        _creationTime: number;
        tag_id: Id<"tags">;
        product_id: Id<"products">;
      }[]
    >[] = [];
    const tags = await asyncMap(args.tagIds, ctx.db.get);
    tags.forEach((tag) => {
      if (!tag) return;
      const productTags = getManyFrom(ctx.db, "productTags", "tag_id", tag._id);
      allProductTags.push(productTags);
    });

    const productsTags = (await Promise.all(allProductTags)).flat();
    productsTags.forEach((productTag) => {
      productIds.add(productTag.product_id);
    });
    const products = await getAll(ctx.db, productIds);
    return products;
  },
});
