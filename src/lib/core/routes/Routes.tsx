import { lazy, Suspense } from "react";
import { useRoutes, Navigate } from "react-router-dom";
import ProtectedRoute from "@/lib/core/routes/ProtectedRoute";

// lazy 로딩 페이지들 (필요한 페이지만 추가)
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const HomePage = lazy(() => import("@/pages/HomePage"));
const NotFoundPage = lazy(() => import("@/pages/404/NotFoundPage"));

export default function AppRoutes() {
  const routes = [
    { path: "/auth/login", element: <LoginPage /> },
    {
      path: "/",
      element: (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      ),
    },
    { path: "/404", element: <NotFoundPage /> },
    { path: "*", element: <Navigate to="/404" replace /> },
  ];

  const element = useRoutes(routes);

  return (
    <Suspense fallback={<div style={{ padding: 24 }}>로딩중…</div>}>
      {element}
    </Suspense>
  );
}
