// lib/transpose.ts

const SHARP_NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const FLAT_NOTES = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
];

const NOTE_INDEX: Record<string, number> = {
  C: 0,
  "C#": 1,
  Db: 1,
  D: 2,
  "D#": 3,
  Eb: 3,
  E: 4,
  F: 5,
  "F#": 6,
  Gb: 6,
  G: 7,
  "G#": 8,
  Ab: 8,
  A: 9,
  "A#": 10,
  Bb: 10,
  B: 11,
};

export type AccidentalPreference = "sharp" | "flat";

function transposeNote(
  note: string,
  steps: number,
  preference: AccidentalPreference,
) {
  const index = NOTE_INDEX[note];

  if (index === undefined) {
    return note;
  }

  const newIndex = (index + steps + 12) % 12;

  return preference === "flat" ? FLAT_NOTES[newIndex] : SHARP_NOTES[newIndex];
}

export function isChord(token: string) {
  return /^([A-G](#|b)?)(.*?)(\/([A-G](#|b)?))?$/.test(token);
}

const SECTION_REGEX =
  /^(Verse|Chorus|Bridge|Tag|Outro|Intro|Pre-Chorus|End|Ending|Tab|Vamp)(\s+\d+)?$/i;

export function transposeChord(
  chord: string,
  steps: number,
  preference: AccidentalPreference = "sharp",
) {
  if (!isChord(chord)) return chord;

  const parts = chord.match(/^([A-G](#|b)?)(.*?)(\/([A-G](#|b)?))?$/);

  if (!parts) return chord;

  const root = parts[1];
  const quality = parts[3] || "";
  const bass = parts[5];

  let result = transposeNote(root, steps, preference) + quality;

  if (bass) {
    result += "/" + transposeNote(bass, steps, preference);
  }

  return result;
}

export function transposeSong(
  text: string,
  steps: number,
  preference: AccidentalPreference = "sharp",
) {
  if (steps === 0) return text;

  //   return text.replace(/\[(.*?)\]/g, (_, token) => {
  //     if (!isChord(token)) {
  //       return `[${token}]`;
  //     }

  //     return `[${transposeChord(token, steps, preference)}]`;
  //   });
  return text.replace(/\[(.*?)\]/g, (_, token) => {
    const value = token.trim();

    if (SECTION_REGEX.test(value)) {
      return `[${value}]`;
    }

    if (!isChord(value)) {
      return `[${value}]`;
    }

    return `[${transposeChord(value, steps, preference)}]`;
  });
}
