/**
 * 공통 코드 관리 페이지
 *
 * 좌측: 메인 코드 (sya_code_main)
 * 우측: 상세 정보 / 서브 코드 (sya_code_sub) - 좌측 선택 시 표시
 */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type {
  ColDef,
  CellValueChangedEvent,
  CellStyle,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { IsInputText, IsSelect } from "insystem-atoms";
import Grid from "@/components/atoms/Grid";
import { PlusIcon, TrashIcon, ChevronRightIcon } from "@/styles/icons";
import { Alert } from "@/components/atoms/Alert";
import { FilterBar } from "@/components/atoms/FilterBar";
import {
  useCodeMainList,
  useCodeSubList,
  useSaveCodeMain,
  useSaveCodeSub,
  type CodeMainItem,
  type CodeSubItem,
} from "@/lib/hooks/useComCode";
import { PageTemplate } from "@/components/template/PageTemplate";
import { PageHeader as CommonPageHeader } from "@/components/atoms/PageHeader";
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
  FormTable,
  FormTableColumn,
  FormTableRow,
  FormTableLabel,
  FormTableCell,
  TabBar,
  TabItem,
  PanelContainer,
} from "./index.style";

/**
 * 공통 코드 관리 페이지 컴포넌트
 */
export default function ComCodeManagementPage() {
  /** ============================= state 영역 ============================= */
  const [selectedMainCd, setSelectedMainCd] = useState<string | null>(null);
  const [mainItems, setMainItems] = useState<CodeMainItem[]>([]);
  const [subItems, setSubItems] = useState<CodeSubItem[]>([]);
  const [hasMainChanges, setHasMainChanges] = useState(false);
  const [hasSubChanges, setHasSubChanges] = useState(false);

  // 검색 필터 상태
  const [searchText, setSearchText] = useState("");

  // 탭 상태
  const [rightActiveTab, setRightActiveTab] = useState("detail");

  // 저장 확인 알림
  const [showSaveAlert, setShowSaveAlert] = useState(false);
  const [saveTarget, setSaveTarget] = useState<"main" | "sub" | null>(null);

  // Grid refs
  const mainGridRef = useRef<AgGridReact>(null);
  const subGridRef = useRef<AgGridReact>(null);

  /** ============================= API 영역 ============================= */
  const { data: mainListData = [] } = useCodeMainList();
  const { data: subListData = [] } = useCodeSubList(selectedMainCd);
  const { mutate: saveMainMutation, isPending: isSavingMain } =
    useSaveCodeMain();
  const { mutate: saveSubMutation, isPending: isSavingSub } = useSaveCodeSub();

  /** ============================= 데이터 초기화 ============================= */
  // 메인 코드 데이터 초기화
  useEffect(() => {
    if (mainListData.length > 0 && !hasMainChanges) {
      setMainItems(mainListData.map((item) => ({ ...item })));
    }
  }, [mainListData, hasMainChanges]);

  // 서브 코드 데이터 초기화
  useEffect(() => {
    if (!hasSubChanges) {
      setSubItems(subListData.map((item) => ({ ...item })));
    }
  }, [subListData, hasSubChanges]);

  // 메인 코드 선택 변경 시 서브 변경사항 초기화
  useEffect(() => {
    setHasSubChanges(false);
  }, [selectedMainCd]);

  /** ============================= 컬럼 정의 ============================= */
  // 메인 코드 컬럼
  const mainColumnDefs: ColDef<CodeMainItem>[] = useMemo(
    () => [
      {
        field: "main_cd",
        headerName: "코드",
        width: 80,
        editable: (params) => !!params.data?._isNew,
        cellStyle: (params): CellStyle | undefined =>
          params.data?._isNew
            ? { backgroundColor: "rgba(46, 196, 160, 0.1)" }
            : undefined,
      },
      {
        field: "main_nm",
        headerName: "코드명",
        flex: 1,
        editable: true,
        cellStyle: (params): CellStyle | undefined =>
          params.data?._isModified
            ? { backgroundColor: "rgba(255, 193, 7, 0.1)" }
            : params.data?._isNew
              ? { backgroundColor: "rgba(46, 196, 160, 0.1)" }
              : undefined,
      },
      {
        field: "use_yn",
        headerName: "사용",
        width: 70,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Y", "N"] },
      },
      {
        field: "sort",
        headerName: "정렬",
        width: 70,
        editable: true,
        cellEditor: "agNumberCellEditor",
      },
      {
        headerName: "",
        width: 50,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const item = params.data as CodeMainItem;
          // 시스템 코드는 삭제 불가
          if (item?.sys_yn === "Y") return null;
          return (
            <DeleteButton
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteMain(item);
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

  // 서브 코드 컬럼
  const subColumnDefs: ColDef<CodeSubItem>[] = useMemo(
    () => [
      {
        field: "sub_cd",
        headerName: "서브코드",
        width: 100,
        editable: (params) => !!params.data?._isNew,
        cellStyle: (params): CellStyle | undefined =>
          params.data?._isNew
            ? { backgroundColor: "rgba(46, 196, 160, 0.1)" }
            : undefined,
      },
      {
        field: "sub_nm",
        headerName: "코드명",
        flex: 1,
        editable: true,
        cellStyle: (params): CellStyle | undefined =>
          params.data?._isModified
            ? { backgroundColor: "rgba(255, 193, 7, 0.1)" }
            : params.data?._isNew
              ? { backgroundColor: "rgba(46, 196, 160, 0.1)" }
              : undefined,
      },
      {
        field: "code",
        headerName: "풀코드",
        width: 120,
        editable: false,
      },
      {
        field: "use_yn",
        headerName: "사용",
        width: 70,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Y", "N"] },
      },
      {
        field: "sort",
        headerName: "정렬",
        width: 70,
        editable: true,
        cellEditor: "agNumberCellEditor",
      },
      {
        headerName: "",
        width: 50,
        sortable: false,
        filter: false,
        cellRenderer: (params: any) => {
          const item = params.data as CodeSubItem;
          // 시스템 코드는 삭제 불가
          if (item?.sys_yn === "Y") return null;
          return (
            <DeleteButton
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSub(item);
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

  /** ============================= 비즈니스 로직 영역 ============================= */

  // 메인 코드 행 클릭
  const handleMainRowClicked = useCallback((event: any) => {
    const data = event.data as CodeMainItem;
    if (data && !data._isDeleted) {
      setSelectedMainCd(data.main_cd);
    }
  }, []);

  // 선택된 메인 코드 필드 수정
  const handleDetailFieldChange = useCallback(
    (field: keyof CodeMainItem, value: string | number | null) => {
      if (!selectedMainCd) return;

      setMainItems((prev) =>
        prev.map((item) =>
          item.main_cd === selectedMainCd
            ? { ...item, [field]: value, _isModified: !item._isNew }
            : item
        )
      );
      setHasMainChanges(true);
    },
    [selectedMainCd]
  );

  // 메인 코드 셀 변경
  const handleMainCellChanged = useCallback(
    (event: CellValueChangedEvent<CodeMainItem>) => {
      if (!event.data) return;

      setMainItems((prev) =>
        prev.map((item) =>
          item.main_cd === event.data!.main_cd
            ? { ...event.data!, _isModified: !event.data!._isNew }
            : item
        )
      );
      setHasMainChanges(true);
    },
    []
  );

  // 서브 코드 셀 변경
  const handleSubCellChanged = useCallback(
    (event: CellValueChangedEvent<CodeSubItem>) => {
      if (!event.data) return;

      setSubItems((prev) =>
        prev.map((item) =>
          item.main_cd === event.data!.main_cd &&
          item.sub_cd === event.data!.sub_cd
            ? { ...event.data!, _isModified: !event.data!._isNew }
            : item
        )
      );
      setHasSubChanges(true);
    },
    []
  );

  // 메인 코드 추가
  const handleAddMain = useCallback(() => {
    const newItem: CodeMainItem = {
      main_cd: "",
      main_nm: "",
      sys_yn: "N",
      use_yn: "Y",
      mng_cd1: null,
      mng_cd2: null,
      sort: mainItems.length,
      _isNew: true,
    };
    setMainItems((prev) => [...prev, newItem]);
    setHasMainChanges(true);

    // 새 행으로 스크롤 및 포커스
    setTimeout(() => {
      const api = mainGridRef.current?.api;
      if (api) {
        const lastIndex = mainItems.length;
        api.ensureIndexVisible(lastIndex);
        api.setFocusedCell(lastIndex, "main_cd");
        api.startEditingCell({ rowIndex: lastIndex, colKey: "main_cd" });
      }
    }, 100);
  }, [mainItems.length]);

  // 서브 코드 추가
  const handleAddSub = useCallback(() => {
    if (!selectedMainCd) return;

    // 다음 서브코드 자동 생성
    const maxSubCd = subItems
      .filter((item) => !item._isDeleted)
      .reduce((max, item) => {
        const num = parseInt(item.sub_cd, 10);
        return num > max ? num : max;
      }, 0);
    const nextSubCd = (maxSubCd + 1).toString().padStart(6, "0");

    const newItem: CodeSubItem = {
      main_cd: selectedMainCd,
      sub_cd: nextSubCd,
      sub_nm: "",
      code: selectedMainCd + nextSubCd,
      sys_yn: "N",
      use_yn: "Y",
      mng_cd1: null,
      mng_cd2: null,
      sort: subItems.length,
      _isNew: true,
    };
    setSubItems((prev) => [...prev, newItem]);
    setHasSubChanges(true);

    // 새 행으로 스크롤 및 포커스
    setTimeout(() => {
      const api = subGridRef.current?.api;
      if (api) {
        const lastIndex = subItems.length;
        api.ensureIndexVisible(lastIndex);
        api.setFocusedCell(lastIndex, "sub_nm");
        api.startEditingCell({ rowIndex: lastIndex, colKey: "sub_nm" });
      }
    }, 100);
  }, [selectedMainCd, subItems]);

  // 메인 코드 삭제 (마킹)
  const handleDeleteMain = useCallback(
    (item: CodeMainItem) => {
      if (item._isNew) {
        // 신규 항목은 바로 제거
        setMainItems((prev) => prev.filter((i) => i.main_cd !== item.main_cd));
      } else {
        // 기존 항목은 삭제 마킹
        setMainItems((prev) =>
          prev.map((i) =>
            i.main_cd === item.main_cd ? { ...i, _isDeleted: true } : i
          )
        );
      }
      setHasMainChanges(true);

      // 삭제된 메인이 선택되어 있으면 선택 해제
      if (item.main_cd === selectedMainCd) {
        setSelectedMainCd(null);
      }
    },
    [selectedMainCd]
  );

  // 서브 코드 삭제 (마킹)
  const handleDeleteSub = useCallback((item: CodeSubItem) => {
    if (item._isNew) {
      // 신규 항목은 바로 제거
      setSubItems((prev) =>
        prev.filter(
          (i) => !(i.main_cd === item.main_cd && i.sub_cd === item.sub_cd)
        )
      );
    } else {
      // 기존 항목은 삭제 마킹
      setSubItems((prev) =>
        prev.map((i) =>
          i.main_cd === item.main_cd && i.sub_cd === item.sub_cd
            ? { ...i, _isDeleted: true }
            : i
        )
      );
    }
    setHasSubChanges(true);
  }, []);

  // 저장 버튼 클릭
  const handleSave = useCallback(() => {
    if (hasMainChanges && hasSubChanges) {
      // 둘 다 변경된 경우 메인 먼저 저장
      setSaveTarget("main");
      setShowSaveAlert(true);
    } else if (hasMainChanges) {
      setSaveTarget("main");
      setShowSaveAlert(true);
    } else if (hasSubChanges) {
      setSaveTarget("sub");
      setShowSaveAlert(true);
    }
  }, [hasMainChanges, hasSubChanges]);

  // 저장 확인
  const handleSaveConfirm = useCallback(() => {
    setShowSaveAlert(false);

    if (saveTarget === "main") {
      // 삭제되지 않은 항목과 삭제 마킹된 항목 모두 전송
      const itemsToSave = mainItems.filter(
        (item) => item._isNew || item._isModified || item._isDeleted
      );

      saveMainMutation(itemsToSave, {
        onSuccess: () => {
          setHasMainChanges(false);
          // 서브 코드도 변경되었으면 이어서 저장
          if (hasSubChanges && selectedMainCd) {
            setSaveTarget("sub");
            setShowSaveAlert(true);
          }
        },
      });
    } else if (saveTarget === "sub" && selectedMainCd) {
      // 삭제되지 않은 항목과 삭제 마킹된 항목 모두 전송
      const itemsToSave = subItems.filter(
        (item) => item._isNew || item._isModified || item._isDeleted
      );

      saveSubMutation(
        { mainCd: selectedMainCd, items: itemsToSave },
        {
          onSuccess: () => {
            setHasSubChanges(false);
          },
        }
      );
    }
  }, [
    saveTarget,
    mainItems,
    subItems,
    selectedMainCd,
    hasSubChanges,
    saveMainMutation,
    saveSubMutation,
  ]);

  // 저장 취소
  const handleSaveCancel = useCallback(() => {
    setShowSaveAlert(false);
    setSaveTarget(null);
  }, []);

  /** ============================= 검색 로직 ============================= */
  const handleSearch = useCallback(() => {
    // 검색 로직 - 클라이언트 사이드 필터링
    console.log("검색:", searchText);
  }, [searchText]);

  const handleClear = useCallback(() => {
    setSearchText("");
  }, []);

  /** ============================= 표시 데이터 ============================= */
  // 삭제되지 않은 항목만 표시 + 검색 필터 적용
  const displayMainItems = useMemo(() => {
    let filtered = mainItems.filter((item) => !item._isDeleted);

    // 검색 텍스트가 있을 경우 필터링
    if (searchText.trim()) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.main_cd.toLowerCase().includes(searchLower) ||
          item.main_nm.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [mainItems, searchText]);

  const displaySubItems = useMemo(
    () => subItems.filter((item) => !item._isDeleted),
    [subItems]
  );

  // 선택된 메인 코드 정보
  const selectedMainItem = useMemo(
    () => mainItems.find((item) => item.main_cd === selectedMainCd),
    [mainItems, selectedMainCd]
  );

  /** ============================= 렌더링 ============================= */
  return (
    <PageTemplate title="공통 코드 관리">
      <CommonPageHeader
        title="공통 코드 관리"
        onSave={handleSave}
        saveDisabled={
          (!hasMainChanges && !hasSubChanges) || isSavingMain || isSavingSub
        }
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
                label="코드명/공통코드"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholderText="코드명 또는 공통코드 검색"
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
            {/* 메인 코드 패널 (코드 목록) */}
            <GridPanel>
              <TabBar>
                <TabItem $active $position="single">
                  코드 목록
                </TabItem>
              </TabBar>
              <PanelContainer>
                <PanelHeader>
                  <PanelTitle>
                    총 <strong>{displayMainItems.length}</strong>건
                  </PanelTitle>
                  <PanelActions>
                    <AddButton onClick={handleAddMain}>
                      <PlusIcon />
                      추가
                    </AddButton>
                  </PanelActions>
                </PanelHeader>
                <GridContent>
                  <Grid
                    ref={mainGridRef}
                    rowData={displayMainItems}
                    columnDefs={mainColumnDefs}
                    rowHeight={40}
                    headerHeight={40}
                    height="100%"
                    isRadius={false}
                    onRowClicked={handleMainRowClicked}
                    onCellValueChanged={handleMainCellChanged}
                    selectionMode="singleRow"
                    getRowStyle={(params) => {
                      if (params.data?.main_cd === selectedMainCd) {
                        return { background: "rgba(46, 196, 160, 0.15)" };
                      }
                      return undefined;
                    }}
                  />
                </GridContent>
              </PanelContainer>
            </GridPanel>

            {/* 우측 패널 (상세 정보 / 하위코드 관리) */}
            <GridPanel>
              <TabBar>
                <TabItem
                  $active={rightActiveTab === "detail"}
                  $position="start"
                  onClick={() => setRightActiveTab("detail")}
                >
                  상세 정보
                </TabItem>
                <TabItem
                  $active={rightActiveTab === "subCode"}
                  $position="end"
                  onClick={() => setRightActiveTab("subCode")}
                >
                  하위코드 관리
                </TabItem>
              </TabBar>
              <PanelContainer $activeTab={rightActiveTab}>
                {/* 상세 정보 탭 */}
                {rightActiveTab === "detail" && (
                  <>
                    {selectedMainItem ? (
                      <FormTable>
                        <FormTableColumn>
                          <FormTableRow $isFirst>
                            <FormTableLabel>코드</FormTableLabel>
                            <FormTableCell>
                              <IsInputText
                                size="xSmall"
                                value={selectedMainItem.main_cd}
                                disabled
                                fullWidth
                              />
                            </FormTableCell>
                          </FormTableRow>
                          <FormTableRow>
                            <FormTableLabel $required>코드명</FormTableLabel>
                            <FormTableCell>
                              <IsInputText
                                size="xSmall"
                                value={selectedMainItem.main_nm}
                                onChange={(e) =>
                                  handleDetailFieldChange(
                                    "main_nm",
                                    e.target.value
                                  )
                                }
                                disabled={selectedMainItem.sys_yn === "Y"}
                                fullWidth
                              />
                            </FormTableCell>
                          </FormTableRow>
                          <FormTableRow>
                            <FormTableLabel>시스템코드</FormTableLabel>
                            <FormTableCell>
                              <IsSelect
                                size="xSmall"
                                value={selectedMainItem.sys_yn}
                                onChange={(val) =>
                                  handleDetailFieldChange(
                                    "sys_yn",
                                    val as string
                                  )
                                }
                                options={[
                                  { label: "예", value: "Y" },
                                  { label: "아니오", value: "N" },
                                ]}
                                fullWidth
                                disabled
                              />
                            </FormTableCell>
                          </FormTableRow>
                          <FormTableRow $isLast>
                            <FormTableLabel>사용여부</FormTableLabel>
                            <FormTableCell>
                              <IsSelect
                                size="xSmall"
                                value={selectedMainItem.use_yn}
                                onChange={(val) =>
                                  handleDetailFieldChange(
                                    "use_yn",
                                    val as string
                                  )
                                }
                                options={[
                                  { label: "사용", value: "Y" },
                                  { label: "미사용", value: "N" },
                                ]}
                                fullWidth
                                disabled={selectedMainItem.sys_yn === "Y"}
                              />
                            </FormTableCell>
                          </FormTableRow>
                        </FormTableColumn>
                        <FormTableColumn>
                          <FormTableRow $isFirst>
                            <FormTableLabel>관리코드1</FormTableLabel>
                            <FormTableCell>
                              <IsInputText
                                size="xSmall"
                                value={selectedMainItem.mng_cd1 || ""}
                                onChange={(e) =>
                                  handleDetailFieldChange(
                                    "mng_cd1",
                                    e.target.value || null
                                  )
                                }
                                disabled={selectedMainItem.sys_yn === "Y"}
                                fullWidth
                              />
                            </FormTableCell>
                          </FormTableRow>
                          <FormTableRow>
                            <FormTableLabel>관리코드2</FormTableLabel>
                            <FormTableCell>
                              <IsInputText
                                size="xSmall"
                                value={selectedMainItem.mng_cd2 || ""}
                                onChange={(e) =>
                                  handleDetailFieldChange(
                                    "mng_cd2",
                                    e.target.value || null
                                  )
                                }
                                disabled={selectedMainItem.sys_yn === "Y"}
                                fullWidth
                              />
                            </FormTableCell>
                          </FormTableRow>
                          <FormTableRow $isLast>
                            <FormTableLabel>정렬순서</FormTableLabel>
                            <FormTableCell>
                              <IsInputText
                                size="xSmall"
                                type="number"
                                value={String(selectedMainItem.sort)}
                                onChange={(e) =>
                                  handleDetailFieldChange(
                                    "sort",
                                    parseInt(e.target.value, 10) || 0
                                  )
                                }
                                disabled={selectedMainItem.sys_yn === "Y"}
                                fullWidth
                              />
                            </FormTableCell>
                          </FormTableRow>
                        </FormTableColumn>
                      </FormTable>
                    ) : (
                      <SelectGuideMessage>
                        <ChevronRightIcon />
                        <span>좌측에서 코드를 선택하세요.</span>
                      </SelectGuideMessage>
                    )}
                  </>
                )}

                {/* 하위코드 관리 탭 */}
                {rightActiveTab === "subCode" && (
                  <>
                    <PanelHeader>
                      <PanelTitle>
                        {selectedMainItem && (
                          <span>
                            {selectedMainItem.main_nm} (
                            {selectedMainItem.main_cd}){" - "}총{" "}
                            <strong>{displaySubItems.length}</strong>건
                          </span>
                        )}
                      </PanelTitle>
                      <PanelActions>
                        <AddButton
                          onClick={handleAddSub}
                          disabled={!selectedMainCd}
                        >
                          <PlusIcon />
                          추가
                        </AddButton>
                      </PanelActions>
                    </PanelHeader>
                    <GridContent>
                      {selectedMainCd ? (
                        <Grid
                          ref={subGridRef}
                          rowData={displaySubItems}
                          columnDefs={subColumnDefs}
                          rowHeight={40}
                          headerHeight={40}
                          height="100%"
                          isRadius={false}
                          onCellValueChanged={handleSubCellChanged}
                        />
                      ) : (
                        <SelectGuideMessage>
                          <ChevronRightIcon />
                          <span>좌측에서 코드를 선택하세요.</span>
                        </SelectGuideMessage>
                      )}
                    </GridContent>
                  </>
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
        description={
          saveTarget === "main"
            ? "메인 코드 변경사항을 저장하시겠습니까?"
            : "서브 코드 변경사항을 저장하시겠습니까?"
        }
        cancelText="취소"
        confirmText="저장"
      />
    </PageTemplate>
  );
}
