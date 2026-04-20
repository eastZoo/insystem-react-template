/**
 * useTest.ts — /api/app/test 엔드포인트 호출 훅
 *
 * 보일러플레이트의 백엔드 연동 테스트용 훅입니다.
 * 각 훅은 실제 DB 연결된 API를 호출합니다.
 *
 * [토큰 갱신 테스트]
 *   useTestPing()은 30초마다 자동 호출되어
 *   Access Token 만료 시 401 → 자동 갱신 → 재시도 흐름을 검증합니다.
 */

import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/axios";
import {
  GET_TEST_PING,
  GET_TEST_USERS,
  GET_TEST_MENUS,
  GET_TEST_PERMISSIONS,
  GET_TEST_ORDERS,
  GET_TEST_STOCKS,
} from "@/lib/querykeys";
import { getQueryConfig } from "@/lib/constants/queryConfig";
import type { ApiResponse } from "@/types/api";
import { isApiSuccess } from "@/types/api";

// ── 응답 타입 ──────────────────────────────────────────────

export interface PingData {
  serverTime: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface TestUser {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  role: { id: string; name: string };
  createdAt: string;
  updatedAt: string;
}

export interface TestMenu {
  id: string;
  menuKey: string;
  menuName: string;
  path: string | null;
  navSection: string | null;
  sortRef: number;
  parentMenuKey: string | null;
}

export interface TestPermission {
  id: string;
  roleId: string;
  menuKey: string;
  canRead: boolean;
  canCreate: boolean;
  canUpdate: boolean;
  canDelete: boolean;
}

export interface TestOrder {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  cancelReason: string | null;
  items: TestOrderItem[];
  createdAt: string;
}

export interface TestOrderItem {
  id: string;
  productKey: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface TestStock {
  id: string;
  productKey: string;
  productName: string;
  price: number;
  quantity: number;
}

// ── Hooks ──────────────────────────────────────────────────

/**
 * GET /api/app/test/ping — 30초마다 자동 호출
 *
 * Access Token(15분)이 만료되면 axios 인터셉터가 자동 갱신합니다.
 * 이 훅으로 갱신 동작이 정상적인지 모니터링할 수 있습니다.
 */
export function useTestPing() {
  return useQuery({
    queryKey: [GET_TEST_PING],
    queryFn: async () => {
      const res = await request<ApiResponse<PingData>>({
        method: "GET",
        url: "/api/app/test/ping",
      });
      if (isApiSuccess(res)) return res.data;
      return null;
    },
    refetchInterval: 30_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 60_000,
    retry: 1,
  });
}

/** GET /api/app/test/users */
export function useTestUsers(page = 1, limit = 10) {
  return useQuery({
    queryKey: [GET_TEST_USERS, page, limit],
    queryFn: async () => {
      const res = await request<
        ApiResponse<{ items: TestUser[]; meta: { total: number; page: number; limit: number; totalPages: number } }>
      >({
        method: "GET",
        url: "/api/app/test/users",
        params: { page, limit },
      });
      if (isApiSuccess(res)) return res.data;
      return null;
    },
    ...getQueryConfig("default"),
  });
}

/** GET /api/app/test/menus */
export function useTestMenus() {
  return useQuery({
    queryKey: [GET_TEST_MENUS],
    queryFn: async () => {
      const res = await request<ApiResponse<TestMenu[]>>({
        method: "GET",
        url: "/api/app/test/menus",
      });
      if (isApiSuccess(res)) return res.data;
      return null;
    },
    ...getQueryConfig("default"),
  });
}

/** GET /api/app/test/permissions */
export function useTestPermissions() {
  return useQuery({
    queryKey: [GET_TEST_PERMISSIONS],
    queryFn: async () => {
      const res = await request<ApiResponse<TestPermission[]>>({
        method: "GET",
        url: "/api/app/test/permissions",
      });
      if (isApiSuccess(res)) return res.data;
      return null;
    },
    ...getQueryConfig("default"),
  });
}

/** GET /api/app/test/orders */
export function useTestOrders() {
  return useQuery({
    queryKey: [GET_TEST_ORDERS],
    queryFn: async () => {
      const res = await request<ApiResponse<TestOrder[]>>({
        method: "GET",
        url: "/api/app/test/orders",
      });
      if (isApiSuccess(res)) return res.data;
      return null;
    },
    ...getQueryConfig("default"),
  });
}

/** GET /api/app/test/stocks */
export function useTestStocks() {
  return useQuery({
    queryKey: [GET_TEST_STOCKS],
    queryFn: async () => {
      const res = await request<ApiResponse<TestStock[]>>({
        method: "GET",
        url: "/api/app/test/stocks",
      });
      if (isApiSuccess(res)) return res.data;
      return null;
    },
    ...getQueryConfig("default"),
  });
}
