/**
 * AppProviders.tsx — 앱 전역 Provider 래퍼
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * [페이지 새로고침 시 Access Token 복원]
 *
 * Access Token은 메모리(모듈 변수)에만 저장하므로 페이지 새로고침 시 사라집니다.
 * Refresh Token은 HttpOnly Cookie에 있어 새로고침 후에도 유지됩니다.
 *
 * 앱 최초 마운트 시 GET /api/auth/session을 호출하여 Access Token을 복원합니다.
 * (항상 200을 반환하므로 비로그인 시에도 콘솔에 401이 찍히지 않습니다.)
 *
 * 흐름:
 *   1. 앱 마운트 → isRestoring: true (로딩 상태)
 *   2. GET /api/auth/session (Cookie 자동 전송)
 *   3. isRestoring: false → 라우터 렌더링 시작
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import axios from "axios";

import { theme } from "@/styles/theme";
import { GlobalStyle } from "@/styles/GlobalStyle";
import { queryClient } from "@/lib/queryClient";
import AppRoutes from "@/lib/core/routes/Routes";
import { ToastProvider } from "@/components/containers/Toast";
import { writeAccessToken, isMockAuth } from "@/lib/functions/authFunctions";
import type { ApiResponse } from "@/types/api";

import "maplibre-gl/dist/maplibre-gl.css";

/**
 * 앱 마운트 시 Refresh Token Cookie로 Access Token을 복원하는 컴포넌트.
 * 복원이 완료되기 전까지 라우터 렌더링을 대기합니다.
 */
function AuthRestorer({ children }: { children: React.ReactNode }) {
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const ac = new AbortController();

    const restoreToken = async () => {
      // Mock 모드: API 호출 스킵 (토큰은 LoginPage에서 발급)
      if (isMockAuth()) {
        setIsRestoring(false);
        return;
      }

      try {
        const base = import.meta.env.VITE_API_BASE_URL;
        const { data: body } = await axios.get<
          ApiResponse<{ authenticated: boolean; accessToken?: string }>
        >(`${base}/api/auth/session`, {
          withCredentials: true,
          signal: ac.signal,
        });

        if (body.success && body.data?.authenticated && body.data.accessToken) {
          writeAccessToken(body.data.accessToken);
        }
      } catch (err) {
        if (axios.isCancel(err)) return;
      } finally {
        if (!ac.signal.aborted) {
          setIsRestoring(false);
        }
      }
    };

    void restoreToken();
    return () => ac.abort();
  }, []);

  if (isRestoring) {
    return (
      <div style={{ padding: 24, fontFamily: "system-ui, sans-serif" }}>
        세션 확인 중…
      </div>
    );
  }

  return <>{children}</>;
}

export default function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <GlobalStyle />
          <ToastProvider>
            <AuthRestorer>
              <AppRoutes />
            </AuthRestorer>
          </ToastProvider>
          <ReactQueryDevtools initialIsOpen={false} />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
