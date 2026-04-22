import { lazy, Suspense, type ComponentType } from "react";
import { useRoutes, Navigate, type RouteObject } from "react-router-dom";
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

/** 렌더마다 lazy()를 새로 만들면 라우트 트리 참조가 매번 바뀌어 useRoutes 매칭이 깨질 수 있음 */
const lazyPageByPath = new Map<string, ReturnType<typeof lazy>>();

function lazyPage(route: RouteConfig) {
  const cached = lazyPageByPath.get(route.path);
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

  const Page = lazy(loader);
  lazyPageByPath.set(route.path, Page);
  return Page;
}

/**
 * 모듈 로드 시 1회 구성 — AppRoutes 렌더마다 routes 배열·lazy 컴포넌트가 바뀌지 않도록 함.
 * (그렇지 않으면 `*` 스플랫만 맞거나 /404 로만 튀는 증상이 날 수 있음)
 */
const APP_ROUTE_OBJECTS: RouteObject[] = [
  ...ROUTE_CONFIGS.map((route): RouteObject => {
    const Page = lazyPage(route);
    const isProtected = route.protected !== false;

    return {
      path: route.path,
      element: isProtected ? (
        <ProtectedRoute>
          <ProtectedLayout>
            <Page />
          </ProtectedLayout>
        </ProtectedRoute>
      ) : (
        <Page />
      ),
    };
  }),
  { path: "*", element: <Navigate to="/404" replace /> },
];

export default function AppRoutes() {
  const element = useRoutes(APP_ROUTE_OBJECTS);

  return (
    <Suspense fallback={<div style={{ padding: 24 }}>로딩중…</div>}>
      {element}
    </Suspense>
  );
}
