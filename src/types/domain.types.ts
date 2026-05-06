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
 * - Refresh Token은 서버가 HttpOnly Cookie로 자동 설정 (응답 body에 없음)
 * - user.role: 서버의 RoleType ('ADMIN' | 'MANAGER' | 'DEVELOPER')
 */
export interface LoginData {
  accessToken: string;
  user: LoginUser;
}

/** POST /api/auth/login 응답의 user 필드 */
export interface LoginUser {
  id: string;       // UUID
  email: string;
  name: string;
  role: string;     // 'ADMIN' | 'MANAGER' | 'DEVELOPER'
}

/**
 * GET /api/auth/me 응답 data (실제 백엔드)
 *
 * role은 서버의 RoleType 문자열 ('ADMIN' | 'MANAGER' | 'DEVELOPER').
 */
export interface MeData {
  id: string;
  email: string;
  name: string;
  role: string;
  roleDescription?: string;
  isActive?: boolean;
}
