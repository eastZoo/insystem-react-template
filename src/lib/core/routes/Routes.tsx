import { lazy, Suspense, type ComponentType } from "react";
import { useRoutes, Navigate, useLocation } from "react-router-dom";
import ProtectedRoute from "@/lib/core/routes/ProtectedRoute";
import { ROUTE_CONFIGS, type RouteConfig } from "@/lib/core/routes/routes.config";

/**
 * Vite import.meta.glob — 패턴은 반드시 문자열 리터럴(빌드 타임 수집).
 * - pages 이하 임의 depth의 index.tsx
 * - pages 이하 `*Page.tsx` 엔트리 (예: auth/Account/ResetPassword/ResetPasswordPage.tsx)
 */
const pageModules = import.meta.glob<{ default: ComponentType }>([
  "../../../pages/**/index.tsx",
  "../../../pages/**/*Page.tsx",
]);

/** src/pages/ 기준 .tsx 경로(슬래시) → glob 키 */
function toGlobKey(pagesRelativeTsx: string): string {
  const n = pagesRelativeTsx.replace(/^\//, "").replace(/\\/g, "/");
  return `../../../pages/${n}`;
}

/**
 * RouteConfig → pages 아래 .tsx 상대 경로(확장자 포함, 슬래시).
 * page 우선, 없으면 name/index.tsx
 */
export function resolveRoutePageTsxPath(route: RouteConfig): string {
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
    `[Routes] path "${route.path}" 에 name 또는 page 가 필요합니다.`
  );
}

function lazyPage(route: RouteConfig) {
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

  return lazy(loader);
}

export default function AppRoutes() {
  const location = useLocation();

  const routes = [
    // routes.config.ts 에 정의된 라우트 설정 자동 매핑
    ...ROUTE_CONFIGS.map((route) => {
      const Page = lazyPage(route);
      const isProtected = route.protected !== false;

      return {
        path: route.path,
        element: isProtected ? (
          <ProtectedRoute>
            <Page />
          </ProtectedRoute>
        ) : (
          <Page />
        ),
      };
    }),

    { path: "*", element: <Navigate to="/404" replace /> },
  ];

  const element = useRoutes(routes);

  // RR v7 + lazy: 전환 시 Suspense fallback 이 안 뜨는 경우가 있어 key 로 경계를 분리
  return (
    <Suspense
      key={location.key}
      fallback={<div style={{ padding: 24 }}>로딩중…</div>}
    >
      {element}
    </Suspense>
  );
}
