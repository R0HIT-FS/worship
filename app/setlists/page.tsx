"use client";

import Link from "next/link";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export default function SetlistsPage() {
  const setlists = useQuery(
    api.setlists.getSetlists
  );

  if (!setlists) {
    return <div className='p-6'>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Setlists
        </h1>

        <Button asChild>
          <Link href="/setlists/new">
            New Setlist
          </Link>
        </Button>
      </div>

      <div className="space-y-4">
        {setlists.map(
          (setlist) => (
            <Link
              key={setlist._id}
              href={`/setlists/${setlist._id}`}
            >
              <Card className='mb-2'>
                <CardHeader>
                  <CardTitle className='text-xl'>
                    {setlist.title}
                  </CardTitle>
                </CardHeader>

                {setlist.leaders && setlist.leaders.length>0 && <CardContent>
                  Leaders : {setlist.leaders}
                </CardContent>}
                {setlist.songIds && setlist.songIds.length>0 && <CardContent>
                  Songs : {setlist.songIds.length}
                </CardContent>}
              </Card>
            </Link>
          )
        )}
      </div>
    </div>
  );
}