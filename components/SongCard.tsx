"use client";

import Link from "next/link";
import { memo } from "react";

type Song = {
  _id: string;
  title: string;
  defaultKey: string;
};

function SongCardComponent({ song }: { song: Song }) {
  console.log("Rendering:", song.title);

  return (
    <Link
      href={`/songs/${song._id}`}
      className="block border p-4 rounded-md hover:bg-muted/50 transition-colors"
    >
      <h2 className="font-semibold">{song.title}</h2>
      <p>Key: {song.defaultKey}</p>
    </Link>
  );
}

export const SongCard = memo(SongCardComponent);