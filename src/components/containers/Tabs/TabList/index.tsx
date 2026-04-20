import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import type { Tab } from "@/types/menu";
import { openTabsState, useSelectedMenu } from "@/store/menu";
import styled from "styled-components";

const TabBar = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  background-color: #D4D4D8;
  padding: 4px 4px 0 4px;
`;

const TabButton = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  margin-right: 3px;
  padding: 6px 12px;
  background-color: ${({ $active }) => ($active ? "#f9f9f9" : "#eee")};
  border-radius: 6px 6px 0 0;
  cursor: pointer;
  font-size: 14px;
  color: ${({ $active }) => ($active ? "#0C4CA3" : "#99A1AF")};

  &:hover {
    background-color: ${({ $active }) => ($active ? "#ccc" : "#ddd")};
  }
`;

const TabLabel = styled.span`
  margin-right: 8px;
`;

const TabClose = styled.span`
  color: #999;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    color: red;
  }
`;

const TabList = () => {
  const openTabs = useAtomValue(openTabsState);
  const [, setMenu] = useSelectedMenu();
  const navigate = useNavigate();

  useEffect(() => {
    const selectedTab = openTabs.find((tab) => tab.isSelected);
    if (selectedTab) {
      navigate(selectedTab.path, { replace: true });
    }
  }, [openTabs]);

  const onRemoveTab = (id: string) => {
    setMenu({ id, isClose: true });
  };

  if (!openTabs?.length) return null;

  return (
    <TabBar>
      {openTabs.map((tab) => (
        <TabButton
          key={tab.id}
          $active={tab.isSelected}
          onClick={() => setMenu({ id: tab.id })}
        >
          <TabLabel>{tab.menuName}</TabLabel>
          <TabClose
            onClick={(e) => {
              e.stopPropagation();
              onRemoveTab(tab.id);
            }}
          >
            ×
          </TabClose>
        </TabButton>
      ))}
    </TabBar>
  );
};

export default TabList;
