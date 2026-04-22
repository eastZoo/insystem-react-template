import { lazy, Suspense, type ComponentType } from "react";
import { useAtomValue } from "jotai";
import type { Tab } from "@/types/menu";
import { openTabsState } from "@/store/menu";
import {
  ROUTE_CONFIGS,
  type RouteConfig,
} from "@/lib/core/routes/routes.config";

/**
 * Vite import.meta.glob — Routes.tsx와 동일한 패턴 사용
 * TabContents.tsx는 src/lib/core/ 에 있으므로 상대 경로가 다름
 */
const pageModules = import.meta.glob<{ default: ComponentType }>([
  "../../pages/**/index.tsx",
  "../../pages/**/*Page.tsx",
]);

/** src/pages/ 기준 .tsx 경로(슬래시) → glob 키 */
function toGlobKey(pagesRelativeTsx: string): string {
  const n = pagesRelativeTsx.replace(/^\//, "").replace(/\\/g, "/");
  return `../../pages/${n}`;
}

/**
 * RouteConfig → pages 아래 .tsx 상대 경로(확장자 포함, 슬래시).
 * page 우선, 없으면 name/index.tsx
 */
function resolvePageTsxPath(route: RouteConfig): string {
  if (route.page) {
    const raw = route.page.replace(/^\//, "").replace(/\.tsx$/i, "");
    const last = raw.split("/").pop() ?? "";
    if (last.endsWith("Page")) {
      return `${raw}.tsx`;
    }
    return `${raw}/index.tsx`;
  }
  if (route.name) {
    return `${route.name}/index.tsx`;
  }
  throw new Error(
    `[TabContents] path "${route.path}" 에 name 또는 page 가 필요합니다.`
  );
}

/** 모듈 로드 시 1회 구성 — 렌더마다 lazy()가 새로 만들어지지 않도록 캐싱 */
const lazyPageByPath = new Map<string, ReturnType<typeof lazy>>();

function lazyPage(route: RouteConfig) {
  const cached = lazyPageByPath.get(route.path);
  if (cached) return cached;

  const rel = resolvePageTsxPath(route);
  const key = toGlobKey(rel);
  const loader = pageModules[key];

  if (!loader) {
    console.warn(
      `[TabContents] 페이지 모듈을 찾을 수 없습니다: ${key}\n` +
        `  src/pages/${rel}`
    );
    return null;
  }

  const Page = lazy(loader);
  lazyPageByPath.set(route.path, Page);
  return Page;
}

/**
 * ROUTE_CONFIGS 기반으로 path → LazyComponent 맵 생성
 * protected 라우트만 탭으로 사용 가능 (로그인/404 등 제외)
 */
const TAB_COMPONENT_MAP = new Map<string, ReturnType<typeof lazy>>();

ROUTE_CONFIGS.forEach((route) => {
  // protected 라우트만 탭 대상
  if (route.protected !== false) {
    const Page = lazyPage(route);
    if (Page) {
      TAB_COMPONENT_MAP.set(route.path, Page);
    }
  }
});

const TabContents = () => {
  const openTabs = useAtomValue(openTabsState);

  if (!openTabs || openTabs.length === 0) {
    return null;
  }

  return (
    <>
      {openTabs.map((tab: Tab) => {
        const Component = TAB_COMPONENT_MAP.get(tab.path);
        if (!Component) {
          console.warn(`[TabContents] Component not found for path: ${tab.path}`);
          return null;
        }

        return (
          <Suspense key={tab.id} fallback={<div style={{ padding: 24 }}>로딩중…</div>}>
            <div
              style={{
                display: tab.isSelected ? "flex" : "block",
                flexDirection: "column",
                flex: tab.isSelected ? 1 : undefined,
                minHeight: tab.isSelected ? 0 : undefined,
                overflow: tab.isSelected ? "hidden" : undefined,
                visibility: tab.isSelected ? "visible" : "hidden",
                position: tab.isSelected ? "static" : "absolute",
                left: tab.isSelected ? undefined : "-9999px",
              }}
            >
              <Component />
            </div>
          </Suspense>
        );
      })}
    </>
  );
};

export default TabContents;
