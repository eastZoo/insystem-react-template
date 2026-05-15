/**
 * 메뉴 관리 페이지
 *
 * 좌측: 메뉴 목록 (트리 구조)
 * 우측: 상세 정보
 */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type {
  ColDef,
  CellValueChangedEvent,
  CellStyle,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { IsInputText, IsRadio, IsTabItem } from "insystem-atoms";
import Grid from "@/components/atoms/Grid";
import { PlusIcon, TrashIcon, ChevronRightIcon } from "@/styles/icons";
import { Alert } from "@/components/atoms/Alert";
import { FilterBar } from "@/components/atoms/FilterBar";
import {
  useMenuList,
  useSaveMenu,
  buildMenuHierarchy,
  type MenuItem,
  type MenuTreeItem,
} from "@/lib/hooks/useMenu";
import { PageTemplate } from "@/components/template/PageTemplate";
import { PageHeader as CommonPageHeader } from "@/components/atoms/PageHeader";
import { FormTable, FormField } from "@/components/atoms/FormTable";
import {
  DualGridContainer,
  GridPanel,
  PanelHeader,
  PanelTitle,
  PanelActions,
  AddButton,
  GridContent,
  DeleteButton,
  SelectGuideMessage,
  TabBar,
  PanelContainer,
  DepthButtonGroup,
  DepthButton,
  TreeCell,
  TreeToggle,
  TreeIndent,
  TreeLabel,
} from "./index.style";

/**
 * 메뉴 관리 페이지 컴포넌트
 */
export default function MenuManagementPage() {
  /** ============================= state 영역 ============================= */
  const [selectedMenuCd, setSelectedMenuCd] = useState<string | null>(null);
  const [menuItems, setMenuItems] = useState<MenuTreeItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // 검색 필터 상태
  const [searchText, setSearchText] = useState("");

  // 저장 확인 알림
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // 현재 펼침 레벨 (0: 모두 접음, -1: 모두 펼침, 1,2,3: 해당 레벨까지)
  const [expandLevel, setExpandLevel] = useState<number>(-1);

  // 접힌 메뉴 코드 Set (트리 토글용)
  const [collapsedMenus, setCollapsedMenus] = useState<Set<string>>(new Set());

  // Grid ref
  const gridRef = useRef<AgGridReact>(null);

  /** ============================= API 영역 ============================= */
  const { data: menuListData = [] } = useMenuList();
  const { mutate: saveMutation, isPending: isSaving } = useSaveMenu();

  /** ============================= 데이터 초기화 ============================= */
  useEffect(() => {
    if (menuListData.length > 0 && !hasChanges) {
      const treeItems = buildMenuHierarchy(menuListData);
      setMenuItems(treeItems);
    }
  }, [menuListData, hasChanges]);

  /** ============================= 트리 토글 ============================= */
  const handleTreeToggle = useCallback((menuCd: string) => {
    setCollapsedMenus((prev) => {
      const next = new Set(prev);
      if (next.has(menuCd)) {
        next.delete(menuCd);
      } else {
        next.add(menuCd);
      }
      return next;
    });
  }, []);

  /** ============================= 컬럼 정의 ============================= */
  const columnDefs: ColDef<MenuTreeItem>[] = useMemo(
    () => [
      {
        field: "menu_nm",
        headerName: "메뉴명",
        flex: 1,
        cellRenderer: (params: any) => {
          const item = params.data as MenuTreeItem;
          if (!item) return null;

          const hasChildren = (item.childCount || 0) > 0;
          const isExpanded = !collapsedMenus.has(item.menu_cd);

          return (
            <TreeCell>
              <TreeIndent $depth={item.depth} />
              <TreeToggle
                $expanded={isExpanded}
                $hasChildren={hasChildren}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasChildren) {
                    handleTreeToggle(item.menu_cd);
                  }
                }}
              >
                <ChevronRightIcon />
              </TreeToggle>
              <TreeLabel>{item.menu_nm}</TreeLabel>
            </TreeCell>
          );
        },
        cellStyle: (params): CellStyle | undefined =>
          params.data?._isModified
            ? { backgroundColor: "rgba(255, 193, 7, 0.1)" }
            : params.data?._isNew
              ? { backgroundColor: "rgba(46, 196, 160, 0.1)" }
              : undefined,
      },
      {
        field: "menu_cd",
        headerName: "코드",
        width: 100,
        cellStyle: (params): CellStyle | undefined =>
          params.data?._isNew
            ? { backgroundColor: "rgba(46, 196, 160, 0.1)" }
            : undefined,
      },
      {
        field: "url",
        headerName: "URL",
        width: 180,
      },
      {
        field: "use_yn",
        headerName: "사용",
        width: 70,
      },
      {
        field: "sort",
        headerName: "정렬",
        width: 70,
      },
      {
        headerName: "",
        width: 50,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const item = params.data as MenuTreeItem;
          // 하위 메뉴가 있으면 삭제 불가
          if (item?.childCount && item.childCount > 0) return null;
          return (
            <DeleteButton
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item);
              }}
              title="삭제"
            >
              <TrashIcon />
            </DeleteButton>
          );
        },
      },
    ],
    [collapsedMenus, handleTreeToggle]
  );

  /** ============================= 비즈니스 로직 영역 ============================= */

  // 메뉴 행 클릭
  const handleRowClicked = useCallback((event: any) => {
    const data = event.data as MenuTreeItem;
    if (data && !data._isDeleted) {
      setSelectedMenuCd(data.menu_cd);
    }
  }, []);

  // 선택된 메뉴 필드 수정
  const handleDetailFieldChange = useCallback(
    (field: keyof MenuItem, value: string | number | null) => {
      if (!selectedMenuCd) return;

      setMenuItems((prev) =>
        prev.map((item) =>
          item.menu_cd === selectedMenuCd
            ? { ...item, [field]: value, _isModified: !item._isNew }
            : item
        )
      );
      setHasChanges(true);
    },
    [selectedMenuCd]
  );

  // 셀 변경
  const handleCellChanged = useCallback(
    (event: CellValueChangedEvent<MenuTreeItem>) => {
      if (!event.data) return;

      setMenuItems((prev) =>
        prev.map((item) =>
          item.menu_cd === event.data!.menu_cd
            ? { ...event.data!, _isModified: !event.data!._isNew }
            : item
        )
      );
      setHasChanges(true);
    },
    []
  );

  // 메뉴 추가
  const handleAdd = useCallback(() => {
    // 선택된 메뉴가 있으면 그 메뉴의 하위로, 없으면 최상위로 추가
    const parentMenu = menuItems.find((m) => m.menu_cd === selectedMenuCd);
    const upMenuCd = selectedMenuCd || "0";
    const upMenuNm = parentMenu?.menu_nm || "";
    const parentDepth = parentMenu?.depth || 0;
    const isTopLevel = upMenuCd === "0";

    // groupPath 계산: 상위 메뉴의 hierarchy 경로
    const groupPath = isTopLevel
      ? null
      : parentMenu?.hierarchy?.join(" > ") || upMenuNm;

    // 임시 코드 생성
    const tempCode = `NEW_${Date.now()}`;

    const newItem: MenuTreeItem = {
      menu_cd: tempCode,
      menu_nm: "새 메뉴",
      up_menu_cd: isTopLevel ? null : upMenuCd,
      up_menu_nm: upMenuNm,
      url: null,
      icon: null,
      sort: menuItems.length,
      use_yn: "Y",
      rmk: null,
      hierarchy: isTopLevel ? ["새 메뉴"] : [...(parentMenu?.hierarchy || []), "새 메뉴"],
      childCount: 0,
      depth: parentDepth + 1,
      groupPath,
      isTopLevel,
      _isNew: true,
    };

    setMenuItems((prev) => [...prev, newItem]);
    setHasChanges(true);
    setSelectedMenuCd(tempCode);
  }, [selectedMenuCd, menuItems]);

  // 메뉴 삭제 (마킹)
  const handleDelete = useCallback(
    (item: MenuTreeItem) => {
      if (item._isNew) {
        // 신규 항목은 바로 제거
        setMenuItems((prev) => prev.filter((i) => i.menu_cd !== item.menu_cd));
      } else {
        // 기존 항목은 삭제 마킹
        setMenuItems((prev) =>
          prev.map((i) =>
            i.menu_cd === item.menu_cd ? { ...i, _isDeleted: true } : i
          )
        );
      }
      setHasChanges(true);

      // 삭제된 메뉴가 선택되어 있으면 선택 해제
      if (item.menu_cd === selectedMenuCd) {
        setSelectedMenuCd(null);
      }
    },
    [selectedMenuCd]
  );

  // 저장 버튼 클릭
  const handleSave = useCallback(() => {
    if (hasChanges) {
      setShowSaveAlert(true);
    }
  }, [hasChanges]);

  // 저장 확인
  const handleSaveConfirm = useCallback(() => {
    setShowSaveAlert(false);

    // 변경된 항목만 추출 (클라이언트 전용 필드 제거)
    const itemsToSave = menuItems
      .filter((item) => item._isNew || item._isModified || item._isDeleted)
      .map(({ hierarchy, childCount, depth, groupPath, isTopLevel, ...rest }) => rest);

    saveMutation(itemsToSave, {
      onSuccess: () => {
        setHasChanges(false);
      },
    });
  }, [menuItems, saveMutation]);

  // 저장 취소
  const handleSaveCancel = useCallback(() => {
    setShowSaveAlert(false);
  }, []);

  /** ============================= 트리 펼침/접음 (레벨 버튼) ============================= */

  // 특정 레벨까지 펼치기
  const handleExpandToLevel = useCallback(
    (level: number) => {
      setExpandLevel(level);

      if (level === -1) {
        // 모두 펼침
        setCollapsedMenus(new Set());
      } else if (level === 0) {
        // 모두 접음 - 자식이 있는 모든 메뉴를 접음
        const allParents = new Set(
          menuItems
            .filter((item) => (item.childCount || 0) > 0)
            .map((item) => item.menu_cd)
        );
        setCollapsedMenus(allParents);
      } else {
        // 특정 레벨 이상만 접음
        const toCollapse = new Set(
          menuItems
            .filter(
              (item) => (item.childCount || 0) > 0 && item.depth >= level
            )
            .map((item) => item.menu_cd)
        );
        setCollapsedMenus(toCollapse);
      }
    },
    [menuItems]
  );

  /** ============================= 검색 로직 ============================= */
  const handleSearch = useCallback(() => {
    console.log("검색:", searchText);
  }, [searchText]);

  const handleClear = useCallback(() => {
    setSearchText("");
  }, []);

  /** ============================= 표시 데이터 ============================= */
  // 삭제되지 않은 항목만 표시 + 트리 접힘 상태 + 검색 필터 적용
  const displayItems = useMemo(() => {
    let filtered = menuItems.filter((item) => !item._isDeleted);

    // 검색 텍스트가 있을 경우 필터링 (트리 접힘 무시)
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.menu_cd.toLowerCase().includes(searchLower) ||
          item.menu_nm.toLowerCase().includes(searchLower)
      );
      return filtered;
    }

    // 접힌 메뉴의 자식들을 숨김
    const isAncestorCollapsed = (item: MenuTreeItem): boolean => {
      let currentUpCd = item.up_menu_cd;
      while (currentUpCd && currentUpCd !== "0") {
        if (collapsedMenus.has(currentUpCd)) {
          return true;
        }
        const parent = menuItems.find((m) => m.menu_cd === currentUpCd);
        currentUpCd = parent?.up_menu_cd || null;
      }
      return false;
    };

    filtered = filtered.filter((item) => !isAncestorCollapsed(item));

    return filtered;
  }, [menuItems, searchText, collapsedMenus]);

  // 선택된 메뉴 정보
  const selectedMenuItem = useMemo(
    () => menuItems.find((item) => item.menu_cd === selectedMenuCd),
    [menuItems, selectedMenuCd]
  );

  /** ============================= 렌더링 ============================= */
  return (
    <PageTemplate title="메뉴 관리">
      <CommonPageHeader
        title="메뉴 관리"
        onSave={handleSave}
        saveDisabled={!hasChanges || isSaving}
      />

      {/* 검색 필터 */}
      <FilterBar
        rows={[
          {
            items: [
              <IsInputText
                key="searchText"
                size="xSmall"
                position="row"
                label="메뉴명/메뉴코드"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholderText="메뉴명 또는 메뉴코드 검색"
                fullWidth
              />,
            ],
          },
        ]}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {/* 듀얼 그리드 */}
      <DualGridContainer>
        {/* 메뉴 목록 패널 */}
        <GridPanel>
          <TabBar>
            <IsTabItem active size="S" position="single">
              메뉴 목록
            </IsTabItem>
          </TabBar>
          <PanelContainer>
            <PanelHeader>
              <DepthButtonGroup>
                <DepthButton
                  $active={expandLevel === 0}
                  onClick={() => handleExpandToLevel(0)}
                  title="모두 접기"
                >
                  접기
                </DepthButton>
                <DepthButton
                  $active={expandLevel === 1}
                  onClick={() => handleExpandToLevel(1)}
                  title="1단계까지 펼침"
                >
                  1
                </DepthButton>
                <DepthButton
                  $active={expandLevel === 2}
                  onClick={() => handleExpandToLevel(2)}
                  title="2단계까지 펼침"
                >
                  2
                </DepthButton>
                <DepthButton
                  $active={expandLevel === 3}
                  onClick={() => handleExpandToLevel(3)}
                  title="3단계까지 펼침"
                >
                  3
                </DepthButton>
                <DepthButton
                  $active={expandLevel === -1}
                  onClick={() => handleExpandToLevel(-1)}
                  title="모두 펼침"
                >
                  전체
                </DepthButton>
              </DepthButtonGroup>
              <PanelTitle>
                총 <strong>{displayItems.length}</strong>건
              </PanelTitle>
              <PanelActions>
                <AddButton onClick={handleAdd}>
                  <PlusIcon />
                  추가
                </AddButton>
              </PanelActions>
            </PanelHeader>
            <GridContent>
              <Grid
                ref={gridRef}
                rowData={displayItems}
                columnDefs={columnDefs}
                rowHeight={40}
                headerHeight={40}
                height="100%"
                isRadius={false}
                onRowClicked={handleRowClicked}
                onCellValueChanged={handleCellChanged}
                selectionMode="singleRow"
                getRowStyle={(params) => {
                  if (params.data?.menu_cd === selectedMenuCd) {
                    return { background: "rgba(46, 196, 160, 0.15)" };
                  }
                  return undefined;
                }}
              />
            </GridContent>
          </PanelContainer>
        </GridPanel>

        {/* 우측 패널 (상세 정보) */}
        <GridPanel>
          <TabBar>
            <IsTabItem active size="S" position="single">
              상세 정보
            </IsTabItem>
          </TabBar>
          <PanelContainer $activeTab="detail">
            {selectedMenuItem ? (
              <FormTable>
                <FormTable.Column>
                  <FormField label="메뉴코드" isFirst>
                    <IsInputText
                      size="xSmall"
                      value={
                        selectedMenuItem._isNew
                          ? "(자동생성)"
                          : selectedMenuItem.menu_cd
                      }
                      disabled
                      fullWidth
                    />
                  </FormField>
                  <FormField label="메뉴명" required>
                    <IsInputText
                      size="xSmall"
                      value={selectedMenuItem.menu_nm}
                      onChange={(e) =>
                        handleDetailFieldChange("menu_nm", e.target.value)
                      }
                      fullWidth
                    />
                  </FormField>
                  <FormField label="상위메뉴">
                    <IsInputText
                      size="xSmall"
                      value={
                        selectedMenuItem.up_menu_cd
                          ? `${selectedMenuItem.up_menu_nm || ""} (${selectedMenuItem.up_menu_cd})`
                          : "최상위"
                      }
                      disabled
                      fullWidth
                    />
                  </FormField>
                  <FormField label="URL">
                    <IsInputText
                      size="xSmall"
                      value={selectedMenuItem.url || ""}
                      onChange={(e) =>
                        handleDetailFieldChange("url", e.target.value || null)
                      }
                      placeholderText="/path/to/page"
                      fullWidth
                    />
                  </FormField>
                  <FormField label="아이콘">
                    <IsInputText
                      size="xSmall"
                      value={selectedMenuItem.icon || ""}
                      onChange={(e) =>
                        handleDetailFieldChange("icon", e.target.value || null)
                      }
                      placeholderText="아이콘 클래스"
                      fullWidth
                    />
                  </FormField>
                  <FormField label="정렬순서">
                    <IsInputText
                      size="xSmall"
                      type="number"
                      value={String(selectedMenuItem.sort)}
                      onChange={(e) =>
                        handleDetailFieldChange(
                          "sort",
                          parseInt(e.target.value, 10) || 0
                        )
                      }
                      fullWidth
                    />
                  </FormField>
                  <FormField label="사용여부">
                    <IsRadio
                      name="use_yn"
                      value="Y"
                      label="사용"
                      size="small"
                      checked={selectedMenuItem.use_yn === "Y"}
                      onChange={(e) =>
                        handleDetailFieldChange("use_yn", e.target.value)
                      }
                    />
                    <IsRadio
                      name="use_yn"
                      value="N"
                      label="미사용"
                      size="small"
                      checked={selectedMenuItem.use_yn === "N"}
                      onChange={(e) =>
                        handleDetailFieldChange("use_yn", e.target.value)
                      }
                    />
                  </FormField>
                  <FormField label="비고" isLast>
                    <IsInputText
                      size="xSmall"
                      value={selectedMenuItem.rmk || ""}
                      onChange={(e) =>
                        handleDetailFieldChange("rmk", e.target.value || null)
                      }
                      fullWidth
                    />
                  </FormField>
                </FormTable.Column>
              </FormTable>
            ) : (
              <SelectGuideMessage>
                <ChevronRightIcon />
                <span>좌측에서 메뉴를 선택하세요.</span>
              </SelectGuideMessage>
            )}
          </PanelContainer>
        </GridPanel>
      </DualGridContainer>

      {/* 저장 확인 알림 */}
      <Alert
        isOpen={showSaveAlert}
        onClose={handleSaveCancel}
        onConfirm={handleSaveConfirm}
        title="변경사항 저장"
        description="메뉴 변경사항을 저장하시겠습니까?"
        cancelText="취소"
        confirmText="저장"
      />
    </PageTemplate>
  );
}
