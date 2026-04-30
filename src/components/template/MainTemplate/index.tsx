import * as S from "./MainTemplate.style";
import { useEffect, useState } from "react";
import useContextMenu from "@/lib/hooks/useContextMenu";

import { Sidemenu } from "@/components/molecules/Sidemenu";
import { readAccessToken } from "@/lib/functions/authFunctions";
import { Navigate } from "react-router-dom";
import { useLogout } from "@/lib/hooks/useAuth";
import { useUserInfo } from "@/lib/hooks/useUserInfo";
import type { UserInfo } from "@/types/domain.types";

interface MainTemplateProps {
  children: React.ReactElement;
}

export const MainTemplate = ({ children }: MainTemplateProps) => {
  /** ============================= state 영역 ============================= */
  const accessToken = readAccessToken();

  const [asideOpen, setAsideOpen] = useState(true);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);

  // 로그아웃 뮤테이션
  const logoutMutation = useLogout();

  // 사용자 정보 조회
  const { data: userInfo } = useUserInfo();

  const {
    contextMenu,
    handleContextMenu,
    handleOpenInNewTab,
    handleOpenInNewWindow,
  } = useContextMenu();
  /** ============================= API 영역 ============================= */

  /** ============================= 비즈니스 로직 영역 ============================= */
  const resizeListener = () => {
    setInnerWidth(window.innerWidth);
  };

  const handleAsideToggle = () => {
    setAsideOpen(!asideOpen);
  };

  /** ============================= 컴포넌트 영역 ============================= */

  /** ============================= useEffect 영역 ============================= */

  useEffect(() => {
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  // 창 크기가 1200px 이상이면 사이드메뉴 열기, 미만이면 닫기 (리사이즈 후에도 올바르게 반영)
  useEffect(() => {
    setAsideOpen(innerWidth >= 1200);
  }, [innerWidth]);

  if (!accessToken) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <S.MainTemplate $asideOpen={asideOpen}>
      <Sidemenu
        isCollapsed={!asideOpen}
        asideToggle={handleAsideToggle}
        onContextMenu={handleContextMenu}
        onLogout={() => logoutMutation.mutate()}
        userInfo={
          userInfo ??
          ({ userName: "-", userRole: "-", userTeam: "-" } as UserInfo)
        }
      />
      <S.ContentSection>{children}</S.ContentSection>
    </S.MainTemplate>
  );
};
