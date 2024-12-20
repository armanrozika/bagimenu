import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    tokenIdentifier: v.string(),
    plan: v.union(v.literal("basic"), v.literal("pro")),
    default_store: v.union(v.id("stores"), v.null()),
  }).index("by_token", ["tokenIdentifier"]),
  stores: defineTable({
    name: v.string(),
    url: v.string(),
    whatsapp: v.string(),
    owner_identifier: v.string(),
  })
    .index("by_token", ["owner_identifier"])
    .index("by_url", ["url"])
    .index("by_name", ["name"]),
  products: defineTable({
    name: v.string(),
    price: v.number(),
    is_active: v.boolean(),
    image_url: v.string(),
    store_id: v.id("stores"),
    notes: v.string(),
    category_id: v.union(v.id("categories"), v.literal("ALL")),
  })
    .index("by_store", ["store_id"])
    .index("by_category", ["category_id"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["store_id", "category_id"],
    }),
  categories: defineTable({
    name: v.string(),
    store_id: v.id("stores"),
  }).index("by_store", ["store_id"]),
  invoices: defineTable({
    invoice_id: v.string(),
    product_name: v.string(),
    product_price: v.number(),
    is_success: v.boolean(),
    store_id: v.id("stores"),
    status: v.union(
      v.literal("PAID"),
      v.literal("CANCELED"),
      v.literal("LEAD")
    ),
  }).index("by_store", ["store_id"]),
  notifications: defineTable({
    store_id: v.id("stores"),
    invoice_id: v.string(),
    is_read: v.boolean(),
  }),
  tags: defineTable({
    name: v.string(),
    store_id: v.id("stores"),
  }).index("by_store", ["store_id"]),
  productTags: defineTable({
    tag_id: v.id("tags"),
    product_id: v.id("products"),
  })
    .index("by_productId", ["product_id"])
    .index("tag_id", ["tag_id"]),
});
