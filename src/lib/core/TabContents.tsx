import React, { lazy, Suspense } from "react";
import { useRecoilValue } from "recoil";
import type { Tab } from "@/types/menu";
import { openTabsState } from "@/store/menu";
import PrivateRoute from "./routes/PrivateRoute";
import useScreenList from "@/lib/hooks/useScreenList";
import SamplePage1 from "@/pages/SamplePage1/SamplePage1";
import SamplePage2 from "@/pages/SamplePage2/SamplePage2";
import SamplePage3Sub1 from "@/pages/SamplePage3/SamplePage3Sub1/SamplePage3Sub1";
import SamplePage3Sub2 from "@/pages/SamplePage3/SamplePage3Sub2/SamplePage3Sub2";

// Vite의 glob import를 사용하여 모든 페이지를 동적으로 로드
const pageModules = import.meta.glob<{ default: React.ComponentType<any> }>(
  "@/pages/**/*.tsx"
);

// path를 파일 경로로 변환하는 함수
const pathToFilePath = (path: string): string | null => {
  // path 매핑
  const pathMap: Record<string, string> = {
    "/": "/MapPage/MapPage",
    "/shared-asset-location": "/SharedAssetLocationPage/SharedAssetLocationPage",
    "/shared-asset-management": "/SharedAssetManagementPage/SharedAssetManagementPage",
  };

  if (pathMap[path]) {
    const filePath = `@/pages${pathMap[path]}.tsx`;
    // 실제로 존재하는지 확인
    if (pageModules[filePath]) {
      return filePath;
    }
    // 디버깅: 사용 가능한 경로 확인
    console.log(`Path not found: ${filePath}`, {
      availablePaths: Object.keys(pageModules).filter(k => k.includes('MapPage'))
    });
  }

  // path를 기반으로 파일 경로 추론 시도
  // 예: /some-path -> /SomePathPage/SomePathPage
  const pathParts = path.split("/").filter(Boolean);
  if (pathParts.length > 0) {
    const pageName = pathParts
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join("");
    const filePath = `@/pages/${pageName}Page/${pageName}Page.tsx`;
    if (pageModules[filePath]) {
      return filePath;
    }
  }

  return null;
};

const TabContents = () => {
  const openTabs = useRecoilValue(openTabsState);
  const { data: screenList } = useScreenList();

  const componentMap = React.useMemo(() => {
    const map = new Map<string, React.LazyExoticComponent<any>>();

    // 주요 페이지를 직접 매핑 (fallback)
    const directComponentMap: Record<string, React.ComponentType<any>> = {
      "/": SamplePage1,
      "/sample-page-2": SamplePage2,
      "/sample-page-3-1": SamplePage3Sub1,
      "/sample-page-3-2": SamplePage3Sub2,
    };

    // 직접 import한 컴포넌트를 lazy로 래핑하여 매핑
    Object.entries(directComponentMap).forEach(([path, Component]) => {
      map.set(path, lazy(() => Promise.resolve({ default: Component })));
    });

    // screenList에서 컴포넌트 매핑
    for (const screen of screenList) {
      if (screen?.filePath && screen?.path) {
        // filePath를 Vite glob 경로 형식으로 변환
        const modulePath = `@/pages${screen.filePath}.tsx`;
        const moduleLoader = pageModules[modulePath];

        if (moduleLoader && !map.has(screen.path)) {
          map.set(
            screen.path,
            lazy(() => moduleLoader().then((mod) => ({ default: mod.default })))
          );
        }
      }
    }

    // 메뉴 path를 직접 사용하여 컴포넌트 매핑 (이미 매핑되지 않은 경우만)
    if (openTabs && openTabs.length > 0) {
      for (const tab of openTabs) {
        if (!map.has(tab.path)) {
          const filePath = pathToFilePath(tab.path);
          if (filePath) {
            const moduleLoader = pageModules[filePath];
            if (moduleLoader) {
              map.set(
                tab.path,
                lazy(() => moduleLoader().then((mod) => ({ default: mod.default })))
              );
            }
          }
        }
      }
    }

    return map;
  }, [screenList, openTabs]);

  // 탭이 없으면 아무것도 렌더링하지 않음
  if (!openTabs || openTabs.length === 0) {
    return null;
  }

  return (
    <>
      {openTabs.map((tab: Tab) => {
        const Component = componentMap.get(tab.path);
        if (!Component) {
          console.warn(`Component not found for path: ${tab.path}`);
          return null;
        }

        return (
          <PrivateRoute
            key={tab.id}
            component={
              <Suspense fallback={<div style={{ padding: 24 }}>로딩중…</div>}>
                <div
                  key={tab.id}
                  style={{
                    display: tab.isSelected ? "flex" : "block",
                    flexDirection: "column",
                    flex: tab.isSelected ? 1 : undefined,
                    minHeight: tab.isSelected ? 0 : undefined,
                    overflow: tab.isSelected ? "hidden" : undefined,
                    visibility: tab.isSelected ? "visible" : "hidden",
                    position: tab.isSelected ? "static" : "absolute",
                    left: tab.isSelected ? undefined : "-9999px",
                  }}
                >
                  <Component />
                </div>
              </Suspense>
            }
          />
        );
      })}
    </>
  );
};

export default TabContents;
