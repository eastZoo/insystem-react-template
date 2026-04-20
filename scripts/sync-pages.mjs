/**
 * sync-pages.mjs
 *
 * routes.config.ts 의 ROUTE_CONFIGS 를 읽어 누락된 페이지 엔트리를 생성합니다.
 *
 * 실행: npm run sync:pages
 * 기존 파일은 덮어쓰지 않습니다.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const configPath = path.join(ROOT, "src/lib/core/routes/routes.config.ts");

if (!fs.existsSync(configPath)) {
  console.error("❌ routes.config.ts 를 찾을 수 없습니다:", configPath);
  process.exit(1);
}

const configSrc = fs.readFileSync(configPath, "utf-8");

function stripComments(src) {
  return src.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
}

const stripped = stripComments(configSrc);

function extractRouteObjectStrings(src) {
  const decl = src.indexOf("ROUTE_CONFIGS");
  if (decl < 0) return [];
  const eq = src.indexOf("=", decl);
  if (eq < 0) return [];
  const lb = src.indexOf("[", eq);
  if (lb < 0) return [];

  const objs = [];
  let i = lb + 1;
  let depth = 0;
  let objStart = -1;

  while (i < src.length) {
    const c = src[i];
    if (c === "{") {
      if (depth === 0) objStart = i;
      depth++;
    } else if (c === "}") {
      depth--;
      if (depth === 0 && objStart >= 0) {
        objs.push(src.slice(objStart, i + 1));
        objStart = -1;
      }
    } else if (depth === 0 && c === "]") {
      break;
    }
    i++;
  }
  return objs;
}

function field(block, key) {
  const m = block.match(new RegExp(`${key}:\\s*["']([^"']*)["']`, "m"));
  return m?.[1];
}

function resolveRelativeTsx(name, page) {
  if (page) {
    const raw = page.replace(/^\//, "").replace(/\.tsx$/i, "");
    const last = raw.split("/").pop() ?? "";
    if (last.endsWith("Page")) return `${raw}.tsx`;
    return `${raw}/index.tsx`;
  }
  if (name) return `${name}/index.tsx`;
  return null;
}

const pageTemplate = (componentBaseName, title) =>
  `/**
 * ${title}
 *
 * routes.config.ts 에 의해 sync:pages 로 생성되었을 수 있습니다.
 */
export default function ${componentBaseName}Page() {
/** ============================= state 영역 ============================= */

/** ============================= API 영역 ============================= */

/** ============================= 비즈니스 로직 영역 ============================= */

/** ============================= 컴포넌트 영역 ============================= */

/** ============================= useEffect 영역 ============================= */

  return (
    <>
      <title>${title}</title>
      <div style={{ padding: "24px" }}>
        <h1>${title}</h1>
        <p>${componentBaseName}Page — 내용을 작성하세요.</p>
      </div>
    </>
  );
}
`;

const blocks = extractRouteObjectStrings(stripped);
let created = 0;
let skipped = 0;

for (const block of blocks) {
  const routePath = field(block, "path");
  const title = field(block, "title") ?? routePath ?? "Page";
  const name = field(block, "name");
  const page = field(block, "page");

  const rel = resolveRelativeTsx(name, page);
  if (!rel) {
    console.warn(`스킵 (name/page 없음): path=${routePath ?? "?"}`);
    continue;
  }

  const fileAbs = path.join(ROOT, "src", "pages", ...rel.split("/"));

  if (fs.existsSync(fileAbs)) {
    console.log(`⏭  스킵 (이미 존재): src/pages/${rel}`);
    skipped++;
    continue;
  }

  const dir = path.dirname(fileAbs);
  fs.mkdirSync(dir, { recursive: true });

  const baseForComponent = page
    ? (page.split("/").pop() ?? "Page").replace(/\.tsx$/i, "").replace(/Page$/, "") || "Page"
    : name || "Page";

  fs.writeFileSync(fileAbs, pageTemplate(baseForComponent, title), "utf-8");
  console.log(`생성: src/pages/${rel}`);
  created++;
}

console.log(`\n📄 생성 ${created}개 / 스킵 ${skipped}개`);
