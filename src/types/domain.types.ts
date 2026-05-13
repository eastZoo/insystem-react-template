// ────────────────────────────────────────────────────────────
// 공통
// ────────────────────────────────────────────────────────────

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ────────────────────────────────────────────────────────────
// Auth
// ────────────────────────────────────────────────────────────

export interface LoginRequest {
  userId: string;
  password: string;
}

/**
 * POST /api/auth/login 응답 data
 *
 * - accessToken: 프론트엔드 메모리에 보관 (15분 유효)
 * - Refresh Token 은 서버가 HttpOnly Cookie 로 자동 설정 (응답 body에 없음)
 * - user: sya_user 기반 사용자 정보 (regId, loginId, name, email)
 */
export interface LoginData {
  accessToken: string;
  user: LoginUser;
}

/**
 * POST /api/auth/login 응답의 user 필드 (sya_user 매핑)
 *
 * 사이드바 메뉴 조회 등에서는 regId 가 핵심 식별자입니다.
 * 메뉴 API(/api/app/menus/me)는 JWT 에서 sub(=regId) 를 추출하므로
 * 별도로 regId 를 요청 파라미터로 보낼 필요는 없습니다.
 */
export interface LoginUser {
  /** sya_user.reg_id (정수 PK) */
  regId: number;
  /** sya_user.id (로그인 ID, 예: 'inadmin') */
  loginId: string;
  /** sya_user.nm (성명) */
  name: string;
  /** sya_user.email — 없을 수 있음 */
  email: string | null;
  /** sya_user.co_cd (법인코드) — 파일 채번 등에 사용 */
  coCd: string | null;
  /** sya_user.bplc_cd (사업장코드) — 파일 채번 등에 사용 */
  bplcCd: string | null;
}

/**
 * GET /api/auth/me 응답 data
 *
 * sya_user 의 추가 컬럼(useYn, coCd, bplcCd, empNo)도 함께 반환합니다.
 */
export interface MeData {
  regId: number;
  loginId: string;
  name: string;
  email: string | null;
  useYn?: string;
  coCd?: string | null;
  bplcCd?: string | null;
  empNo?: string | null;
}

// ────────────────────────────────────────────────────────────
// Permission — GET /api/permission/me
// ────────────────────────────────────────────────────────────

/**
 * GET /api/permission/me 응답 data
 *
 * 사이드바 푸터에 표시할 사용자 기본 정보입니다.
 */
export interface UserInfo {
  /** 사용자명 (sya_user.nm) */
  userName: string;
  /** 권한명 (sya_auth.auth_nm) */
  userRole: string | null;
  /** 부서명 (bs_dept.dept_nm) */
  userTeam: string | null;
}

// ────────────────────────────────────────────────────────────
// Menus — GET /api/permission/menu-list
// ────────────────────────────────────────────────────────────

/**
 * 로그인 사용자에게 부여된 메뉴 1 건.
 * sya_menu × sya_auth × sya_auth_dtl × sya_auth_menu 조인 결과를 정규화한 형태입니다.
 */
export interface UserMenuItem {
  /** 메뉴코드 (PK) */
  menuCd: string;
  /** 메뉴명 */
  menuName: string;
  /** 상위메뉴코드 ('0' 또는 null 이면 최상위) */
  upMenuCd: string | null;
  /** 상위메뉴명 (없으면 빈 문자열) */
  upMenuName: string;
  /** 정렬 순서 */
  sort: number;
  /** 아이콘 식별자 */
  icon: string | null;
  /** 메뉴 URL — 클릭 시 이동 경로 */
  url: string | null;
  /** 사용여부 (Y/N). 서버가 'Y' 만 반환합니다. */
  useYn: string;
  /** 트리 깊이 (1 부터 시작) */
  depth: number;
}
