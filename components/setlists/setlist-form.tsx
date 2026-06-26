"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Song = {
  _id: string;
  title: string;
};

type Props = {
  songs: Song[];

  initialTitle?: string;
  initialDate?: string;
  initialLeaders?: string[];

  initialSongIds?: string[];

  submitLabel?: string;

  onSubmit: (data: {
    title: string;
    date: string;
    leaders: string[];
    songIds: string[];
  }) => Promise<void>;
};

export function SetlistForm({
  songs,

  initialTitle = "",
  initialDate = "",
  initialLeaders = [],

  initialSongIds = [],

  submitLabel = "Save",

  onSubmit,
}: Props) {
  const [title, setTitle] =
    useState(initialTitle);

  const [date, setDate] =
    useState(initialDate);

  const [leaders, setLeaders] =
    useState(
      initialLeaders.join(", ")
    );

  const [search, setSearch] =
    useState("");

  const [
    selectedSongs,
    setSelectedSongs,
  ] = useState<string[]>(
    initialSongIds
  );

  const songMap = useMemo(
    () =>
      new Map(
        songs.map((song) => [
          song._id,
          song,
        ])
      ),
    [songs]
  );

  const filteredSongs =
    useMemo(() => {
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

  async function handleSubmit() {
    await onSubmit({
      title,

      date,

      leaders: leaders
        .split(",")
        .map((x) =>
          x.trim()
        )
        .filter(Boolean),

      songIds: selectedSongs,
    });
  }

  return (
    <div className="p-6 space-y-6">
      <Input
        placeholder="Title"
        value={title}
        onChange={(e) =>
          setTitle(
            e.target.value
          )
        }
      />

      {/* <Input
        type="date"
        value={date}
        onChange={(e) =>
          setDate(
            e.target.value
          )
        }
      /> */}

      <Input
        placeholder="Leaders"
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
                  className="flex justify-between border rounded p-3"
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
                  songMap.get(
                    songId
                  );

                if (!song)
                  return null;

                return (
                  <div
                    key={songId}
                    className="flex justify-between border rounded p-3"
                  >
                    <span>
                      {index + 1}.{" "}
                      {
                        song.title
                      }
                    </span>

                    <Button
                      size="sm"
                      variant="destructive"
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
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={
          handleSubmit
        }
      >
        {submitLabel}
      </Button>
    </div>
  );
}