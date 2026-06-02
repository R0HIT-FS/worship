"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function NewSongPage() {
  const router = useRouter();

  const createSong = useMutation(
    api.songs.createSong
  );

  const [title, setTitle] =
    useState("");

  const [defaultKey, setDefaultKey] =
    useState("G");

  const [lyrics, setLyrics] =
    useState("");

  const [
    lyricsWithChords,
    setLyricsWithChords,
  ] = useState("");

  async function handleSave() {
    const id = await createSong({
      title,
      defaultKey,
      lyrics,
      lyricsWithChords,
    });

    router.push(`/songs/${id}`);
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl mb-6">
        New Song
      </h1>

      <input
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
        placeholder="Title"
        className="border p-2 w-full mb-4"
      />

      <input
        value={defaultKey}
        onChange={(e) =>
          setDefaultKey(e.target.value)
        }
        placeholder="Key"
        className="border p-2 w-full mb-4"
      />

      <textarea
        value={lyrics}
        onChange={(e) =>
          setLyrics(e.target.value)
        }
        placeholder="Lyrics"
        className="border p-2 w-full h-64 mb-4"
      />

      <textarea
        value={lyricsWithChords}
        onChange={(e) =>
          setLyricsWithChords(
            e.target.value
          )
        }
        placeholder="Lyrics With Chords"
        className="border p-2 w-full h-64 mb-4"
      />

      <button
        onClick={handleSave}
        className="border px-4 py-2"
      >
        Save Song
      </button>
    </div>
  );
}