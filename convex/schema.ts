import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  songs: defineTable({
    title: v.string(),

    defaultKey: v.string(),

    lyrics: v.string(),

    lyricsWithChords: v.string(),

    createdAt: v.number(),
  }),

  setlists: defineTable({
    title: v.string(),

    date: v.string(),

    leaders: v.array(v.string()),

    songIds: v.array(v.id("songs")),

    createdAt: v.number(),
  }),
});
