"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewSetlistPage() {
  const router = useRouter();

  const songs = useQuery(
    api.songs.getSongs
  );

  const createSetlist = useMutation(
    api.setlists.createSetlist
  );

  const [title, setTitle] =
    useState("");

  const [date, setDate] =
    useState("");

  const [leaders, setLeaders] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [selectedSongs, setSelectedSongs] =
    useState<string[]>([]);

  const filteredSongs = useMemo(() => {
    if (!songs) return [];

    return songs.filter(
      (song) =>
        song.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) &&
        !selectedSongs.includes(
          song._id
        )
    );
  }, [
    songs,
    search,
    selectedSongs,
  ]);

  function addSong(
    songId: string
  ) {
    setSelectedSongs((prev) => [
      ...prev,
      songId,
    ]);
  }

  function removeSong(
    songId: string
  ) {
    setSelectedSongs((prev) =>
      prev.filter(
        (id) => id !== songId
      )
    );
  }

  async function handleSave() {
    const leadersArray =
      leaders
        .split(",")
        .map((name) =>
          name.trim()
        )
        .filter(Boolean);

    const id =
      await createSetlist({
        title,
        date,
        leaders: leadersArray,
        songIds:
          selectedSongs as any,
      });

    router.push(
      `/setlists/${id}`
    );
  }

  if (!songs) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-6">
        New Setlist
      </h1>

      <div className="space-y-4">
        <Input
          placeholder="Setlist Title"
          value={title}
          onChange={(e) =>
            setTitle(
              e.target.value
            )
          }
        />

        <Input
          type="date"
          value={date}
          onChange={(e) =>
            setDate(
              e.target.value
            )
          }
        />

        <Input
          placeholder="Leaders (comma separated)"
          value={leaders}
          onChange={(e) =>
            setLeaders(
              e.target.value
            )
          }
        />

        <Card>
          <CardHeader>
            <CardTitle>
              Search Songs
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Input
              placeholder="Search songs..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

            <div className="space-y-2 mt-4">
              {filteredSongs.map(
                (song) => (
                  <div
                    key={song._id}
                    className="flex items-center justify-between border rounded p-3"
                  >
                    <span>
                      {song.title}
                    </span>

                    <Button
                      size="sm"
                      onClick={() =>
                        addSong(
                          song._id
                        )
                      }
                    >
                      Add
                    </Button>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              Selected Songs
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-2">
              {selectedSongs.map(
                (
                  songId,
                  index
                ) => {
                  const song =
                    songs.find(
                      (s) =>
                        s._id ===
                        songId
                    );

                  if (!song)
                    return null;

                  return (
                    <div
                      key={songId}
                      className="flex items-center justify-between border rounded p-3"
                    >
                      <span>
                        {index + 1}
                        .{" "}
                        {
                          song.title
                        }
                      </span>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          removeSong(
                            songId
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  );
                }
              )}

              {selectedSongs.length ===
                0 && (
                <p className="text-muted-foreground">
                  No songs selected
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={
            handleSave
          }
        >
          Save Setlist
        </Button>
      </div>
    </div>
  );
}