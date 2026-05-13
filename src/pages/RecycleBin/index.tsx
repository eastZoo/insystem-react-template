/**
 * 휴지통 페이지
 * @description 삭제된 파일/폴더를 관리하고 복원 또는 영구 삭제하는 페이지
 */
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import type { AgGridReact } from "ag-grid-react";
import {
  TrashIcon,
  DocumentIcon,
  GridIcon,
  ListIcon,
  MoveIcon,
  RestoreIcon,
} from "@/styles/icons";
import { Alert } from "@/components/atoms/Alert";
import { Pagination } from "@/components/atoms/Pagination";
import {
  MoveFileModal,
  type FolderItem,
} from "@/components/atoms/MoveFileModal";
import Grid from "@/components/atoms/Grid";
import {
  type RecycleBinItem,
  type RecycleBinGridContext,
  useRecycleBinColumnDefs,
} from "./recycleBinGrid";
import {
  PageContainer,
  MainContainer,
  Content,
  ContentHeader,
  HeaderTextGroup,
  MainTitle,
  TableContainer,
  TableContent,
  PaginationFooter,
  SearchBar,
  SearchLeft,
  SearchRight,
  ViewToggle,
  ViewButton,
  EmptyState,
  EmptyStateIcon,
  EmptyStateTextGroup,
  EmptyStateTitle,
  EmptyStateDescription,
  SelectionActionBar,
  ActionBarItem,
  SelectionCount,
  SelectionCountNumber,
  SelectionCountText,
  ActionButton,
  FileListContainer,
  FileListItem,
  FileListIcon,
  FileListName,
} from "./index.style";
import {
  useTrashList,
  useRestoreItem,
  usePermanentDelete,
  type TrashListItem,
} from "@/lib/hooks/useRecycleBin";
import { useFolderTree, useMoveItem } from "@/lib/hooks/useCollection";

/* ========================================
   컴포넌트
   ======================================== */

/**
 * 휴지통 페이지 컴포넌트
 */
export default function RecycleBinPage() {
  /* ===== 상태 관리 ===== */

  // 뷰 모드 상태
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    const saved = localStorage.getItem("recycleBin_viewMode");
    return saved === "grid" ? "grid" : "list";
  });

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // 선택된 항목 상태
  const [selectedItems, setSelectedItems] = useState<RecycleBinItem[]>([]);

  // 영구 삭제 확인 모달 상태
  const [itemsPendingDelete, setItemsPendingDelete] = useState<
    RecycleBinItem[]
  >([]);

  // 이동 모달 상태
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [movingItems, setMovingItems] = useState<RecycleBinItem[]>([]);

  // 복원 확인 모달 상태
  const [itemsPendingRestore, setItemsPendingRestore] = useState<
    RecycleBinItem[]
  >([]);

  // DOM 참조
  const gridRef = useRef<AgGridReact>(null);

  /* ===== API 훅 ===== */

  // 휴지통 목록 조회
  const { data: trashItems = [], isLoading } = useTrashList();

  // 폴더 트리 조회 (이동 모달용)
  const { data: folderTreeData = [] } = useFolderTree();

  // 복원 mutation
  const { mutate: restoreItemMutation, isPending: isRestoring } =
    useRestoreItem();

  // 영구 삭제 mutation
  const { mutate: permanentDeleteMutation, isPending: isDeleting } =
    usePermanentDelete();

  // 이동 mutation (복원 후 특정 폴더로 이동)
  const { mutate: moveItemMutation, isPending: isMoving } = useMoveItem();

  /* ===== 데이터 ===== */

  const columnDefs = useRecycleBinColumnDefs();

  // API 데이터를 RecycleBinItem 형식으로 변환
  const items: RecycleBinItem[] = useMemo(() => {
    return trashItems.map((item: TrashListItem) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      modifiedDate: item.modifiedDate,
      deletedDate: item.deletedDate,
      visibility: item.visibility,
      vectorStatus: item.vectorStatus,
      size: item.size,
      fld_cd: item.fld_cd,
      file_id: item.file_id,
      file_seq: item.file_seq,
      collection_nm: item.collection_nm,
      embd_model: item.embd_model,
    }));
  }, [trashItems]);

  // 폴더 목록 (이동 모달용)
  const folders: FolderItem[] = useMemo(() => {
    return folderTreeData.map((item: any) => ({
      id: item.fld_cd,
      name: item.fld_nm,
    }));
  }, [folderTreeData]);

  /** 필터링된 항목 목록 */
  const filteredItems = useMemo(() => {
    return [...items];
  }, [items]);

  /** 페이지네이션된 항목 목록 */
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  /** 페이지 변경 핸들러 */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  /* ===== 그리드 액션 핸들러 ===== */

  /** 항목 복원 클릭 (단일) */
  const handleItemRestore = useCallback((item: RecycleBinItem) => {
    setItemsPendingRestore([item]);
  }, []);

  /** 항목 영구 삭제 클릭 (단일) */
  const handleItemPermanentDelete = useCallback((item: RecycleBinItem) => {
    setItemsPendingDelete([item]);
  }, []);

  /** 항목 이동 클릭 (단일) */
  const handleItemMove = useCallback((item: RecycleBinItem) => {
    setMovingItems([item]);
    setShowMoveModal(true);
  }, []);

  /** 복원 확인 */
  const handleRestoreConfirm = useCallback(() => {
    for (const item of itemsPendingRestore) {
      restoreItemMutation({
        itemId: item.id,
        itemType: item.type,
        collectionNm: item.collection_nm || "test",
        embdModel: item.embd_model || "bge-m3:latest",
        fileId: item.file_id,
        fileSeq: item.file_seq,
      });
    }
    setItemsPendingRestore([]);
    setSelectedItems([]);
    gridRef.current?.api?.deselectAll();
  }, [itemsPendingRestore, restoreItemMutation]);

  /** 영구 삭제 확인 */
  const handlePermanentDeleteConfirm = useCallback(() => {
    for (const item of itemsPendingDelete) {
      permanentDeleteMutation({
        itemId: item.id,
        itemType: item.type,
        collectionNm: item.collection_nm || "test",
        embdModel: item.embd_model || "bge-m3:latest",
        fileId: item.file_id,
        fileSeq: item.file_seq,
      });
    }
    setItemsPendingDelete([]);
    setSelectedItems([]);
    gridRef.current?.api?.deselectAll();
  }, [itemsPendingDelete, permanentDeleteMutation]);

  /** 이동 확인 (복원 후 폴더로 이동) */
  const handleMoveConfirm = useCallback(
    (targetFolderId: string) => {
      for (const item of movingItems) {
        // 1. 먼저 복원
        restoreItemMutation(
          {
            itemId: item.id,
            itemType: item.type,
            collectionNm: item.collection_nm || "test",
            embdModel: item.embd_model || "bge-m3:latest",
            fileId: item.file_id,
            fileSeq: item.file_seq,
          },
          {
            onSuccess: () => {
              // 2. 복원 성공 후 이동
              moveItemMutation({
                itemId: item.id,
                itemType: item.type,
                targetFolderCode: targetFolderId,
                collectionNm: item.collection_nm || "test",
                embdModel: item.embd_model || "bge-m3:latest",
                fileId: item.file_id,
                fileSeq: item.file_seq,
                currentFldCd: item.fld_cd,
              });
            },
          }
        );
      }
      setShowMoveModal(false);
      setMovingItems([]);
      setSelectedItems([]);
      gridRef.current?.api?.deselectAll();
    },
    [movingItems, restoreItemMutation, moveItemMutation]
  );

  /** 체크박스 선택 변경 */
  const handleSelectionChanged = useCallback((event: any) => {
    const selectedRows = event.api.getSelectedRows() as RecycleBinItem[];
    setSelectedItems(selectedRows);
  }, []);

  /** 선택된 항목 일괄 영구 삭제 */
  const handleBulkPermanentDelete = useCallback(() => {
    if (selectedItems.length > 0) {
      setItemsPendingDelete([...selectedItems]);
    }
  }, [selectedItems]);

  /** 선택된 항목 일괄 이동 */
  const handleBulkMove = useCallback(() => {
    if (selectedItems.length > 0) {
      setMovingItems([...selectedItems]);
      setShowMoveModal(true);
    }
  }, [selectedItems]);

  /** 선택된 항목 일괄 복원 */
  const handleBulkRestore = useCallback(() => {
    if (selectedItems.length > 0) {
      setItemsPendingRestore([...selectedItems]);
    }
  }, [selectedItems]);

  /** 그리드 컨텍스트 (액션 핸들러 전달) */
  const gridContext = useMemo<RecycleBinGridContext>(
    () => ({
      onRestore: handleItemRestore,
      onPermanentDelete: handleItemPermanentDelete,
      onMove: handleItemMove,
    }),
    [handleItemRestore, handleItemPermanentDelete, handleItemMove]
  );

  /* ===== 사이드 이펙트 ===== */

  /** 뷰 모드 변경 시 localStorage에 저장 */
  useEffect(() => {
    localStorage.setItem("recycleBin_viewMode", viewMode);
  }, [viewMode]);

  /* ===== 렌더링 ===== */

  return (
    <PageContainer>
      {/* 메인 컨텐츠 */}
      <MainContainer>
        <Content>
          {/* 컨텐츠 헤더 */}
          <ContentHeader>
            <HeaderTextGroup>
              <MainTitle>휴지통</MainTitle>
            </HeaderTextGroup>
          </ContentHeader>

          {/* 테이블 컨테이너 */}
          <TableContainer>
            {/* 툴바 영역 (선택 액션 바 + 뷰 토글) */}
            <SearchBar>
              <SearchLeft>
                {/* 선택된 항목이 있을 때 액션 바 표시 */}
                {selectedItems.length > 0 && (
                  <SelectionActionBar>
                    <ActionBarItem $hasBorder>
                      <SelectionCount>
                        <SelectionCountNumber>
                          {selectedItems.length}개
                        </SelectionCountNumber>
                        <SelectionCountText>선택됨</SelectionCountText>
                      </SelectionCount>
                    </ActionBarItem>
                    <ActionBarItem $hasBorder>
                      <ActionButton $danger onClick={handleBulkPermanentDelete}>
                        <TrashIcon />
                        완전삭제
                      </ActionButton>
                    </ActionBarItem>
                    <ActionBarItem $hasBorder>
                      <ActionButton onClick={handleBulkMove}>
                        <MoveIcon />
                        이동
                      </ActionButton>
                    </ActionBarItem>
                    <ActionBarItem>
                      <ActionButton onClick={handleBulkRestore}>
                        <RestoreIcon />
                        복원
                      </ActionButton>
                    </ActionBarItem>
                  </SelectionActionBar>
                )}
              </SearchLeft>
              <SearchRight>
                <ViewToggle>
                  <ViewButton
                    $active={viewMode === "grid"}
                    onClick={() => setViewMode("grid")}
                    title="그리드 보기"
                    $position="left"
                  >
                    <GridIcon />
                  </ViewButton>
                  <ViewButton
                    $active={viewMode === "list"}
                    onClick={() => setViewMode("list")}
                    title="목록 보기"
                    $position="right"
                  >
                    <ListIcon />
                  </ViewButton>
                </ViewToggle>
              </SearchRight>
            </SearchBar>

            {/* 파일 그리드 또는 빈 상태 */}
            <TableContent>
              {isLoading ? (
                <EmptyState>
                  <EmptyStateTextGroup>
                    <EmptyStateDescription>
                      휴지통 목록을 불러오는 중...
                    </EmptyStateDescription>
                  </EmptyStateTextGroup>
                </EmptyState>
              ) : filteredItems.length > 0 ? (
                <Grid
                  ref={gridRef}
                  rowData={paginatedItems}
                  columnDefs={columnDefs}
                  context={gridContext}
                  rowHeight={40}
                  headerHeight={40}
                  height="auto"
                  domLayout="autoHeight"
                  isRadius={false}
                  selectionMode="multiRow"
                  onSelectionChanged={handleSelectionChanged}
                />
              ) : (
                // 휴지통이 비어있을 때
                <EmptyState>
                  <EmptyStateIcon>
                    <TrashIcon />
                  </EmptyStateIcon>
                  <EmptyStateTextGroup>
                    <EmptyStateTitle>휴지통이 비어있습니다</EmptyStateTitle>
                    <EmptyStateDescription>
                      삭제된 파일이 여기에 표시됩니다.
                    </EmptyStateDescription>
                  </EmptyStateTextGroup>
                </EmptyState>
              )}
            </TableContent>

            {/* 페이지네이션 */}
            {filteredItems.length > 0 && (
              <PaginationFooter>
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredItems.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </PaginationFooter>
            )}
          </TableContainer>
        </Content>
      </MainContainer>

      {/* 복원 확인 모달 */}
      <Alert
        isOpen={itemsPendingRestore.length > 0}
        onClose={() => setItemsPendingRestore([])}
        onConfirm={handleRestoreConfirm}
        title="파일 복원"
        description={
          <>
            선택한 <strong>{itemsPendingRestore.length}개</strong>의 파일을
            복원하시겠습니까?
          </>
        }
        cancelText="취소"
        confirmText="복원"
        width={384}
      >
        <FileListContainer>
          {itemsPendingRestore.slice(0, 5).map((item) => (
            <FileListItem key={item.id}>
              <FileListIcon>
                <DocumentIcon />
              </FileListIcon>
              <FileListName>{item.name}</FileListName>
            </FileListItem>
          ))}
          {itemsPendingRestore.length > 5 && (
            <FileListItem>
              <FileListName
                style={{ color: "rgba(55, 56, 60, 0.61)", fontStyle: "italic" }}
              >
                외 {itemsPendingRestore.length - 5}개 항목...
              </FileListName>
            </FileListItem>
          )}
        </FileListContainer>
      </Alert>

      {/* 영구 삭제 확인 모달 */}
      <Alert
        isOpen={itemsPendingDelete.length > 0}
        onClose={() => setItemsPendingDelete([])}
        onConfirm={handlePermanentDeleteConfirm}
        title="완전 삭제"
        description={
          <>
            선택한 <strong>{itemsPendingDelete.length}개</strong>의 파일을
            완전히 삭제하시겠습니까?
            <br />
            <br />
            <span style={{ color: "#ff4242", fontSize: "13px" }}>
              이 작업은 되돌릴 수 없습니다.
            </span>
          </>
        }
        cancelText="취소"
        confirmText="완전 삭제"
        width={384}
      >
        <FileListContainer>
          {itemsPendingDelete.slice(0, 5).map((item) => (
            <FileListItem key={item.id}>
              <FileListIcon>
                <DocumentIcon />
              </FileListIcon>
              <FileListName>{item.name}</FileListName>
            </FileListItem>
          ))}
          {itemsPendingDelete.length > 5 && (
            <FileListItem>
              <FileListName
                style={{ color: "rgba(55, 56, 60, 0.61)", fontStyle: "italic" }}
              >
                외 {itemsPendingDelete.length - 5}개 항목...
              </FileListName>
            </FileListItem>
          )}
        </FileListContainer>
      </Alert>

      {/* 이동 모달 */}
      <MoveFileModal
        isOpen={showMoveModal}
        onClose={() => {
          setShowMoveModal(false);
          setMovingItems([]);
        }}
        onMove={handleMoveConfirm}
        fileName={
          movingItems.length === 1
            ? movingItems[0].name
            : `${movingItems.length}개 항목`
        }
        folders={folders}
      />
    </PageContainer>
  );
}
