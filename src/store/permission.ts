import type { Permission } from "@/types/permission";

/**
 * 권한 상태 관리
 * Note: 현재 recoil 미사용으로 간단한 상태 저장소 구현
 */
let permissions: Permission[] = [];

export const permissionsState = {
  get: () => permissions,
  set: (newPermissions: Permission[]) => {
    permissions = newPermissions;
  },
};
