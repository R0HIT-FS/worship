"use client";

import Link from "next/link";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  useMutation,
  useQuery,
} from "convex/react";

import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";

import { SetlistForm } from "@/components/setlists/setlist-form";

export default function EditSetlistPage() {
  const params = useParams();
  const router = useRouter();

  const songs = useQuery(
    api.songs.getSongOptions
  );

  const setlist = useQuery(
    api.setlists.getSetlistWithSongs,
    {
      id: params.id as any,
    }
  );

  const updateSetlist =
    useMutation(
      api.setlists.updateSetlist
    );

  const deleteSetlist =
    useMutation(
      api.setlists.deleteSetlist
    );

  async function handleDelete() {
    if (!setlist) return;

    const confirmed =
      window.confirm(
        "Delete this setlist?"
      );

    if (!confirmed) return;

    await deleteSetlist({
      id: setlist._id,
    });

    router.push(
      "/setlists"
    );
  }

  if (
    songs === undefined ||
    setlist === undefined
  ) {
    return (
      <div className="p-6">
        Loading...
      </div>
    );
  }

  if (!setlist) {
    return (
      <div className="p-6">
        Setlist not found
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="flex gap-2 mb-6">
        <Button
          variant="outline"
          asChild
        >
          <Link
            href={`/setlists/${setlist._id}`}
          >
            Cancel
          </Link>
        </Button>

        <Button
          variant="destructive"
          onClick={
            handleDelete
          }
        >
          Delete
        </Button>
      </div>

      <SetlistForm
        songs={songs}
        initialTitle={
          setlist.title
        }
        initialDate={
          setlist.date
        }
        initialLeaders={
          setlist.leaders
        }
        initialSongIds={
          setlist.songIds as string[]
        }
        submitLabel="Save Changes"
        onSubmit={async (
          data
        ) => {
          await updateSetlist({
            id: setlist._id,

            title:
              data.title,

            date:
              data.date,

            leaders:
              data.leaders,

            songIds:
              data.songIds as any,
          });

          router.push(
            `/setlists/${setlist._id}`
          );
        }}
      />
    </div>
  );
}