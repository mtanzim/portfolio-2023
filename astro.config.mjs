import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  site: "https://www.mtanzim.com",
  integrations: [tailwind(), react(), svelte()],
  experimental: { assets: true },
});
