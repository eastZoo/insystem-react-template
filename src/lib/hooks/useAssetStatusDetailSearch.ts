import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { request, api } from "@/lib/api";
import type { BaseResponse } from "@/types/baseRespones";
import type { AssetStatusDetail } from "./types/assetStatusDetail";

export interface SearchAssetStatusDetailParams {
  propertyUseType?: string; // 'all' | 'admin' | 'normal'
  startAccountingStandard?: string;
  endAccountingStandard?: string;
  detailBusinessName?: string;
  managementDept?: string;
  acquisitionDept?: string;
}

/**
 * 자산현황 검색 훅
 */
export function useAssetStatusDetailSearch(
  params: SearchAssetStatusDetailParams,
  enabled = true
) {
  return useQuery<AssetStatusDetail[]>({
    queryKey: ["assetStatusDetailSearch", params],
    queryFn: async () => {
      const response: BaseResponse<AssetStatusDetail[]> = await request({
        method: "GET",
        url: `/api/app/govmap/assets`,
        params,
      });
      return response.data || [];
    },
    enabled,
    initialData: [],
  });
}

/**
 * 전체 자산현황 목록 조회 훅
 */
export function useAssetStatusDetailList(enabled = true) {
  return useQuery<AssetStatusDetail[]>({
    queryKey: ["assetStatusDetailList"],
    queryFn: async () => {
      const response: BaseResponse<AssetStatusDetail[]> = await request({
        method: "GET",
        url: `/api/app/govmap/assets/all`,
      });
      return response.data || [];
    },
    enabled,
    initialData: [],
  });
}

export interface UploadExcelResult {
  successCount: number;
  failedCount: number;
  errors: string[];
}

/**
 * 엑셀 업로드 훅
 */
export function useAssetExcelUpload() {
  const queryClient = useQueryClient();

  return useMutation<UploadExcelResult, Error, File>({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post<BaseResponse<UploadExcelResult>>(
        "/api/app/govmap/assets/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.data!;
    },
    onSuccess: () => {
      // 업로드 성공 시 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["assetStatusDetailSearch"] });
      queryClient.invalidateQueries({ queryKey: ["assetStatusDetailList"] });
    },
  });
}

/**
 * 자산현황 수정 훅
 */
export function useAssetStatusDetailUpdate() {
  const queryClient = useQueryClient();

  return useMutation<AssetStatusDetail, Error, Partial<AssetStatusDetail> & { linkSerialNo: string }>({
    mutationFn: async (data) => {
      const { linkSerialNo, ...updateData } = data;
      const response = await api.patch<BaseResponse<AssetStatusDetail>>(
        `/api/app/govmap/assets/${linkSerialNo}`,
        updateData
      );
      if (!response.data.success) {
        throw new Error(response.data.message || "수정 실패");
      }
      return response.data.data!;
    },
    onSuccess: () => {
      // 수정 성공 시 목록 갱신
      queryClient.invalidateQueries({ queryKey: ["assetStatusDetailSearch"] });
      queryClient.invalidateQueries({ queryKey: ["assetStatusDetailList"] });
    },
  });
}
