/**
 * authFunctions.ts — 토큰 관리 유틸
 *
 * [토큰 전략: Access Token In-Memory + Refresh Token HttpOnly Cookie]
 *
 *   Access Token: 모듈 변수(_accessToken)에 보관 (XSS 탈취 불가)
 *   Refresh Token: 서버가 HttpOnly Cookie로 설정 (JS 접근 불가)
 *   페이지 새로고침 시: AppProviders의 AuthRestorer가 GET /api/auth/session으로 복원
 */

import { JOTAI_PERSIST_KEY } from "../constants/sharedStrings";

/**
 * VITE_DEV_MOCK_AUTH=true 이면 API 호출 없이 mock 토큰으로 동작합니다.
 * 실제 백엔드 연동 시 .env 에서 false 또는 삭제하세요.
 */
export const isMockAuth = (): boolean =>
  import.meta.env.VITE_DEV_MOCK_AUTH === "true";

/** Mock 모드에서 사용하는 더미 토큰 */
export const MOCK_ACCESS_TOKEN = "mock-access-token-dev";

/** Access Token 인메모리 저장소 (모듈 스코프 변수) */
let _accessToken: string | null = null;

/** Access Token을 메모리에 저장합니다. */
export const writeAccessToken = (token: string): void => {
  _accessToken = token;
};

/** 메모리에서 Access Token을 읽습니다. */
export const readAccessToken = (): string | null => {
  return _accessToken;
};

/** Access Token을 메모리에서 삭제합니다. */
export const clearAccessToken = (): void => {
  _accessToken = null;
};

/**
 * 하위 호환: 기존 LoginPage 등에서 호출하는 코드가 있으므로 유지합니다.
 * Refresh Token은 서버가 HttpOnly Cookie로 관리하므로 실제로는 no-op 입니다.
 */
export const writeRefreshToken = (_refreshToken: string): void => {
  /* HttpOnly Cookie — 프론트에서 저장 불필요 */
};
export const readRefreshToken = (): string | null => {
  return null;
};

/** 세션 스토리지 정리 (탭 상태 등) */
export function clearTabSessionStorage() {
  try {
    sessionStorage.removeItem("openTabs");
    sessionStorage.removeItem("selectedMenu");
  } catch {
    /* ignore */
  }
}

export const getUserInfo = () => {
  const store: string | null = localStorage.getItem(JOTAI_PERSIST_KEY);
  if (store) {
    const json = JSON.parse(store);
    return json["user"];
  }
  return null;
};

/**
 * 로컬 상태를 모두 정리하고 로그인 페이지로 이동합니다.
 * POST /api/auth/logout 호출 후 이 함수를 호출하세요.
 */
export const logout = (): void => {
  clearAccessToken();
  clearTabSessionStorage();
  localStorage.removeItem(JOTAI_PERSIST_KEY);
  window.location.replace("/auth/login");
};

export const validateToken = async () => {};
