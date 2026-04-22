/**
 * authFunctions.ts — 토큰 관리 유틸
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * [토큰 전략: Access Token In-Memory + Refresh Token HttpOnly Cookie]
 *
 *   Access Token
 *     - 저장: 이 파일의 모듈 변수(_accessToken)에 보관 (메모리)
 *     - 만료: 15분 (서버 설정)
 *     - 이점: localStorage/sessionStorage에 저장하지 않아 XSS 탈취 불가
 *     - 단점: 페이지 새로고침 시 사라짐 → AppProviders가 GET /api/auth/session으로 복원
 *
 *   Refresh Token
 *     - 저장: 서버가 HttpOnly Cookie로 설정 (JS에서 접근 불가)
 *     - 만료: 7일 (서버 설정 REFRESH_TOKEN_EXPIRES_DAYS)
 *     - 이점: JS에서 읽거나 조작할 수 없으므로 XSS 공격 대상이 아님
 *     - 전송: path=/api/auth 로 설정되어 있어 인증 엔드포인트에만 자동 전송
 *     - 주의: axios 인스턴스에 withCredentials: true 가 필요
 *
 *   로그아웃
 *     - 메모리 변수 초기화
 *     - 서버에 POST /api/auth/logout → 서버가 Cookie를 삭제하고 DB에서 revoke
 *
 *   [연속 새로고침 대응]
 *     백엔드에서 Grace Period를 구현하여 연속 새로고침 시에도
 *     revoke된 토큰을 짧은 시간 내에 재사용할 수 있습니다.
 *     따라서 프론트엔드에서 별도의 요청 잠금이 필요하지 않습니다.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { JOTAI_PERSIST_KEY } from "../constants/sharedStrings";

/**
 * Access Token 인메모리 저장소.
 * 모듈 스코프 변수로 관리합니다.
 *
 * [왜 모듈 변수인가?]
 *   React Context나 Jotai atom을 쓸 경우 Provider 바깥의 코드(axios interceptor 등)에서
 *   접근하기 어렵습니다. 모듈 변수는 어디서나 단순 함수 호출로 접근 가능합니다.
 *   단, 탭 간 공유는 되지 않습니다 (탭마다 독립적인 메모리).
 */
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

// ─────────────────────────────────────────────────────────────────────────────
// Refresh Token
// Refresh Token은 서버가 HttpOnly Cookie로 설정합니다.
// 프론트엔드에서는 저장/읽기가 필요 없으며, 브라우저가 자동으로 전송합니다.
// (axios withCredentials: true 설정 필요)
// ─────────────────────────────────────────────────────────────────────────────

/** 세션 스토리지 정리 (탭 상태 등) */
export function clearTabSessionStorage() {
  try {
    sessionStorage.removeItem("openTabs");
    sessionStorage.removeItem("selectedMenu");
  } catch {
    /* ignore */
  }
}

/**
 * 로컬 상태를 모두 정리하고 로그인 페이지로 이동합니다.
 *
 * Refresh Token Cookie 삭제는 서버가 담당합니다.
 * 이 함수를 호출하기 전에 POST /api/auth/logout 을 호출하세요.
 * (useLogout 훅이 API 호출 후 이 함수를 자동으로 호출합니다)
 */
export const logout = (): void => {
  clearAccessToken();
  clearTabSessionStorage();
  localStorage.removeItem(JOTAI_PERSIST_KEY);
  window.location.replace("/auth/login");
};

export const getUserInfo = () => {
  const localStorageUser: string | null =
    localStorage.getItem(JOTAI_PERSIST_KEY);
  if (localStorageUser) {
    const storageJson = JSON.parse(localStorageUser);
    return storageJson["user"];
  }
  return null;
};
