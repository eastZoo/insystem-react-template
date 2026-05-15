/**
 * 사용자 권한관리 페이지
 *
 * 좌측: 그룹 목록
 * 우측: 그룹에 속한 사용자 목록
 */
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import type { ColDef } from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { IsInputText, IsSelect, IsTabItem } from "insystem-atoms";
import type { IsSelectOption } from "insystem-atoms";
import Grid from "@/components/atoms/Grid";
import { PlusIcon, TrashIcon, ChevronRightIcon, XIcon, SearchIcon } from "@/styles/icons";
import { Alert } from "@/components/atoms/Alert";
import { FilterBar } from "@/components/atoms/FilterBar";
import { useGroupList, type GroupItem } from "@/lib/hooks/useGroupAuth";
import { useCodeSubList } from "@/lib/hooks/useComCode";
import {
  useGroupUserList,
  useAddGroupUsers,
  useRemoveGroupUsers,
  useCorpList,
  useBplcList,
  useSearchUsersMutation,
  type GroupUserItem,
  type UserSearchItem,
} from "@/lib/hooks/useUserAuth";
import { PageTemplate } from "@/components/template/PageTemplate";
import { PageHeader as CommonPageHeader } from "@/components/atoms/PageHeader";
import {
  DualGridContainer,
  GridPanel,
  PanelHeader,
  PanelTitle,
  PanelActions,
  AddButton,
  DeleteButton,
  GridContent,
  SelectGuideMessage,
  TabBar,
  PanelContainer,
  PopupOverlay,
  PopupContainer,
  PopupHeader,
  PopupTitle,
  PopupCloseButton,
  PopupBody,
  PopupSearchArea,
  PopupSearchField,
  PopupSearchButton,
  PopupGridArea,
  PopupFooter,
  PopupButton,
  CurrentGroupBadge,
} from "./index.style";

/**
 * 사용자 권한관리 페이지 컴포넌트
 */
export default function UserAuthManagementPage() {
  /** ============================= state 영역 ============================= */
  const [selectedAuthCd, setSelectedAuthCd] = useState<string | null>(null);

  // 검색 필터 상태
  const [filterGroupNm, setFilterGroupNm] = useState("");
  const [filterGroupType, setFilterGroupType] = useState("");
  const [filterUserType, setFilterUserType] = useState("");
  const [filterCoCd, setFilterCoCd] = useState("");
  const [filterBplcCd, setFilterBplcCd] = useState("");

  // 삭제 확인 알림
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [usersToDelete, setUsersToDelete] = useState<number[]>([]);

  // 사용자 추가 팝업
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [popupKeyword, setPopupKeyword] = useState("");
  const [popupCoCd, setPopupCoCd] = useState("");
  const [popupBplcCd, setPopupBplcCd] = useState("");
  const [popupUserType, setPopupUserType] = useState("");
  const [popupSearchResults, setPopupSearchResults] = useState<UserSearchItem[]>([]);
  const [selectedPopupUsers, setSelectedPopupUsers] = useState<number[]>([]);

  // 그룹 이동 확인 (이미 다른 그룹에 속한 사용자)
  const [showMoveConfirmAlert, setShowMoveConfirmAlert] = useState(false);
  const [usersWithGroup, setUsersWithGroup] = useState<UserSearchItem[]>([]);

  // Grid ref
  const groupGridRef = useRef<AgGridReact>(null);
  const userGridRef = useRef<AgGridReact>(null);
  const popupGridRef = useRef<AgGridReact>(null);

  /** ============================= API 영역 ============================= */
  const { data: groupListData = [] } = useGroupList();
  const { data: groupUsers = [], refetch: refetchGroupUsers } = useGroupUserList(selectedAuthCd);
  const { data: sy01Codes = [] } = useCodeSubList("SY01"); // 그룹구분
  const { data: sy04Codes = [] } = useCodeSubList("SY04"); // 사용자구분
  const { data: corpList = [] } = useCorpList();
  const { data: bplcList = [] } = useBplcList(filterCoCd || undefined);
  const { data: popupBplcList = [] } = useBplcList(popupCoCd || undefined);

  const { mutate: addUsersMutation, isPending: isAdding } = useAddGroupUsers();
  const { mutate: removeUsersMutation, isPending: isRemoving } = useRemoveGroupUsers();
  const { mutate: searchUsersMutation, isPending: isSearching } = useSearchUsersMutation();

  /** ============================= 옵션 변환 ============================= */
  const groupTypeOptions: IsSelectOption[] = useMemo(
    () => [
      { label: "전체", value: "" },
      ...sy01Codes.map((code) => ({ label: code.sub_nm, value: code.sub_cd })),
    ],
    [sy01Codes]
  );

  const userTypeOptions: IsSelectOption[] = useMemo(
    () => [
      { label: "전체", value: "" },
      ...sy04Codes.map((code) => ({ label: code.sub_nm, value: code.sub_cd })),
    ],
    [sy04Codes]
  );

  const corpOptions: IsSelectOption[] = useMemo(
    () => [
      { label: "전체", value: "" },
      ...corpList.map((corp) => ({ label: corp.co_nm, value: corp.co_cd })),
    ],
    [corpList]
  );

  const bplcOptions: IsSelectOption[] = useMemo(
    () => [
      { label: "전체", value: "" },
      ...bplcList.map((bplc) => ({ label: bplc.bplc_nm, value: bplc.bplc_cd })),
    ],
    [bplcList]
  );

  const popupBplcOptions: IsSelectOption[] = useMemo(
    () => [
      { label: "전체", value: "" },
      ...popupBplcList.map((bplc) => ({ label: bplc.bplc_nm, value: bplc.bplc_cd })),
    ],
    [popupBplcList]
  );

  /** ============================= 그룹 컬럼 정의 ============================= */
  const groupColumnDefs: ColDef<GroupItem>[] = useMemo(
    () => [
      {
        headerName: "No.",
        valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
        width: 60,
        sortable: false,
        filter: false,
      },
      {
        field: "auth_cd",
        headerName: "그룹코드",
        width: 120,
      },
      {
        field: "auth_nm",
        headerName: "그룹명",
        flex: 1,
      },
      {
        field: "user_type_cd",
        headerName: "사용자구분",
        width: 100,
      },
      {
        field: "use_yn",
        headerName: "사용여부",
        width: 80,
      },
    ],
    []
  );

  /** ============================= 사용자 컬럼 정의 ============================= */
  const userColumnDefs: ColDef<GroupUserItem>[] = useMemo(
    () => [
      {
        headerName: "No.",
        valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
        width: 60,
        sortable: false,
        filter: false,
        headerCheckboxSelection: true,
        checkboxSelection: true,
      },
      {
        field: "reg_id",
        headerName: "관리번호",
        width: 100,
      },
      {
        field: "nm",
        headerName: "성명",
        width: 100,
      },
      {
        field: "id",
        headerName: "ID",
        width: 120,
      },
      {
        field: "user_type",
        headerName: "사용자분류",
        width: 100,
      },
      {
        field: "co_nm",
        headerName: "법인",
        width: 120,
      },
      {
        field: "bplc_nm",
        headerName: "사업장",
        width: 120,
      },
      {
        field: "emp_no",
        headerName: "사원번호",
        flex: 1,
      },
    ],
    []
  );

  /** ============================= 팝업 사용자 컬럼 정의 ============================= */
  const popupUserColumnDefs: ColDef<UserSearchItem>[] = useMemo(
    () => [
      {
        headerName: "No.",
        valueGetter: (params) => (params.node?.rowIndex ?? 0) + 1,
        width: 60,
        sortable: false,
        filter: false,
        headerCheckboxSelection: true,
        checkboxSelection: true,
      },
      {
        field: "reg_id",
        headerName: "관리번호",
        width: 90,
      },
      {
        field: "nm",
        headerName: "성명",
        width: 90,
      },
      {
        field: "id",
        headerName: "ID",
        width: 120,
      },
      {
        field: "user_type",
        headerName: "사용자분류",
        width: 90,
      },
      {
        field: "co_nm",
        headerName: "법인",
        width: 100,
      },
      {
        field: "bplc_nm",
        headerName: "사업장",
        width: 100,
      },
      {
        field: "emp_no",
        headerName: "사원번호",
        width: 100,
      },
      {
        field: "current_auth_nm",
        headerName: "현재 그룹",
        flex: 1,
        cellRenderer: (params: any) => {
          const authNm = params.value;
          if (!authNm) return null;
          return <CurrentGroupBadge>{authNm}</CurrentGroupBadge>;
        },
      },
    ],
    []
  );

  /** ============================= 비즈니스 로직 영역 ============================= */

  // 그룹 행 클릭
  const handleGroupRowClicked = useCallback((event: any) => {
    const data = event.data as GroupItem;
    if (data && !data._isDeleted) {
      setSelectedAuthCd(data.auth_cd);
    }
  }, []);

  // 선택된 그룹 정보
  const selectedGroup = useMemo(
    () => groupListData.find((item) => item.auth_cd === selectedAuthCd),
    [groupListData, selectedAuthCd]
  );

  // 필터된 그룹 목록
  const filteredGroups = useMemo(() => {
    let filtered = groupListData.filter((g) => !g._isDeleted);

    if (filterGroupNm.trim()) {
      const searchLower = filterGroupNm.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.auth_nm.toLowerCase().includes(searchLower) ||
          g.auth_cd.toLowerCase().includes(searchLower)
      );
    }

    if (filterGroupType) {
      filtered = filtered.filter((g) => g.user_type_cd === filterGroupType);
    }

    return filtered;
  }, [groupListData, filterGroupNm, filterGroupType]);

  // 검색
  const handleSearch = useCallback(() => {
    // 필터 자동 적용
  }, []);

  // 검색 초기화
  const handleClear = useCallback(() => {
    setFilterGroupNm("");
    setFilterGroupType("");
    setFilterUserType("");
    setFilterCoCd("");
    setFilterBplcCd("");
  }, []);

  // 사용자 추가 팝업 열기
  const handleOpenUserPopup = useCallback(() => {
    if (!selectedAuthCd) return;
    setShowUserPopup(true);
    setPopupKeyword("");
    setPopupCoCd("");
    setPopupBplcCd("");
    setPopupUserType("");
    setPopupSearchResults([]);
    setSelectedPopupUsers([]);
  }, [selectedAuthCd]);

  // 팝업 닫기
  const handleCloseUserPopup = useCallback(() => {
    setShowUserPopup(false);
    setPopupSearchResults([]);
    setSelectedPopupUsers([]);
  }, []);

  // 팝업에서 사용자 검색
  const handlePopupSearch = useCallback(() => {
    searchUsersMutation(
      {
        keyword: popupKeyword || undefined,
        coCd: popupCoCd || undefined,
        bplcCd: popupBplcCd || undefined,
        userType: popupUserType || undefined,
        excludeAuthCd: selectedAuthCd || undefined,
      },
      {
        onSuccess: (data) => {
          setPopupSearchResults(data);
          setSelectedPopupUsers([]);
        },
      }
    );
  }, [popupKeyword, popupCoCd, popupBplcCd, popupUserType, selectedAuthCd, searchUsersMutation]);

  // 팝업 그리드 선택 변경
  const handlePopupSelectionChanged = useCallback(() => {
    const selectedNodes = popupGridRef.current?.api?.getSelectedNodes() || [];
    const regIds = selectedNodes
      .map((node) => (node.data as UserSearchItem)?.reg_id)
      .filter(Boolean);
    setSelectedPopupUsers(regIds);
  }, []);

  // 사용자 추가 확인
  const handleAddUsers = useCallback(() => {
    if (!selectedAuthCd || selectedPopupUsers.length === 0) return;

    // 이미 다른 그룹에 속한 사용자 확인
    const usersInOtherGroup = popupSearchResults.filter(
      (u) => selectedPopupUsers.includes(u.reg_id) && u.current_auth_cd
    );

    if (usersInOtherGroup.length > 0) {
      setUsersWithGroup(usersInOtherGroup);
      setShowMoveConfirmAlert(true);
    } else {
      // 바로 추가
      addUsersMutation(
        { authCd: selectedAuthCd, regIds: selectedPopupUsers },
        {
          onSuccess: () => {
            handleCloseUserPopup();
            refetchGroupUsers();
          },
        }
      );
    }
  }, [
    selectedAuthCd,
    selectedPopupUsers,
    popupSearchResults,
    addUsersMutation,
    handleCloseUserPopup,
    refetchGroupUsers,
  ]);

  // 그룹 이동 확인
  const handleMoveConfirm = useCallback(() => {
    if (!selectedAuthCd) return;
    setShowMoveConfirmAlert(false);

    addUsersMutation(
      { authCd: selectedAuthCd, regIds: selectedPopupUsers },
      {
        onSuccess: () => {
          handleCloseUserPopup();
          refetchGroupUsers();
        },
      }
    );
  }, [selectedAuthCd, selectedPopupUsers, addUsersMutation, handleCloseUserPopup, refetchGroupUsers]);

  // 사용자 삭제 버튼 클릭
  const handleDeleteClick = useCallback(() => {
    const selectedNodes = userGridRef.current?.api?.getSelectedNodes() || [];
    const regIds = selectedNodes
      .map((node) => (node.data as GroupUserItem)?.reg_id)
      .filter(Boolean);

    if (regIds.length === 0) return;

    setUsersToDelete(regIds);
    setShowDeleteAlert(true);
  }, []);

  // 삭제 확인
  const handleDeleteConfirm = useCallback(() => {
    if (!selectedAuthCd || usersToDelete.length === 0) return;
    setShowDeleteAlert(false);

    removeUsersMutation(
      { authCd: selectedAuthCd, regIds: usersToDelete },
      {
        onSuccess: () => {
          setUsersToDelete([]);
          refetchGroupUsers();
        },
      }
    );
  }, [selectedAuthCd, usersToDelete, removeUsersMutation, refetchGroupUsers]);

  // 법인 선택 시 사업장 초기화
  useEffect(() => {
    setFilterBplcCd("");
  }, [filterCoCd]);

  useEffect(() => {
    setPopupBplcCd("");
  }, [popupCoCd]);

  /** ============================= 렌더링 ============================= */
  return (
    <PageTemplate title="사용자 권한관리">
      <CommonPageHeader title="사용자 권한관리" />

      {/* 검색 필터 */}
      <FilterBar
        rows={[
          {
            items: [
              <IsInputText
                key="groupNm"
                size="xSmall"
                position="row"
                label="그룹명"
                value={filterGroupNm}
                onChange={(e) => setFilterGroupNm(e.target.value)}
                placeholderText="그룹명 검색"
                fullWidth
              />,
              <IsSelect
                key="groupType"
                size="xSmall"
                position="row"
                label="그룹구분"
                options={groupTypeOptions}
                value={filterGroupType}
                onChange={(value) => setFilterGroupType(value as string)}
                fullWidth
              />,
            ],
          },
          {
            items: [
              <IsSelect
                key="userType"
                size="xSmall"
                position="row"
                label="사용자구분"
                options={userTypeOptions}
                value={filterUserType}
                onChange={(value) => setFilterUserType(value as string)}
                fullWidth
              />,
              <IsSelect
                key="corp"
                size="xSmall"
                position="row"
                label="회사/법인"
                options={corpOptions}
                value={filterCoCd}
                onChange={(value) => setFilterCoCd(value as string)}
                fullWidth
              />,
              <IsSelect
                key="bplc"
                size="xSmall"
                position="row"
                label="사업장"
                options={bplcOptions}
                value={filterBplcCd}
                onChange={(value) => setFilterBplcCd(value as string)}
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
                총 <strong>{filteredGroups.length}</strong>건
              </PanelTitle>
            </PanelHeader>
            <GridContent>
              <Grid
                ref={groupGridRef}
                rowData={filteredGroups}
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

        {/* 사용자 목록 패널 */}
        <GridPanel>
          <TabBar>
            <IsTabItem active size="S" position="single">
              사용자 목록
            </IsTabItem>
          </TabBar>
          <PanelContainer>
            {selectedGroup ? (
              <>
                <PanelHeader>
                  <PanelTitle>
                    총 <strong>{groupUsers.length}</strong>건
                  </PanelTitle>
                  <PanelActions>
                    <DeleteButton onClick={handleDeleteClick} disabled={isRemoving}>
                      <TrashIcon />
                      삭제
                    </DeleteButton>
                    <AddButton onClick={handleOpenUserPopup} disabled={isAdding}>
                      <PlusIcon />
                      추가
                    </AddButton>
                  </PanelActions>
                </PanelHeader>
                <GridContent>
                  <Grid
                    ref={userGridRef}
                    rowData={groupUsers}
                    columnDefs={userColumnDefs}
                    rowHeight={40}
                    headerHeight={40}
                    height="100%"
                    isRadius={false}
                    selectionMode="multiRow"
                  />
                </GridContent>
              </>
            ) : (
              <SelectGuideMessage>
                <ChevronRightIcon />
                <span>좌측에서 그룹을 선택하세요.</span>
              </SelectGuideMessage>
            )}
          </PanelContainer>
        </GridPanel>
      </DualGridContainer>

      {/* 사용자 검색 팝업 */}
      {showUserPopup && (
        <PopupOverlay onClick={handleCloseUserPopup}>
          <PopupContainer onClick={(e) => e.stopPropagation()}>
            <PopupHeader>
              <PopupTitle>사용자 검색</PopupTitle>
              <PopupCloseButton onClick={handleCloseUserPopup}>
                <XIcon />
              </PopupCloseButton>
            </PopupHeader>
            <PopupBody>
              <PopupSearchArea>
                <PopupSearchField>
                  <label>검색어</label>
                  <IsInputText
                    size="xSmall"
                    value={popupKeyword}
                    onChange={(e) => setPopupKeyword(e.target.value)}
                    placeholderText="성명, ID, 사원번호"
                    fullWidth
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handlePopupSearch();
                    }}
                  />
                </PopupSearchField>
                <PopupSearchField>
                  <label>사용자구분</label>
                  <IsSelect
                    size="xSmall"
                    options={userTypeOptions}
                    value={popupUserType}
                    onChange={(value) => setPopupUserType(value as string)}
                    fullWidth
                  />
                </PopupSearchField>
                <PopupSearchField>
                  <label>법인</label>
                  <IsSelect
                    size="xSmall"
                    options={corpOptions}
                    value={popupCoCd}
                    onChange={(value) => setPopupCoCd(value as string)}
                    fullWidth
                  />
                </PopupSearchField>
                <PopupSearchField>
                  <label>사업장</label>
                  <IsSelect
                    size="xSmall"
                    options={popupBplcOptions}
                    value={popupBplcCd}
                    onChange={(value) => setPopupBplcCd(value as string)}
                    fullWidth
                  />
                </PopupSearchField>
                <PopupSearchButton onClick={handlePopupSearch} disabled={isSearching}>
                  <SearchIcon />
                  검색
                </PopupSearchButton>
              </PopupSearchArea>
              <PopupGridArea>
                <Grid
                  ref={popupGridRef}
                  rowData={popupSearchResults}
                  columnDefs={popupUserColumnDefs}
                  rowHeight={36}
                  headerHeight={36}
                  height="100%"
                  isRadius={false}
                  selectionMode="multiRow"
                  onSelectionChanged={handlePopupSelectionChanged}
                />
              </PopupGridArea>
            </PopupBody>
            <PopupFooter>
              <PopupButton onClick={handleCloseUserPopup}>취소</PopupButton>
              <PopupButton
                $primary
                onClick={handleAddUsers}
                disabled={selectedPopupUsers.length === 0 || isAdding}
              >
                추가 ({selectedPopupUsers.length}건)
              </PopupButton>
            </PopupFooter>
          </PopupContainer>
        </PopupOverlay>
      )}

      {/* 삭제 확인 알림 */}
      <Alert
        isOpen={showDeleteAlert}
        onClose={() => setShowDeleteAlert(false)}
        onConfirm={handleDeleteConfirm}
        title="사용자 삭제"
        description={`선택한 ${usersToDelete.length}명의 사용자를 그룹에서 삭제하시겠습니까?`}
        cancelText="취소"
        confirmText="삭제"
      />

      {/* 그룹 이동 확인 알림 */}
      <Alert
        isOpen={showMoveConfirmAlert}
        onClose={() => setShowMoveConfirmAlert(false)}
        onConfirm={handleMoveConfirm}
        title="그룹 이동 확인"
        description={`${usersWithGroup.length}명의 사용자가 이미 다른 그룹에 속해 있습니다. 이 그룹으로 이동하시겠습니까?`}
        cancelText="취소"
        confirmText="이동"
      />
    </PageTemplate>
  );
}
