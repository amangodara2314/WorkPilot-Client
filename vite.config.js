import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import ClosePlugin from "./vite-plugin-close";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), ClosePlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
