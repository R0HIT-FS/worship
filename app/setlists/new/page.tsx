"use client";

import { useRouter } from "next/navigation";

import {
  useMutation,
  useQuery,
} from "convex/react";

import { api } from "@/convex/_generated/api";

import { SetlistForm } from "@/components/setlists/setlist-form";

export default function NewSetlistPage() {
  const router = useRouter();

  const songs = useQuery(
    api.songs.getSongOptions
  );

  const createSetlist =
    useMutation(
      api.setlists.createSetlist
    );

  if (!songs)
    return <div className="p-6">Loading...</div>;

  return (
    <SetlistForm
      songs={songs}
      submitLabel="Create Setlist"
      onSubmit={async (
        data
      ) => {
        const id =
          await createSetlist(
            data
          );

        router.push(
          `/setlists/${id}`
        );
      }}
    />
  );
}