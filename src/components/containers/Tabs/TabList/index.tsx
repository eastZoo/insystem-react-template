import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import type { Tab } from "@/types/menu";
import { openTabsState, useSelectedMenu } from "@/store/menu";
import styled from "styled-components";

// 닫기 아이콘 SVG
const CloseIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M3 3L9 9M9 3L3 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TabBar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  white-space: nowrap;
  background-color: #D1D5DC;
  padding: 16px 16px 0 16px;
`;

const TabButton = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 8px 8px 16px;
  background-color: ${({ $active }) => ($active ? "#FFFFFF" : "#E5E7EB")};
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-family: "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: -0.26px;
  color: ${({ $active }) => ($active ? "#0C4CA3" : "#99A1AF")};
  overflow: hidden;
  flex-shrink: 0;

  &:hover {
    background-color: ${({ $active }) => ($active ? "#FFFFFF" : "#D1D5DC")};
  }
`;

const TabLabel = styled.span`
  white-space: nowrap;
`;

const TabClose = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 12px;
  color: #99A1AF;
  font-size: 14px;
  line-height: 1;
  cursor: pointer;

  &:hover {
    color: #6A7282;
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
            <CloseIcon />
          </TabClose>
        </TabButton>
      ))}
    </TabBar>
  );
};

export default TabList;
