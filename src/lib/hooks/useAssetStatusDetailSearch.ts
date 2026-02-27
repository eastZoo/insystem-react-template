import { useQuery } from "@tanstack/react-query";
import { request } from "@/lib/api";
import type { BaseResponse } from "@/types/baseRespones";
import type { AssetStatusDetail } from "./types/assetStatusDetail";

export interface SearchAssetStatusDetailParams {
  propertyUseType?: string; // 'all' | 'admin' | 'nomal'
  startAccountingStandard?: string;
  endAccountingStandard?: string;
  detailBusinessName?: string;
  managementDept?: string;
  acquisitionDept?: string;
}

export function useAssetStatusDetailSearch(
  params: SearchAssetStatusDetailParams,
  enabled = true
) {
  return useQuery<AssetStatusDetail[]>({
    queryKey: ["assetStatusDetailSearch", params],
    queryFn: async () => {
      const response: BaseResponse<AssetStatusDetail[]> = await request({
        method: "GET",
        url: `/asset-status-detail/search`,
        params,
      });
      return response.data || [];
    },
    enabled,
    initialData: [],
  });
}
