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

export default function SongPage() {
  const params = useParams();

  const router = useRouter();

  const deleteSong = useMutation(api.songs.deleteSong);

  const duplicateSong = useMutation(api.songs.duplicateSong);

  const song = useQuery(api.songs.getSong, {
    id: params.id as any,
  });

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

  const newSongId =
    await duplicateSong({
      id: song._id,
    });

  router.push(
    `/songs/${newSongId}`
  );
}

  if (song === undefined) {
    return <div className="container p-6">Loading...</div>;
  }

  if (!song) {
    return <div className="container py-6">Song not found</div>;
  }

  return (
    <div className="container w-full p-6">
<div className="flex gap-2 mb-6">
  {/* <Button
    asChild
    variant="outline"
  >
    <Link href="/songs">
      Back To Songs
    </Link>
  </Button> */}

  <Button
    asChild
    variant="outline"
  >
    <Link
      href={`/songs/${song._id}/edit`}
    >
      Edit
    </Link>
  </Button>

  <Button
    variant="outline"
    onClick={handleDuplicate}
  >
    Duplicate
  </Button>

  <Button
    variant="destructive"
    onClick={handleDelete}
  >
    Delete
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
              <pre className="whitespace-pre-wrap font-sans mt-4">
                {song.lyrics}
              </pre>
            </TabsContent>

            <TabsContent value="chords">
              <pre className="whitespace-pre-wrap font-mono mt-4">
                {song.lyricsWithChords}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
