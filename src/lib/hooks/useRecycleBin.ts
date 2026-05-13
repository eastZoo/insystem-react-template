/**
 * useRecycleBin.ts - 휴지통 관련 React Query 훅
 *
 * 휴지통 목록 조회, 복원, 영구 삭제 API 훅
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useToast } from "@/components/containers/Toast";
import type { ApiSuccessResponse } from "@/types/api";
import { COLLECTION_QUERY_KEYS } from "./useCollection";

// Query Keys
export const RECYCLE_BIN_QUERY_KEYS = {
  trash: ["collection", "trash"] as const,
};

/** 휴지통 항목 타입 */
export interface TrashListItem {
  id: string;
  name: string;
  type: "file" | "folder";
  modifiedDate: string;
  deletedDate: string;
  visibility: "private" | "team" | "public" | "pending";
  vectorStatus: "complete" | "pending" | "error";
  size: string;
  fld_cd: string;
  file_id?: string;
  file_seq?: number;
  collection_nm?: string;
  embd_model?: string;
}

/**
 * 휴지통 목록 조회 훅
 */
export function useTrashList() {
  return useQuery({
    queryKey: RECYCLE_BIN_QUERY_KEYS.trash,
    queryFn: async () => {
      const { data } = await api.get<ApiSuccessResponse<TrashListItem[]>>(
        "/api/app/collection/trash"
      );
      return data.data || [];
    },
  });
}

/**
 * 항목 복원 훅
 */
export function useRestoreItem() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      itemType,
      collectionNm,
      embdModel,
      fileId,
      fileSeq,
    }: {
      itemId: string;
      itemType: "file" | "folder";
      collectionNm?: string;
      embdModel?: string;
      fileId?: string;
      fileSeq?: number;
    }) => {
      const { data } = await api.post<ApiSuccessResponse<null>>(
        "/api/app/collection/restore",
        {
          itemId,
          itemType,
          collectionNm,
          embdModel,
          fileId,
          fileSeq,
        }
      );
      return data;
    },
    onSuccess: () => {
      showToast({ message: "항목이 복원되었습니다.", type: "success" });
      // 휴지통 목록, 파일 목록, 통계, 폴더 트리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: RECYCLE_BIN_QUERY_KEYS.trash });
      queryClient.invalidateQueries({ queryKey: ["collection", "files"] });
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.stats });
      queryClient.invalidateQueries({
        queryKey: COLLECTION_QUERY_KEYS.folderTree,
      });
    },
    onError: () => {
      showToast({ message: "항목 복원에 실패했습니다.", type: "error" });
    },
  });
}

/**
 * 항목 영구 삭제 훅
 */
export function usePermanentDelete() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      itemType,
      collectionNm,
      embdModel,
      fileId,
      fileSeq,
    }: {
      itemId: string;
      itemType: "file" | "folder";
      collectionNm?: string;
      embdModel?: string;
      fileId?: string;
      fileSeq?: number;
    }) => {
      const { data } = await api.delete<ApiSuccessResponse<null>>(
        "/api/app/collection/permanent",
        {
          data: {
            itemId,
            itemType,
            collectionNm,
            embdModel,
            fileId,
            fileSeq,
          },
        }
      );
      return data;
    },
    onSuccess: () => {
      showToast({ message: "항목이 영구 삭제되었습니다.", type: "success" });
      // 휴지통 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: RECYCLE_BIN_QUERY_KEYS.trash });
    },
    onError: () => {
      showToast({ message: "항목 영구 삭제에 실패했습니다.", type: "error" });
    },
  });
}

/**
 * 휴지통 비우기 훅
 */
export function useEmptyTrash() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<
        ApiSuccessResponse<{ deletedCount: number }>
      >("/api/app/collection/trash/empty");
      return data;
    },
    onSuccess: (data) => {
      const count = data.data?.deletedCount || 0;
      showToast({
        message: `휴지통이 비워졌습니다. (${count}개 항목 삭제)`,
        type: "success",
      });
      // 휴지통 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: RECYCLE_BIN_QUERY_KEYS.trash });
    },
    onError: () => {
      showToast({ message: "휴지통 비우기에 실패했습니다.", type: "error" });
    },
  });
}
