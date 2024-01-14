import WordCloudInner from "react-d3-cloud";
import type { SpotifyArtists } from "../../types/spotify-artists";

const fillColor = "#3ABFF8";
const scalingFactor = 300;

export function WordCloud({ json }: { json: SpotifyArtists }) {
  const { items } = json;
  const genres: string[] = items.flatMap((i) => i.genres);
  const genreMap = genres.reduce(
    (acc: { [k: string]: number }, cur: string) => {
      if (acc?.[cur] !== undefined) {
        acc[cur] = acc[cur] + 1;
      } else {
        acc[cur] = 1;
      }
      return acc;
    },
    {}
  );
  const maxCount = Math.max(...Object.values(genreMap));
  const genreMapArray: { text: string; value: number }[] = Object.entries(
    genreMap
  ).map(([text, value]) => ({
    text,
    value,
  }));
  return (
    <WordCloudInner
      fontSize={(word) => (word.value / maxCount) * scalingFactor}
      font={"Impact"}
      fill={fillColor}
      data={genreMapArray}
      padding={1}
      rotate={() => ~~(Math.random() * 2) * 90}
      spiral="archimedean"
    />
  );
}
