import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "@/lib/api";
import type { BaseResponse } from "@/types/baseRespones";
import type {
  CreateAssetLocationMappingPayload,
  BulkCreateResult,
} from "./types/assetLocationMapping";

const QUERY_KEY = "assetLocationMapping";

/**
 * 저장된 법정동코드 목록 조회 (하위 호환)
 */
export function useAssetLocationLegalDongCodes(enabled = true) {
  return useQuery<string[]>({
    queryKey: [QUERY_KEY, "legalDongCodes"],
    queryFn: async () => {
      const response: BaseResponse<string[]> = await request({
        method: "GET",
        url: "/asset-location-mapping/legal-dong-codes",
      });
      return response.data || [];
    },
    enabled,
    staleTime: 1000 * 60 * 5, // 5분 캐시
  });
}

/**
 * 도·시별 PNU 목록 조회 (지적도 하이라이트용, 쿼리 최소화)
 */
export function useAssetLocationPnuByDistrict(
  sido: string | undefined,
  si: string | undefined,
  enabled = true
) {
  return useQuery<string[]>({
    queryKey: [QUERY_KEY, "pnuByDistrict", sido ?? "", si ?? ""],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (sido?.trim()) params.set("sido", sido.trim());
      if (si?.trim()) params.set("si", si.trim());
      const response: BaseResponse<string[]> = await request({
        method: "GET",
        url: `/asset-location-mapping/pnu-by-district?${params.toString()}`,
      });
      return response.data || [];
    },
    enabled: enabled && (!!sido?.trim() || !!si?.trim()),
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * 벌크 저장 mutation
 */
export function useCreateAssetLocationMappings() {
  const queryClient = useQueryClient();

  return useMutation<BulkCreateResult, Error, CreateAssetLocationMappingPayload[]>({
    mutationFn: async (mappings) => {
      const response: BaseResponse<BulkCreateResult> = await request({
        method: "POST",
        url: "/asset-location-mapping/bulk",
        data: { mappings },
      });
      return response.data!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}

/**
 * 전체 삭제 mutation
 */
export function useDeleteAllAssetLocationMappings() {
  const queryClient = useQueryClient();

  return useMutation<void, Error>({
    mutationFn: async () => {
      await request({
        method: "DELETE",
        url: "/asset-location-mapping/all",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
    },
  });
}
