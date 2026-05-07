/**
 * SharedAssetLocationPage — 공유재산 위치표시 페이지
 *
 * Figma 디자인 기반으로 마이그레이션됨
 * 자산현황 검색 및 위치 매핑 기능 제공
 */

import { useState, useMemo } from "react";
import type { ColDef } from "ag-grid-community";
import { PageContent } from "@/components/organisms/PageContent";
import Grid from "@/components/atoms/Grid";
import * as S from "./SharedAssetLocationPage.style";

// 아이콘 컴포넌트
const ChevronDownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M6 9L12 15L18 9" stroke="#6A7282" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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

// 타입 정의
interface AssetData {
  id: number;
  propertyType: string;
  isProcessed: boolean;
  classificationResult: string;
  area: number;
  publicPrice: string;
  assetName: string;
  legalDongCode: string;
}

export default function SharedAssetLocationPage() {
  /** ============================= state 영역 ============================= */
  const [propertyViewType, setPropertyViewType] = useState<"all" | "admin" | "general">("admin");
  const [startYear, setStartYear] = useState("2024");
  const [endYear, setEndYear] = useState("2025");
  const [projectName, setProjectName] = useState("");
  const [managementDept, setManagementDept] = useState("");
  const [acquisitionDept, setAcquisitionDept] = useState("");

  // 분류 결과 카운트
  const [adminConfirmedCount] = useState(0);
  const [splitTargetCount] = useState(0);
  const [generalChangeCount] = useState(0);

  /** ============================= API 영역 ============================= */

  /** ============================= 비즈니스 로직 영역 ============================= */

  // 더미 데이터
  const assetData: AssetData[] = useMemo(
    () => [
      { id: 1, propertyType: "행정", isProcessed: true, classificationResult: "행정확정", area: 123, publicPrice: '"', assetName: "경상남도 남해군 창선면 광천면...", legalDongCode: "경상남도 남해군 창선면 광천리 신지번 65 -2" },
      { id: 2, propertyType: "행정", isProcessed: true, classificationResult: "분할대상", area: 123, publicPrice: '"', assetName: "경상남도 남해군 창선면 광천면...", legalDongCode: "경상남도 남해군 창선면 광천리 신지번 65 -2" },
      { id: 3, propertyType: "행정", isProcessed: true, classificationResult: "행정확정", area: 123, publicPrice: '"', assetName: "경상남도 남해군 창선면 광천면...", legalDongCode: "경상남도 남해군 창선면 광천리 신지번 65 -2" },
      { id: 4, propertyType: "상업", isProcessed: false, classificationResult: "상업확정", area: 456, publicPrice: '"', assetName: "부산광역시 해운대구 우동...", legalDongCode: "부산광역시 해운대구 우동 신지번 78-1" },
      { id: 5, propertyType: "주거", isProcessed: true, classificationResult: "주거확정", area: 789, publicPrice: '"', assetName: "서울특별시 강남구 역삼동...", legalDongCode: "서울특별시 강남구 역삼리 신지번 90-3" },
      { id: 6, propertyType: "산업", isProcessed: false, classificationResult: "산업확정", area: 101, publicPrice: '"', assetName: "인천광역시 남동구 구월동...", legalDongCode: "인천광역시 남동구 구월리 신지번 22-4" },
      { id: 7, propertyType: "관광", isProcessed: true, classificationResult: "관광확정", area: 202, publicPrice: '"', assetName: "제주특별자치도 제주시 애월읍...", legalDongCode: "제주특별자치도 제주시 애월리 신지번 44-5" },
      { id: 8, propertyType: "농업", isProcessed: false, classificationResult: "농업확정", area: 303, publicPrice: '"', assetName: "전라북도 전주시 완산구...", legalDongCode: "전라북도 전주시 완산리 신지번 66-7" },
      { id: 9, propertyType: "농업", isProcessed: false, classificationResult: "농업확정", area: 303, publicPrice: '"', assetName: "전라북도 전주시 완산구...", legalDongCode: "전라북도 전주시 완산리 신지번 66-7" },
      { id: 10, propertyType: "농업", isProcessed: false, classificationResult: "농업확정", area: 303, publicPrice: '"', assetName: "전라북도 전주시 완산구...", legalDongCode: "전라북도 전주시 완산리 신지번 66-7" },
    ],
    []
  );

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
      { headerName: "No.", field: "id", width: 53 },
      { headerName: "재산구분", field: "propertyType", width: 83 },
      {
        headerName: "분류처리여부",
        field: "isProcessed",
        width: 111,
        valueFormatter: (params) => (params.value ? "O" : "X"),
      },
      { headerName: "분류결과", field: "classificationResult", width: 121 },
      { headerName: "면적(㎡)", field: "area", width: 92 },
      { headerName: "공시지가", field: "publicPrice", width: 134 },
      { headerName: "자산명", field: "assetName", width: 197 },
      { headerName: "법정동 코드", field: "legalDongCode", width: 332 },
    ],
    []
  );

  const handleReset = () => {
    setPropertyViewType("all");
    setStartYear("2024");
    setEndYear("2025");
    setProjectName("");
    setManagementDept("");
    setAcquisitionDept("");
  };

  const handleSearch = () => {
    console.log("검색 실행:", { propertyViewType, startYear, endYear, projectName, managementDept, acquisitionDept });
  };

  const handleAutoClassify = () => {
    console.log("자동분류처리 실행");
  };

  const handleApplyToMap = () => {
    console.log("분류결과 지도반영");
  };

  const handleViewMap = () => {
    console.log("분류결과 지도보기");
  };

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
                  <S.RadioItem onClick={() => setPropertyViewType("general")}>
                    <S.RadioCircle $checked={propertyViewType === "general"}>
                      {propertyViewType === "general" && <S.RadioDot />}
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
                    </S.SelectInput>
                    <S.RangeSeparator>~</S.RangeSeparator>
                    <S.SelectInput>
                      <S.SelectValue>{endYear}</S.SelectValue>
                      <S.SelectIcon>
                        <ChevronDownIcon />
                      </S.SelectIcon>
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
                <S.ProcessLabel>재산분류처리</S.ProcessLabel>
                <S.PrimaryButton onClick={handleAutoClassify}>
                  자동분류처리 실행
                  <PlayIcon />
                </S.PrimaryButton>
              </S.ProcessInputButton>
              <S.ResultList>
                <S.ResultLabel>분류결과 :</S.ResultLabel>
                <S.ResultItem>
                  ① 행정재산 확정 :
                  <S.ResultCount>
                    <S.CountValue>{adminConfirmedCount}</S.CountValue>건
                  </S.ResultCount>
                </S.ResultItem>
                <S.Divider>|</S.Divider>
                <S.ResultItem>
                  ② 행정/일반 분할대상 :
                  <S.ResultCount>
                    <S.CountValue>{splitTargetCount}</S.CountValue>건
                  </S.ResultCount>
                </S.ResultItem>
                <S.Divider>|</S.Divider>
                <S.ResultItem>
                  ③ 일반재산 변경대상 :
                  <S.ResultCount>
                    <S.CountValue>{generalChangeCount}</S.CountValue>건
                  </S.ResultCount>
                </S.ResultItem>
              </S.ResultList>
            </S.ProcessRow>

            {/* 지도반영적용 */}
            <S.ProcessRow>
              <S.ProcessInputButton>
                <S.ProcessLabel>지도반영적용</S.ProcessLabel>
                <S.DisabledButton disabled onClick={handleApplyToMap}>
                  분류결과 지도반영
                  <PlayIcon />
                </S.DisabledButton>
              </S.ProcessInputButton>
              <S.CompletedText>반영 완료</S.CompletedText>
            </S.ProcessRow>

            {/* 지도반영보기 */}
            <S.ProcessRow>
              <S.ProcessInputButton>
                <S.ProcessLabel>지도반영보기</S.ProcessLabel>
                <S.DisabledButton disabled onClick={handleViewMap}>
                  분류결과 지도보기
                  <MapIcon />
                </S.DisabledButton>
              </S.ProcessInputButton>
            </S.ProcessRow>
          </S.ProcessContent>
        </S.ProcessContainer>

        {/* 자산현황목록 */}
        <S.GridSection>
          <S.GridHeader>
            <S.GridTitle>자산현황목록</S.GridTitle>
            <S.GridCount>
              총 <S.GridCountValue>{assetData.length > 100 ? 118 : assetData.length}</S.GridCountValue>건
            </S.GridCount>
          </S.GridHeader>

          <S.GridContainer>
            <Grid
              columnDefs={columnDefs}
              rowData={assetData}
              height={430}
              rowHeight={40}
              headerHeight={30}
              rowSelection="multiple"
              suppressRowClickSelection={true}
            />
          </S.GridContainer>
        </S.GridSection>
      </S.PageContainer>
    </PageContent>
  );
}
