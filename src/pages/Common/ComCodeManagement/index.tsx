/**
 * 공통 코드 관리 페이지
 *
 * 좌측: 메인 코드 목록 (sys_code_main)
 * 우측: 상세 정보 탭 / 하위코드 관리 탭 (sys_code_sub)
 */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type {
  ColDef,
  CellStyle,
  ICellRendererParams,
  CellValueChangedEvent,
} from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { IsInputText, IsRadio, IsTabItem } from "insystem-atoms";
import Grid from "@/components/atoms/Grid";
import { ChevronRightIcon, PlusIcon, TrashIcon } from "@/styles/icons";
import { Alert } from "@/components/atoms/Alert";
import { FilterBar } from "@/components/atoms/FilterBar";
import {
  useCodeMainList,
  useCodeSubList,
  useSaveCodeMain,
  useSaveCodeSub,
  useDeleteCodeMain,
  useDeleteCodeSub,
  type CodeMainItem,
  type CodeSubItem,
} from "@/lib/hooks/useComCode";
import { PageTemplate } from "@/components/template/PageTemplate";
import { PageHeader as CommonPageHeader } from "@/components/atoms/PageHeader";
import { FormTable, FormField } from "@/components/atoms/FormTable";
import {
  DualGridContainer,
  GridPanel,
  PanelHeader,
  PanelTitle,
  GridContent,
  DeleteButton,
  SelectGuideMessage,
  TabBar,
  PanelContainer,
  AddButton,
  PanelActions,
} from "./index.style";

/** 폼 데이터 초기값 */
const INITIAL_FORM_DATA: Omit<
  CodeMainItem,
  "_isNew" | "_isModified" | "_isDeleted"
> = {
  main_cd: "",
  main_nm: "",
  sys_yn: "N",
  use_yn: "Y",
  mng_cd1: null,
  mng_cd2: null,
  sort: 0,
};

/**
 * 공통 코드 관리 페이지 컴포넌트
 */
export default function ComCodeManagementPage() {
  /** ============================= state 영역 ============================= */
  // 선택된 메인 코드 (그리드에서 선택)
  const [selectedMainCd, setSelectedMainCd] = useState<string | null>(null);

  // 폼 데이터 (상세정보 탭에서 수정)
  const [formData, setFormData] =
    useState<typeof INITIAL_FORM_DATA>(INITIAL_FORM_DATA);

  // 신규 등록 모드 여부
  const [isAddMode, setIsAddMode] = useState(false);

  // 하위코드 데이터
  const [subItems, setSubItems] = useState<CodeSubItem[]>([]);

  // 검색 필터 상태
  const [searchText, setSearchText] = useState("");

  // 탭 상태: "detail" (상세정보) | "subCode" (하위코드 관리)
  const [rightActiveTab, setRightActiveTab] = useState<"detail" | "subCode">(
    "detail"
  );

  // 알림창 상태
  const [alertState, setAlertState] = useState<{
    isOpen: boolean;
    type:
      | "save"
      | "delete"
      | "sysYnWarning"
      | "deleteSubConfirm"
      | "deleteMainConfirm";
    message: string;
    onConfirm?: () => void;
  }>({
    isOpen: false,
    type: "save",
    message: "",
  });

  // Grid refs
  const mainGridRef = useRef<AgGridReact>(null);
  const subGridRef = useRef<AgGridReact>(null);

  /** ============================= API 영역 ============================= */
  const { data: mainListData = [], refetch: refetchMainList } =
    useCodeMainList();
  const { data: subListData = [], refetch: refetchSubList } =
    useCodeSubList(selectedMainCd);
  const { mutate: saveMainMutation, isPending: isSavingMain } =
    useSaveCodeMain();
  const { mutate: saveSubMutation, isPending: isSavingSub } = useSaveCodeSub();
  const { mutate: deleteMainMutation, isPending: isDeletingMain } =
    useDeleteCodeMain();
  const { mutate: deleteSubMutation, isPending: isDeletingSub } =
    useDeleteCodeSub();

  /** ============================= 데이터 초기화 ============================= */
  // 서브 코드 데이터 초기화
  useEffect(() => {
    setSubItems(subListData.map((item) => ({ ...item })));
  }, [subListData]);

  // 메인 코드 선택 시 폼 데이터 초기화
  useEffect(() => {
    if (selectedMainCd && !isAddMode) {
      const selectedItem = mainListData.find(
        (item) => item.main_cd === selectedMainCd
      );
      if (selectedItem) {
        setFormData({
          main_cd: selectedItem.main_cd,
          main_nm: selectedItem.main_nm,
          sys_yn: selectedItem.sys_yn,
          use_yn: selectedItem.use_yn,
          mng_cd1: selectedItem.mng_cd1,
          mng_cd2: selectedItem.mng_cd2,
          sort: selectedItem.sort,
        });
      }
    }
  }, [selectedMainCd, mainListData, isAddMode]);

  /** ============================= 핸들러 (컬럼 정의 전) ============================= */
  // 하위코드 행 삭제 (그리드 내 삭제 버튼)
  const handleDeleteSubRow = useCallback((item: CodeSubItem) => {
    if (item.sys_yn === "Y") {
      setAlertState({
        isOpen: true,
        type: "delete",
        message: "시스템 사용 코드는 삭제할 수 없습니다.",
      });
      return;
    }

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
  }, []);

  /** ============================= 컬럼 정의 ============================= */
  // 메인 코드 컬럼: No., 코드, 코드명, 시스템 사용여부, 사용여부
  const mainColumnDefs: ColDef<CodeMainItem>[] = useMemo(
    () => [
      {
        headerName: "No.",
        width: 60,
        minWidth: 60,
        valueGetter: (params) => {
          if (params.node?.rowIndex != null) {
            return params.node.rowIndex + 1;
          }
          return "";
        },
        sortable: false,
        filter: false,
      },
      {
        field: "main_cd",
        headerName: "코드",
        width: 90,
        minWidth: 90,
      },
      {
        field: "main_nm",
        headerName: "코드명",
        flex: 1,
        minWidth: 160,
      },
      {
        field: "sys_yn",
        headerName: "시스템 사용여부",
        width: 140,
        minWidth: 140,
        valueFormatter: (params) => (params.value === "Y" ? "사용" : "미사용"),
      },
      {
        field: "use_yn",
        headerName: "사용여부",
        width: 100,
        minWidth: 100,
        valueFormatter: (params) => (params.value === "Y" ? "사용" : "미사용"),
      },
    ],
    []
  );

  // 하위 코드 컬럼
  const subColumnDefs: ColDef<CodeSubItem>[] = useMemo(
    () => [
      {
        field: "sub_cd",
        headerName: "하위코드",
        width: 110,
        minWidth: 110,
        editable: (params) => !!params.data?._isNew,
        cellStyle: (params): CellStyle | undefined =>
          params.data?._isNew
            ? { backgroundColor: "rgba(46, 196, 160, 0.1)" }
            : undefined,
      },
      {
        field: "sub_nm",
        headerName: "하위코드명",
        flex: 1,
        minWidth: 150,
        editable: (params) => params.data?.sys_yn !== "Y",
        cellStyle: (params): CellStyle | undefined =>
          params.data?._isModified
            ? { backgroundColor: "rgba(255, 193, 7, 0.1)" }
            : params.data?._isNew
              ? { backgroundColor: "rgba(46, 196, 160, 0.1)" }
              : undefined,
      },
      {
        field: "sys_yn",
        headerName: "시스템 사용여부",
        width: 140,
        minWidth: 140,
        editable: (params) => params.data?.sys_yn !== "Y",
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Y", "N"] },
        valueFormatter: (params) => (params.value === "Y" ? "사용" : "미사용"),
      },
      {
        field: "use_yn",
        headerName: "사용여부",
        width: 100,
        minWidth: 100,
        editable: true,
        cellEditor: "agSelectCellEditor",
        cellEditorParams: { values: ["Y", "N"] },
        valueFormatter: (params) => (params.value === "Y" ? "사용" : "미사용"),
      },
      {
        field: "sort",
        headerName: "정렬",
        width: 70,
        minWidth: 70,
        editable: (params) => params.data?.sys_yn !== "Y",
        cellEditor: "agNumberCellEditor",
      },
      {
        field: "mng_cd1",
        headerName: "비고1",
        width: 130,
        minWidth: 130,
        editable: (params) => params.data?.sys_yn !== "Y",
      },
      {
        field: "mng_cd2",
        headerName: "비고2",
        width: 130,
        minWidth: 130,
        editable: (params) => params.data?.sys_yn !== "Y",
      },
      {
        field: "code",
        headerName: "Code",
        width: 160,
        minWidth: 160,
        editable: false,
      },
      {
        headerName: "",
        width: 50,
        minWidth: 50,
        sortable: false,
        filter: false,
        cellRenderer: (params: ICellRendererParams<CodeSubItem>) => {
          const item = params.data;
          // 데이터 없거나 시스템 코드는 삭제 불가
          if (!item || item.sys_yn === "Y") return null;
          return (
            <DeleteButton
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteSubRow(item);
              }}
              title="삭제"
            >
              <TrashIcon />
            </DeleteButton>
          );
        },
      },
    ],
    [handleDeleteSubRow]
  );

  /** ============================= 폼 초기화 ============================= */
  const initForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
    setIsAddMode(false);
    setSelectedMainCd(null);
    // 그리드 선택 해제
    mainGridRef.current?.api?.deselectAll();
  }, []);

  /** ============================= 비즈니스 로직 영역 ============================= */

  // 메인 코드 행 클릭
  const handleMainRowClicked = useCallback((event: { data: CodeMainItem }) => {
    const data = event.data;
    if (data) {
      setSelectedMainCd(data.main_cd);
      setIsAddMode(false);
    }
  }, []);

  // 상세 정보 필드 변경
  const handleFormFieldChange = useCallback(
    (field: keyof typeof INITIAL_FORM_DATA, value: string | number | null) => {
      // 시스템 사용여부 Y 선택 시 경고
      if (field === "sys_yn" && value === "Y") {
        setAlertState({
          isOpen: true,
          type: "sysYnWarning",
          message:
            "시스템 사용여부를 '사용'으로 설정하면 해당 코드는 수정/삭제가 불가능합니다. 계속하시겠습니까?",
          onConfirm: () => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            setAlertState((prev) => ({ ...prev, isOpen: false }));
          },
        });
        return;
      }
      setFormData((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // 하위코드 셀 값 변경
  const handleSubCellChanged = useCallback(
    (event: CellValueChangedEvent<CodeSubItem>) => {
      if (!event.data) return;

      const updatedItem = { ...event.data, _isModified: !event.data._isNew };

      // code 필드 자동 계산
      if (event.colDef.field === "sub_cd") {
        updatedItem.code = (selectedMainCd || "") + event.newValue;
      }

      setSubItems((prev) =>
        prev.map((item) =>
          item.main_cd === event.data!.main_cd &&
          item.sub_cd === event.data!.sub_cd
            ? updatedItem
            : item
        )
      );
    },
    [selectedMainCd]
  );

  /** ============================= 추가 버튼 ============================= */
  const handleAdd = useCallback(() => {
    if (rightActiveTab === "detail") {
      // 상세정보 탭: 신규 등록 모드
      setIsAddMode(true);
      setSelectedMainCd(null);
      setFormData(INITIAL_FORM_DATA);
      mainGridRef.current?.api?.deselectAll();
    } else {
      // 하위코드 관리 탭: 행 추가
      if (!selectedMainCd) {
        setAlertState({
          isOpen: true,
          type: "save",
          message: "메인 코드를 먼저 선택해주세요.",
        });
        return;
      }

      const newSubCd = String(subItems.length + 1).padStart(6, "0");
      const newItem: CodeSubItem = {
        main_cd: selectedMainCd,
        sub_cd: newSubCd,
        sub_nm: "",
        code: selectedMainCd + newSubCd,
        sys_yn: "N",
        use_yn: "Y",
        mng_cd1: null,
        mng_cd2: null,
        sort: subItems.length,
        _isNew: true,
      };
      setSubItems((prev) => [...prev, newItem]);

      // 새 행으로 포커스
      setTimeout(() => {
        const api = subGridRef.current?.api;
        if (api) {
          const lastIndex = subItems.length;
          api.ensureIndexVisible(lastIndex);
          api.setFocusedCell(lastIndex, "sub_cd");
          api.startEditingCell({ rowIndex: lastIndex, colKey: "sub_cd" });
        }
      }, 100);
    }
  }, [rightActiveTab, selectedMainCd, subItems]);

  /** ============================= 저장 버튼 ============================= */
  const handleSave = useCallback(() => {
    if (rightActiveTab === "detail") {
      // 상세정보 탭: 메인 코드 저장
      // Validation
      if (!formData.main_cd || formData.main_cd.length !== 4) {
        setAlertState({
          isOpen: true,
          type: "save",
          message: "코드번호는 4자리로 입력해주세요.",
        });
        return;
      }
      if (!formData.main_nm) {
        setAlertState({
          isOpen: true,
          type: "save",
          message: "코드명을 입력해주세요.",
        });
        return;
      }

      // 중복 체크 (신규 등록 시)
      if (isAddMode) {
        const isDuplicate = mainListData.some(
          (item) => item.main_cd === formData.main_cd
        );
        if (isDuplicate) {
          setAlertState({
            isOpen: true,
            type: "save",
            message: "이미 등록된 코드번호입니다.",
          });
          return;
        }
      }

      const itemToSave: CodeMainItem = {
        ...formData,
        _isNew: isAddMode,
        _isModified: !isAddMode,
      };

      saveMainMutation([itemToSave], {
        onSuccess: () => {
          setAlertState({
            isOpen: true,
            type: "save",
            message: "저장이 완료되었습니다.",
            onConfirm: () => {
              refetchMainList();
              // 신규 등록 시에만 폼 초기화 — 수정 시에는 선택 상태 유지
              if (isAddMode) {
                initForm();
              }
              setAlertState((prev) => ({ ...prev, isOpen: false }));
            },
          });
        },
        onError: () => {
          setAlertState({
            isOpen: true,
            type: "save",
            message: "저장에 실패했습니다.",
          });
        },
      });
    } else {
      // 하위코드 관리 탭: 서브 코드 저장
      if (!selectedMainCd) {
        setAlertState({
          isOpen: true,
          type: "save",
          message: "메인 코드를 먼저 선택해주세요.",
        });
        return;
      }

      const changedItems = subItems.filter(
        (item) => item._isNew || item._isModified || item._isDeleted
      );

      if (changedItems.length === 0) {
        setAlertState({
          isOpen: true,
          type: "save",
          message: "변경된 내용이 없습니다.",
        });
        return;
      }

      // Validation: sub_cd 1~6자리
      for (const item of changedItems) {
        if (!item._isDeleted && (!item.sub_cd || item.sub_cd.length > 6)) {
          setAlertState({
            isOpen: true,
            type: "save",
            message: "하위코드는 1~6자리로 입력해주세요.",
          });
          return;
        }
      }

      saveSubMutation(
        { mainCd: selectedMainCd, items: changedItems },
        {
          onSuccess: () => {
            setAlertState({
              isOpen: true,
              type: "save",
              message: "저장이 완료되었습니다.",
              onConfirm: () => {
                refetchSubList();
                setAlertState((prev) => ({ ...prev, isOpen: false }));
              },
            });
          },
          onError: () => {
            setAlertState({
              isOpen: true,
              type: "save",
              message: "저장에 실패했습니다.",
            });
          },
        }
      );
    }
  }, [
    rightActiveTab,
    formData,
    isAddMode,
    mainListData,
    selectedMainCd,
    subItems,
    saveMainMutation,
    saveSubMutation,
    refetchMainList,
    refetchSubList,
    initForm,
  ]);

  /** ============================= 삭제 버튼 ============================= */
  const handleDelete = useCallback(() => {
    if (rightActiveTab === "detail") {
      // 상세정보 탭: 메인 코드 삭제
      if (!selectedMainCd) {
        setAlertState({
          isOpen: true,
          type: "delete",
          message: "데이터를 선택해 주세요.",
        });
        return;
      }

      const selectedItem = mainListData.find(
        (item) => item.main_cd === selectedMainCd
      );
      if (selectedItem?.sys_yn === "Y") {
        setAlertState({
          isOpen: true,
          type: "delete",
          message: "시스템 사용 코드는 삭제할 수 없습니다.",
        });
        return;
      }

      setAlertState({
        isOpen: true,
        type: "deleteMainConfirm",
        message:
          "하위로 등록되어 있는 코드가 모두 삭제됩니다. 삭제 하시겠습니까?",
        onConfirm: () => {
          deleteMainMutation(
            {
              mainCd: selectedMainCd,
              mainItem: selectedItem!,
              subItems: subItems.filter((i) => !i._isNew),
            },
            {
              onSuccess: () => {
                refetchMainList();
                initForm();
                setAlertState((prev) => ({ ...prev, isOpen: false }));
              },
              onError: () => {
                setAlertState({
                  isOpen: true,
                  type: "delete",
                  message: "삭제에 실패했습니다.",
                });
              },
            }
          );
        },
      });
    } else {
      // 하위코드 관리 탭: 선택된 서브 코드 삭제
      const selectedRows = subGridRef.current?.api?.getSelectedRows() || [];
      if (selectedRows.length === 0) {
        setAlertState({
          isOpen: true,
          type: "delete",
          message: "데이터를 선택해 주세요.",
        });
        return;
      }

      const selectedItem = selectedRows[0] as CodeSubItem;
      if (selectedItem.sys_yn === "Y") {
        setAlertState({
          isOpen: true,
          type: "delete",
          message: "시스템 사용 코드는 삭제할 수 없습니다.",
        });
        return;
      }

      setAlertState({
        isOpen: true,
        type: "deleteSubConfirm",
        message: "선택한 하위코드를 삭제하시겠습니까?",
        onConfirm: () => {
          if (selectedItem._isNew) {
            // 신규 항목은 바로 제거
            setSubItems((prev) =>
              prev.filter(
                (i) =>
                  !(
                    i.main_cd === selectedItem.main_cd &&
                    i.sub_cd === selectedItem.sub_cd
                  )
              )
            );
            setAlertState((prev) => ({ ...prev, isOpen: false }));
          } else {
            deleteSubMutation(
              {
                mainCd: selectedItem.main_cd,
                subCd: selectedItem.sub_cd,
                subItem: selectedItem,
              },
              {
                onSuccess: () => {
                  refetchSubList();
                  setAlertState((prev) => ({ ...prev, isOpen: false }));
                },
                onError: () => {
                  setAlertState({
                    isOpen: true,
                    type: "delete",
                    message: "삭제에 실패했습니다.",
                  });
                },
              }
            );
          }
        },
      });
    }
  }, [
    rightActiveTab,
    selectedMainCd,
    mainListData,
    deleteMainMutation,
    deleteSubMutation,
    refetchMainList,
    refetchSubList,
    initForm,
  ]);

  /** ============================= 검색 로직 ============================= */
  const handleSearch = useCallback(() => {
    // 클라이언트 사이드 필터링 (displayMainItems에서 처리)
  }, []);

  const handleClear = useCallback(() => {
    setSearchText("");
  }, []);

  /** ============================= 알림창 닫기 ============================= */
  const handleAlertClose = useCallback(() => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleAlertConfirm = useCallback(() => {
    if (alertState.onConfirm) {
      alertState.onConfirm();
    } else {
      setAlertState((prev) => ({ ...prev, isOpen: false }));
    }
  }, [alertState]);

  /** ============================= 표시 데이터 ============================= */
  // 메인 코드 필터링 (검색어 적용)
  const displayMainItems = useMemo(() => {
    if (!searchText.trim()) return mainListData;

    const searchLower = searchText.toLowerCase();
    return mainListData.filter(
      (item) =>
        item.main_cd.toLowerCase().includes(searchLower) ||
        item.main_nm.toLowerCase().includes(searchLower)
    );
  }, [mainListData, searchText]);

  // 삭제되지 않은 서브 코드만 표시
  const displaySubItems = useMemo(
    () => subItems.filter((item) => !item._isDeleted),
    [subItems]
  );

  // 선택된 메인 코드 정보
  const selectedMainItem = useMemo(
    () => mainListData.find((item) => item.main_cd === selectedMainCd),
    [mainListData, selectedMainCd]
  );

  // 시스템 사용 코드 여부 (수정/삭제 불가)
  const isSystemCode = selectedMainItem?.sys_yn === "Y";

  // 폼 수정 가능 여부 (코드가 선택되었거나 신규 추가 모드)
  const isFormEditable = isAddMode || !!selectedMainCd;

  /** ============================= 렌더링 ============================= */
  return (
    <PageTemplate title="공통 코드 관리">
      <CommonPageHeader
        title="공통 코드 관리"
        onAdd={handleAdd}
        onSave={handleSave}
        onDelete={handleDelete}
        addDisabled={isSavingMain || isSavingSub}
        saveDisabled={isSavingMain || isSavingSub}
        deleteDisabled={isDeletingMain || isDeletingSub}
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
            <IsTabItem active size="S" position="single">
              코드 목록
            </IsTabItem>
          </TabBar>
          <PanelContainer>
            <PanelHeader>
              <PanelTitle>
                총 <strong>{displayMainItems.length}</strong>건
              </PanelTitle>
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
                selectionMode="singleRow"
                showCheckbox={false}
              />
            </GridContent>
          </PanelContainer>
        </GridPanel>

        {/* 우측 패널 (상세 정보 / 하위코드 관리) */}
        <GridPanel>
          <TabBar>
            <IsTabItem
              active={rightActiveTab === "detail"}
              size="S"
              position="start"
              onClick={() => setRightActiveTab("detail")}
            >
              상세 정보
            </IsTabItem>
            <IsTabItem
              active={rightActiveTab === "subCode"}
              size="S"
              position="end"
              onClick={() => setRightActiveTab("subCode")}
            >
              하위코드 관리
            </IsTabItem>
          </TabBar>
          <PanelContainer $activeTab={rightActiveTab}>
            {/* 상세 정보 탭 */}
            {rightActiveTab === "detail" && (
              <>
                {selectedMainItem || isAddMode ? (
                  <FormTable>
                    <FormTable.Column>
                      <FormField label="코드번호" required isFirst>
                        <IsInputText
                          size="xSmall"
                          value={formData.main_cd}
                          onChange={(e) => {
                            // 4자리로 제한
                            const value = e.target.value.slice(0, 4);
                            handleFormFieldChange("main_cd", value);
                          }}
                          disabled={!isAddMode}
                          fullWidth
                          maxLength={4}
                          placeholderText="4자리 입력"
                        />
                      </FormField>
                      <FormField label="코드명" required>
                        <IsInputText
                          size="xSmall"
                          value={formData.main_nm}
                          onChange={(e) =>
                            handleFormFieldChange("main_nm", e.target.value)
                          }
                          disabled={!isFormEditable}
                          fullWidth
                        />
                      </FormField>
                      <FormField label="시스템 사용여부" required>
                        <div style={{ display: "flex", gap: 16 }}>
                          <IsRadio
                            name="sys_yn"
                            value="Y"
                            label="사용"
                            checked={formData.sys_yn === "Y"}
                            onChange={() =>
                              handleFormFieldChange("sys_yn", "Y")
                            }
                            disabled={!isFormEditable}
                          />
                          <IsRadio
                            name="sys_yn"
                            value="N"
                            label="미사용"
                            checked={formData.sys_yn === "N"}
                            onChange={() =>
                              handleFormFieldChange("sys_yn", "N")
                            }
                            disabled={!isFormEditable}
                          />
                        </div>
                      </FormField>
                      <FormField label="사용여부" required>
                        <div style={{ display: "flex", gap: 16 }}>
                          <IsRadio
                            name="use_yn"
                            value="Y"
                            label="사용"
                            checked={formData.use_yn === "Y"}
                            onChange={() =>
                              handleFormFieldChange("use_yn", "Y")
                            }
                            disabled={!isFormEditable}
                          />
                          <IsRadio
                            name="use_yn"
                            value="N"
                            label="미사용"
                            checked={formData.use_yn === "N"}
                            onChange={() =>
                              handleFormFieldChange("use_yn", "N")
                            }
                            disabled={!isFormEditable}
                          />
                        </div>
                      </FormField>
                      <FormField label="비고1">
                        <IsInputText
                          size="xSmall"
                          value={formData.mng_cd1 || ""}
                          onChange={(e) =>
                            handleFormFieldChange(
                              "mng_cd1",
                              e.target.value || null
                            )
                          }
                          disabled={!isFormEditable}
                          fullWidth
                          maxLength={100}
                        />
                      </FormField>
                      <FormField label="비고2" isLast>
                        <IsInputText
                          size="xSmall"
                          value={formData.mng_cd2 || ""}
                          onChange={(e) =>
                            handleFormFieldChange(
                              "mng_cd2",
                              e.target.value || null
                            )
                          }
                          disabled={!isFormEditable}
                          fullWidth
                          maxLength={100}
                        />
                      </FormField>
                    </FormTable.Column>
                  </FormTable>
                ) : (
                  <SelectGuideMessage>
                    <ChevronRightIcon />
                    <span>
                      좌측에서 코드를 선택하거나 [추가] 버튼을 클릭하세요.
                    </span>
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
                        {selectedMainItem.main_nm} ({selectedMainItem.main_cd})
                        {" - "}총 <strong>{displaySubItems.length}</strong>건
                      </span>
                    )}
                  </PanelTitle>
                  {/* <PanelActions>
                    <AddButton onClick={handleAdd} disabled={!selectedMainCd}>
                      <PlusIcon />행 추가
                    </AddButton>
                  </PanelActions> */}
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
                      selectionMode="singleRow"
                      showCheckbox={false}
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

      {/* 알림창 */}
      <Alert
        isOpen={alertState.isOpen}
        onClose={handleAlertClose}
        onConfirm={handleAlertConfirm}
        title={
          alertState.type === "save"
            ? "알림"
            : alertState.type === "delete" ||
                alertState.type === "deleteMainConfirm" ||
                alertState.type === "deleteSubConfirm"
              ? "삭제 확인"
              : "확인"
        }
        description={alertState.message}
        cancelText={alertState.onConfirm ? "취소" : undefined}
        confirmText="확인"
      />
    </PageTemplate>
  );
}
