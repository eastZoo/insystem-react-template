/**
 * useComCode.ts - 공통코드 관리 React Query 훅
 *
 * 메인 코드 / 서브 코드 조회, 저장 API 훅
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useToast } from "@/components/containers/Toast";
import type { ApiSuccessResponse } from "@/types/api";

// Query Keys
export const COM_CODE_QUERY_KEYS = {
  codeMain: ["basicinfo", "code-main"] as const,
  codeSub: (mainCd: string) => ["basicinfo", "code-sub", mainCd] as const,
};

/** 메인 코드 항목 타입 */
export interface CodeMainItem {
  main_cd: string;
  main_nm: string;
  sys_yn: string;
  use_yn: string;
  mng_cd1: string | null;
  mng_cd2: string | null;
  sort: number;
  // 클라이언트 전용 플래그
  _isNew?: boolean;
  _isDeleted?: boolean;
  _isModified?: boolean;
}

/** 서브 코드 항목 타입 */
export interface CodeSubItem {
  main_cd: string;
  sub_cd: string;
  sub_nm: string;
  code: string | null;
  sys_yn: string;
  use_yn: string;
  mng_cd1: string | null;
  mng_cd2: string | null;
  sort: number;
  // 클라이언트 전용 플래그
  _isNew?: boolean;
  _isDeleted?: boolean;
  _isModified?: boolean;
}

/**
 * 메인 코드 목록 조회 훅
 */
export function useCodeMainList() {
  return useQuery({
    queryKey: COM_CODE_QUERY_KEYS.codeMain,
    queryFn: async () => {
      const { data } = await api.get<ApiSuccessResponse<CodeMainItem[]>>(
        "/api/app/basicinfo/code-main"
      );
      return data.data || [];
    },
  });
}

/**
 * 서브 코드 목록 조회 훅
 */
export function useCodeSubList(mainCd: string | null) {
  return useQuery({
    queryKey: COM_CODE_QUERY_KEYS.codeSub(mainCd || ""),
    queryFn: async () => {
      if (!mainCd) return [];
      const { data } = await api.get<ApiSuccessResponse<CodeSubItem[]>>(
        `/api/app/basicinfo/code-sub?mainCd=${mainCd}`
      );
      return data.data || [];
    },
    enabled: !!mainCd,
  });
}

/**
 * 메인 코드 일괄 저장 훅
 */
export function useSaveCodeMain() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: CodeMainItem[]) => {
      const { data } = await api.post<
        ApiSuccessResponse<{ savedCount: number; deletedCount: number }>
      >("/api/app/basicinfo/code-main/save", { items });
      return data;
    },
    onSuccess: (data) => {
      const result = data.data;
      showToast({
        message: `저장 완료 (저장: ${result?.savedCount || 0}건, 삭제: ${result?.deletedCount || 0}건)`,
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: COM_CODE_QUERY_KEYS.codeMain,
      });
    },
    onError: () => {
      showToast({ message: "메인 코드 저장에 실패했습니다.", type: "error" });
    },
  });
}

/**
 * 서브 코드 일괄 저장 훅
 */
export function useSaveCodeSub() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      mainCd,
      items,
    }: {
      mainCd: string;
      items: CodeSubItem[];
    }) => {
      const { data } = await api.post<
        ApiSuccessResponse<{ savedCount: number; deletedCount: number }>
      >("/api/app/basicinfo/code-sub/save", { mainCd, items });
      return data;
    },
    onSuccess: (data, variables) => {
      const result = data.data;
      showToast({
        message: `저장 완료 (저장: ${result?.savedCount || 0}건, 삭제: ${result?.deletedCount || 0}건)`,
        type: "success",
      });
      queryClient.invalidateQueries({
        queryKey: COM_CODE_QUERY_KEYS.codeSub(variables.mainCd),
      });
    },
    onError: () => {
      showToast({ message: "서브 코드 저장에 실패했습니다.", type: "error" });
    },
  });
}
