"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";

import { api } from "@/convex/_generated/api";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { transposeSong } from "@/lib/transpose";
import SongChordSheet from "@/components/song/SongChordSheet/SongChordSheet";
import AutoScroll from "@/components/AutoScroll";
import { SquarePen, Trash } from "lucide-react";

export default function SongPage() {
  const params = useParams();

  const router = useRouter();

  const deleteSong = useMutation(api.songs.deleteSong);

  const duplicateSong = useMutation(api.songs.duplicateSong);

  const song = useQuery(api.songs.getSong, {
    id: params.id as any,
  });

  const [transpose, setTranspose] = useState(0);

  const [preference, setPreference] = useState<"sharp" | "flat">("sharp");

  async function handleDelete() {
    const confirmed = window.confirm(`Delete "${song?.title}"?`);

    if (!confirmed || !song) return;

    await deleteSong({
      id: song._id,
    });

    router.push("/songs");
  }

  async function handleDuplicate() {
    if (!song) return;

    const newSongId = await duplicateSong({
      id: song._id,
    });

    router.push(`/songs/${newSongId}`);
  }

  if (song === undefined) {
    return <div className="container p-6">Loading...</div>;
  }

  if (!song) {
    return <div className="container py-6">Song not found</div>;
  }

  const displayedLyricsWithChords = transposeSong(
    song.lyricsWithChords,
    transpose,
    preference,
  );

  return (
    <div className="container w-full p-6">
      <div className="flex gap-2 mb-6">
        <Button asChild variant="outline" title="Edit">
          <Link href={`/songs/${song._id}/edit`}><SquarePen /></Link>
        </Button>

        {/* <Button variant="outline" onClick={handleDuplicate}>
          Duplicate
        </Button> */}

        <Button variant="destructive" onClick={handleDelete} title="Delete">
          <Trash />
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{song.title}</CardTitle>

          <p className="text-sm text-muted-foreground">
            Key: {song.defaultKey}
          </p>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="lyrics">
            <TabsList>
              <TabsTrigger value="lyrics">Lyrics</TabsTrigger>

              <TabsTrigger value="chords">Lyrics With Chords</TabsTrigger>
            </TabsList>

            <TabsContent value="lyrics">
              <pre className="whitespace-pre-wrap font-sans mt-4 text-sm sm:text-[16px]">
                {song.lyrics}
              </pre>
            </TabsContent>

            <TabsContent value="chords">
              <div className="flex flex-wrap items-center gap-2 mt-4">

                <p>Transpose:</p>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTranspose((t) => t - 1)}
                >
                  −
                </Button>

                <span className="w-10 text-center">
                  {transpose > 0 ? `+${transpose}` : transpose}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setTranspose((t) => t + 1)}
                >
                  +
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setTranspose(0)}
                >
                  Reset
                </Button>

                <Button
                  size="sm"
                  variant={preference === "sharp" ? "default" : "outline"}
                  onClick={() => setPreference("sharp")}
                >
                  #
                </Button>

                <Button
                  size="sm"
                  variant={preference === "flat" ? "default" : "outline"}
                  onClick={() => setPreference("flat")}
                >
                  b
                </Button>
              </div>
              {/* <pre className="whitespace-pre-wrap font-mono mt-4">
                {displayedLyricsWithChords}
              </pre> */}
              <SongChordSheet
              content={displayedLyricsWithChords}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <AutoScroll/>
    </div>
  );
}
