import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    text: v.string(),
    isCompleted: v.boolean(),
  }),
  users: defineTable({
    email: v.string(),
    tokenIdentifier: v.string(),
    plan: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
  stores: defineTable({
    name: v.string(),
    url: v.string(),
    whatsapp: v.string(),
    owner_identifier: v.string(),
  }).index("by_token", ["owner_identifier"]),
});
