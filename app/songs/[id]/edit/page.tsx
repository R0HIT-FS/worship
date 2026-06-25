"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { useState, useEffect } from "react";

import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function EditSongPage() {
  const params = useParams();
  const router = useRouter();

  const song = useQuery(
    api.songs.getSong,
    {
      id: params.id as any,
    }
  );

  const updateSong = useMutation(
    api.songs.updateSong
  );

  const [title, setTitle] =
    useState("");

  const [defaultKey, setDefaultKey] =
    useState("");

  const [lyrics, setLyrics] =
    useState("");

  const [
    lyricsWithChords,
    setLyricsWithChords,
  ] = useState("");

  useEffect(() => {
    if (!song) return;

    setTitle(song.title);
    setDefaultKey(song.defaultKey);
    setLyrics(song.lyrics);
    setLyricsWithChords(
      song.lyricsWithChords
    );
  }, [song]);

  async function handleSave() {
    if (!song) return;

    await updateSong({
      id: song._id,

      title,

      defaultKey,

      lyrics,

      lyricsWithChords,
    });

    router.push(
      `/songs/${song._id}`
    );
  }

  if (song === undefined) {
    return (
      <div className="container py-6">
        Loading...
      </div>
    );
  }

  if (!song) {
    return (
      <div className="container py-6">
        Song not found
      </div>
    );
  }

  return (
    <div className="container max-w-5xl p-6">
      <div className="flex gap-2 mb-6">
        <Button
          variant="outline"
          asChild
        >
          <Link
            href={`/songs/${song._id}`}
          >
            Cancel
          </Link>
        </Button>

        <Button
          onClick={handleSave}
        >
          Save Changes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Edit Song
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <Input
            value={title}
            onChange={(e) =>
              setTitle(
                e.target.value
              )
            }
            placeholder="Song Title"
          />

          <Input
            value={defaultKey}
            onChange={(e) =>
              setDefaultKey(
                e.target.value
              )
            }
            placeholder="Key"
          />

          <div>
            <p className="font-medium mb-2">
              Lyrics
            </p>

            <Textarea
              value={lyrics}
              onChange={(e) =>
                setLyrics(
                  e.target.value
                )
              }
              rows={16}
            />
          </div>

          <div>
            <p className="font-medium mb-2">
              Lyrics With Chords
            </p>

            <Textarea
              value={
                lyricsWithChords
              }
              onChange={(e) =>
                setLyricsWithChords(
                  e.target.value
                )
              }
              rows={16}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}