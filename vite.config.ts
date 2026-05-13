import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svgr(),
    react({
      // styled-components Babel 플러그인 활성화 (대중적 옵션)
      babel: {
        plugins: [
          [
            "babel-plugin-styled-components",
            {
              displayName: true,
              fileName: true,
              pure: true,
            },
          ],
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    // npm link 사용 시 React/styled-components 중복 방지
    dedupe: ["react", "react-dom", "styled-components"],
  },
  server: {
    port: 3000, // 필요시 변경
    open: true,
    host: true, // 같은 네트워크 내 다른 기기에서 접속 허용 (0.0.0.0 바인딩)
  },
});
