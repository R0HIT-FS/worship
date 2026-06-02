import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const createSong = mutation({
  args: {
    title: v.string(),
    defaultKey: v.string(),
    lyrics: v.string(),
    lyricsWithChords: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("songs", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const getSongs = query({
  args: {},

  handler: async (ctx) => {
    return await ctx.db
      .query("songs")
      .order("desc")
      .collect();
  },
});

export const getSong = query({
  args: {
    id: v.id("songs"),
  },

  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});


export const updateSong = mutation({
  args: {
    id: v.id("songs"),

    title: v.string(),

    defaultKey: v.string(),

    lyrics: v.string(),

    lyricsWithChords: v.string(),
  },

  handler: async (ctx, args) => {
    const { id, ...updates } = args;

    await ctx.db.patch(id, updates);

    return id;
  },
});

export const deleteSong = mutation({
  args: {
    id: v.id("songs"),
  },

  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});


export const duplicateSong = mutation({
  args: {
    id: v.id("songs"),
  },

  handler: async (ctx, args) => {
    const song = await ctx.db.get(args.id);

    if (!song) {
      throw new Error("Song not found");
    }

    const newId = await ctx.db.insert("songs", {
      title: `${song.title} (Copy)`,
      defaultKey: song.defaultKey,
      lyrics: song.lyrics,
      lyricsWithChords: song.lyricsWithChords,
      createdAt: Date.now(),
    });

    return newId;
  },
});