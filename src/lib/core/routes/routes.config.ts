/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║              라우터 단일 원천 (Single Source of Truth)          ║
 * ╠══════════════════════════════════════════════════════════════╣
 * ║  새 페이지 추가                                                 ║
 * ║  1) 아래 ROUTE_CONFIGS 에 항목 추가                             ║
 * ║  2) npm run routes  →  누락된 엔트리 파일 생성                    ║
 * ║  3) 생성/직접 만든 파일에 화면 구현                                ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * ── 페이지 파일 매핑 (2·3·…n depth) ─────────────────────────────
 *
 * ① 레거시·평면 1단 — `name` 만 사용
 *    name: "Users"
 *    → src/pages/Users/index.tsx
 *
 * ② 중첩 폴더 + index 엔트리 — `page` 사용 (깊이 무제한)
 *    page: "auth/Account/FindAccount"
 *    → src/pages/auth/Account/FindAccount/index.tsx
 *
 * ③ 중첩 + *Page.tsx 엔트리 (첨부 구조처럼 폴더 안에 XxxPage.tsx)
 *    page: "auth/Account/ResetPassword/ResetPasswordPage"
 *    → src/pages/auth/Account/ResetPassword/ResetPasswordPage.tsx
 *
 * 규칙:
 * - `page` 가 있으면 `name` 은 무시됩니다 (라우터 해석 기준은 page).
 * - `page` / `name` 중 하나는 반드시 있어야 합니다.
 * - 경로는 POSIX 슬래시, 선행 `/`·`.tsx` 를 붙이지 않습니다.
 * - 마지막 세그먼트가 `Page` 로 끝나면 → 파일 1개. 아니면 → 마지막 세그먼트를 폴더명으로 보고 index.tsx.
 *
 * 예시 (주석 해제 시 실제 파일이 있어야 빌드됩니다):
 *
 *   {
 *     path: "/auth/account/find",
 *     page: "auth/Account/FindAccount/FindAccountPage",
 *     title: "계정 찾기",
 *     protected: false,
 *   },
 */

export interface RouteConfig {
  /** URL 경로 (react-router-dom, 동적 세그먼트 가능 e.g. "/users/:id") */
  path: string;
  /**
   * 단일 세그먼트(레거시). `page` 가 없을 때만 사용.
   * → src/pages/{name}/index.tsx
   */
  name?: string;
  /**
   * src/pages/ 기준 모듈 경로(확장자 제외). `page` 가 있으면 이 값이 우선합니다.
   * - …/FooPage → …/FooPage.tsx
   * - …/Foo (Foo 가 Page 로 안 끝남) → …/Foo/index.tsx
   */
  page?: string;
  /** 문서 제목 등 */
  title: string;
  /** true: ProtectedRoute (기본 true) */
  protected?: boolean;
}

export const ROUTE_CONFIGS: RouteConfig[] = [
  // ── 인증 (비보호) ───────────────────────────────────────────
  {
    path: "/auth/login",
    name: "Login",
    title: "로그인",
    protected: false,
  },

  // ── 앱 (인증 필요) ──────────────────────────────────────────
  {
    path: "/",
    name: "Home",
    title: "홈",
    protected: true,
  },

  // { path: "/users", name: "Users", title: "사용자 목록", protected: true },
  {
    path: "/file-management",
    name: "FileManagement",
    title: "파일 관리",
    protected: true,
  },
  {
    path: "/recycle-bin",
    name: "RecycleBin",
    title: "휴지통",
    protected: true,
  },
  {
    path: "/user-setup",
    name: "UserSetup",
    title: "환경설정",
    protected: true,
  },
  {
    path: "/file-management/folder/:folderId",
    page: "FileManagement/FolderDetail",
    title: "폴더 상세",
    protected: true,
  },

  {
    path: "/cmn/user-mng",
    page: "Common/UserManagement",
    title: "사용자 관리",
    protected: true,
  },
  {
    path: "/cmn/com-code",
    page: "Common/ComCodeManagement",
    title: "공통 코드 관리",
    protected: true,
  },
  {
    path: "/cmn/menu-mng",
    page: "Common/MenuManagement",
    title: "메뉴 관리",
    protected: true,
  },
  {
    path: "/cmn/grp-auth-mng",
    page: "Common/GroupAuthManagement",
    title: "그룹 권한 관리",
    protected: true,
  },
  {
    path: "/cmn/user-auth-mng",
    page: "Common/UserAuthManagement",
    title: "사용자 권한 관리",
    protected: true,
  },

  {
    path: "/chat",
    name: "Chat",
    title: "채팅",
    protected: true,
  },
  // {
  //   path: "/sample",
  //   name: "SamplePage1",
  //   title: "1.샘플 메뉴",
  //   protected: true,
  // },
  // {
  //   path: "/sample/1-1",
  //   page: "SamplePage1/SamplePage1Sub1",
  //   title: "1-1.샘플페이지",
  //   protected: true,
  // },
  // {
  //   path: "/sample/1-2",
  //   page: "SamplePage1/SamplePage1Sub2",
  //   title: "1-2.샘플페이지",
  //   protected: true,
  // },

  // ── 시스템 ──────────────────────────────────────────────────
  {
    path: "/404",
    name: "NotFound",
    title: "페이지 없음",
    protected: false,
  },
];
