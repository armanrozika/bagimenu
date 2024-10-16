import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { authorizeUser } from "./helper/helper";

export const add = mutation({
  args: { name: v.string(), url: v.string(), whatsapp: v.string() },
  handler: async (ctx, args) => {
    args.url = args.url.replaceAll(" ", "");
    const identity = await authorizeUser(ctx, "No Auth: add stores");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");

    const stores = await ctx.db
      .query("stores")
      .withIndex("by_token", (q) => {
        return q.eq("owner_identifier", identity.tokenIdentifier);
      })
      .collect();

    if (user?.plan === "basic" && stores.length === 1) {
      throw new Error("Plan basic Limit: add Store");
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

    if (!user.default_store) {
      await ctx.db.patch(user._id, { default_store: store });
    }
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await authorizeUser(ctx, "No Auth: view stores");
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
    const identity = await authorizeUser(ctx, "No Auth: view single store");
    const store = await ctx.db.get(args.id);
    if (store?.owner_identifier !== identity.tokenIdentifier) {
      throw new Error("Identifier Don't Match: view store");
    }
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
    const identity = await authorizeUser(ctx, "No Auth: patch store");
    const store = await ctx.db.get(args.id);
    if (store?.owner_identifier !== identity.tokenIdentifier) {
      throw new Error("Identifier Don't Match: patch store");
    }
    (args.formData.url = args.formData.url.replaceAll(" ", "")),
      await ctx.db.patch(args.id, args.formData);
  },
});

export const getStoresWithDefault = query({
  handler: async (ctx) => {
    const identity = await authorizeUser(ctx, "No Auth: patch store");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();
    if (!user) throw new Error("No User Found");

    const stores = await ctx.db
      .query("stores")
      .withIndex("by_token", (q) => {
        return q.eq("owner_identifier", identity.tokenIdentifier);
      })
      .collect();
    const returnValue = stores.map((store) => {
      const is_default = store._id === user.default_store ? true : false;
      return {
        ...store,
        label: store.name,
        value: store._id,
        is_default,
      };
    });
    if (user.plan === "pro") {
      return returnValue;
    } else {
      return "basic";
    }
  },
});

export const updateDefaultStore = mutation({
  args: {
    id: v.id("stores"),
  },
  handler: async (ctx, args) => {
    const identity = await authorizeUser(ctx, "No Auth: patch store");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();

    if (!user) throw new Error("No User Found");
    const store = await ctx.db.get(args.id);
    if (store?.owner_identifier !== user.tokenIdentifier) {
      throw new Error("Identifier Don't Match: update default_store");
    }
    await ctx.db.patch(user._id, { default_store: args.id });
  },
});
