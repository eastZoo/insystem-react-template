import { lazy, Suspense, type ComponentType } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import ProtectedRoute from "@/lib/core/routes/ProtectedRoute";
import {
  ROUTE_CONFIGS,
  type RouteConfig,
} from "@/lib/core/routes/routes.config";
import ProtectedLayout from "../ProtectedLayout";

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
  const protectedChildren = ROUTE_CONFIGS.filter(
    (route) => route.protected !== false
  ).map((route) => {
    const Page = lazyPage(route);
    if (route.path === "/") {
      return {
        index: true,
        element: <Page />,
      };
    }

    return {
      path: route.path.replace(/^\//, ""),
      element: <Page />,
    };
  });

  const publicRoutes = ROUTE_CONFIGS.filter(
    (route) => route.protected === false
  ).map((route) => {
    const Page = lazyPage(route);
    return {
      path: route.path,
      element: <Page />,
    };
  });

  const routes = [
    ...publicRoutes,
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <ProtectedLayout />
        </ProtectedRoute>
      ),
      children: protectedChildren,
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ];

  const element = useRoutes(routes);

  return <Suspense fallback={<div style={{ padding: 24 }}>로딩중…</div>}>{element}</Suspense>;
}
