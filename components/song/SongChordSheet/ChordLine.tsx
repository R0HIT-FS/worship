import { LyricToken } from "./parser";
import ChordWord from "./ChordWord";
import React from "react";

interface Props {
  tokens: LyricToken[];
}

export default function ChordLine({ tokens }: Props) {
  return (
    <div className="leading-7">
      {/* {tokens.map((token, i) => (
        <ChordWord
          key={i}
          chord={token.chord}
          text={token.text}
        />
      ))} */}

      {tokens.map((token, i) => (
        <React.Fragment key={i}>
          <ChordWord chord={token.chord} text={token.text.trimEnd()} />
          {i < tokens.length - 1 && " "}
        </React.Fragment>
      ))}
    </div>
  );
}
