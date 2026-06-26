"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

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
  DragEndEvent,
} from "@dnd-kit/core";

import { SortableSong } from "@/components/setlists/sortable-song";
import { SquarePen } from "lucide-react";

type Song = {
  _id: Id<"songs">;
  title: string;
};

export default function SetlistPage() {
  const params = useParams();

  const updateSongOrder = useMutation(api.setlists.updateSongOrder);

  const [songs, setSongs] = useState<Song[]>([]);

  const setlist = useQuery(api.setlists.getSetlistWithSongs, {
    id: params.id as Id<"setlists">,
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

    setSongs(
      setlist.songs.filter(Boolean).map((song) => ({
        _id: song._id,
        title: song.title,
      })),
    );
  }, [setlist]);

  if (setlist === undefined) {
    return <div className="p-6">Loading...</div>;
  }

  if (!setlist) {
    return <div className="p-6">Setlist not found</div>;
  }

  async function handleDragEnd(event: DragEndEvent) {
    if (!setlist) return;

    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = songs.findIndex(
      (song) => song._id === (active.id as Id<"songs">),
    );

    const newIndex = songs.findIndex(
      (song) => song._id === (over.id as Id<"songs">),
    );

    const reordered = arrayMove(songs, oldIndex, newIndex);

    setSongs(reordered);

    await updateSongOrder({
      id: setlist._id,
      songIds: reordered.map((song) => song._id),
    });
  }

  return (
    <div className="w-full p-6">
      <div className="mb-6 flex gap-2">
        <Button asChild variant={'outline'} title="Edit">
          <Link href={`/setlists/${setlist._id}/edit`}><SquarePen /></Link>
        </Button>

        <Button asChild variant={'outline'}>
          <Link href={`/setlists/${setlist._id}/worship`}>Worship Mode</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{setlist.title}</CardTitle>
        </CardHeader>

        <CardContent className="mb-2">
          <div className="mb-2 flex gap-2">
            <p className="font-medium">Leaders</p>

            <div className="flex flex-wrap gap-2">
              {setlist.leaders.map((leader) => (
                <Badge key={leader}>{leader}</Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 font-medium">Songs</p>

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
        </CardContent>
      </Card>
    </div>
  );
}
