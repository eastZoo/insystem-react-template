// React Query 전역 설정
//
// 사용법:
// 1. 기본 사용: useQuery({ ...getQueryConfig('default'), ... })
// 2. 대시보드 데이터: useQuery({ ...getQueryConfig('dashboard'), ... })
// 3. 실시간 데이터: useQuery({ ...getQueryConfig('realtime'), ... })
// 4. 설정 데이터: useQuery({ ...getQueryConfig('settings'), ... })
// 5. 사용자 데이터: useQuery({ ...getQueryConfig('user'), ... })
//
// 설정 설명:
// - staleTime: 데이터가 "신선"하다고 간주되는 시간 (이 시간 내에는 재요청하지 않음)
// - gcTime: 캐시된 데이터를 메모리에 보관하는 시간 (페이지 이동 후에도 데이터 유지)
// - retry: 네트워크 오류 시 재시도 횟수
// - retryDelay: 재시도 간격 (지수 백오프 방식)

import { REFRESH_INTERVAL } from "./refreshInterval";

export const QUERY_CONFIG = {
  // 기본 쿼리 설정 (5분 fresh, 10분 캐시)
  default: {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    // 캐시된 데이터를 5분간 fresh로 간주
    staleTime: 5 * 60 * 1000,
    // 캐시된 데이터를 10분간 메모리에 보관
    gcTime: 10 * 60 * 1000,
    // 네트워크 오류 시 3번 재시도
    retry: 3,
    // 재시도 지연시간 (1초, 2초, 4초)
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  },

  // 실시간 데이터 (자주 변경되는 데이터) - 30초 fresh, 2분 캐시
  realtime: {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 30 * 1000, // 30초
    gcTime: 2 * 60 * 1000, // 2분
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  },

  // 대시보드 데이터 (중간 빈도로 변경되는 데이터) - 2분 fresh, 5분 캐시
  dashboard: {
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchInterval: REFRESH_INTERVAL,
    refetchIntervalInBackground: true,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
    retry: 3,
    // 재시도 지연시간 (1초, 2초, 4초)
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
    keepPreviousData: true, // ✅ 이게 핵심 데이터 페칭되기전까지 이전데이터 유지
  },

  // 설정 데이터 (자주 변경되지 않는 데이터) - 10분 fresh, 30분 캐시
  settings: {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  },

  // 사용자 데이터 (로그인 후 변경되지 않는 데이터) - 30분 fresh, 1시간 캐시
  user: {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 30 * 60 * 1000, // 30분
    gcTime: 60 * 60 * 1000, // 1시간
    retry: 3,
    retryDelay: (attemptIndex: number) =>
      Math.min(1000 * 2 ** attemptIndex, 30000),
  },
} as const;

// 쿼리 타입별 설정을 쉽게 가져올 수 있는 헬퍼 함수
export const getQueryConfig = (type: keyof typeof QUERY_CONFIG = "default") => {
  return QUERY_CONFIG[type];
};
