import React, { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import type { Tab } from "@/types/menu";
import { openTabsState, selectedMenuSelector } from "@/store/menu";
import styled from "styled-components";

const TabBar = styled.div`
  display: flex;
  overflow-x: auto;
  white-space: nowrap;
  /* border-bottom: 1px solid #ccc; */
  background-color: #D4D4D8;
  /* background-color: #f9f9f9; */
  padding: 4px 4px 0 4px;

  /* 스크롤바 숨기고 싶다면 아래 주석 해제 */
  /* &::-webkit-scrollbar {
    height: 6px;
  } */
  /* &::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 3px;
  } */
  /* &::-webkit-scrollbar-track {
    background-color: transparent;
  } */
`;

const TabButton = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  margin-right: 3px;
  padding: 6px 12px;
  /* border: 1px solid ${({ $active }) => ($active ? "#aaa" : "transparent")}; */
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
  const openTabs = useRecoilValue(openTabsState);
  const setMenu = useSetRecoilState(selectedMenuSelector);
  const navigate = useNavigate();

  // 선택된 탭이 바뀔 때마다 URL을 해당 탭의 path로 동기화
  useEffect(() => {
    const selectedTab = openTabs.find((tab) => tab.isSelected);
    if (selectedTab) {
      navigate(selectedTab.path, { replace: true });
    }
  }, [openTabs]);

  const onRemoveTab = (id: string) => {
    setMenu({ id: id, isClose: true });
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
