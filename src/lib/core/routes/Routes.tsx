import React, { lazy, Suspense } from "react";
import { Navigate, Routes as DomRoutes, Route } from "react-router-dom";

// Vite의 glob import를 사용하여 모든 페이지를 동적으로 로드
// 상대 경로 사용 (Routes.tsx 위치: src/lib/core/routes/)
const pageModules = import.meta.glob<{ default: React.ComponentType<any> }>(
  "../../../pages/**/*.tsx"
);

interface RouteConfig {
  path: string;
  filePath: string;
  withAuthorization: boolean;
  isNavigate?: boolean;
}

export default function AppRoutes() {
  const routes: RouteConfig[] = [
    { 
      path: "/auth/login", 
      filePath: "/auth/LoginPage",
      withAuthorization: false,
    },
    { 
      path: "/404", 
      filePath: "/404/NotFoundPage",
      withAuthorization: false,
    },
    // { 
    //   path: "*", 
    //   filePath: "/404/NotFoundPage",
    //   withAuthorization: false,
    //   isNavigate: true,
    // },
  ];

  return (
    <Suspense fallback={<div style={{ padding: 24 }}>로딩중…</div>}>
      <DomRoutes>
        {routes
          .filter((route) => !route.withAuthorization)
          .map(({ path, filePath, isNavigate }) => {
            const modulePath = `../../../pages${filePath}.tsx`;
            const moduleLoader = pageModules[modulePath];
            
            if (!moduleLoader) {
              console.warn(`Module not found: ${modulePath}`);
              return null;
            }

            const Component = lazy(() => moduleLoader());

            return (
              <Route
                key={path}
                path={path}
                element={
                 
                    <Component />
                  
                }
              />
            );
          })}
      </DomRoutes>
    </Suspense>
  );
}