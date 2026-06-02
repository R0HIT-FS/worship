"use client";

import Link from "next/link";

import { useParams } from "next/navigation";

import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

export default function SetlistPage() {
  const params = useParams();

  const setlist = useQuery(
    api.setlists.getSetlistWithSongs,
    {
      id: params.id as any,
    }
  );

  if (setlist === undefined) {
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
          asChild
          variant="outline"
        >
          <Link href="/setlists">
            Back
          </Link>
        </Button>

        <Button
          asChild
        >
          <Link
            href={`/setlists/${setlist._id}/edit`}
          >
            Edit
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {setlist.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="mb-2">
          <div className="flex gap-2 mb-2">
            <p className="font-medium">
              Leaders
            </p>

            <div className="flex flex-wrap gap-2">
              {setlist.leaders.map(
                (leader) => (
                  <Badge
                    key={leader}
                  >
                    {leader}
                  </Badge>
                )
              )}
            </div>
          </div>

          <div>
            <p className="font-medium mb-2">
              Songs
            </p>

            <div className="space-y-2">
              {setlist.songs.map(
                (
                  song,
                  index
                ) => (
                  <Link
                    key={song?._id}
                    href={`/songs/${song?._id}`}
                    className="block"
                  >
                    <Card>
                      <CardContent className="">
                        {index + 1}
                        .{" "}
                        {
                          song?.title
                        }
                      </CardContent>
                    </Card>
                  </Link>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}