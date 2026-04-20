import React, { lazy, Suspense } from "react";
import { useAtomValue } from "jotai";
import type { Tab } from "@/types/menu";
import { openTabsState } from "@/store/menu";
import SamplePage1 from "@/pages/SamplePage1/SamplePage1";
import SamplePage2 from "@/pages/SamplePage2/SamplePage2";
import SamplePage3Sub1 from "@/pages/SamplePage3/SamplePage3Sub1/SamplePage3Sub1";
import SamplePage3Sub2 from "@/pages/SamplePage3/SamplePage3Sub2/SamplePage3Sub2";

const TabContents = () => {
  const openTabs = useAtomValue(openTabsState);

  const componentMap = React.useMemo(() => {
    const map = new Map<string, React.LazyExoticComponent<any>>();

    const directComponentMap: Record<string, React.ComponentType<any>> = {
      "/": SamplePage1,
      "/sample-page-2": SamplePage2,
      "/sample-page-3-1": SamplePage3Sub1,
      "/sample-page-3-2": SamplePage3Sub2,
    };

    Object.entries(directComponentMap).forEach(([path, Component]) => {
      map.set(path, lazy(() => Promise.resolve({ default: Component })));
    });

    return map;
  }, []);

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
          <Suspense key={tab.id} fallback={<div style={{ padding: 24 }}>로딩중…</div>}>
            <div
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
        );
      })}
    </>
  );
};

export default TabContents;
