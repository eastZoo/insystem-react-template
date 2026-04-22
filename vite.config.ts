import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { execSync } from "node:child_process";

/**
 * sync-pages 플러그인
 * - 빌드 시작 시 sync:pages 실행
 * - routes.config.ts 저장 시 HMR 트리거로 sync:pages 재실행
 *   → 새 라우트를 저장하는 순간 src/pages/{name}/index.tsx 가 자동 생성됩니다.
 */
function syncPagesPlugin() {
  return {
    name: "sync-pages",
    buildStart() {
      execSync("node scripts/sync-pages.mjs", { stdio: "inherit" });
    },
    handleHotUpdate({ file }: { file: string }) {
      if (file.includes("routes.config.ts")) {
        console.log("\n[sync-pages] routes.config.ts 변경 감지 → 동기화 실행");
        execSync("node scripts/sync-pages.mjs", { stdio: "inherit" });
      }
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    syncPagesPlugin(),
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
  },
  server: {
    port: 3000, // 필요시 변경
    open: true,
  },
});
