import { getErrorMessageFromUnknown } from "@/lib/utils/apiErrorHandler";
import type { ShowToastOptions } from "@/components/containers/Toast";
import { isApiSuccess, type ApiResponse } from "@/types/api";

export type ShowToastFn = (opts: ShowToastOptions) => void;

/**
 * `request<ApiResponse<T>>` 를 쓰는 useMutation 에서 공통으로 쓰는
 * onSuccess / onError 핸들러를 생성한다.
 * - 성공: `success: true` → 성공 토스트 후 `onSuccessData`
 * - 본문만 실패(`success: false`인 200 등): 에러 토스트
 * - HTTP/네트워크 오류: `getErrorMessageFromUnknown` 으로 에러 토스트
 */
export type CreateApiMutationFeedbackOptions<TData> = {
  showToast: ShowToastFn;
  /** 성공 시 `res.message` 가 비었을 때 */
  defaultSuccessMessage?: string;
  /** 드물게 200 본문이 `{ success: false }` 일 때 */
  fallbackFailureMessage?: string;
  /** 성공 토스트 후 `data` 처리 (리다이렉트·캐시 무효화 등) */
  onSuccessData?: (data: TData) => void;
  /** 성공 토스트를 띄우지 않음 (조용한 mutation) */
  skipSuccessToast?: boolean;
  /** 에러 토스트 직후 추가 처리 */
  onErrorSideEffect?: (error: unknown) => void;
};

export function createApiMutationFeedbackHandlers<TData>(
  opts: CreateApiMutationFeedbackOptions<TData>
) {
  const {
    showToast,
    defaultSuccessMessage = "처리되었습니다.",
    fallbackFailureMessage = "요청에 실패했습니다.",
    onSuccessData,
    skipSuccessToast,
    onErrorSideEffect,
  } = opts;

  return {
    onSuccess: (res: ApiResponse<TData>) => {
      if (!isApiSuccess(res)) {
        showToast({
          type: "error",
          message: res.message ?? fallbackFailureMessage,
        });
        return;
      }
      if (!skipSuccessToast) {
        showToast({
          type: "success",
          message: res.message || defaultSuccessMessage,
        });
      }
      onSuccessData?.(res.data);
    },
    onError: (err: unknown) => {
      showToast({
        type: "error",
        message: getErrorMessageFromUnknown(err),
      });
      onErrorSideEffect?.(err);
    },
  };
}
