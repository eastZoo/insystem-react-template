/** 백엔드 `responseObj` / HttpExceptionFilter 와 동일한 응답 형태 */
export type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiFailResponse = {
  success: false;
  message: string;
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiFailResponse;

export function isApiSuccess<T>(
  res: ApiResponse<T>
): res is ApiSuccessResponse<T> {
  return res.success === true;
}
