import * as S from "./MainTemplate.style";
import { useEffect, useState } from "react";
import useContextMenu from "@/lib/hooks/useContextMenu";

import { Sidemenu } from "@/components/molecules/Sidemenu";
import { readAccessToken } from "@/lib/functions/authFunctions";
import { Navigate } from "react-router-dom";

interface MainTemplateProps {
  children: React.ReactElement;
}

export const MainTemplate = ({ children }: MainTemplateProps) => {
  const accessToken = readAccessToken();

  const [asideOpen, setAsideOpen] = useState(true);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  // const permissions = useRecoilValue<any>(permissionsState);

  const {
    contextMenu,
    handleContextMenu,
    handleOpenInNewTab,
    handleOpenInNewWindow,
  } = useContextMenu();

  const resizeListener = () => {
    setInnerWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", resizeListener);
    return () => window.removeEventListener("resize", resizeListener);
  }, []);

  // 창 크기가 1200px 이상이면 사이드메뉴 열기, 미만이면 닫기 (리사이즈 후에도 올바르게 반영)
  useEffect(() => {
    setAsideOpen(innerWidth >= 1200);
  }, [innerWidth]);

  const handleAsideOpen = () => {
    setAsideOpen(!asideOpen);
  };

  if (!accessToken) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <S.MainTemplate $asideOpen={asideOpen}>
      <Sidemenu
        asideToggle={handleAsideOpen}
        onContextMenu={handleContextMenu}
        // permissions={permissions ?? []}
      />
      <S.ContentSection>{children}</S.ContentSection>
    </S.MainTemplate>
  );
};
