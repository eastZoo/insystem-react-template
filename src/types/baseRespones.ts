export interface BaseResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}
