<script lang="ts">
  import type { SpotifyArtists } from "../../types/spotify-artists";
  import WordCloud from "./WordCloud.svelte";

  export let data: SpotifyArtists;

  const items = data.items;
  const genres = items.flatMap((i) => i.genres);
  const genreMap = genres.reduce((acc: { [k: string]: number }, cur) => {
    if (acc?.[cur] !== undefined) {
      acc[cur] = acc[cur] + 1;
    } else {
      acc[cur] = 1;
    }
    return acc;
  }, {});
</script>

<WordCloud {genreMap} />
