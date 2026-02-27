export interface User {
  /** 키 */
  oid: string;

  /** 아이디 */
  userId?: string;

  /** 유저명 */
  userName?: string;

  /** 전화번호 */
  tel?: string;

  /** 휴대전화 */
  hp?: string;

  /** 이메일 */
  email?: string;

  /** 부서 */
  department?: string;

  /** 직책 */
  duties?: string;

  /** 직책 이름 */
  dutiesName?: string;

  /** 권한 */
  auth?: string;

  /** 사용여부 */
  useYn?: boolean;

  /** 비고 */
  remark?: string;

  /** 사용자 색상 */
  useColor?: string;

  /* 입사일 */
  joinDate?: string;

  /* 부서 */
  departmentName?: string;
}
