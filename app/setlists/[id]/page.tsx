"use client";

import Link from "next/link";

import { useParams } from "next/navigation";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { useMutation } from "convex/react";

import { SortableSong } from "@/components/setlists/sortable-song";

import { useEffect, useState } from "react";

export default function SetlistPage() {
  const params = useParams();

  const updateSongOrder = useMutation(api.setlists.updateSongOrder);

  const [songs, setSongs] = useState<any[]>([]);

  const setlist = useQuery(api.setlists.getSetlistWithSongs, {
    id: params.id as any,
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  useEffect(() => {
    if (!setlist) return;

    setSongs(setlist.songs);
  }, [setlist]);

  if (setlist === undefined) {
    return <div className="p-6">Loading...</div>;
  }

  if (!setlist) {
    return <div className="p-6">Setlist not found</div>;
  }

  async function handleDragEnd(event: any) {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = songs.findIndex((song) => song._id === active.id);

    const newIndex = songs.findIndex((song) => song._id === over.id);

    const reordered = arrayMove(songs, oldIndex, newIndex);

    setSongs(reordered);

    await updateSongOrder({
      id: setlist._id,

      songIds: reordered.map((song) => song._id),
    });
  }

  return (
    <div className="w-full p-6">
      <div className="flex gap-2 mb-6">
        {/* <Button asChild variant="outline">
          <Link href="/setlists">Back</Link>
        </Button> */}

        <Button asChild>
          <Link href={`/setlists/${setlist._id}/edit`}>Edit</Link>
        </Button>
        <Button asChild>
          <Link href={`/setlists/${setlist._id}/worship`}>Worship Mode</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{setlist.title}</CardTitle>
        </CardHeader>

        <CardContent className="mb-2">
          <div className="flex gap-2 mb-2">
            <p className="font-medium">Leaders</p>

            <div className="flex flex-wrap gap-2">
              {setlist.leaders.map((leader) => (
                <Badge key={leader}>{leader}</Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">Songs</p>

            <div className="space-y-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={songs.map((song) => song._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {songs.map((song, index) => (
                      <SortableSong
                        key={song._id}
                        id={song._id}
                        title={song.title}
                        index={index}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
