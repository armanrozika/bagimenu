import { mutation, query } from "./_generated/server";
import { authorizeUser } from "./helper/helper";

export const add = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await authorizeUser(ctx, "No Auth: add user");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();

    if (user) {
      return user._id;
    }
    const userId = await ctx.db.insert("users", {
      tokenIdentifier: identity.tokenIdentifier,
      email: identity.email!,
      plan: "basic",
    });

    return userId;
  },
});

export const getIdentifier = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    return identity?.tokenIdentifier;
  },
});

//get single user
export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await authorizeUser(ctx, "No Auth: get user ");
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => {
        return q.eq("tokenIdentifier", identity.tokenIdentifier);
      })
      .unique();

    if (user) {
      return user;
    }
  },
});
