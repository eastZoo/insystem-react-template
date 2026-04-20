import { isAxiosError } from "axios";
import { ApiError } from "@/types/apiError";
import type { ApiFailResponse } from "@/types/api";

function messageFromBody(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const msg = (data as { message?: unknown }).message;
  if (typeof msg === "string") return msg;
  if (Array.isArray(msg)) return msg.filter((m) => typeof m === "string").join(", ");
  return undefined;
}

/** Axios 응답 본문이 백엔드 `responseObj.fail` 형태인지 */
export function isApiFailBody(data: unknown): data is ApiFailResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    (data as ApiFailResponse).success === false
  );
}

/**
 * 서버/클라이언트 에러를 사용자 메시지로 정규화
 * - 백엔드: `{ success: false, message }`
 * - Nest 검증/HTTP 예외: `{ message: string | string[] }`
 */
export function getErrorMessageFromUnknown(error: unknown): string {
  if (isAxiosError(error)) {
    const data = error.response?.data as unknown;
    if (isApiFailBody(data)) {
      return data.message;
    }
    const fromBody = messageFromBody(data);
    if (fromBody) return fromBody;
    if (error.message) return error.message;
  }
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "요청 처리 중 오류가 발생했습니다.";
}
