/**
 * useCollection.ts - 파일 컬렉션 관련 React Query 훅
 *
 * PDF 파일 업로드 및 컬렉션 관리 API 훅
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useToast } from "@/components/containers/Toast";
import { createApiMutationFeedbackHandlers } from "@/lib/utils/apiMutationFeedback";
import type { ApiSuccessResponse } from "@/types/api";
import type { AuthLevelType } from "@/components/molecules/UploadModal";

// Query Keys
export const COLLECTION_QUERY_KEYS = {
  files: (fldCd: string) => ["collection", "files", fldCd] as const,
  stats: ["collection", "stats"] as const,
  folderTree: ["collection", "folderTree"] as const,
};

/** 업로드 응답 타입 */
interface UploadFileResult {
  file_id: string;
  file_seq: number;
  file_nm: string;
  collection_nm: string;
}

interface UploadResponse {
  uploadedCount: number;
  files: UploadFileResult[];
  vectorApiResponse: unknown;
}

/** 파일/폴더 목록 아이템 타입 */
export interface FileListItem {
  id: string;
  name: string;
  type: "file" | "folder";
  modifiedDate: string;
  visibility: "private" | "team" | "public" | "pending";
  size: string;
  fld_cd: string;
  file_id?: string;
  file_seq?: number;
}

/** 통계 타입 */
export interface CollectionStats {
  totalFiles: number;
  myFiles: number;
  pendingApproval: number;
}

/** 폴더 트리 아이템 타입 */
export interface FolderTreeItem {
  fld_cd: string;
  fld_nm: string;
  up_fld_cd: string;
}

/**
 * PDF 파일 업로드 훅
 *
 * @example
 * const { mutate: uploadFiles, isLoading } = useUploadFiles();
 *
 * uploadFiles({
 *   files: [file1, file2],
 *   authLevel: 'SY02000004',
 *   fldCd: '0000000001' // 선택적, 폴더코드
 * });
 */
export function useUploadFiles() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      files,
      authLevel,
      fldCd,
    }: {
      files: File[];
      authLevel: AuthLevelType;
      fldCd?: string; // 선택적 폴더코드
    }) => {
      const formData = new FormData();

      // 파일 추가
      files.forEach((file) => {
        formData.append("files", file);
      });

      // 공개설정 코드 추가
      formData.append("auth_level", authLevel);

      // fld_cd가 있을 경우에만 추가
      if (fldCd) {
        formData.append("fld_cd", fldCd);
      }

      const { data } = await api.post<ApiSuccessResponse<UploadResponse>>(
        "/api/app/collection/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return data;
    },
    onSuccess: () => {
      showToast({ message: "파일이 성공적으로 업로드되었습니다.", type: "success" });
      // 파일 목록, 통계, 폴더 트리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["collection", "files"] });
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.stats });
    },
    onError: () => {
      showToast({ message: "파일 업로드에 실패했습니다.", type: "error" });
    },
  });
}

/**
 * 파일/폴더 목록 조회 훅
 */
export function useFileList(fldCd: string = "ROOT") {
  return useQuery({
    queryKey: COLLECTION_QUERY_KEYS.files(fldCd),
    queryFn: async () => {
      const { data } = await api.get<ApiSuccessResponse<FileListItem[]>>(
        `/api/app/collection/files`,
        { params: { fldCd } }
      );
      return data.data || [];
    },
  });
}

/**
 * 통계 조회 훅
 */
export function useCollectionStats() {
  return useQuery({
    queryKey: COLLECTION_QUERY_KEYS.stats,
    queryFn: async () => {
      const { data } = await api.get<ApiSuccessResponse<CollectionStats>>(
        "/api/app/collection/stats"
      );
      return data.data || { totalFiles: 0, myFiles: 0, pendingApproval: 0 };
    },
  });
}

/**
 * 폴더 트리 조회 훅
 */
export function useFolderTree() {
  return useQuery({
    queryKey: COLLECTION_QUERY_KEYS.folderTree,
    queryFn: async () => {
      const { data } = await api.get<ApiSuccessResponse<FolderTreeItem[]>>(
        "/api/app/collection/folder-tree"
      );
      return data.data || [];
    },
  });
}

/**
 * 폴더 생성 훅
 */
export function useCreateFolder() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      folderName,
      parentFolderCode = "ROOT",
      userDivCode = "private",
    }: {
      folderName: string;
      parentFolderCode?: string;
      userDivCode?: "private" | "team" | "public";
    }) => {
      const { data } = await api.post<ApiSuccessResponse<{ fldCd: string; fldNm: string }>>(
        "/api/app/collection/folder",
        { folderName, parentFolderCode, userDivCode }
      );
      return data;
    },
    onSuccess: () => {
      showToast({ message: "폴더가 생성되었습니다.", type: "success" });
      // 파일 목록, 통계, 폴더 트리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["collection", "files"] });
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.folderTree });
    },
    onError: () => {
      showToast({ message: "폴더 생성에 실패했습니다.", type: "error" });
    },
  });
}

/**
 * 항목 이동 훅
 */
export function useMoveItem() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      itemId,
      itemType,
      targetFolderCode,
      collectionNm,
      embdModel,
      fileId,
      fileSeq,
      currentFldCd,
    }: {
      itemId: string;
      itemType: "file" | "folder";
      targetFolderCode: string;
      collectionNm?: string;
      embdModel?: string;
      fileId?: string;
      fileSeq?: number;
      currentFldCd?: string;
    }) => {
      const { data } = await api.post<ApiSuccessResponse<null>>("/api/app/collection/move", {
        itemId,
        itemType,
        targetFolderCode,
        collectionNm,
        embdModel,
        fileId,
        fileSeq,
        currentFldCd,
      });
      return data;
    },
    onSuccess: () => {
      showToast({ message: "항목이 이동되었습니다.", type: "success" });
      // 파일 목록, 폴더 트리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["collection", "files"] });
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.folderTree });
    },
    onError: () => {
      showToast({ message: "항목 이동에 실패했습니다.", type: "error" });
    },
  });
}

/**
 * 항목 삭제 훅
 */
export function useDeleteItem() {
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
      fldCd,
    }: {
      itemId: string;
      itemType: "file" | "folder";
      collectionNm?: string;
      embdModel?: string;
      fileId?: string;
      fileSeq?: number;
      fldCd?: string;
    }) => {
      const { data } = await api.delete<ApiSuccessResponse<null>>("/api/app/collection/item", {
        data: {
          itemId,
          itemType,
          collectionNm,
          embdModel,
          fileId,
          fileSeq,
          fldCd,
        },
      });
      return data;
    },
    onSuccess: () => {
      showToast({ message: "항목이 삭제되었습니다.", type: "success" });
      // 파일 목록, 통계, 폴더 트리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["collection", "files"] });
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.stats });
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.folderTree });
    },
    onError: () => {
      showToast({ message: "항목 삭제에 실패했습니다.", type: "error" });
    },
  });
}

/**
 * 폴더 수정 훅
 */
export function useUpdateFolder() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fldCd,
      folderName,
    }: {
      fldCd: string;
      folderName: string;
    }) => {
      const { data } = await api.patch<ApiSuccessResponse<null>>(
        `/api/app/collection/folder/${fldCd}`,
        { folderName }
      );
      return data;
    },
    onSuccess: () => {
      showToast({ message: "폴더가 수정되었습니다.", type: "success" });
      // 파일 목록, 폴더 트리 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["collection", "files"] });
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.folderTree });
    },
    onError: () => {
      showToast({ message: "폴더 수정에 실패했습니다.", type: "error" });
    },
  });
}

/**
 * 파일 수정 훅
 */
export function useUpdateFile() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileId,
      fileSeq,
      fileName,
      visibility,
      fldCd,
    }: {
      fileId: string;
      fileSeq: number;
      fileName?: string;
      visibility?: "private" | "team" | "public";
      fldCd?: string;
    }) => {
      const { data } = await api.patch<ApiSuccessResponse<null>>(
        `/api/app/collection/file`,
        { fileId, fileSeq, fileName, visibility, fldCd }
      );
      return data;
    },
    onSuccess: () => {
      showToast({ message: "파일이 수정되었습니다.", type: "success" });
      // 파일 목록, 통계 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["collection", "files"] });
      queryClient.invalidateQueries({ queryKey: COLLECTION_QUERY_KEYS.stats });
    },
    onError: () => {
      showToast({ message: "파일 수정에 실패했습니다.", type: "error" });
    },
  });
}
