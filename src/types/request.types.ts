export interface RequestType {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    user?: any; // TODO: 유저 타입 정의 필요
  };
}
