import * as S from "./MainTemplate.style";
import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useContextMenu from "@/lib/hooks/useContextMenu";
import { Header } from "@/components/organisms/Header";
import { Sidemenu } from "@/components/organisms/Sidemenu";
import TabList from "@/components/containers/Tabs/TabList";
import { openTabsState, useSelectedMenu, M } from "@/store/menu";
import HomePage from "@/pages/Home";

interface MainTemplateProps {
  children: React.ReactElement;
  defaultComponent?: React.ReactElement;
}

export const MainTemplate = ({
  children,
  defaultComponent = <HomePage />,
}: MainTemplateProps) => {
  const location = useLocation();
  const [, setMenu] = useSelectedMenu();

  const [asideOpen, setAsideOpen] = useState(true);
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const openTabs = useAtomValue(openTabsState);
  const hasActiveTabs = openTabs && openTabs.length > 0;
  const [homeTabInitialized, setHomeTabInitialized] = useState(false);

  const {
    handleContextMenu,
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

  // 현재 경로에 맞는 메뉴를 자동으로 선택
  useEffect(() => {
    if (!hasActiveTabs && !homeTabInitialized && M.length > 0) {
      const matchedMenu = M.find(
        (menu) => menu.path === location.pathname
      );
      if (matchedMenu) {
        setMenu({ id: matchedMenu.oid });
      }
      setHomeTabInitialized(true);
    }
  }, [hasActiveTabs, homeTabInitialized, setMenu, location.pathname]);

  const handleAsideOpen = () => {
    setAsideOpen(!asideOpen);
  };

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
      />
      <S.ContentSection>
        <TabList />
        {hasActiveTabs ? children : defaultComponent}
      </S.ContentSection>
    </S.MainTemplate>
  );
};
