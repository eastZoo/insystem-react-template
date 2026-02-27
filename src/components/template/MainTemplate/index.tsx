import * as S from "./MainTemplate.style";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useContextMenu from "@/lib/hooks/useContextMenu";
import { permissionsState } from "@/store/permission";
import { Header } from "@/components/organisms/Header";
import { Sidemenu } from "@/components/organisms/Sidemenu";
import useMenuData from "@/lib/hooks/useMenuData";
import TabList from "@/components/containers/Tabs/TabList";
import { readAccessToken } from "@/lib/functions/authFunctions";
import { Navigate } from "react-router-dom";
import { openTabsState, selectedMenuSelector, flattenMenuTree } from "@/store/menu";
import HomePage from "@/pages/HomePage";
import { menuListDummy } from "@/lib/data/menuListDummy";

interface MainTemplateProps {
  children: React.ReactElement;
  defaultComponent?: React.ReactElement;
}

export const MainTemplate = ({
  children,
  defaultComponent = <HomePage />,
}: MainTemplateProps) => {
  const accessToken = readAccessToken();
  useMenuData();
  const location = useLocation();
  const setMenu = useSetRecoilState(selectedMenuSelector);

  const [asideOpen, setAsideOpen] = useState(true);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const permissions = useRecoilValue<any>(permissionsState);
  const openTabs = useRecoilValue(openTabsState);
  const hasActiveTabs = openTabs && openTabs.length > 0;
  const [homeTabInitialized, setHomeTabInitialized] = useState(false);

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

    return () => {
      window.removeEventListener("resize", resizeListener);
      innerWidth < 1200 ? setAsideOpen(false) : setAsideOpen(true);
    };
  }, [innerWidth]);

  // sessionStorage에 탭 데이터가 없고, URL에 매칭 메뉴가 있을 때만 탭 자동 열기
  // (sessionStorage에서 복원된 경우 hasActiveTabs가 이미 true이므로 skip됨)
  useEffect(() => {
    if (!hasActiveTabs && !homeTabInitialized) {
      const flatMenuList = flattenMenuTree(menuListDummy);
      const matchedMenu = flatMenuList.find((menu) => menu.path === location.pathname);
      if (matchedMenu) {
        setMenu({ id: matchedMenu.oid });
      }
      setHomeTabInitialized(true);
    }
  }, [hasActiveTabs, homeTabInitialized, setMenu]);

  const handleAsideOpen = () => {
    setAsideOpen(!asideOpen);
  };

  if (!accessToken) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <S.MainTemplate $asideOpen={asideOpen}>
      <Header
        asideToggle={handleAsideOpen}
        asideOpen={asideOpen}
        innerWidth={innerWidth}
      />
      <Sidemenu
        asideToggle={handleAsideOpen}
        onContextMenu={handleContextMenu}
        permissions={permissions ?? []}
      />
      <S.ContentSection>
        {/* 여기에 TabList추가하기 */}
        <TabList />
        {hasActiveTabs ? children : defaultComponent}
      </S.ContentSection>

    </S.MainTemplate>
  );
};
