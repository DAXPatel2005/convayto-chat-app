import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path"; // ✅ Add this line

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // ✅ Alias setup
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
    open: false,
  },
});
