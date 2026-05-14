/**
 * 스크린/라우트 타입 정의
 */
export interface Screen {
  id: string;
  name: string;
  path: string;
  component?: string;
  children?: Screen[];
}
