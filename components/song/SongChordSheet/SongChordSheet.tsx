import { parseSong } from "./parser";
import ChordLine from "./ChordLine";

interface Props {
  content: string;
  fontSize: number | string;
}

export default function SongChordSheet({ content, fontSize }: Props) {
  const sections = parseSong(content);

  return (
    <div
      className="space-y-8 text-base"
      style={{
        fontSize: `${fontSize}px`,
      }}
    >
      {/* {sections.map((section, index) => (
        <div key={index}>
          {section.title && (
            <h3 className="mb-4 text-lg font-bold">
              {section.title}
            </h3>
          )}

          <div className="space-y-2">
            {section.lines.map((line, i) => {
              if (line.type === "blank") {
                return <div key={i} className="h-4" />;
              }

              return (
                <ChordLine
                  key={i}
                  tokens={line.tokens!}
                />
              );
            })}
          </div>
        </div>
      ))} */}
  
      {sections.map((section, index) => (
        <section key={index} className="mb-10">
          {section.title && (
            <h2 className="mb-4 mt-8 text-xl font-bold tracking-wide">
              {section.title}
            </h2>
          )}

          <div className="space-y-1">
            {section.lines.map((line, i) => {
              switch (line.type) {
                case "blank":
                  return <div key={i} className="h-3" />;

                case "text":
                  return (
                    <p key={i} className="text-base italic text-gray-500">
                      {line.text}
                    </p>
                  );

                case "progression":
                  return (
                    <p
                      key={i}
                      className="font-semibold text-blue-600 whitespace-pre-wrap"
                    >
                      {line.text}
                    </p>
                  );

                case "lyrics":
                  return <ChordLine key={i} tokens={line.tokens!} />;
              }
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
