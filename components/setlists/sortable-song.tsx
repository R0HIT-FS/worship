"use client";

import Link from "next/link";
import { GripVertical } from "lucide-react";

import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

import { Id } from "@/convex/_generated/dataModel";

type Props = {
  id: Id<"songs">;
  title: string;
  index: number;
};

export function SortableSong({
  id,
  title,
  index,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id,
  });

  const style = {
    transform:
      CSS.Transform.toString(
        transform
      ),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg bg-background"
    >
      <div className="flex items-center">
        <div
          // href={`/songs/${id}`}
          className="flex-1 p-4"
        >
          {index + 1}. {title}
        </div>

        <button
          type="button"
          className="p-4 touch-none cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}