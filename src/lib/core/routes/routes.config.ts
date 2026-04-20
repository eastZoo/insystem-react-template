/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║              라우터 단일 원천 (Single Source of Truth)          ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  새 페이지 추가                                                 ║
 * ║  1) 아래 ROUTE_CONFIGS 에 항목 추가                             ║
 * ║  2) npm run sync:pages  →  누락된 엔트리 파일 자동 생성            ║
 * ║  3) 생성/직접 만든 파일에 화면 구현                                ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

export interface RouteConfig {
  path: string;
  name?: string;
  page?: string;
  title: string;
  /** true: ProtectedRoute (기본 true) */
  protected?: boolean;
}

export const ROUTE_CONFIGS: RouteConfig[] = [
  // ── 공개 라우트 (비보호) ────────────────────────────────────
  {
    path: "/auth/login",
    page: "auth/LoginPage",
    title: "로그인",
    protected: false,
  },
  {
    path: "/404",
    page: "404/NotFoundPage",
    title: "페이지 없음",
    protected: false,
  },

  // ── 인증 필요 라우트 ────────────────────────────────────────
  // 아래 경로 외 모든 URL은 ProtectedRoute → MainTemplate + TabContents 가 처리합니다.
  // TabContents 내부에서 탭 경로에 따라 실제 페이지를 렌더링합니다.
];
