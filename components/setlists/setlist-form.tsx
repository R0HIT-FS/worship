// "use client";

// import { useMemo, useState } from "react";

// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// type Song = {
//   _id: string;
//   title: string;
// };

// type Props = {
//   songs: Song[];

//   initialTitle?: string;
//   initialDate?: string;
//   initialLeaders?: string[];

//   initialSongIds?: string[];

//   submitLabel?: string;

//   onSubmit: (data: {
//     title: string;
//     date: string;
//     leaders: string[];
//     songIds: string[];
//   }) => Promise<void>;
// };

// export function SetlistForm({
//   songs,

//   initialTitle = "",
//   initialDate = "",
//   initialLeaders = [],

//   initialSongIds = [],

//   submitLabel = "Save",

//   onSubmit,
// }: Props) {
//   const [title, setTitle] =
//     useState(initialTitle);

//   const [date, setDate] =
//     useState(initialDate);

//   const [leaders, setLeaders] =
//     useState(
//       initialLeaders.join(", ")
//     );

//   const [search, setSearch] =
//     useState("");

//   const [
//     selectedSongs,
//     setSelectedSongs,
//   ] = useState<string[]>(
//     initialSongIds
//   );

//   const songMap = useMemo(
//     () =>
//       new Map(
//         songs.map((song) => [
//           song._id,
//           song,
//         ])
//       ),
//     [songs]
//   );

//   const filteredSongs =
//     useMemo(() => {
//       return songs.filter(
//         (song) =>
//           song.title
//             .toLowerCase()
//             .includes(
//               search.toLowerCase()
//             ) &&
//           !selectedSongs.includes(
//             song._id
//           )
//       );
//     }, [
//       songs,
//       search,
//       selectedSongs,
//     ]);

//   function addSong(
//     songId: string
//   ) {
//     setSelectedSongs((prev) => [
//       ...prev,
//       songId,
//     ]);
//   }

//   function removeSong(
//     songId: string
//   ) {
//     setSelectedSongs((prev) =>
//       prev.filter(
//         (id) => id !== songId
//       )
//     );
//   }

//   async function handleSubmit() {
//     await onSubmit({
//       title,

//       date,

//       leaders: leaders
//         .split(",")
//         .map((x) =>
//           x.trim()
//         )
//         .filter(Boolean),

//       songIds: selectedSongs,
//     });
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <Input
//         placeholder="Title"
//         value={title}
//         onChange={(e) =>
//           setTitle(
//             e.target.value
//           )
//         }
//       />

//       {/* <Input
//         type="date"
//         value={date}
//         onChange={(e) =>
//           setDate(
//             e.target.value
//           )
//         }
//       /> */}

//       <Input
//         placeholder="Leaders"
//         value={leaders}
//         onChange={(e) =>
//           setLeaders(
//             e.target.value
//           )
//         }
//       />

//       <Card>
//         <CardHeader>
//           <CardTitle>
//             Search Songs
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           <Input
//             placeholder="Search songs..."
//             value={search}
//             onChange={(e) =>
//               setSearch(
//                 e.target.value
//               )
//             }
//           />

//           <div className="space-y-2 mt-4">
//             {filteredSongs.map(
//               (song) => (
//                 <div
//                   key={song._id}
//                   className="flex justify-between border rounded p-3"
//                 >
//                   <span>
//                     {song.title}
//                   </span>

//                   <Button
//                     size="sm"
//                     onClick={() =>
//                       addSong(
//                         song._id
//                       )
//                     }
//                   >
//                     Add
//                   </Button>
//                 </div>
//               )
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       <Card>
//         <CardHeader>
//           <CardTitle>
//             Selected Songs
//           </CardTitle>
//         </CardHeader>

//         <CardContent>
//           <div className="space-y-2">
//             {selectedSongs.map(
//               (
//                 songId,
//                 index
//               ) => {
//                 const song =
//                   songMap.get(
//                     songId
//                   );

//                 if (!song)
//                   return null;

//                 return (
//                   <div
//                     key={songId}
//                     className="flex justify-between border rounded p-3"
//                   >
//                     <span>
//                       {index + 1}.{" "}
//                       {
//                         song.title
//                       }
//                     </span>

//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       onClick={() =>
//                         removeSong(
//                           songId
//                         )
//                       }
//                     >
//                       Remove
//                     </Button>
//                   </div>
//                 );
//               }
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       <Button
//         onClick={
//           handleSubmit
//         }
//       >
//         {submitLabel}
//       </Button>
//     </div>
//   );
// }




"use client";

import { useMemo, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Song = {
  _id: string;
  title: string;
};

type Props = {
  songs: Song[];

  initialTitle?: string;
  initialDate?: string;
  initialLeaders?: string[];

  initialSongIds?: string[];

  submitLabel?: string;

  onSubmit: (data: {
    title: string;
    date: string;
    leaders: string[];
    songIds: string[];
  }) => Promise<void>;
};

export function SetlistForm({
  songs,
  initialTitle = "",
  initialDate = "",
  initialLeaders = [],
  initialSongIds = [],
  submitLabel = "Save",
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(initialTitle);
  const [date, setDate] = useState(initialDate);
  const [leaders, setLeaders] = useState(
    initialLeaders.join(", ")
  );
  const [search, setSearch] = useState("");
  const [selectedSongs, setSelectedSongs] =
    useState<string[]>(initialSongIds);

  const [errors, setErrors] = useState<{
    title?: string;
    leaders?: string;
    songs?: string;
  }>({});

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const songMap = useMemo(
    () =>
      new Map(
        songs.map((song) => [
          song._id,
          song,
        ])
      ),
    [songs]
  );

  const filteredSongs = useMemo(() => {
    return songs.filter(
      (song) =>
        song.title
          .toLowerCase()
          .includes(search.toLowerCase()) &&
        !selectedSongs.includes(song._id)
    );
  }, [songs, search, selectedSongs]);

  function addSong(songId: string) {
    setSelectedSongs((prev) => [
      ...prev,
      songId,
    ]);

    if (errors.songs) {
      setErrors((prev) => ({
        ...prev,
        songs: undefined,
      }));
    }
  }

  function removeSong(songId: string) {
    setSelectedSongs((prev) =>
      prev.filter((id) => id !== songId)
    );
  }

  function validate() {
    const newErrors: typeof errors = {};

    if (!title.trim()) {
      newErrors.title =
        "Title is required.";
    }

    if (!leaders.trim()) {
      newErrors.leaders =
        "At least one leader is required.";
    }

    if (selectedSongs.length === 0) {
      newErrors.songs =
        "Select at least one song.";
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors).length === 0
    );
  }

  async function handleSubmit() {
    if (!validate()) return;

    try {
      setIsSubmitting(true);

      await onSubmit({
        title: title.trim(),
        date,
        leaders: leaders
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        songIds: selectedSongs,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <Input
          placeholder="Title"
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
        />

        {errors.title && (
          <p className="mt-1 text-sm text-red-600">
            {errors.title}
          </p>
        )}
      </div>

      {/* Uncomment if using dates
      <Input
        type="date"
        value={date}
        onChange={(e) =>
          setDate(e.target.value)
        }
      />
      */}

      <div>
        <Input
          placeholder="Leaders (comma separated)"
          value={leaders}
          onChange={(e) => {
            setLeaders(e.target.value);

            if (errors.leaders) {
              setErrors((prev) => ({
                ...prev,
                leaders: undefined,
              }));
            }
          }}
        />

        {errors.leaders && (
          <p className="mt-1 text-sm text-red-600">
            {errors.leaders}
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Search Songs
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Input
            placeholder="Search songs..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <div className="space-y-2 mt-4">
            {filteredSongs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No songs found.
              </p>
            ) : (
              filteredSongs.map((song) => (
                <div
                  key={song._id}
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  <span>{song.title}</span>

                  <Button
                    size="sm"
                    onClick={() =>
                      addSong(song._id)
                    }
                  >
                    Add
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Selected Songs
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {selectedSongs.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No songs selected.
              </p>
            ) : (
              selectedSongs.map(
                (
                  songId,
                  index
                ) => {
                  const song =
                    songMap.get(songId);

                  if (!song) return null;

                  return (
                    <div
                      key={songId}
                      className="flex items-center justify-between border rounded-md p-3"
                    >
                      <span>
                        {index + 1}.{" "}
                        {song.title}
                      </span>

                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          removeSong(
                            songId
                          )
                        }
                      >
                        Remove
                      </Button>
                    </div>
                  );
                }
              )
            )}
          </div>

          {errors.songs && (
            <p className="mt-3 text-sm text-red-600">
              {errors.songs}
            </p>
          )}
        </CardContent>
      </Card>

      <Button
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Saving..."
          : submitLabel}
      </Button>
    </div>
  );
}