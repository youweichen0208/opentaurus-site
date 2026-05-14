import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/opentaurus-site/",
  plugins: [vue()],
});
