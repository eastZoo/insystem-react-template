/**
 * 공통 코드 관리 페이지
 *
 * 좌측: 메인 코드 (sya_code_main)
 * 우측: 서브 코드 (sya_code_sub) - 좌측 선택 시 표시
 */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { ColDef, CellValueChangedEvent } from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import Grid from "@/components/atoms/Grid";
import { PlusIcon, TrashIcon, ChevronRightIcon } from "@/styles/icons";
import { Alert } from "@/components/atoms/Alert";
import {
  useCodeMainList,
  useCodeSubList,
  useSaveCodeMain,
  useSaveCodeSub,
  type CodeMainItem,
  type CodeSubItem,
} from "@/lib/hooks/useComCode";
import {
  PageContainer,
  PageHeader,
  PageTitle,
  MainContainer,
  Content,
  ContentHeader,
  HeaderTextGroup,
  MainTitle,
  Description,
  SaveButton,
  DualGridContainer,
  GridPanel,
  PanelHeader,
  PanelTitle,
  PanelActions,
  AddButton,
  GridContent,
  DeleteButton,
  SelectGuideMessage,
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
        cellStyle: (params) => ({
          backgroundColor: params.data?._isNew
            ? "rgba(46, 196, 160, 0.1)"
            : undefined,
        }),
      },
      {
        field: "main_nm",
        headerName: "코드명",
        flex: 1,
        editable: true,
        cellStyle: (params) => ({
          backgroundColor: params.data?._isModified
            ? "rgba(255, 193, 7, 0.1)"
            : params.data?._isNew
              ? "rgba(46, 196, 160, 0.1)"
              : undefined,
        }),
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
        cellStyle: (params) => ({
          backgroundColor: params.data?._isNew
            ? "rgba(46, 196, 160, 0.1)"
            : undefined,
        }),
      },
      {
        field: "sub_nm",
        headerName: "코드명",
        flex: 1,
        editable: true,
        cellStyle: (params) => ({
          backgroundColor: params.data?._isModified
            ? "rgba(255, 193, 7, 0.1)"
            : params.data?._isNew
              ? "rgba(46, 196, 160, 0.1)"
              : undefined,
        }),
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
  const handleDeleteMain = useCallback((item: CodeMainItem) => {
    if (item._isNew) {
      // 신규 항목은 바로 제거
      setMainItems((prev) =>
        prev.filter((i) => i.main_cd !== item.main_cd)
      );
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
  }, [selectedMainCd]);

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

  /** ============================= 표시 데이터 ============================= */
  // 삭제되지 않은 항목만 표시
  const displayMainItems = useMemo(
    () => mainItems.filter((item) => !item._isDeleted),
    [mainItems]
  );

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
    <PageContainer>
      {/* 페이지 헤더 */}
      <PageHeader>
        <PageTitle>공통 코드 관리</PageTitle>
      </PageHeader>

      {/* 메인 컨텐츠 */}
      <MainContainer>
        <Content>
          {/* 컨텐츠 헤더 */}
          <ContentHeader>
            <HeaderTextGroup>
              <MainTitle>공통 코드 관리</MainTitle>
              <Description>
                시스템에서 사용하는 공통 코드를 관리합니다.
              </Description>
            </HeaderTextGroup>

            {/* 저장 버튼 */}
            <SaveButton
              variant="solid"
              color="primary"
              size="sm"
              onClick={handleSave}
              disabled={
                (!hasMainChanges && !hasSubChanges) || isSavingMain || isSavingSub
              }
            >
              {isSavingMain || isSavingSub ? "저장 중..." : "저장"}
            </SaveButton>
          </ContentHeader>

          {/* 듀얼 그리드 */}
          <DualGridContainer>
            {/* 메인 코드 패널 */}
            <GridPanel>
              <PanelHeader>
                <PanelTitle>메인 코드</PanelTitle>
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
            </GridPanel>

            {/* 서브 코드 패널 */}
            <GridPanel>
              <PanelHeader>
                <PanelTitle>
                  서브 코드
                  {selectedMainItem && (
                    <span style={{ fontWeight: 400, color: "#6b7a9f" }}>
                      {" "}
                      - {selectedMainItem.main_nm} ({selectedMainItem.main_cd})
                    </span>
                  )}
                </PanelTitle>
                <PanelActions>
                  <AddButton onClick={handleAddSub} disabled={!selectedMainCd}>
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
                    <span>좌측에서 메인 코드를 선택하세요.</span>
                  </SelectGuideMessage>
                )}
              </GridContent>
            </GridPanel>
          </DualGridContainer>
        </Content>
      </MainContainer>

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
    </PageContainer>
  );
}
