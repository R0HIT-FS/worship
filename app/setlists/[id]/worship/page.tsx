"use client";

import { useState, useEffect } from "react";

import { useParams } from "next/navigation";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";

import { Card, CardContent } from "@/components/ui/card";

import { transposeSong } from "@/lib/transpose";
import SongChordSheet from "@/components/song/SongChordSheet/SongChordSheet";

export default function WorshipPage() {
  const params = useParams();

  const setlist = useQuery(api.setlists.getSetlistWithSongs, {
    id: params.id as any,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  const [showChords, setShowChords] = useState(false);

  const [fontSize, setFontSize] = useState(18);

  const [transpose, setTranspose] = useState(0);

  const [preference, setPreference] = useState<"sharp" | "flat">("sharp");

  useEffect(() => {
    if (!setlist) return;

    const maxIndex = setlist.songs.length - 1;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }

      if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setlist]);

  const storageKey = `worship-${params.id}`;

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      setCurrentIndex(Number(saved));
    }
  }, [storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, String(currentIndex));
  }, [currentIndex, storageKey]);

  if (setlist === undefined) {
    return <div className="p-6">Loading...</div>;
  }

  if (!setlist) {
    return <div className="p-6">Setlist not found</div>;
  }

  const currentSong = setlist.songs[currentIndex];

  const displayedLyrics = showChords
    ? <><SongChordSheet content={transposeSong(currentSong.lyricsWithChords, transpose, preference)}/></>
    : currentSong.lyrics;

  if (!currentSong) {
    return <div className="p-6">No songs in setlist</div>;
  }

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{setlist.title}</h1>
      </div>

      <div className="grid lg:grid-cols-[300px_1fr] gap-6">
        {/* SONG LIST */}

        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              {setlist?.songs?.map((song, index) => (
                <Button
                  key={song?._id}
                  variant={index === currentIndex ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setCurrentIndex(index)}
                >
                  {index + 1}. {song?.title}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* LYRICS */}

        <Card>
          <CardContent className="p-6 pb-24 md:pb-0">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <p>Font Size : </p>
              <Button
                variant="outline"
                onClick={() => setFontSize((v) => Math.max(12, v - 2))}
              >
                A-
              </Button>

              <Button
                variant="outline"
                onClick={() => setFontSize((v) => Math.min(48, v + 2))}
              >
                A+
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <Button
                variant={!showChords ? "default" : "outline"}
                onClick={() => setShowChords(false)}
              >
                Lyrics
              </Button>

              <Button
                variant={showChords ? "default" : "outline"}
                onClick={() => setShowChords(true)}
              >
                Lyrics + Chords
              </Button>
            </div>

            {showChords && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <p>Transpose:</p>

                <Button
                  variant="outline"
                  onClick={() => setTranspose((t) => t - 1)}
                >
                  -1
                </Button>

                <span className="w-10 text-center font-medium">
                  {transpose > 0 ? `+${transpose}` : transpose}
                </span>

                <Button
                  variant="outline"
                  onClick={() => setTranspose((t) => t + 1)}
                >
                  +1
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setTranspose(0)}
                >
                  Reset
                </Button>

                <Button
                  variant={preference === "sharp" ? "default" : "outline"}
                  onClick={() => setPreference("sharp")}
                >
                  #
                </Button>

                <Button
                  variant={preference === "flat" ? "default" : "outline"}
                  onClick={() => setPreference("flat")}
                >
                  b
                </Button>
              </div>
            )}

            <h2 className="text-2xl font-bold mb-6">{currentSong.title}</h2>

            <pre
              className="whitespace-pre-wrap font-sans leading-8"
              style={{
                fontSize: `${fontSize}px`,
              }}
            >
              {displayedLyrics}
            </pre>

            <div
              className="
    fixed
    bottom-0
    left-0
    right-0
    z-50
    flex
    gap-2
    rounded-lg
    border
    bg-background
    p-2
    shadow-lg

    lg:static
    lg:mt-10
    lg:p-0
    lg:border-0
    lg:bg-transparent
    lg:shadow-none
    w-full
    lg:max-w-md
  "
            >
              <Button
                className="flex-1"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              >
                Previous
              </Button>

              <Button
                className="flex-1"
                disabled={currentIndex === setlist.songs.length - 1}
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(setlist.songs.length - 1, prev + 1),
                  )
                }
              >
                Next
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
