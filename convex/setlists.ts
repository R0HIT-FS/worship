import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

export const createSetlist = mutation({
  args: {
    title: v.string(),

    date: v.string(),

    leaders: v.array(
      v.string()
    ),

    songIds: v.array(
      v.id("songs")
    ),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert(
      "setlists",
      {
        ...args,
        createdAt: Date.now(),
      }
    );
  },
});


export const getSetlists = query({
  args: {},

  handler: async (ctx) => {
    return await ctx.db
      .query("setlists")
      .order("desc")
      .collect();
  },
});

export const getSetlistWithSongs = query({
  args: {
    id: v.id("setlists"),
  },

  handler: async (ctx, args) => {
    const setlist = await ctx.db.get(args.id);

    if (!setlist) {
      return null;
    }

    const songs = await Promise.all(
      setlist.songIds.map((songId) =>
        ctx.db.get(songId)
      )
    );

    return {
      ...setlist,
      songs: songs.filter(
        (song): song is NonNullable<typeof song> =>
          song !== null
      ),
    };
  },
});


export const updateSongOrder = mutation({
  args: {
    id: v.id("setlists"),

    songIds: v.array(
      v.id("songs")
    ),
  },

  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      songIds: args.songIds,
    });
  },
});

export const updateSetlist = mutation({
  args: {
    id: v.id("setlists"),

    title: v.string(),

    date: v.string(),

    leaders: v.array(
      v.string()
    ),

    songIds: v.array(
      v.id("songs")
    ),
  },

  handler: async (ctx, args) => {
    const { id, ...updates } =
      args;

    await ctx.db.patch(
      id,
      updates
    );

    return id;
  },
});


export const deleteSetlist = mutation({
  args: {
    id: v.id("setlists"),
  },

  handler: async (ctx, args) => {
    await ctx.db.delete(
      args.id
    );
  },
});