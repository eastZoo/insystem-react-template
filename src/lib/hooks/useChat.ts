/**
 * useChat.ts - 채팅 관련 React Query 훅
 *
 * 채팅방 관리, 메시지 송수신 API 훅
 */

import {
  useMutation,
  useQuery,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useToast } from "@/components/containers/Toast";
import type { ApiSuccessResponse } from "@/types/api";

// Query Keys
export const CHAT_QUERY_KEYS = {
  rooms: ["chat", "rooms"] as const,
  room: (chatId: string) => ["chat", "room", chatId] as const,
  messages: (chatId: string) => ["chat", "messages", chatId] as const,
};

/** 채팅방 아이템 타입 */
export interface ChatRoomItem {
  chatId: string;
  title: string;
  lastMessage: string | null;
  lastMessageDate: string | null;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

/** 참조 파일 아이템 타입 */
export interface ReferencedFileItem {
  fileName: string;
  fileId: string;
  fileSeq: number;
}

/** 채팅 메시지 아이템 타입 */
export interface ChatMessageItem {
  chatNo: string;
  message: string;
  senderType: "user" | "ai";
  createdAt: string;
  referencedFiles?: ReferencedFileItem[];
}

/** 채팅방 목록 응답 */
interface ChatRoomListResponse {
  rooms: ChatRoomItem[];
  total: number;
  hasMore: boolean;
}

/** 메시지 목록 응답 */
interface ChatMessageListResponse {
  messages: ChatMessageItem[];
  hasMore: boolean;
  oldestCursor: string | null;
  newestCursor: string | null;
}

/** 메시지 전송 응답 */
interface SendMessageResponse {
  userMessage: ChatMessageItem;
  aiMessage: ChatMessageItem;
}

/** 새 채팅방+메시지 응답 */
interface CreateChatWithMessageResponse {
  chatId: string;
  title: string;
  userMessage: ChatMessageItem;
  aiMessage: ChatMessageItem;
}

/**
 * 채팅방 목록 조회 훅
 */
export function useChatRooms(page: number = 1, limit: number = 50) {
  return useQuery({
    queryKey: [...CHAT_QUERY_KEYS.rooms, page, limit],
    queryFn: async () => {
      const { data } = await api.get<ApiSuccessResponse<ChatRoomListResponse>>(
        "/api/app/chat/rooms",
        { params: { page, limit } }
      );
      return data.data || { rooms: [], total: 0, hasMore: false };
    },
  });
}

/**
 * 채팅방 정보 조회 훅
 */
export function useChatRoom(chatId: string | null) {
  return useQuery({
    queryKey: CHAT_QUERY_KEYS.room(chatId || ""),
    queryFn: async () => {
      if (!chatId) return null;
      const { data } = await api.get<
        ApiSuccessResponse<{ chatId: string; title: string; createdAt: string }>
      >(`/api/app/chat/rooms/${chatId}`);
      return data.data;
    },
    enabled: !!chatId,
  });
}

/**
 * 채팅 메시지 목록 조회 훅 (역방향 무한 스크롤)
 */
export function useChatMessages(chatId: string | null, limit: number = 30) {
  return useInfiniteQuery({
    queryKey: [...CHAT_QUERY_KEYS.messages(chatId || ""), limit],
    queryFn: async ({ pageParam }) => {
      if (!chatId) {
        return {
          messages: [],
          hasMore: false,
          oldestCursor: null,
          newestCursor: null,
        };
      }

      const params: Record<string, string | number> = { limit };
      if (pageParam) {
        params.cursor = pageParam;
        params.direction = "older";
      }

      const { data } = await api.get<ApiSuccessResponse<ChatMessageListResponse>>(
        `/api/app/chat/rooms/${chatId}/messages`,
        { params }
      );
      return data.data || {
        messages: [],
        hasMore: false,
        oldestCursor: null,
        newestCursor: null,
      };
    },
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.oldestCursor : undefined,
    initialPageParam: undefined as string | undefined,
    enabled: !!chatId,
  });
}

/**
 * 채팅방 생성 훅
 */
export function useCreateChatRoom() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title?: string) => {
      const { data } = await api.post<
        ApiSuccessResponse<{ chatId: string; title: string }>
      >("/api/app/chat/rooms", { title });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.rooms });
    },
    onError: () => {
      showToast({ message: "채팅방 생성에 실패했습니다.", type: "error" });
    },
  });
}

/**
 * 채팅방 제목 수정 훅
 */
export function useUpdateChatTitle() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatId,
      title,
    }: {
      chatId: string;
      title: string;
    }) => {
      const { data } = await api.patch<ApiSuccessResponse<null>>(
        `/api/app/chat/rooms/${chatId}/title`,
        { title }
      );
      return data;
    },
    onSuccess: (_, { chatId }) => {
      showToast({ message: "제목이 수정되었습니다.", type: "success" });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.rooms });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.room(chatId) });
    },
    onError: () => {
      showToast({ message: "제목 수정에 실패했습니다.", type: "error" });
    },
  });
}

/**
 * 채팅방 삭제 훅
 */
export function useDeleteChatRoom() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (chatId: string) => {
      const { data } = await api.delete<ApiSuccessResponse<null>>(
        `/api/app/chat/rooms/${chatId}`
      );
      return data;
    },
    onSuccess: () => {
      showToast({ message: "대화가 삭제되었습니다.", type: "success" });
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.rooms });
    },
    onError: () => {
      showToast({ message: "대화 삭제에 실패했습니다.", type: "error" });
    },
  });
}

/**
 * 메시지 전송 훅 (기존 채팅방)
 */
export function useSendMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      chatId,
      message,
      collectionName,
      searchK,
    }: {
      chatId: string;
      message: string;
      collectionName?: string;
      searchK?: number;
    }) => {
      const { data } = await api.post<ApiSuccessResponse<SendMessageResponse>>(
        `/api/app/chat/rooms/${chatId}/messages`,
        {
          message,
          collection_name: collectionName || "test",
          search_k: searchK || 20,
        }
      );
      return data.data;
    },
    onSuccess: (_, { chatId }) => {
      // 메시지 목록 갱신
      queryClient.invalidateQueries({
        queryKey: CHAT_QUERY_KEYS.messages(chatId),
      });
      // 채팅방 목록 갱신 (lastMessage 등 업데이트)
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.rooms });
    },
  });
}

/**
 * 새 채팅방 생성 + 첫 메시지 전송 훅
 */
export function useCreateChatWithMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      message,
      collectionName,
      searchK,
    }: {
      message: string;
      collectionName?: string;
      searchK?: number;
    }) => {
      const { data } = await api.post<
        ApiSuccessResponse<CreateChatWithMessageResponse>
      >("/api/app/chat/send", {
        message,
        collection_name: collectionName || "test",
        search_k: searchK || 20,
      });
      return data.data;
    },
    onSuccess: () => {
      // 채팅방 목록 갱신
      queryClient.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.rooms });
    },
  });
}

/**
 * 채팅 히스토리 그룹화 헬퍼 함수
 */
export function groupChatRoomsByDate(rooms: ChatRoomItem[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

  const groups: Record<
    "today" | "yesterday" | "thisWeek" | "older",
    ChatRoomItem[]
  > = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  for (const room of rooms) {
    const roomDate = new Date(room.updatedAt);
    const roomDay = new Date(
      roomDate.getFullYear(),
      roomDate.getMonth(),
      roomDate.getDate()
    );

    if (roomDay.getTime() >= today.getTime()) {
      groups.today.push(room);
    } else if (roomDay.getTime() >= yesterday.getTime()) {
      groups.yesterday.push(room);
    } else if (roomDay.getTime() >= weekAgo.getTime()) {
      groups.thisWeek.push(room);
    } else {
      groups.older.push(room);
    }
  }

  return groups;
}

/**
 * 상대적 시간 포맷 헬퍼 함수
 */
export function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "";

  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "방금 전";
  if (diffMins < 60) return `${diffMins}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;

  // 7일 이상이면 날짜 표시
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}
