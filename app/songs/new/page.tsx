// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useMutation } from "convex/react";
// import { api } from "@/convex/_generated/api";

// export default function NewSongPage() {
//   const router = useRouter();

//   const createSong = useMutation(
//     api.songs.createSong
//   );

//   const [title, setTitle] =
//     useState("");

//   const [defaultKey, setDefaultKey] =
//     useState("G");

//   const [lyrics, setLyrics] =
//     useState("");

//   const [
//     lyricsWithChords,
//     setLyricsWithChords,
//   ] = useState("");

//   async function handleSave() {
//     const id = await createSong({
//       title,
//       defaultKey,
//       lyrics,
//       lyricsWithChords,
//     });

//     router.push(`/songs/${id}`);
//   }

//   return (
//     <div className="p-6 max-w-4xl">
//       <h1 className="text-2xl mb-6">
//         New Song
//       </h1>

//       <input
//         value={title}
//         onChange={(e) =>
//           setTitle(e.target.value)
//         }
//         placeholder="Title"
//         className="border p-2 w-full mb-4"
//       />

//       <input
//         value={defaultKey}
//         onChange={(e) =>
//           setDefaultKey(e.target.value)
//         }
//         placeholder="Key"
//         className="border p-2 w-full mb-4"
//       />

//       <textarea
//         value={lyrics}
//         onChange={(e) =>
//           setLyrics(e.target.value)
//         }
//         placeholder="Lyrics"
//         className="border p-2 w-full h-64 mb-4"
//       />

//       <textarea
//         value={lyricsWithChords}
//         onChange={(e) =>
//           setLyricsWithChords(
//             e.target.value
//           )
//         }
//         placeholder="Lyrics With Chords"
//         className="border p-2 w-full h-64 mb-4"
//       />

//       <button
//         onClick={handleSave}
//         className="border px-4 py-2"
//       >
//         Save Song
//       </button>
//     </div>
//   );
// }



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function NewSongPage() {
  const router = useRouter();

  const createSong = useMutation(api.songs.createSong);

  const [title, setTitle] = useState("");
  const [defaultKey, setDefaultKey] = useState("G");
  const [lyrics, setLyrics] = useState("");
  const [lyricsWithChords, setLyricsWithChords] = useState("");

  const [errors, setErrors] = useState<{
    title?: string;
    defaultKey?: string;
    lyrics?: string;
    lyricsWithChords?: string;
  }>({});

  const [isSaving, setIsSaving] = useState(false);

  function validate() {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!defaultKey.trim()) {
      newErrors.defaultKey = "Key is required.";
    }

    if (!lyrics.trim()) {
      newErrors.lyrics = "Lyrics are required.";
    }

    if (!lyricsWithChords.trim()) {
      newErrors.lyricsWithChords =
        "Lyrics with chords are required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;

    try {
      setIsSaving(true);

      const id = await createSong({
        title: title.trim(),
        defaultKey: defaultKey.trim(),
        lyrics: lyrics.trim(),
        lyricsWithChords: lyricsWithChords.trim(),
      });

      router.push(`/songs/${id}`);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl mb-6">New Song</h1>

      <div className="mb-4">
        <input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (errors.title) {
              setErrors((prev) => ({
                ...prev,
                title: undefined,
              }));
            }
          }}
          placeholder="Title"
          className="border rounded p-2 w-full"
        />
        {errors.title && (
          <p className="text-red-600 text-sm mt-1">
            {errors.title}
          </p>
        )}
      </div>

      <div className="mb-4">
        <input
          value={defaultKey}
          onChange={(e) => {
            setDefaultKey(e.target.value);
            if (errors.defaultKey) {
              setErrors((prev) => ({
                ...prev,
                defaultKey: undefined,
              }));
            }
          }}
          placeholder="Key"
          className="border rounded p-2 w-full"
        />
        {errors.defaultKey && (
          <p className="text-red-600 text-sm mt-1">
            {errors.defaultKey}
          </p>
        )}
      </div>

      <div className="mb-4">
        <textarea
          value={lyrics}
          onChange={(e) => {
            setLyrics(e.target.value);
            if (errors.lyrics) {
              setErrors((prev) => ({
                ...prev,
                lyrics: undefined,
              }));
            }
          }}
          placeholder="Lyrics"
          className="border rounded p-2 w-full h-64"
        />
        {errors.lyrics && (
          <p className="text-red-600 text-sm mt-1">
            {errors.lyrics}
          </p>
        )}
      </div>

      <div className="mb-6">
        <textarea
          value={lyricsWithChords}
          onChange={(e) => {
            setLyricsWithChords(e.target.value);
            if (errors.lyricsWithChords) {
              setErrors((prev) => ({
                ...prev,
                lyricsWithChords: undefined,
              }));
            }
          }}
          placeholder="Lyrics With Chords"
          className="border rounded p-2 w-full h-64"
        />
        {errors.lyricsWithChords && (
          <p className="text-red-600 text-sm mt-1">
            {errors.lyricsWithChords}
          </p>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={isSaving}
        className="border rounded px-4 py-2 disabled:opacity-50"
      >
        {isSaving ? "Saving..." : "Save Song"}
      </button>
    </div>
  );
}