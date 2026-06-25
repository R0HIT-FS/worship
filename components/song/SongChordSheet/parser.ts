export interface LyricToken {
  chord: string | null | undefined;
  text: string;
  isProgression?: boolean;
}

export interface SongLine {
  type: "lyrics" | "progression" | "text" | "blank";
  tokens?: LyricToken[];
  text?: string;
}

export interface SongSection {
  title: string;
  lines: SongLine[];
}

const CHORD_REGEX = /\[([^\]]+)\]/g;

function parseLyricLine(line: string): LyricToken[] {
  const tokens: LyricToken[] = [];

  let lastIndex = 0;
  let pendingChord: string | null = null;

  for (const match of line.matchAll(CHORD_REGEX)) {
    const index = match.index ?? 0;

    const text = line.slice(lastIndex, index);

    const cleaned = text.trim();

    if (text.length > 0 || pendingChord !== null) {
      tokens.push({
        chord: pendingChord,
        text,
        isProgression:
          cleaned === "/" ||
          cleaned === "|" ||
          cleaned === "/|" ||
          cleaned === "|/",
      });
    }

    pendingChord = match[1];
    lastIndex = index + match[0].length;
  }

  const remaining = line.slice(lastIndex);

  tokens.push({
    chord: pendingChord,
    text: remaining,
  });

  return tokens;
}

function extractLeadingProgression(tokens: LyricToken[]) {
  const progression: string[] = [];
  let lyricIndex = -1;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (!token.chord) break;

    const text = token.text.trim();

    if (text === "/" || text === "|") {
      progression.push(token.chord);
      continue;
    }

    progression.push(token.chord);

    if (text.length > 0) {
      lyricIndex = i;
    }

    break;
  }

  return { progression, lyricIndex };
}

export function parseSong(content: string): SongSection[] {
  const sections: SongSection[] = [];
  const lines = content.replace(/\r/g, "").split("\n");

  let current: SongSection | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();

    // Blank line
    if (!line.trim()) {
      current?.lines.push({ type: "blank" });
      continue;
    }

    const nextNonEmpty = lines.slice(i + 1).find((l) => l.trim().length > 0);

    const isSectionHeader =
      !line.includes("[") && !!nextNonEmpty && nextNonEmpty.includes("[");

    if (isSectionHeader) {
      current = {
        title: line,
        lines: [],
      };

      sections.push(current);
      continue;
    }

    if (!current) {
      current = {
        title: "",
        lines: [],
      };

      sections.push(current);
    }

    if (line.includes("[")) {
      const tokens = parseLyricLine(line);

      const { progression, lyricIndex } = extractLeadingProgression(tokens);

      if (progression.length >= 2) {
        current.lines.push({
          type: "progression",
          text: progression.join(" / "),
        });

        // Standalone progression
        if (lyricIndex === -1) {
          continue;
        }

        // Progression followed by lyrics
        const lyricTokens = tokens.slice(lyricIndex);

        lyricTokens[0] = {
          ...lyricTokens[0],
          chord: undefined,
        };

        current.lines.push({
          type: "lyrics",
          tokens: lyricTokens,
        });

        continue;
      }

      // Normal lyric line
      current.lines.push({
        type: "lyrics",
        tokens,
      });
    } else {
      current.lines.push({
        type: "text",
        text: line,
      });
    }
  }

  return sections;
}
