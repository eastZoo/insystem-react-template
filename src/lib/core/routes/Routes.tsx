import { lazy, Suspense, type ComponentType } from "react";
import { useRoutes, useLocation } from "react-router-dom";
import ProtectedRoute from "@/lib/core/routes/ProtectedRoute";
import { ROUTE_CONFIGS, type RouteConfig } from "@/lib/core/routes/routes.config";

/**
 * Vite import.meta.glob — 패턴은 반드시 문자열 리터럴(빌드 타임 수집).
 */
const pageModules = import.meta.glob<{ default: ComponentType }>([
  "../../../pages/**/index.tsx",
  "../../../pages/**/*Page.tsx",
]);

/** 보호 라우트 레이아웃 (MainTemplate + TabContents) — lazy import */
const ProtectedLayout = lazy(() => import("@/lib/core/ProtectedLayout"));

function toGlobKey(pagesRelativeTsx: string): string {
  const n = pagesRelativeTsx.replace(/^\//, "").replace(/\\/g, "/");
  return `../../../pages/${n}`;
}

export function resolveRoutePageTsxPath(route: RouteConfig): string {
  if (route.page) {
    const raw = route.page.replace(/^\//, "").replace(/\.tsx$/i, "");
    const last = raw.split("/").pop() ?? "";
    if (last.endsWith("Page")) return `${raw}.tsx`;
    return `${raw}/index.tsx`;
  }
  if (route.name) return `${route.name}/index.tsx`;
  throw new Error(
    `[Routes] path "${route.path}" 에 name 또는 page 가 필요합니다.`
  );
}

const lazyPageCache = new Map<string, ReturnType<typeof lazy>>();

function getLazyPage(route: RouteConfig) {
  const cacheKey = route.path;
  const cached = lazyPageCache.get(cacheKey);
  if (cached) return cached;

  const rel = resolveRoutePageTsxPath(route);
  const key = toGlobKey(rel);
  const loader = pageModules[key];

  if (!loader) {
    throw new Error(
      `[Routes] 페이지 모듈을 찾을 수 없습니다.\n` +
        `  기대 키: ${key}\n` +
        `  src/pages/${rel}\n` +
        `  routes.config 에서 page / name 을 확인하거나 npm run sync:pages 를 실행하세요.`
    );
  }

  const LazyComponent = lazy(loader);
  lazyPageCache.set(cacheKey, LazyComponent);
  return LazyComponent;
}

/**
 * AppRoutes — routes.config.ts 기반 라우트 매핑
 *
 * 1. 공개 라우트(protected: false): 페이지를 직접 렌더링 (/auth/login, /404)
 * 2. catch-all(*): ProtectedRoute → MainTemplate + TabContents
 *    - 토큰 없음 → /auth/login 리다이렉트
 *    - 토큰 있음 → MainTemplate 안에서 TabContents가 URL에 맞는 페이지 렌더링
 */
export default function AppRoutes() {
  const location = useLocation();

  const routes = [
    // 공개 라우트 (비보호)
    ...ROUTE_CONFIGS
      .filter((route) => route.protected === false)
      .map((route) => {
        const Page = getLazyPage(route);
        return {
          path: route.path,
          element: <Page />,
        };
      }),

    // 그 외 모든 경로 → 인증 체크 → MainTemplate + TabContents
    {
      path: "*",
      element: (
        <ProtectedRoute>
          <ProtectedLayout />
        </ProtectedRoute>
      ),
    },
  ];

  const element = useRoutes(routes);

  return (
    <Suspense
      key={location.key}
      fallback={<div style={{ padding: 24 }}>로딩중…</div>}
    >
      {element}
    </Suspense>
  );
}
