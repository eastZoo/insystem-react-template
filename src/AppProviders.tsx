/**
 * AppProviders.tsx — 앱 전역 Provider 래퍼
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * [페이지 새로고침 시 Access Token 복원]
 *
 * Access Token은 메모리(모듈 변수)에만 저장하므로 페이지 새로고침 시 사라집니다.
 * 그러나 Refresh Token은 HttpOnly Cookie에 있어 새로고침 후에도 유지됩니다.
 *
 * 따라서 앱 최초 마운트 시 GET /api/auth/session을 호출하여 Access Token을 복원합니다.
 * (항상 200을 반환하므로 비로그인 시에도 네트워크/콘솔에 401이 찍히지 않습니다.)
 *
 * 흐름:
 *   1. 앱 마운트 → isRestoring: true (로딩 상태)
 *   2. GET /api/auth/session (Cookie 자동 전송)
 *      - authenticated + accessToken: 메모리에 저장
 *      - authenticated: false: 비로그인 상태 (에러 아님)
 *   3. isRestoring: false → 라우터 렌더링 시작
 *
 * [StrictMode / 요청이 두 번 보일 때]
 *   개발 모드에서 main.tsx의 <StrictMode>는 effect를 mount → cleanup → 재실행합니다.
 *   아래 effect는 AbortController로 cleanup 시 진행 중인 요청을 취소해
 *   실제로는 한 번만 완료되도록 하며, refresh 이중 호출 경쟁도 방지합니다.
 *
 * 왜 라우터 전에 처리해야 하는가?
 *   ProtectedRoute는 readAccessToken()이 null이면 /auth/login으로 리다이렉트합니다.
 *   복원 전에 라우터가 렌더링되면 로그인 상태임에도 로그인 페이지로 튕깁니다.
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
import { writeAccessToken } from "@/lib/functions/authFunctions";
import type { ApiResponse } from "@/types/api";

/**
 * 앱 마운트 시 Refresh Token Cookie로 Access Token을 복원하는 컴포넌트.
 * 복원이 완료되기 전까지 라우터 렌더링을 대기합니다.
 */
function AuthRestorer({ children }: { children: React.ReactNode }) {
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const ac = new AbortController();

    const restoreToken = async () => {
      try {
        const base = import.meta.env.VITE_API_BASE_URL;
        const { data: body } = await axios.get<
          ApiResponse<{ authenticated: boolean; accessToken?: string }>
        >(`${base}/api/auth/session`, {
          withCredentials: true,
          signal: ac.signal,
        });

        if (
          body.success &&
          body.data?.authenticated &&
          body.data.accessToken
        ) {
          writeAccessToken(body.data.accessToken);
        }
      } catch (err) {
        // StrictMode cleanup 등으로 요청이 취소된 경우 — 무시
        if (axios.isCancel(err)) return;
        // 네트워크 오류 등 — 비로그인과 동일하게 진행
      } finally {
        if (!ac.signal.aborted) {
          setIsRestoring(false);
        }
      }
    };

    void restoreToken();
    return () => ac.abort();
  }, []);

  // 복원 중에도 최소 UI를 두어 #root 가 비지 않게 함 (흰 화면 방지)
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
