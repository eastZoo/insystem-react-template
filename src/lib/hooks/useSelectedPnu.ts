import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/lib/api";
import type { BaseResponse } from "@/types/baseRespones";

const QUERY_KEY = "selectedPnu";

export interface SaveSelectedPnusParams {
  pnus: string[];
  storageKey?: string;
  sido?: string;
  si?: string;
}

export interface SaveSelectedPnusResult {
  created: number;
  skipped: number;
}

/**
 * 선택된 PNU 목록 조회 훅
 */
export function useSelectedPnuList(
  storageKey?: string,
  sido?: string,
  si?: string,
  enabled = true
) {
  return useQuery<string[]>({
    queryKey: [QUERY_KEY, storageKey ?? "", sido ?? "", si ?? ""],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (storageKey?.trim()) params.set("storageKey", storageKey.trim());
      if (sido?.trim()) params.set("sido", sido.trim());
      if (si?.trim()) params.set("si", si.trim());
      const response: BaseResponse<string[]> = await request({
        method: "GET",
        url: `/api/app/govmap/selected-pnus?${params.toString()}`,
      });
      return response.data || [];
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });
}

/**
 * 선택된 PNU 저장 mutation
 */
export function useSaveSelectedPnus() {
  const queryClient = useQueryClient();

  return useMutation<SaveSelectedPnusResult, Error, SaveSelectedPnusParams>({
    mutationFn: async (params) => {
      const response: BaseResponse<SaveSelectedPnusResult> = await request({
        method: "POST",
        url: "/api/app/govmap/selected-pnus",
        data: params,
      });
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/**
 * 선택된 PNU 삭제 mutation
 */
export function useDeleteSelectedPnus() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string | undefined>({
    mutationFn: async (storageKey) => {
      const params = new URLSearchParams();
      if (storageKey?.trim()) params.set("storageKey", storageKey.trim());
      await request({
        method: "DELETE",
        url: `/api/app/govmap/selected-pnus?${params.toString()}`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
