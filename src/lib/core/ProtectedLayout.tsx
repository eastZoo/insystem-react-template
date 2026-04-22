import { MainTemplate } from "@/components/template/MainTemplate";
import { Outlet } from "react-router-dom";

/**
 * 인증된 사용자 전용 레이아웃.
 * Routes.tsx 에서 lazy import 되어 보호 라우트 접근 시에만 로드됩니다.
 */

function ProtectedLayout() {
  return (
    <MainTemplate>
      <Outlet />
    </MainTemplate>
  );
}

export default ProtectedLayout;
