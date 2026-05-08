/**
 * SharedAssetLocationPage — 공유재산 위치표시 페이지
 *
 * Figma 디자인 기반으로 마이그레이션됨
 * 자산현황 검색 및 위치 매핑 기능 제공
 */

import { useState, useMemo, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { ColDef, SelectionChangedEvent, RowClickedEvent } from "ag-grid-community";
import { PageContent } from "@/components/organisms/PageContent";
import Grid from "@/components/atoms/Grid";
import * as S from "./SharedAssetLocationPage.style";
import {
  useAssetStatusDetailSearch,
  useAssetStatusDetailUpdate,
  type SearchAssetStatusDetailParams,
} from "@/lib/hooks/useAssetStatusDetailSearch";
import { useCreateAssetLocationMappings } from "@/lib/hooks/useAssetLocationMapping";
import type { AssetStatusDetail } from "@/lib/hooks/types/assetStatusDetail";
import type { CreateAssetLocationMappingPayload } from "@/lib/hooks/types/assetLocationMapping";

// 아이콘 컴포넌트
const RefreshIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M15.75 9C15.75 12.7279 12.7279 15.75 9 15.75C5.27208 15.75 2.25 12.7279 2.25 9C2.25 5.27208 5.27208 2.25 9 2.25C11.4853 2.25 13.6569 3.57107 14.8125 5.5625"
      stroke="#0C4CA3"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M15.75 2.25V5.625H12.375" stroke="#0C4CA3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="8.25" cy="8.25" r="5.25" stroke="#0C4CA3" strokeWidth="1.5" />
    <path d="M15.75 15.75L12.375 12.375" stroke="#0C4CA3" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M6.75 4.5L13.5 9L6.75 13.5V4.5Z" fill="#F9FAFB" stroke="#F9FAFB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MapIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M6.75 2.25L2.25 4.5V15.75L6.75 13.5M6.75 2.25L11.25 4.5M6.75 2.25V13.5M11.25 4.5L15.75 2.25V13.5L11.25 15.75M11.25 4.5V15.75M11.25 15.75L6.75 13.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="#6A7282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 분류결과 타입 정의
interface ClassifiedAssetRow extends AssetStatusDetail {
  rowIndex: number;
  classificationResult: string | null; // 분류결과 (행정확정, 일반변경 등)
}

export default function SharedAssetLocationPage() {
  /** ============================= state 영역 ============================= */
  const [propertyViewType, setPropertyViewType] = useState<"all" | "admin" | "normal">("admin");
  const [startYear, setStartYear] = useState("2024");
  const [endYear, setEndYear] = useState("2025");
  const [projectName, setProjectName] = useState("");
  const [managementDept, setManagementDept] = useState("");
  const [acquisitionDept, setAcquisitionDept] = useState("");
  const [searchEnabled, setSearchEnabled] = useState(false);

  // 선택된 행 목록
  const [selectedRows, setSelectedRows] = useState<ClassifiedAssetRow[]>([]);

  // 분류 처리된 데이터 (로컬 상태)
  const [classifiedData, setClassifiedData] = useState<Record<string, { appliedYn: string; classificationResult: string }>>({});

  // 분류 처리 중 상태
  const [isClassifying, setIsClassifying] = useState(false);

  // 지도 반영 중 상태
  const [isApplyingToMap, setIsApplyingToMap] = useState(false);

  // 분류 결과 카운트 (API 데이터에서 계산)
  const [adminConfirmedCount, setAdminConfirmedCount] = useState(0);
  const [splitTargetCount, setSplitTargetCount] = useState(0);
  const [generalChangeCount, setGeneralChangeCount] = useState(0);

  // Grid ref
  const gridRef = useRef<any>(null);

  /** ============================= API 영역 ============================= */
  // 검색 파라미터 변환
  const searchParams: SearchAssetStatusDetailParams = useMemo(() => ({
    propertyUseType: propertyViewType,
    startAccountingStandard: startYear,
    endAccountingStandard: endYear,
    detailBusinessName: projectName || undefined,
    managementDept: managementDept || undefined,
    acquisitionDept: acquisitionDept || undefined,
  }), [propertyViewType, startYear, endYear, projectName, managementDept, acquisitionDept]);

  // 자산현황 검색 API
  const { data: apiAssetData = [], isLoading, refetch } = useAssetStatusDetailSearch(searchParams, searchEnabled);

  // 자산현황 수정 API
  const updateMutation = useAssetStatusDetailUpdate();

  // 자산 위치 매핑 저장 API
  const createMappingsMutation = useCreateAssetLocationMappings();

  // 페이지 네비게이션
  const navigate = useNavigate();

  /** ============================= 비즈니스 로직 영역 ============================= */
  // 그리드에 표시할 데이터 (인덱스 + 분류결과 추가)
  const rowData: ClassifiedAssetRow[] = useMemo(
    () =>
      apiAssetData.map((item, index) => {
        const key = String(item.linkSerialNo);
        const localData = classifiedData[key];
        return {
          ...item,
          rowIndex: index + 1,
          // 분류 처리 여부: 로컬 상태 우선, 없으면 API 데이터
          appliedYn: localData?.appliedYn ?? item.appliedYn,
          // 분류 결과: appliedYn이 "Y"일 때만 표시
          classificationResult: localData?.classificationResult ??
            (item.appliedYn === "Y" ? item.administrativePropertyTypeCode : null),
        };
      }),
    [apiAssetData, classifiedData]
  );

  // 분류 결과 카운트 계산 (rowData 기반)
  useMemo(() => {
    if (rowData.length > 0) {
      // ① 행정재산 확정: 분류결과가 "행정확정"인 건수
      const adminCount = rowData.filter(
        (item) => item.classificationResult === "행정확정"
      ).length;
      // ② 행정/일반 분할대상: 분류결과가 "분할대상"인 건수
      const splitCount = rowData.filter(
        (item) => item.classificationResult === "분할대상"
      ).length;
      // ③ 일반재산 변경대상: 분류결과가 "일반변경"인 건수
      const generalCount = rowData.filter(
        (item) => item.classificationResult === "일반변경"
      ).length;

      setAdminConfirmedCount(adminCount);
      setSplitTargetCount(splitCount);
      setGeneralChangeCount(generalCount);
    } else {
      setAdminConfirmedCount(0);
      setSplitTargetCount(0);
      setGeneralChangeCount(0);
    }
  }, [rowData]);

  // Grid 컬럼 정의
  const columnDefs: ColDef[] = useMemo(
    () => [
      {
        headerName: "",
        field: "checkbox",
        width: 55,
        checkboxSelection: true,
        headerCheckboxSelection: true,
      },
      { headerName: "No.", field: "rowIndex", width: 53 },
      { headerName: "재산구분", field: "propertyUseTypeCode", width: 83 },
      {
        headerName: "분류처리여부",
        field: "appliedYn",
        width: 111,
        valueFormatter: (params) => (params.value === "Y" ? "O" : "X"),
      },
      {
        headerName: "분류결과",
        field: "classificationResult",
        width: 121,
        valueFormatter: (params) => params.value || "",
      },
      { headerName: "면적(㎡)", field: "area", width: 92 },
      { headerName: "공시지가", field: "propertyValue", width: 134 },
      { headerName: "자산명", field: "assetName", width: 197 },
      { headerName: "법정동 코드", field: "legalDongCode", width: 332 },
    ],
    []
  );

  const handleReset = useCallback(() => {
    setPropertyViewType("all");
    setStartYear("2024");
    setEndYear("2025");
    setProjectName("");
    setManagementDept("");
    setAcquisitionDept("");
    setSearchEnabled(false);
    setClassifiedData({});
    setSelectedRows([]);
  }, []);

  const handleSearch = useCallback(() => {
    setSearchEnabled(true);
    refetch();
  }, [refetch]);

  // 그리드 행 선택 변경 핸들러
  const handleSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const selected = event.api.getSelectedRows() as ClassifiedAssetRow[];
    setSelectedRows(selected);
  }, []);

  // 행 클릭 시 선택 토글 (멀티 선택 지원)
  const handleRowClicked = useCallback((event: RowClickedEvent) => {
    if (event.node) {
      event.node.setSelected(!event.node.isSelected());
    }
  }, []);

  // 자동분류처리 실행
  const handleAutoClassify = useCallback(async () => {
    if (selectedRows.length === 0) {
      alert("분류할 항목을 선택해주세요.");
      return;
    }

    setIsClassifying(true);

    try {
      const newClassifiedData: Record<string, { appliedYn: string; classificationResult: string }> = { ...classifiedData };
      let successCount = 0;
      let failCount = 0;

      for (const row of selectedRows) {
        // linkSerialNo 검증
        if (!row.linkSerialNo) {
          console.warn("linkSerialNo가 없는 행:", row);
          failCount++;
          continue;
        }

        let classificationResult = "";

        // 재산구분(propertyUseTypeCode)에 따라 분류결과 결정
        if (row.propertyUseTypeCode?.includes("행정") || row.propertyUseTypeCode === "행정재산") {
          classificationResult = "행정확정";
        } else if (row.propertyUseTypeCode?.includes("일반") || row.propertyUseTypeCode === "일반재산") {
          classificationResult = "일반변경";
        } else {
          // 기타의 경우 분할대상으로 처리
          classificationResult = "분할대상";
        }

        // 로컬 상태 업데이트 (키를 문자열로 변환)
        const key = String(row.linkSerialNo);
        newClassifiedData[key] = {
          appliedYn: "Y",
          classificationResult,
        };

        // API 호출하여 DB 업데이트 (개별 처리로 에러 핸들링)
        try {
          await updateMutation.mutateAsync({
            linkSerialNo: String(row.linkSerialNo), // 문자열로 변환
            appliedYn: "Y",
            administrativePropertyTypeCode: classificationResult,
          });
          successCount++;
        } catch (err: any) {
          console.error(`분류처리 실패 (linkSerialNo: ${row.linkSerialNo}):`, err);
          console.error("Error details:", err?.response?.data || err?.message || err);
          failCount++;
        }
      }

      // 로컬 상태 업데이트 (API 실패 여부와 무관하게 UI에는 반영)
      setClassifiedData(newClassifiedData);

      if (failCount > 0 && successCount === 0) {
        alert(`분류처리 실패: API 연결을 확인해주세요.\n(로컬 상태는 업데이트됨)`);
      } else if (failCount > 0) {
        alert(`분류처리 완료: 성공 ${successCount}건, 실패 ${failCount}건`);
      } else {
        alert(`${successCount}건의 분류처리가 완료되었습니다.`);
      }

      // 선택 해제
      if (gridRef.current) {
        gridRef.current.api?.deselectAll();
      }
      setSelectedRows([]);

      // 데이터 새로고침
      refetch();
    } catch (error) {
      console.error("분류처리 실패:", error);
      alert(`분류처리 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    } finally {
      setIsClassifying(false);
    }
  }, [selectedRows, classifiedData, updateMutation, refetch]);

  // 분류결과 지도반영 - 선택된 아이템을 위치 매핑 테이블에 저장
  const handleApplyToMap = useCallback(async () => {
    // 분류 완료된 아이템만 필터링 (appliedYn === "Y" && classificationResult가 있는 경우)
    const classifiedRows = selectedRows.filter(
      (row) => row.appliedYn === "Y" && row.classificationResult
    );

    if (classifiedRows.length === 0) {
      alert("지도에 반영할 분류된 항목이 없습니다. 먼저 자동분류처리를 실행해주세요.");
      return;
    }

    // legalDongCode가 없는 항목 확인
    const rowsWithLegalDong = classifiedRows.filter((row) => row.legalDongCode);
    if (rowsWithLegalDong.length === 0) {
      alert("선택된 항목에 법정동코드가 없어 지도에 반영할 수 없습니다.");
      return;
    }

    setIsApplyingToMap(true);

    try {
      // CreateAssetLocationMappingPayload 배열 생성
      const mappings: CreateAssetLocationMappingPayload[] = rowsWithLegalDong.map((row) => ({
        linkSerialNo: String(row.linkSerialNo),
        legalDongCode: row.legalDongCode!,
        assetName: row.assetName || undefined,
      }));

      // 벌크 저장 API 호출
      const result = await createMappingsMutation.mutateAsync(mappings);

      if (result.created > 0 || result.skipped > 0) {
        alert(
          `지도 반영 완료!\n- 새로 추가: ${result.created}건\n- 이미 존재: ${result.skipped}건`
        );
      } else {
        alert("지도 반영이 완료되었습니다.");
      }

      // 선택 해제
      if (gridRef.current) {
        gridRef.current.api?.deselectAll();
      }
      setSelectedRows([]);
    } catch (error) {
      console.error("지도 반영 실패:", error);
      alert(`지도 반영 중 오류가 발생했습니다: ${error instanceof Error ? error.message : "알 수 없는 오류"}`);
    } finally {
      setIsApplyingToMap(false);
    }
  }, [selectedRows, createMappingsMutation]);

  // 분류결과 지도보기 - 지도 페이지로 이동
  const handleViewMap = useCallback(() => {
    navigate("/govmap/map");
  }, [navigate]);

  // 연도 옵션 생성
  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 5; i <= currentYear + 1; i++) {
      years.push(i.toString());
    }
    return years;
  }, []);

  /** ============================= useEffect 영역 ============================= */

  return (
    <PageContent depth01Title="공유재산 위치표시" $height="100%">
      <S.PageContainer>
        {/* 재산 검색 섹션 */}
        <S.SectionContainer>
          <S.SectionTitle>재산 검색</S.SectionTitle>
          <S.SearchContainer>
            <S.SearchFormArea>
              {/* 재산분류보기 */}
              <S.SearchRow>
                <S.InputGroup>
                  <S.Label>재산분류보기</S.Label>
                </S.InputGroup>
                <S.RadioGroup>
                  <S.RadioItem onClick={() => setPropertyViewType("all")}>
                    <S.RadioCircle $checked={propertyViewType === "all"}>
                      {propertyViewType === "all" && <S.RadioDot />}
                    </S.RadioCircle>
                    <S.RadioLabel>전체</S.RadioLabel>
                  </S.RadioItem>
                  <S.RadioItem onClick={() => setPropertyViewType("admin")}>
                    <S.RadioCircle $checked={propertyViewType === "admin"}>
                      {propertyViewType === "admin" && <S.RadioDot />}
                    </S.RadioCircle>
                    <S.RadioLabel>행정</S.RadioLabel>
                  </S.RadioItem>
                  <S.RadioItem onClick={() => setPropertyViewType("normal")}>
                    <S.RadioCircle $checked={propertyViewType === "normal"}>
                      {propertyViewType === "normal" && <S.RadioDot />}
                    </S.RadioCircle>
                    <S.RadioLabel>일반</S.RadioLabel>
                  </S.RadioItem>
                </S.RadioGroup>
              </S.SearchRow>

              {/* 회계연도 & 사업명 */}
              <S.SearchRowWide>
                <S.InputGroup>
                  <S.Label>회계연도</S.Label>
                  <S.InputGroup>
                    <S.SelectInput>
                      <S.SelectValue>{startYear}</S.SelectValue>
                      <S.SelectIcon>
                        <ChevronDownIcon />
                      </S.SelectIcon>
                      <select
                        value={startYear}
                        onChange={(e) => setStartYear(e.target.value)}
                      >
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </S.SelectInput>
                    <S.RangeSeparator>~</S.RangeSeparator>
                    <S.SelectInput>
                      <S.SelectValue>{endYear}</S.SelectValue>
                      <S.SelectIcon>
                        <ChevronDownIcon />
                      </S.SelectIcon>
                      <select
                        value={endYear}
                        onChange={(e) => setEndYear(e.target.value)}
                      >
                        {yearOptions.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </S.SelectInput>
                  </S.InputGroup>
                </S.InputGroup>
                <S.InputGroupFlex>
                  <S.Label>사업명</S.Label>
                  <S.TextInput
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder=""
                  />
                </S.InputGroupFlex>
              </S.SearchRowWide>

              {/* 관리부서 & 취득부서 */}
              <S.SearchRowWide>
                <S.InputGroupFlex>
                  <S.Label>관리부서</S.Label>
                  <S.TextInput
                    type="text"
                    value={managementDept}
                    onChange={(e) => setManagementDept(e.target.value)}
                    placeholder=""
                  />
                </S.InputGroupFlex>
                <S.InputGroupFlex>
                  <S.Label>취득부서</S.Label>
                  <S.TextInput
                    type="text"
                    value={acquisitionDept}
                    onChange={(e) => setAcquisitionDept(e.target.value)}
                    placeholder=""
                  />
                </S.InputGroupFlex>
              </S.SearchRowWide>
            </S.SearchFormArea>

            {/* 버튼 그룹 */}
            <S.ButtonGroup>
              <S.OutlineButton onClick={handleReset}>
                초기화
                <RefreshIcon />
              </S.OutlineButton>
              <S.OutlineButton onClick={handleSearch}>
                재산 검색
                <SearchIcon />
              </S.OutlineButton>
            </S.ButtonGroup>
          </S.SearchContainer>
        </S.SectionContainer>

        {/* 처리 섹션 */}
        <S.ProcessContainer>
          <S.ProcessContent>
            {/* 재산분류처리 */}
            <S.ProcessRow>
              <S.ProcessInputButton>
                <S.ProcessLabelWrapper>
                  <S.ProcessLabel>재산분류처리</S.ProcessLabel>
                </S.ProcessLabelWrapper>
                <S.PrimaryButton
                  type="button"
                  onClick={handleAutoClassify}
                  disabled={isClassifying || selectedRows.length === 0}
                >
                  {isClassifying ? "분류 처리 중..." : `자동분류처리 실행${selectedRows.length > 0 ? ` (${selectedRows.length}건)` : ""}`}
                  <PlayIcon />
                </S.PrimaryButton>
              </S.ProcessInputButton>
              <S.ResultList>
                <S.ResultLabel>분류결과 :</S.ResultLabel>
                <S.ResultItem>
                  ① 행정재산 확정 :
                  <S.ResultCount>
                    <S.CountValue>{adminConfirmedCount}</S.CountValue>
                    <S.CountUnit>건</S.CountUnit>
                  </S.ResultCount>
                </S.ResultItem>
                <S.Divider>l</S.Divider>
                <S.ResultItem>
                  ② 행정/일반 분할대상 :
                  <S.ResultCount>
                    <S.CountValue>{splitTargetCount}</S.CountValue>
                    <S.CountUnit>건</S.CountUnit>
                  </S.ResultCount>
                </S.ResultItem>
                <S.Divider>l</S.Divider>
                <S.ResultItem>
                  ③ 일반재산 변경대상 :
                  <S.ResultCount>
                    <S.CountValue>{generalChangeCount}</S.CountValue>
                    <S.CountUnit>건</S.CountUnit>
                  </S.ResultCount>
                </S.ResultItem>
              </S.ResultList>
            </S.ProcessRow>

            {/* 지도반영적용 */}
            <S.ProcessRow>
              <S.ProcessInputButton>
                <S.ProcessLabelWrapper>
                  <S.ProcessLabel>지도반영적용</S.ProcessLabel>
                </S.ProcessLabelWrapper>
                <S.PrimaryButton
                  type="button"
                  onClick={handleApplyToMap}
                  disabled={isApplyingToMap || selectedRows.length === 0}
                >
                  {isApplyingToMap ? "지도 반영 중..." : `분류결과 지도반영${selectedRows.length > 0 ? ` (${selectedRows.length}건)` : ""}`}
                  <PlayIcon />
                </S.PrimaryButton>
              </S.ProcessInputButton>
              {createMappingsMutation.isSuccess && <S.CompletedText>반영 완료</S.CompletedText>}
            </S.ProcessRow>

            {/* 지도반영보기 */}
            <S.ProcessRow>
              <S.ProcessInputButton>
                <S.ProcessLabelWrapper>
                  <S.ProcessLabel>지도반영보기</S.ProcessLabel>
                </S.ProcessLabelWrapper>
                <S.PrimaryButton type="button" onClick={handleViewMap}>
                  분류결과 지도보기
                  <MapIcon />
                </S.PrimaryButton>
              </S.ProcessInputButton>
            </S.ProcessRow>
          </S.ProcessContent>
        </S.ProcessContainer>

        {/* 자산현황목록 */}
        <S.GridSection>
          <S.GridHeader>
            <S.GridTitle>자산현황목록</S.GridTitle>
            <S.GridCount>
              총 <S.GridCountValue>{rowData.length}</S.GridCountValue>건
              {isLoading && " (로딩 중...)"}
            </S.GridCount>
          </S.GridHeader>

          <S.GridContainer>
            <Grid
              ref={gridRef}
              columnDefs={columnDefs}
              rowData={rowData}
              height={430}
              rowHeight={40}
              headerHeight={30}
              rowSelection="multiple"
              suppressRowClickSelection={true}
              loading={isLoading || isClassifying}
              onSelectionChanged={handleSelectionChanged}
              onRowClicked={handleRowClicked}
            />
          </S.GridContainer>
        </S.GridSection>
      </S.PageContainer>
    </PageContent>
  );
}
