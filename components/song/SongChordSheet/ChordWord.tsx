interface Props {
  chord: string | null | undefined;
  text: string;
}

export default function ChordWord({
  chord,
  text,
}: Props) {
  return (
    <span className="inline-flex flex-col align-top whitespace-pre">
      <span className="h-5 text-sm font-semibold text-blue-600">
        {chord ?? ""}
      </span>

      <span className="text-md">{text}</span>
    </span>
  );
}