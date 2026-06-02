"use client";

import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { SongCard } from "@/components/SongCard";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SongsPage() {

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const songs = useQuery(api.songs.getSongs);

  const filteredSongs = useMemo(() => {
    if (!songs) return [];

    const filtered = songs.filter((song) =>
      song.title.toLowerCase().includes(search.toLowerCase())
    );

    switch (sortBy) {
      case "az":
        return [...filtered].sort((a, b) =>
          a.title.localeCompare(b.title)
        );

      case "za":
        return [...filtered].sort((a, b) =>
          b.title.localeCompare(a.title)
        );

      case "recent":
      default:
        return [...filtered].sort(
          (a, b) => b.createdAt - a.createdAt
        );
    }
  }, [songs, search, sortBy]);

  if (songs === undefined) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between mb-6 gap-2">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">Songs</h1>

        <div className="flex flex-col md:flex-row gap-2">
          <Input
            placeholder="Search songs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:max-w-md"
          />

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[220px]">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="recent">Recently Added</SelectItem>
              <SelectItem value="az">Title A-Z</SelectItem>
              <SelectItem value="za">Title Z-A</SelectItem>
            </SelectContent>
          </Select>

          <Link
            href="/songs/new"
            className="w-full border px-2 py-1 whitespace-nowrap text-sm md:text-md rounded-md"
          >
            Add Song
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {filteredSongs.map((song) => (
          <SongCard key={song._id} song={song} />
        ))}

        {filteredSongs.length === 0 && (
          <div className="text-muted-foreground text-center py-10">
            No songs found
          </div>
        )}
      </div>
    </div>
  );
}