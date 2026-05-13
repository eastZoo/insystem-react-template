/**
 * 휴지통 그리드 컬럼 정의
 * @description AG-Grid 컬럼 정의 및 셀 렌더러
 */
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import type { ColDef, ICellRendererParams, CellStyle } from "ag-grid-community";
import {
  FileIconSmall,
  FolderIconSmall,
  MoreVerticalIcon,
  RestoreIcon,
  TrashIcon,
} from "@/styles/icons";

/** 공개 범위 타입 */
export type VisibilityType = "public" | "team" | "private" | "pending";

/** 벡터화 상태 타입 */
export type VectorStatusType = "complete" | "pending" | "error";

/** 휴지통 그리드 행 타입 */
export interface RecycleBinItem {
  select?: boolean;
  id: string;
  name: string;
  type: "file" | "folder";
  /** 수정 날짜 */
  modifiedDate: string;
  /** 공개 범위 */
  visibility: VisibilityType;
  /** 벡터화 상태 */
  vectorStatus: VectorStatusType;
  /** 파일 크기 */
  size: string;
  /** 삭제 날짜 (기존 호환) */
  deletedDate?: string;
  /** 원래 위치 (기존 호환) */
  originalLocation?: string;
  /** 폴더 코드 (API 호출용) */
  fld_cd?: string;
  /** 파일 ID (API 호출용) */
  file_id?: string;
  /** 파일 SEQ (API 호출용) */
  file_seq?: number;
  /** 컬렉션 명 (API 호출용) */
  collection_nm?: string;
  /** 임베딩 모델 (API 호출용) */
  embd_model?: string;
  /** 삭제 예정일 (30일 후 자동 삭제) */
  autoDeleteDate?: string;
}

/** 액션 메뉴에서 사용하는 ag-grid context */
export interface RecycleBinGridContext {
  onRestore?: (item: RecycleBinItem) => void;
  onPermanentDelete?: (item: RecycleBinItem) => void;
  onMove?: (item: RecycleBinItem) => void;
}

const cellStyleFlexCenter: CellStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const cellStyleTextRight: CellStyle = {
  textAlign: "right",
};

/** 이름 셀 렌더러 */
const NameCellRenderer = (
  props: ICellRendererParams<RecycleBinItem, unknown, RecycleBinGridContext>
) => {
  const data = props.data;
  if (!data) return null;

  return (
    <NameCell>
      <IconWrapper>
        {data.type === "folder" ? <FolderIconSmall /> : <FileIconSmall />}
      </IconWrapper>
      <FileNameText>{data.name}</FileNameText>
    </NameCell>
  );
};

/** 공개 범위 셀 렌더러 */
const VisibilityCellRenderer = (
  props: ICellRendererParams<RecycleBinItem, unknown, RecycleBinGridContext>
) => {
  const data = props.data;
  if (!data) return null;

  const getVisibilityConfig = (visibility: VisibilityType) => {
    switch (visibility) {
      case "public":
        return { label: "전체공개", color: "#00bf40", bg: "rgba(0, 191, 64, 0.12)" };
      case "team":
        return { label: "팀 공개", color: "#00bdde", bg: "rgba(0, 189, 222, 0.12)" };
      case "private":
        return { label: "나만 보기", color: "rgba(55, 56, 60, 0.61)", bg: "rgba(112, 115, 124, 0.12)" };
      case "pending":
        return { label: "승인대기", color: "#ff9200", bg: "rgba(255, 146, 0, 0.12)" };
      default:
        return { label: "-", color: "#70737c", bg: "transparent" };
    }
  };

  const config = getVisibilityConfig(data.visibility);

  return (
    <VisibilityBadge $color={config.color} $bg={config.bg}>
      {config.label}
    </VisibilityBadge>
  );
};

/** 벡터화 상태 셀 렌더러 */
const VectorStatusCellRenderer = (
  props: ICellRendererParams<RecycleBinItem, unknown, RecycleBinGridContext>
) => {
  const data = props.data;
  if (!data) return null;

  const getStatusConfig = (status: VectorStatusType) => {
    switch (status) {
      case "complete":
        return { label: "완료", color: "#00bf40" };
      case "pending":
        return { label: "대기중", color: "#ff9200" };
      case "error":
        return { label: "오류", color: "#ff4242" };
      default:
        return { label: "-", color: "#70737c" };
    }
  };

  const config = getStatusConfig(data.vectorStatus);

  return (
    <VectorStatusCell>
      <VectorStatusDot $color={config.color} />
      <VectorStatusText>{config.label}</VectorStatusText>
    </VectorStatusCell>
  );
};

/** 액션 메뉴 렌더러 */
const ActionMenuRenderer = (
  props: ICellRendererParams<RecycleBinItem, unknown, RecycleBinGridContext>
) => {
  const data = props.data;
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const updateMenuPosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPosition({
        top: rect.bottom + 4,
        left: rect.right - 140,
      });
    }
  }, []);

  const handleToggleMenu = useCallback(() => {
    if (!showMenu) {
      updateMenuPosition();
    }
    setShowMenu(!showMenu);
  }, [showMenu, updateMenuPosition]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    };

    const handleScroll = () => {
      if (showMenu) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [showMenu]);

  if (!data) return null;

  const handleRestore = () => {
    setShowMenu(false);
    props.context?.onRestore?.(data);
  };

  const handlePermanentDelete = () => {
    setShowMenu(false);
    props.context?.onPermanentDelete?.(data);
  };

  return (
    <ActionWrapper>
      <ActionButton
        ref={buttonRef}
        type="button"
        title="행 메뉴"
        aria-label="행 메뉴 열기"
        aria-expanded={showMenu}
        aria-haspopup="menu"
        onClick={handleToggleMenu}
      >
        <MoreVerticalIcon />
      </ActionButton>
      {showMenu &&
        createPortal(
          <ActionMenuPortal
            ref={menuRef}
            style={{ top: menuPosition.top, left: menuPosition.left }}
          >
            <GridMenuItem type="button" onClick={handleRestore}>
              <GridMenuIcon>
                <RestoreIcon />
              </GridMenuIcon>
              <GridMenuLabel>복원하기</GridMenuLabel>
            </GridMenuItem>
            <GridMenuDivider />
            <GridMenuItem type="button" onClick={handlePermanentDelete} $danger>
              <GridMenuIcon $danger>
                <TrashIcon />
              </GridMenuIcon>
              <GridMenuLabel $danger>영구 삭제</GridMenuLabel>
            </GridMenuItem>
          </ActionMenuPortal>,
          document.body
        )}
    </ActionWrapper>
  );
};

/** 휴지통 화면용 ag-grid 컬럼 정의 */
export function createRecycleBinColumnDefs(): ColDef<RecycleBinItem>[] {
  return [
    {
      headerName: "이름",
      field: "name",
      flex: 2,
      minWidth: 300,
      cellRenderer: NameCellRenderer,
      sortable: true,
    },
    {
      headerName: "수정 날짜",
      field: "modifiedDate",
      flex: 1,
      minWidth: 120,
      cellStyle: { ...cellStyleFlexCenter },
      sortable: true,
    },
    {
      headerName: "공개 범위",
      field: "visibility",
      flex: 1,
      minWidth: 100,
      cellRenderer: VisibilityCellRenderer,
      cellStyle: cellStyleFlexCenter,
      sortable: false,
    },
    {
      headerName: "벡터화 상태",
      field: "vectorStatus",
      flex: 1,
      minWidth: 100,
      cellRenderer: VectorStatusCellRenderer,
      cellStyle: cellStyleFlexCenter,
      sortable: false,
    },
    {
      headerName: "크기",
      field: "size",
      flex: 1,
      minWidth: 80,
      cellStyle: { ...cellStyleFlexCenter },
      sortable: false,
    },
    {
      headerName: "관리",
      field: "id",
      width: 80,
      colId: "actions",
      cellRenderer: ActionMenuRenderer,
      cellStyle: cellStyleFlexCenter,
      sortable: false,
      lockPosition: "right",
    },
  ];
}

/** 컬럼 정의는 불변이라 한 번만 메모이제이션 */
export function useRecycleBinColumnDefs(): ColDef<RecycleBinItem>[] {
  return useMemo(() => createRecycleBinColumnDefs(), []);
}

/* ========================================
   스타일 컴포넌트
   ======================================== */

const NameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #1b2a6b;
`;

const FileNameText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #1b2a6b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VisibilityBadge = styled.div<{ $color: string; $bg: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 8px;
  min-width: 59px;
  background: ${({ $bg }) => $bg};
  border-radius: 4px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.273;
  letter-spacing: 0.342px;
  color: ${({ $color }) => $color};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const VectorStatusCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 4px 0;
`;

const VectorStatusDot = styled.div<{ $color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
`;

const VectorStatusText = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.334;
  letter-spacing: 0.302px;
  color: rgba(46, 47, 51, 0.88);
  text-align: center;
  white-space: nowrap;
`;

const ActionWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 6px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: rgba(46, 47, 51, 0.88);
  transition: background 0.15s ease;

  &:hover {
    background: rgba(112, 115, 124, 0.08);
  }
`;

const ActionMenuPortal = styled.div`
  position: fixed;
  min-width: 140px;
  background: #ffffff;
  border: 1px solid #eaebec;
  border-radius: 8px;
  box-shadow:
    0px 4px 6px -1px rgba(23, 23, 23, 0.06),
    0px 2px 4px -2px rgba(23, 23, 23, 0.06);
  padding: 4px 0;
  z-index: 9999;
`;

const GridMenuItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${({ $danger }) =>
      $danger ? "rgba(239, 68, 68, 0.08)" : "rgba(23, 23, 25, 0.075)"};
  }
`;

const GridMenuIcon = styled.span<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: ${({ $danger }) => ($danger ? "#ef4444" : "rgba(46, 47, 51, 0.88)")};
  flex-shrink: 0;

  svg {
    width: 20px;
    height: 20px;
  }
`;

const GridMenuLabel = styled.span<{ $danger?: boolean }>`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.334;
  letter-spacing: 0.302px;
  color: ${({ $danger }) => ($danger ? "#ef4444" : "rgba(46, 47, 51, 0.88)")};
`;

const GridMenuDivider = styled.div`
  height: 1px;
  margin: 0 8px;
  background: rgba(112, 115, 124, 0.08);
`;
