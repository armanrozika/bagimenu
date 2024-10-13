import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    tokenIdentifier: v.string(),
    plan: v.union(v.literal("basic"), v.literal("pro")),
    default_store: v.union(v.string(), v.null()),
  }).index("by_token", ["tokenIdentifier"]),
  stores: defineTable({
    name: v.string(),
    url: v.string(),
    whatsapp: v.string(),
    owner_identifier: v.string(),
  })
    .index("by_token", ["owner_identifier"])
    .index("by_url", ["url"]),
  products: defineTable({
    name: v.string(),
    price: v.number(),
    is_active: v.boolean(),
    image_url: v.string(),
    store_id: v.string(),
  }).index("by_toko", ["store_id"]),
});
