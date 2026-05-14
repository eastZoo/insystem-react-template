/**
 * 권한 타입 정의
 */
export interface Permission {
  pmsId: string;
  pmsGroup: string;
  pmsMenuName: string;
  pmsMenuActive: number;
  pmsMenuInsert: number;
  pmsMenuUpdate: number;
  pmsMenuDelete: number;
  pmsMenuRead: number;
  createIP: string | null;
  createUserID: string | null;
  createdAt: string;
  updateIP: string | null;
  updateUserID: string | null;
  updatedAt: string;
}
