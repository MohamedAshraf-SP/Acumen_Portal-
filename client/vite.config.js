import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      "@syncfusion/ej2-base",
      "@syncfusion/ej2-react-base",
      "@syncfusion/ej2-richtexteditor",
      "@syncfusion/ej2-popups",
    ],
  },
});
