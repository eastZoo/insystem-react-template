/**
 * 사용자 타입 정의
 */
export interface User {
  oid: string;
  userId: string;
  password?: string;
  userName: string;
  grade: string;
  tel: string;
  hp: string;
  email: string;
  department: string;
  duties: string;
  isActive: boolean;
  remark: string;
  useColor: string;
  joinDate: string;
  createdAt: string;
  updatedAt: string;
}
