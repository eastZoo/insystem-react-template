/**
 * 그룹권한 관리 페이지
 *
 * 좌측: 그룹 목록
 * 우측: 그룹 정보 / 접근가능 메뉴 (탭)
 */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { ColDef, CellStyle } from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { IsInputText, IsRadio, IsCheckbox, IsTabItem } from "insystem-atoms";
import Grid from "@/components/atoms/Grid";
import { PlusIcon, TrashIcon, ChevronRightIcon } from "@/styles/icons";
import { Alert } from "@/components/atoms/Alert";
import { FilterBar } from "@/components/atoms/FilterBar";
import {
  useGroupList,
  useSaveGroup,
  useGroupMenuAuthList,
  useSaveGroupMenuAuth,
  buildMenuAuthHierarchy,
  type GroupItem,
  type MenuAuthTreeItem,
} from "@/lib/hooks/useGroupAuth";
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
  CheckboxCell,
} from "./index.style";

/** 탭 타입 */
type RightTabType = "info" | "menu";

/** 체크박스 셀 렌더러 Props */
interface CheckboxCellRendererProps {
  data: MenuAuthTreeItem;
  field: "sel_auth_yn" | "save_auth_yn";
  hasMenuChangesRef: React.MutableRefObject<boolean>;
}

/** 체크박스 셀 렌더러 컴포넌트 (개별 셀만 리렌더링) */
function CheckboxCellRenderer({
  data,
  field,
  hasMenuChangesRef,
}: CheckboxCellRendererProps) {
  const [checked, setChecked] = useState(data[field] === "Y");

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.checked;
      setChecked(newValue);
      // Grid 데이터 직접 수정
      data[field] = newValue ? "Y" : "N";
      data._isModified = true;
      hasMenuChangesRef.current = true;
    },
    [data, field, hasMenuChangesRef]
  );

  return (
    <CheckboxCell>
      <IsCheckbox size="small" checked={checked} onChange={handleChange} />
    </CheckboxCell>
  );
}

/**
 * 그룹권한 관리 페이지 컴포넌트
 */
export default function GroupAuthManagementPage() {
  /** ============================= state 영역 ============================= */
  const [selectedAuthCd, setSelectedAuthCd] = useState<string | null>(null);
  const [groupItems, setGroupItems] = useState<GroupItem[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // 우측 탭 상태
  const [activeRightTab, setActiveRightTab] = useState<RightTabType>("info");

  // 검색 필터 상태
  const [searchText, setSearchText] = useState("");

  // 저장 확인 알림
  const [showSaveAlert, setShowSaveAlert] = useState(false);

  // 메뉴 권한 상태 (초기 데이터 저장용)
  const [menuAuthItems, setMenuAuthItems] = useState<MenuAuthTreeItem[]>([]);
  // 메뉴 변경 여부 (ref로 관리하여 리렌더링 방지)
  const hasMenuChangesRef = useRef(false);

  // 트리 접힘 상태
  const [collapsedMenus, setCollapsedMenus] = useState<Set<string>>(new Set());
  const [expandLevel, setExpandLevel] = useState<number>(-1);

  // Grid ref
  const gridRef = useRef<AgGridReact>(null);
  const menuGridRef = useRef<AgGridReact>(null);

  /** ============================= API 영역 ============================= */
  const { data: groupListData = [] } = useGroupList();
  const { mutate: saveGroupMutation, isPending: isSaving } = useSaveGroup();
  const { data: menuAuthData = [] } = useGroupMenuAuthList(selectedAuthCd);
  const { mutate: saveMenuAuthMutation, isPending: isSavingMenu } =
    useSaveGroupMenuAuth();

  /** ============================= 데이터 초기화 ============================= */
  useEffect(() => {
    if (groupListData.length > 0 && !hasChanges) {
      setGroupItems(groupListData);
    }
  }, [groupListData, hasChanges]);

  // 메뉴 권한 데이터 초기화
  useEffect(() => {
    if (menuAuthData.length > 0 && !hasMenuChangesRef.current) {
      const treeItems = buildMenuAuthHierarchy(menuAuthData);
      setMenuAuthItems(treeItems);
    }
  }, [menuAuthData]);

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

  /** ============================= 그룹 컬럼 정의 ============================= */
  const groupColumnDefs: ColDef<GroupItem>[] = useMemo(
    () => [
      {
        field: "auth_nm",
        headerName: "그룹명",
        flex: 1,
        cellStyle: (params): CellStyle | undefined =>
          params.data?._isModified
            ? { backgroundColor: "rgba(255, 193, 7, 0.1)" }
            : params.data?._isNew
              ? { backgroundColor: "rgba(46, 196, 160, 0.1)" }
              : undefined,
      },
      {
        field: "auth_cd",
        headerName: "그룹코드",
        width: 120,
        cellStyle: (params): CellStyle | undefined =>
          params.data?._isNew
            ? { backgroundColor: "rgba(46, 196, 160, 0.1)" }
            : undefined,
      },
      {
        field: "user_type_cd",
        headerName: "사용자분류",
        width: 100,
      },
      {
        field: "use_yn",
        headerName: "사용",
        width: 60,
      },
      {
        headerName: "",
        width: 50,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const item = params.data as GroupItem;
          return (
            <DeleteButton
              onClick={(e) => {
                e.stopPropagation();
                handleGroupDelete(item);
              }}
              title="삭제"
            >
              <TrashIcon />
            </DeleteButton>
          );
        },
      },
    ],
    []
  );

  /** ============================= 메뉴 권한 컬럼 정의 ============================= */
  const menuAuthColumnDefs: ColDef<MenuAuthTreeItem>[] = useMemo(
    () => [
      {
        field: "menu_nm",
        headerName: "메뉴명",
        flex: 1,
        cellRenderer: (params: any) => {
          const item = params.data as MenuAuthTreeItem;
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
            : undefined,
      },
      {
        field: "menu_cd",
        headerName: "메뉴코드",
        width: 100,
      },
      {
        field: "sel_auth_yn",
        headerName: "조회",
        width: 70,
        cellRenderer: (params: any) => {
          const item = params.data as MenuAuthTreeItem;
          if (!item) return null;
          return (
            <CheckboxCellRenderer
              data={item}
              field="sel_auth_yn"
              hasMenuChangesRef={hasMenuChangesRef}
            />
          );
        },
      },
      {
        field: "save_auth_yn",
        headerName: "변경",
        width: 70,
        cellRenderer: (params: any) => {
          const item = params.data as MenuAuthTreeItem;
          if (!item) return null;
          return (
            <CheckboxCellRenderer
              data={item}
              field="save_auth_yn"
              hasMenuChangesRef={hasMenuChangesRef}
            />
          );
        },
      },
    ],
    [collapsedMenus, handleTreeToggle]
  );

  /** ============================= 비즈니스 로직 영역 ============================= */

  // 그룹 행 클릭
  const handleGroupRowClicked = useCallback((event: any) => {
    const data = event.data as GroupItem;
    if (data && !data._isDeleted) {
      setSelectedAuthCd(data.auth_cd);
      hasMenuChangesRef.current = false; // 메뉴 변경사항 초기화
    }
  }, []);

  // 선택된 그룹 필드 수정
  const handleDetailFieldChange = useCallback(
    (field: keyof GroupItem, value: string | null) => {
      if (!selectedAuthCd) return;

      setGroupItems((prev) =>
        prev.map((item) =>
          item.auth_cd === selectedAuthCd
            ? { ...item, [field]: value, _isModified: !item._isNew }
            : item
        )
      );
      setHasChanges(true);
    },
    [selectedAuthCd]
  );

  // 그룹 추가
  const handleGroupAdd = useCallback(() => {
    const tempCode = `NEW_${Date.now()}`;

    const newItem: GroupItem = {
      auth_cd: tempCode,
      auth_nm: "새 그룹",
      user_type_cd: null,
      use_yn: "Y",
      _isNew: true,
    };

    setGroupItems((prev) => [...prev, newItem]);
    setHasChanges(true);
    setSelectedAuthCd(tempCode);
  }, []);

  // 그룹 삭제 (마킹)
  const handleGroupDelete = useCallback(
    (item: GroupItem) => {
      if (item._isNew) {
        setGroupItems((prev) => prev.filter((i) => i.auth_cd !== item.auth_cd));
      } else {
        setGroupItems((prev) =>
          prev.map((i) =>
            i.auth_cd === item.auth_cd ? { ...i, _isDeleted: true } : i
          )
        );
      }
      setHasChanges(true);

      if (item.auth_cd === selectedAuthCd) {
        setSelectedAuthCd(null);
      }
    },
    [selectedAuthCd]
  );

  // 저장 버튼 클릭
  const handleSave = useCallback(() => {
    if (hasChanges || hasMenuChangesRef.current) {
      setShowSaveAlert(true);
    }
  }, [hasChanges]);

  // 저장 확인
  const handleSaveConfirm = useCallback(() => {
    setShowSaveAlert(false);

    // 그룹 변경사항 저장
    if (hasChanges) {
      const itemsToSave = groupItems.filter(
        (item) => item._isNew || item._isModified || item._isDeleted
      );
      saveGroupMutation(itemsToSave, {
        onSuccess: () => {
          setHasChanges(false);
        },
      });
    }

    // 메뉴 권한 변경사항 저장 (Grid API로 데이터 추출)
    if (
      hasMenuChangesRef.current &&
      selectedAuthCd &&
      menuGridRef.current?.api
    ) {
      const menuItemsToSave: Array<{
        menu_cd: string;
        sel_auth_yn: string;
        save_auth_yn: string;
      }> = [];

      menuGridRef.current.api.forEachNode((node) => {
        const item = node.data as MenuAuthTreeItem;
        if (item?._isModified) {
          menuItemsToSave.push({
            menu_cd: item.menu_cd,
            sel_auth_yn: item.sel_auth_yn,
            save_auth_yn: item.save_auth_yn,
          });
        }
      });

      if (menuItemsToSave.length > 0) {
        saveMenuAuthMutation(
          { authCd: selectedAuthCd, items: menuItemsToSave },
          {
            onSuccess: () => {
              hasMenuChangesRef.current = false;
              // _isModified 플래그 초기화
              menuGridRef.current?.api?.forEachNode((node) => {
                if (node.data?._isModified) {
                  node.data._isModified = false;
                }
              });
            },
          }
        );
      }
    }
  }, [
    groupItems,
    selectedAuthCd,
    hasChanges,
    saveGroupMutation,
    saveMenuAuthMutation,
  ]);

  // 저장 취소
  const handleSaveCancel = useCallback(() => {
    setShowSaveAlert(false);
  }, []);

  /** ============================= 트리 펼침/접음 (레벨 버튼) ============================= */

  const handleExpandToLevel = useCallback(
    (level: number) => {
      setExpandLevel(level);

      if (level === -1) {
        setCollapsedMenus(new Set());
      } else if (level === 0) {
        const allParents = new Set(
          menuAuthItems
            .filter((item) => (item.childCount || 0) > 0)
            .map((item) => item.menu_cd)
        );
        setCollapsedMenus(allParents);
      } else {
        const toCollapse = new Set(
          menuAuthItems
            .filter((item) => (item.childCount || 0) > 0 && item.depth >= level)
            .map((item) => item.menu_cd)
        );
        setCollapsedMenus(toCollapse);
      }
    },
    [menuAuthItems]
  );

  /** ============================= 검색 로직 ============================= */
  const handleSearch = useCallback(() => {
    console.log("검색:", searchText);
  }, [searchText]);

  const handleClear = useCallback(() => {
    setSearchText("");
  }, []);

  /** ============================= 표시 데이터 ============================= */
  // 삭제되지 않은 그룹 + 검색 필터
  const displayGroupItems = useMemo(() => {
    let filtered = groupItems.filter((item) => !item._isDeleted);

    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.auth_cd.toLowerCase().includes(searchLower) ||
          item.auth_nm.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [groupItems, searchText]);

  // 메뉴 권한 표시 데이터 (접힘 상태 반영)
  const displayMenuAuthItems = useMemo(() => {
    const isAncestorCollapsed = (item: MenuAuthTreeItem): boolean => {
      let currentUpCd = item.up_menu_cd;
      while (currentUpCd && currentUpCd !== "0") {
        if (collapsedMenus.has(currentUpCd)) {
          return true;
        }
        const parent = menuAuthItems.find((m) => m.menu_cd === currentUpCd);
        currentUpCd = parent?.up_menu_cd || null;
      }
      return false;
    };

    return menuAuthItems.filter((item) => !isAncestorCollapsed(item));
  }, [menuAuthItems, collapsedMenus]);

  // 선택된 그룹 정보
  const selectedGroup = useMemo(
    () => groupItems.find((item) => item.auth_cd === selectedAuthCd),
    [groupItems, selectedAuthCd]
  );

  /** ============================= 렌더링 ============================= */
  return (
    <PageTemplate title="그룹권한 관리">
      <CommonPageHeader
        title="그룹권한 관리"
        onSave={handleSave}
        saveDisabled={isSaving || isSavingMenu}
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
                label="그룹명"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholderText="그룹명 검색"
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
        {/* 그룹 목록 패널 */}
        <GridPanel>
          <TabBar>
            <IsTabItem active size="S" position="single">
              그룹 목록
            </IsTabItem>
          </TabBar>
          <PanelContainer>
            <PanelHeader>
              <PanelTitle>
                총 <strong>{displayGroupItems.length}</strong>건
              </PanelTitle>
              <PanelActions>
                <AddButton onClick={handleGroupAdd}>
                  <PlusIcon />
                  추가
                </AddButton>
              </PanelActions>
            </PanelHeader>
            <GridContent>
              <Grid
                ref={gridRef}
                rowData={displayGroupItems}
                columnDefs={groupColumnDefs}
                rowHeight={40}
                headerHeight={40}
                height="100%"
                isRadius={false}
                onRowClicked={handleGroupRowClicked}
                selectionMode="singleRow"
                getRowStyle={(params) => {
                  if (params.data?.auth_cd === selectedAuthCd) {
                    return { background: "rgba(46, 196, 160, 0.15)" };
                  }
                  return undefined;
                }}
              />
            </GridContent>
          </PanelContainer>
        </GridPanel>

        {/* 우측 패널 (그룹 정보 / 접근가능 메뉴) */}
        <GridPanel>
          <TabBar>
            <IsTabItem
              active={activeRightTab === "info"}
              size="S"
              position="start"
              onClick={() => setActiveRightTab("info")}
            >
              그룹 정보
            </IsTabItem>
            <IsTabItem
              active={activeRightTab === "menu"}
              size="S"
              position="end"
              onClick={() => setActiveRightTab("menu")}
            >
              접근가능 메뉴
            </IsTabItem>
          </TabBar>
          <PanelContainer
            $tabCount={2}
            $activeTabIndex={activeRightTab === "info" ? 0 : 1}
          >
            {selectedGroup ? (
              activeRightTab === "info" ? (
                /* 그룹 정보 탭 */
                <FormTable>
                  <FormTable.Column>
                    <FormField label="그룹코드" isFirst>
                      <IsInputText
                        size="xSmall"
                        value={
                          selectedGroup._isNew
                            ? "(자동생성)"
                            : selectedGroup.auth_cd
                        }
                        disabled
                        fullWidth
                      />
                    </FormField>
                    <FormField label="그룹명" required>
                      <IsInputText
                        size="xSmall"
                        value={selectedGroup.auth_nm}
                        onChange={(e) =>
                          handleDetailFieldChange("auth_nm", e.target.value)
                        }
                        fullWidth
                      />
                    </FormField>
                    <FormField label="사용자분류">
                      <IsInputText
                        size="xSmall"
                        value={selectedGroup.user_type_cd || ""}
                        onChange={(e) =>
                          handleDetailFieldChange(
                            "user_type_cd",
                            e.target.value || null
                          )
                        }
                        fullWidth
                      />
                    </FormField>
                    <FormField label="사용여부" isLast>
                      <IsRadio
                        name="use_yn"
                        value="Y"
                        label="사용"
                        size="small"
                        checked={selectedGroup.use_yn === "Y"}
                        onChange={(e) =>
                          handleDetailFieldChange("use_yn", e.target.value)
                        }
                      />
                      <IsRadio
                        name="use_yn"
                        value="N"
                        label="미사용"
                        size="small"
                        checked={selectedGroup.use_yn === "N"}
                        onChange={(e) =>
                          handleDetailFieldChange("use_yn", e.target.value)
                        }
                      />
                    </FormField>
                  </FormTable.Column>
                </FormTable>
              ) : (
                /* 접근가능 메뉴 탭 */
                <>
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
                      총 <strong>{displayMenuAuthItems.length}</strong>건
                    </PanelTitle>
                  </PanelHeader>
                  <GridContent>
                    <Grid
                      ref={menuGridRef}
                      rowData={displayMenuAuthItems}
                      columnDefs={menuAuthColumnDefs}
                      rowHeight={40}
                      headerHeight={40}
                      height="100%"
                      isRadius={false}
                      selectionMode="singleRow"
                    />
                  </GridContent>
                </>
              )
            ) : (
              <SelectGuideMessage>
                <ChevronRightIcon />
                <span>좌측에서 그룹을 선택하세요.</span>
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
        description="변경사항을 저장하시겠습니까?"
        cancelText="취소"
        confirmText="저장"
      />
    </PageTemplate>
  );
}
