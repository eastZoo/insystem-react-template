import {
  lazy,
  Suspense,
  useMemo,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
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

/** 렌더마다 `lazy()` 를 새로 만들면 라우트 트리가 불안정해질 수 있어 페이지 단위로 캐시합니다. */
const lazyPageCache = new Map<string, LazyExoticComponent<ComponentType>>();

function getLazyPage(route: RouteConfig) {
  const rel = resolveRoutePageTsxPath(route);
  let Page = lazyPageCache.get(rel);
  if (!Page) {
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

    Page = lazy(loader);
    lazyPageCache.set(rel, Page);
  }

  return Page;
}

export default function AppRoutes() {
  const routes = useMemo(
    () => [
      ...ROUTE_CONFIGS.filter((route) => route.protected === false).map(
        (route) => {
          const Page = getLazyPage(route);
          return {
            path: route.path,
            element: <Page />,
          };
        }
      ),
      /**
       * path 없는 레이아웃 + 자식은 URL 전체 경로(`/sample` 등)를 쓰는 편이 RR v7 에서 안전합니다.
       * 부모를 `path: "/"` 만 두고 자식만 `sample` 처럼 상대 경로로 두면 Outlet 이 갱신되지 않는 경우가 있습니다.
       */
      {
        element: (
          <ProtectedRoute>
            <ProtectedLayout />
          </ProtectedRoute>
        ),
        children: ROUTE_CONFIGS.filter((route) => route.protected !== false).map(
          (route) => {
            const Page = getLazyPage(route);
            if (route.path === "/") {
              return {
                index: true,
                element: <Page />,
              };
            }
            return {
              path: route.path,
              element: <Page />,
            };
          }
        ),
      },
      { path: "*", element: <Navigate to="/404" replace /> },
    ],
    []
  );

  const element = useRoutes(routes);

  return <Suspense fallback={<div style={{ padding: 24 }}>로딩중…</div>}>{element}</Suspense>;
}
