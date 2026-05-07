/**
 * SharedAssetManagementPage — 공유재산 정보관리 페이지
 *
 * gov_map에서 마이그레이션됨
 * 공유재산 정보 조회 및 관리 기능 제공
 */

import { useMemo, useState, useCallback } from "react";
import type { ColDef } from "ag-grid-community";
import Grid from "@/components/atoms/Grid";
import * as S from "./SharedAssetManagementPage.style";
import IconUpload from "@/styles/assets/svg/icon_upload.svg?react";
import IconRefresh from "@/styles/assets/svg/icon_refresh.svg?react";
import IconSearch from "@/styles/assets/svg/icon_search.svg?react";
import IconSave from "@/styles/assets/svg/icon_save.svg?react";

type PropertyClassification = "all" | "administrative" | "general";

interface SearchFilter {
  classification: PropertyClassification;
  yearStart: string;
  yearEnd: string;
  projectName: string;
  managementDept: string;
  acquisitionDept: string;
}

interface PropertyInfo {
  propertyType: string;
  classificationStatus: string;
  classificationResult: string;
  area1: string;
  publicPrice1: string;
  assetName1: string;
  area2: string;
  publicPrice2: string;
  assetName2: string;
}

interface AssetData {
  id: number;
  type: string;
  isClassified: boolean;
  result: string;
  areaSqm: number;
  publicPrice: string;
  assetName: string;
  code: string;
}

export default function SharedAssetManagementPage() {
  /** ============================= state 영역 ============================= */
  const [searchFilter, setSearchFilter] = useState<SearchFilter>({
    classification: "administrative",
    yearStart: "2024",
    yearEnd: "2025",
    projectName: "",
    managementDept: "",
    acquisitionDept: "",
  });

  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo>({
    propertyType: "",
    classificationStatus: "",
    classificationResult: "",
    area1: "",
    publicPrice1: "",
    assetName1: "",
    area2: "",
    publicPrice2: "",
    assetName2: "",
  });

  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  /** ============================= API 영역 ============================= */

  /** ============================= 비즈니스 로직 영역 ============================= */
  const handleClassificationChange = useCallback((value: PropertyClassification) => {
    setSearchFilter((prev) => ({ ...prev, classification: value }));
  }, []);

  const handleSearchFilterChange = useCallback(
    (field: keyof SearchFilter, value: string) => {
      setSearchFilter((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handlePropertyInfoChange = useCallback(
    (field: keyof PropertyInfo, value: string) => {
      setPropertyInfo((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleReset = useCallback(() => {
    setSearchFilter({
      classification: "all",
      yearStart: "2024",
      yearEnd: "2025",
      projectName: "",
      managementDept: "",
      acquisitionDept: "",
    });
  }, []);

  const handleSearch = useCallback(() => {
    console.log("Search with filter:", searchFilter);
  }, [searchFilter]);

  const handleSave = useCallback(() => {
    console.log("Save property info:", propertyInfo);
  }, [propertyInfo]);

  const handleDataUpload = useCallback(() => {
    console.log("Data upload clicked");
  }, []);

  /** ============================= 컴포넌트 영역 ============================= */
  const rowData: AssetData[] = useMemo(
    () => [
      {
        id: 1,
        type: "행정",
        isClassified: true,
        result: "행정확정",
        areaSqm: 123,
        publicPrice: '"',
        assetName: "경상남도 남해군 창선면 광천면...",
        code: "경상남도 남해군 창선면 광천리 신지번 65-2",
      },
      {
        id: 2,
        type: "행정",
        isClassified: true,
        result: "분할대상",
        areaSqm: 123,
        publicPrice: '"',
        assetName: "경상남도 남해군 창선면 광천면...",
        code: "경상남도 남해군 창선면 광천리 신지번 65-2",
      },
      {
        id: 3,
        type: "행정",
        isClassified: true,
        result: "행정확정",
        areaSqm: 123,
        publicPrice: '"',
        assetName: "경상남도 남해군 창선면 광천면...",
        code: "경상남도 남해군 창선면 광천리 신지번 65-2",
      },
      {
        id: 4,
        type: "상업",
        isClassified: false,
        result: "상업확정",
        areaSqm: 456,
        publicPrice: '"',
        assetName: "부산광역시 해운대구 우동...",
        code: "부산광역시 해운대구 우동 신지번 78-1",
      },
      {
        id: 5,
        type: "주거",
        isClassified: true,
        result: "주거확정",
        areaSqm: 789,
        publicPrice: '"',
        assetName: "서울특별시 강남구 역삼동...",
        code: "서울특별시 강남구 역삼리 신지번 90-3",
      },
      {
        id: 6,
        type: "산업",
        isClassified: false,
        result: "산업확정",
        areaSqm: 101,
        publicPrice: '"',
        assetName: "인천광역시 남동구 구월동...",
        code: "인천광역시 남동구 구월리 신지번 22-4",
      },
      {
        id: 7,
        type: "관광",
        isClassified: true,
        result: "관광확정",
        areaSqm: 202,
        publicPrice: '"',
        assetName: "제주특별자치도 제주시 애월읍...",
        code: "제주특별자치도 제주시 애월리 신지번 44-5",
      },
      {
        id: 8,
        type: "농업",
        isClassified: false,
        result: "농업확정",
        areaSqm: 303,
        publicPrice: '"',
        assetName: "전라북도 전주시 완산구...",
        code: "전라북도 전주시 완산리 신지번 66-7",
      },
      {
        id: 9,
        type: "농업",
        isClassified: false,
        result: "농업확정",
        areaSqm: 303,
        publicPrice: '"',
        assetName: "전라북도 전주시 완산구...",
        code: "전라북도 전주시 완산리 신지번 66-7",
      },
      {
        id: 10,
        type: "농업",
        isClassified: false,
        result: "농업확정",
        areaSqm: 303,
        publicPrice: '"',
        assetName: "전라북도 전주시 완산구...",
        code: "전라북도 전주시 완산리 신지번 66-7",
      },
    ],
    []
  );

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
      { headerName: "재산구분", field: "type", width: 83 },
      {
        headerName: "분류처리여부",
        field: "isClassified",
        width: 111,
        valueFormatter: (params) => (params.value ? "O" : "X"),
      },
      { headerName: "분류결과", field: "result", width: 121 },
      { headerName: "면적(㎡)", field: "areaSqm", width: 92 },
      { headerName: "공시지가", field: "publicPrice", width: 134 },
      { headerName: "자산명", field: "assetName", width: 197 },
      { headerName: "법정동 코드", field: "code", width: 332 },
    ],
    []
  );

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
    <S.PageWrapper>
      {/* 페이지 헤더 */}
      <S.PageHeader>
        <S.PageTitle>공유재산 정보관리</S.PageTitle>
        <S.HeaderButtons>
          <S.PrimaryButton type="button" onClick={handleDataUpload}>
            <span>Data Upload</span>
            <IconUpload />
          </S.PrimaryButton>
        </S.HeaderButtons>
      </S.PageHeader>

      {/* 재산 검색 섹션 */}
      <S.Section>
        <S.SectionTitle>재산 검색</S.SectionTitle>
        <S.Container>
          <S.FormArea>
            {/* 재산분류보기 라디오 */}
            <S.FormRow>
              <S.InputGroup>
                <S.Label>
                  <span>재산분류보기</span>
                </S.Label>
              </S.InputGroup>
              <S.RadioList>
                <S.RadioItem
                  $active={searchFilter.classification === "all"}
                  onClick={() => handleClassificationChange("all")}
                >
                  <div className="radio-circle">
                    {searchFilter.classification === "all" && (
                      <div className="radio-inner" />
                    )}
                  </div>
                  <span>전체</span>
                </S.RadioItem>
                <S.RadioItem
                  $active={searchFilter.classification === "administrative"}
                  onClick={() => handleClassificationChange("administrative")}
                >
                  <div className="radio-circle">
                    {searchFilter.classification === "administrative" && (
                      <div className="radio-inner" />
                    )}
                  </div>
                  <span>행정</span>
                </S.RadioItem>
                <S.RadioItem
                  $active={searchFilter.classification === "general"}
                  onClick={() => handleClassificationChange("general")}
                >
                  <div className="radio-circle">
                    {searchFilter.classification === "general" && (
                      <div className="radio-inner" />
                    )}
                  </div>
                  <span>일반</span>
                </S.RadioItem>
              </S.RadioList>
            </S.FormRow>

            {/* 회계연도 / 사업명 */}
            <S.FormRowFull>
              <S.InputGroup>
                <S.Label>
                  <span>회계연도</span>
                </S.Label>
                <S.DateRangeGroup>
                  <S.SelectInput>
                    <select
                      value={searchFilter.yearStart}
                      onChange={(e) =>
                        handleSearchFilterChange("yearStart", e.target.value)
                      }
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </S.SelectInput>
                  <span className="separator">~</span>
                  <S.SelectInput>
                    <select
                      value={searchFilter.yearEnd}
                      onChange={(e) =>
                        handleSearchFilterChange("yearEnd", e.target.value)
                      }
                    >
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </S.SelectInput>
                </S.DateRangeGroup>
              </S.InputGroup>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>사업명</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={searchFilter.projectName}
                  onChange={(e) =>
                    handleSearchFilterChange("projectName", e.target.value)
                  }
                />
              </S.InputGroup>
            </S.FormRowFull>

            {/* 관리부서 / 취득부서 */}
            <S.FormRowFull>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>관리부서</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={searchFilter.managementDept}
                  onChange={(e) =>
                    handleSearchFilterChange("managementDept", e.target.value)
                  }
                />
              </S.InputGroup>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>취득부서</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={searchFilter.acquisitionDept}
                  onChange={(e) =>
                    handleSearchFilterChange("acquisitionDept", e.target.value)
                  }
                />
              </S.InputGroup>
            </S.FormRowFull>
          </S.FormArea>

          <S.ButtonGroup>
            <S.OutlineButton type="button" onClick={handleReset}>
              <span>초기화</span>
              <IconRefresh />
            </S.OutlineButton>
            <S.OutlineButton type="button" onClick={handleSearch}>
              <span>재산 검색</span>
              <IconSearch />
            </S.OutlineButton>
          </S.ButtonGroup>
        </S.Container>
      </S.Section>

      {/* 재산 정보 섹션 */}
      <S.Section>
        <S.SectionTitle>재산 정보</S.SectionTitle>
        <S.Container>
          <S.FormArea $width="1080px">
            {/* 재산구분 / 분류처리여부 / 분류결과 */}
            <S.FormRowFull>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>재산구분</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.propertyType}
                  onChange={(e) =>
                    handlePropertyInfoChange("propertyType", e.target.value)
                  }
                />
              </S.InputGroup>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>분류처리여부</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.classificationStatus}
                  onChange={(e) =>
                    handlePropertyInfoChange("classificationStatus", e.target.value)
                  }
                />
              </S.InputGroup>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>분류결과</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.classificationResult}
                  onChange={(e) =>
                    handlePropertyInfoChange("classificationResult", e.target.value)
                  }
                />
              </S.InputGroup>
            </S.FormRowFull>

            {/* 면적 / 공시지가 / 자산명 (1) */}
            <S.FormRowFull>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>면적(㎡)</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.area1}
                  onChange={(e) =>
                    handlePropertyInfoChange("area1", e.target.value)
                  }
                />
              </S.InputGroup>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>공시지가</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.publicPrice1}
                  onChange={(e) =>
                    handlePropertyInfoChange("publicPrice1", e.target.value)
                  }
                />
              </S.InputGroup>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>자산명</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.assetName1}
                  onChange={(e) =>
                    handlePropertyInfoChange("assetName1", e.target.value)
                  }
                />
              </S.InputGroup>
            </S.FormRowFull>

            {/* 면적 / 공시지가 / 자산명 (2) */}
            <S.FormRowFull>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>면적(㎡)</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.area2}
                  onChange={(e) =>
                    handlePropertyInfoChange("area2", e.target.value)
                  }
                />
              </S.InputGroup>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>공시지가</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.publicPrice2}
                  onChange={(e) =>
                    handlePropertyInfoChange("publicPrice2", e.target.value)
                  }
                />
              </S.InputGroup>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>자산명</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.assetName2}
                  onChange={(e) =>
                    handlePropertyInfoChange("assetName2", e.target.value)
                  }
                />
              </S.InputGroup>
            </S.FormRowFull>
          </S.FormArea>

          <S.ButtonGroup>
            <S.OutlineButton type="button" onClick={handleSave}>
              <span>저장</span>
              <IconSave />
            </S.OutlineButton>
          </S.ButtonGroup>
        </S.Container>
      </S.Section>

      {/* 자산현황목록 섹션 */}
      <S.ListSection>
        <S.ListHeader>
          <S.ListTitleGroup>
            <S.ListTitle>자산현황목록</S.ListTitle>
            <S.ListCount>
              총 <strong>{rowData.length > 100 ? 118 : rowData.length}</strong>건
            </S.ListCount>
          </S.ListTitleGroup>
        </S.ListHeader>

        <S.GridContainer>
          <Grid
            columnDefs={columnDefs}
            rowData={rowData}
            height={430}
            rowHeight={40}
            headerHeight={30}
            rowSelection="multiple"
            suppressRowClickSelection={true}
          />
        </S.GridContainer>
      </S.ListSection>
    </S.PageWrapper>
  );
}
