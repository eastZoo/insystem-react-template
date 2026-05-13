/**
 * Tabs 컴포넌트
 * @description 탭 네비게이션 컴포넌트
 */
import { useState, useCallback } from "react";
import styled from "styled-components";

export interface TabItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface TabsProps {
  /** 탭 목록 */
  tabs: TabItem[];
  /** 현재 선택된 탭 ID */
  activeTab?: string;
  /** 탭 변경 핸들러 */
  onTabChange?: (tabId: string) => void;
  /** 기본 선택 탭 ID */
  defaultTab?: string;
  /** 전체 너비 사용 여부 */
  fullWidth?: boolean;
}

export const Tabs = ({
  tabs,
  activeTab: controlledActiveTab,
  onTabChange,
  defaultTab,
  fullWidth = false,
}: TabsProps) => {
  const [internalActiveTab, setInternalActiveTab] = useState(
    defaultTab || tabs[0]?.id || ""
  );

  const activeTab = controlledActiveTab ?? internalActiveTab;

  const handleTabClick = useCallback(
    (tabId: string) => {
      if (controlledActiveTab === undefined) {
        setInternalActiveTab(tabId);
      }
      onTabChange?.(tabId);
    },
    [controlledActiveTab, onTabChange]
  );

  return (
    <TabsContainer $fullWidth={fullWidth}>
      <TabList>
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            $isActive={activeTab === tab.id}
            $fullWidth={fullWidth}
            disabled={tab.disabled}
            onClick={() => !tab.disabled && handleTabClick(tab.id)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabList>
    </TabsContainer>
  );
};

export default Tabs;

/* ========================================
   Styled Components
   ======================================== */

const TabsContainer = styled.div<{ $fullWidth: boolean }>`
  width: ${({ $fullWidth }) => ($fullWidth ? "100%" : "auto")};
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(112, 115, 124, 0.22);
`;

const TabButton = styled.button<{ $isActive: boolean; $fullWidth: boolean }>`
  flex: ${({ $fullWidth }) => ($fullWidth ? 1 : "none")};
  padding: 12px 24px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: ${({ $isActive }) => ($isActive ? 600 : 500)};
  line-height: 1.429;
  letter-spacing: 0.203px;
  color: ${({ $isActive }) => ($isActive ? "#1b2a6b" : "#6b7a9f")};
  background: transparent;
  border: none;
  border-bottom: 2px solid
    ${({ $isActive }) => ($isActive ? "#1b2a6b" : "transparent")};
  margin-bottom: -1px;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover:not(:disabled) {
    color: #1b2a6b;
  }

  &:disabled {
    color: rgba(112, 115, 124, 0.4);
    cursor: not-allowed;
  }
`;
