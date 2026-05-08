/**
 * SharedAssetManagementPage — 공유재산 정보관리 페이지
 *
 * gov_map에서 마이그레이션됨
 * 공유재산 정보 조회 및 관리 기능 제공
 */

import { useMemo, useState, useCallback, useRef } from "react";
import type { ColDef, SelectionChangedEvent } from "ag-grid-community";
import Grid from "@/components/atoms/Grid";
import { PageContent } from "@/components/organisms/PageContent";
import * as S from "./SharedAssetManagementPage.style";
import IconUpload from "@/styles/assets/svg/icon_upload.svg?react";
import IconRefresh from "@/styles/assets/svg/icon_refresh.svg?react";
import IconSearch from "@/styles/assets/svg/icon_search.svg?react";
import IconSave from "@/styles/assets/svg/icon_save.svg?react";
import {
  useAssetStatusDetailSearch,
  useAssetExcelUpload,
  useAssetStatusDetailUpdate,
  type SearchAssetStatusDetailParams,
} from "@/lib/hooks/useAssetStatusDetailSearch";
import type { AssetStatusDetail } from "@/lib/hooks/types/assetStatusDetail";
import { showAlert } from "@/components/containers/Alert";

type PropertyClassification = "all" | "admin" | "normal";

interface SearchFilter {
  classification: PropertyClassification;
  yearStart: string;
  yearEnd: string;
  projectName: string;
  managementDept: string;
  acquisitionDept: string;
}

interface PropertyInfo {
  linkSerialNo: string;
  propertyType: string;
  classificationStatus: string;
  classificationResult: string;
  area: string;
  publicPrice: string;
  assetName: string;
  legalDongCode: string;
  managementDept: string;
  acquisitionDept: string;
}

export default function SharedAssetManagementPage() {
  /** ============================= state 영역 ============================= */
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [searchFilter, setSearchFilter] = useState<SearchFilter>({
    classification: "admin",
    yearStart: "2024",
    yearEnd: "2025",
    projectName: "",
    managementDept: "",
    acquisitionDept: "",
  });

  const [propertyInfo, setPropertyInfo] = useState<PropertyInfo>({
    linkSerialNo: "",
    propertyType: "",
    classificationStatus: "",
    classificationResult: "",
    area: "",
    publicPrice: "",
    assetName: "",
    legalDongCode: "",
    managementDept: "",
    acquisitionDept: "",
  });

  const [searchEnabled, setSearchEnabled] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<AssetStatusDetail | null>(null);

  /** ============================= API 영역 ============================= */
  // 검색 파라미터 변환
  const searchParams: SearchAssetStatusDetailParams = useMemo(() => ({
    propertyUseType: searchFilter.classification,
    startAccountingStandard: searchFilter.yearStart,
    endAccountingStandard: searchFilter.yearEnd,
    detailBusinessName: searchFilter.projectName || undefined,
    managementDept: searchFilter.managementDept || undefined,
    acquisitionDept: searchFilter.acquisitionDept || undefined,
  }), [searchFilter]);

  // 자산현황 검색 API
  const { data: assetData = [], isLoading, refetch } = useAssetStatusDetailSearch(searchParams, searchEnabled);

  // 엑셀 업로드 API
  const uploadMutation = useAssetExcelUpload();

  // 자산현황 수정 API
  const updateMutation = useAssetStatusDetailUpdate();

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
    setSearchEnabled(false);
  }, []);

  const handleSearch = useCallback(() => {
    setSearchEnabled(true);
    refetch();
  }, [refetch]);

  const handleSave = useCallback(async () => {
    if (!selectedAsset || !propertyInfo.linkSerialNo) {
      await showAlert("저장할 자산을 선택해주세요.");
      return;
    }

    try {
      await updateMutation.mutateAsync({
        linkSerialNo: propertyInfo.linkSerialNo,
        propertyUseTypeCode: propertyInfo.propertyType,
        area: propertyInfo.area,
        assetName: propertyInfo.assetName,
        legalDongCode: propertyInfo.legalDongCode,
        managementDept: propertyInfo.managementDept,
        acquisitionDept: propertyInfo.acquisitionDept,
      });
      await showAlert("저장되었습니다.");
    } catch {
      // 에러는 mutation에서 처리됨
    }
  }, [selectedAsset, propertyInfo, updateMutation]);

  const handleDataUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadMutation.mutateAsync(file);
      await showAlert(
        `업로드 완료!\n성공: ${result.successCount}건\n실패: ${result.failedCount}건`
      );
      // 검색 실행
      setSearchEnabled(true);
      refetch();
    } catch {
      // 에러는 mutation에서 처리됨
    } finally {
      // 파일 입력 초기화
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [uploadMutation, refetch]);

  // 그리드 행 선택 시 재산정보 폼에 데이터 반영
  const handleSelectionChanged = useCallback((event: SelectionChangedEvent) => {
    const selectedRows = event.api.getSelectedRows() as AssetStatusDetail[];
    if (selectedRows.length > 0) {
      const asset = selectedRows[0];
      setSelectedAsset(asset);
      setPropertyInfo({
        linkSerialNo: asset.linkSerialNo,
        propertyType: asset.propertyUseTypeCode || "",
        classificationStatus: asset.appliedYn === "Y" ? "O" : "X",
        classificationResult: asset.administrativePropertyTypeCode || "",
        area: asset.area || "",
        publicPrice: asset.propertyValue || "",
        assetName: asset.assetName || "",
        legalDongCode: asset.legalDongCode || "",
        managementDept: asset.managementDept || "",
        acquisitionDept: asset.acquisitionDept || "",
      });
    } else {
      setSelectedAsset(null);
      setPropertyInfo({
        linkSerialNo: "",
        propertyType: "",
        classificationStatus: "",
        classificationResult: "",
        area: "",
        publicPrice: "",
        assetName: "",
        legalDongCode: "",
        managementDept: "",
        acquisitionDept: "",
      });
    }
  }, []);

  /** ============================= 컴포넌트 영역 ============================= */
  // 그리드에 표시할 데이터 (인덱스 추가)
  const rowData = useMemo(
    () =>
      assetData.map((item, index) => ({
        ...item,
        rowIndex: index + 1,
      })),
    [assetData]
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
      { headerName: "No.", field: "rowIndex", width: 53 },
      { headerName: "재산구분", field: "propertyUseTypeCode", width: 83 },
      {
        headerName: "분류처리여부",
        field: "appliedYn",
        width: 111,
        valueFormatter: (params) => (params.value === "Y" ? "O" : "X"),
      },
      { headerName: "분류결과", field: "administrativePropertyTypeCode", width: 121 },
      { headerName: "면적(㎡)", field: "area", width: 92 },
      { headerName: "공시지가", field: "propertyValue", width: 134 },
      { headerName: "자산명", field: "assetName", width: 197 },
      { headerName: "법정동 코드", field: "legalDongCode", width: 332 },
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
    <PageContent depth01Title="공유재산 정보관리" $height="100%">
      <S.PageWrapper>
        {/* 숨겨진 파일 입력 */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />

        {/* 헤더 액션 */}
        <S.HeaderButtons>
          <S.PrimaryButton
            type="button"
            onClick={handleDataUpload}
            disabled={uploadMutation.isPending}
          >
            <span>{uploadMutation.isPending ? "업로드 중..." : "Data Upload"}</span>
            <IconUpload />
          </S.PrimaryButton>
        </S.HeaderButtons>

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
                  $active={searchFilter.classification === "admin"}
                  onClick={() => handleClassificationChange("admin")}
                >
                  <div className="radio-circle">
                    {searchFilter.classification === "admin" && (
                      <div className="radio-inner" />
                    )}
                  </div>
                  <span>행정</span>
                </S.RadioItem>
                <S.RadioItem
                  $active={searchFilter.classification === "normal"}
                  onClick={() => handleClassificationChange("normal")}
                >
                  <div className="radio-circle">
                    {searchFilter.classification === "normal" && (
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
        <S.SectionTitle>재산 정보 {selectedAsset && `(${propertyInfo.linkSerialNo})`}</S.SectionTitle>
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
                  readOnly
                />
              </S.InputGroup>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>분류결과</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.classificationResult}
                  readOnly
                />
              </S.InputGroup>
            </S.FormRowFull>

            {/* 면적 / 공시지가 / 자산명 */}
            <S.FormRowFull>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>면적(㎡)</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.area}
                  onChange={(e) =>
                    handlePropertyInfoChange("area", e.target.value)
                  }
                />
              </S.InputGroup>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>공시지가</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.publicPrice}
                  readOnly
                />
              </S.InputGroup>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>자산명</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.assetName}
                  onChange={(e) =>
                    handlePropertyInfoChange("assetName", e.target.value)
                  }
                />
              </S.InputGroup>
            </S.FormRowFull>

            {/* 법정동코드 / 관리부서 / 취득부서 */}
            <S.FormRowFull>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>법정동코드</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.legalDongCode}
                  onChange={(e) =>
                    handlePropertyInfoChange("legalDongCode", e.target.value)
                  }
                />
              </S.InputGroup>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>관리부서</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.managementDept}
                  onChange={(e) =>
                    handlePropertyInfoChange("managementDept", e.target.value)
                  }
                />
              </S.InputGroup>
              <S.InputGroup $flex={1}>
                <S.Label>
                  <span>취득부서</span>
                </S.Label>
                <S.TextInput
                  type="text"
                  value={propertyInfo.acquisitionDept}
                  onChange={(e) =>
                    handlePropertyInfoChange("acquisitionDept", e.target.value)
                  }
                />
              </S.InputGroup>
            </S.FormRowFull>
          </S.FormArea>

          <S.ButtonGroup>
            <S.OutlineButton
              type="button"
              onClick={handleSave}
              disabled={!selectedAsset || updateMutation.isPending}
            >
              <span>{updateMutation.isPending ? "저장 중..." : "저장"}</span>
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
              총 <strong>{rowData.length}</strong>건
              {isLoading && " (로딩 중...)"}
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
            rowSelection="single"
            suppressRowClickSelection={false}
            onSelectionChanged={handleSelectionChanged}
          />
        </S.GridContainer>
      </S.ListSection>
      </S.PageWrapper>
    </PageContent>
  );
}
