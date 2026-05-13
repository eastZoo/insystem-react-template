/**
 * 사용자 관리 페이지
 * @description 사용자 정보 조회, 등록, 수정 기능을 제공하는 페이지
 */
import { useState, useCallback } from "react";
import { IsInputText, IsSelect, IsButton, IsCheckbox } from "insystem-atoms";
import { Tabs } from "@/components/atoms/Tabs";
import { RadioGroup } from "@/components/atoms/RadioGroup";
import { Pagination } from "@/components/atoms/Pagination";
import { SearchIcon, CalendarIcon } from "@/styles/icons";
import * as S from "./index.style";

/* ========================================
   타입 정의
   ======================================== */

interface UserInfo {
  id: string;
  name: string;
  nameEn: string;
  division: string;
  ssn: string;
  birthDate: string;
  phone1: string;
  phone2: string;
  phone3: string;
  email1: string;
  email2: string;
  zipCode: string;
  address: string;
  addressDetail: string;
  maritalStatus: "married" | "single";
}

interface UserListItem {
  id: string;
  name: string;
  department: string;
}

/* ========================================
   상수 정의
   ======================================== */

const TABS = [
  { id: "basic", label: "기본 정보" },
  { id: "transaction", label: "거래 정보" },
  { id: "salary", label: "급여 정보" },
  { id: "manager", label: "담당자 정보" },
];

const DIVISION_OPTIONS = [
  { value: "", label: "선택" },
  { value: "regular", label: "정규직" },
  { value: "contract", label: "계약직" },
  { value: "parttime", label: "파트타임" },
];

const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "active", label: "재직" },
  { value: "resigned", label: "퇴직" },
  { value: "leave", label: "휴직" },
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "management", label: "경영" },
  { value: "development", label: "개발" },
  { value: "sales", label: "영업" },
];

const TYPE_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "internal", label: "내부" },
  { value: "external", label: "외부" },
];

const MARITAL_STATUS_OPTIONS = [
  { value: "married", label: "기혼" },
  { value: "single", label: "미혼" },
];

const PHONE_PREFIX_OPTIONS = [
  { value: "010", label: "010" },
  { value: "011", label: "011" },
  { value: "016", label: "016" },
  { value: "017", label: "017" },
  { value: "018", label: "018" },
  { value: "019", label: "019" },
];

/* ========================================
   초기값
   ======================================== */

const initialUserInfo: UserInfo = {
  id: "",
  name: "",
  nameEn: "",
  division: "",
  ssn: "",
  birthDate: "",
  phone1: "010",
  phone2: "",
  phone3: "",
  email1: "",
  email2: "",
  zipCode: "",
  address: "",
  addressDetail: "",
  maritalStatus: "married",
};

/* ========================================
   메인 컴포넌트
   ======================================== */

export default function UserManagementPage() {
  /* ============================= state 영역 ============================= */

  // 검색 필터 상태
  const [department, setDepartment] = useState("");
  const [employeeName, setEmployeeName] = useState("");
  const [employmentStatus, setEmploymentStatus] = useState("all");
  const [isChecked, setIsChecked] = useState(false);
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");

  // 좌측 패널 상태
  const [userList] = useState<UserListItem[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(1);

  // 우측 패널 상태
  const [activeTab, setActiveTab] = useState("basic");
  const [leftUserInfo, setLeftUserInfo] = useState<UserInfo>(initialUserInfo);
  const [rightUserInfo, setRightUserInfo] = useState<UserInfo>(initialUserInfo);

  /* ============================= API 영역 ============================= */

  // TODO: API 연동

  /* ============================= 비즈니스 로직 영역 ============================= */

  /** 검색 핸들러 */
  const handleSearch = useCallback(() => {
    console.log("검색:", {
      department,
      employeeName,
      employmentStatus,
      isChecked,
      category,
      type,
    });
    // TODO: API 호출
  }, [department, employeeName, employmentStatus, isChecked, category, type]);

  /** 초기화 핸들러 */
  const handleReset = useCallback(() => {
    setDepartment("");
    setEmployeeName("");
    setEmploymentStatus("all");
    setIsChecked(false);
    setCategory("all");
    setType("all");
  }, []);

  /** 사용자 선택 핸들러 */
  const handleSelectUser = useCallback((userId: string) => {
    setSelectedUserId(userId);
    // TODO: 사용자 정보 로드
  }, []);

  /** 주소 검색 핸들러 */
  const handleAddressSearch = useCallback((side: "left" | "right") => {
    console.log("주소 검색:", side);
    // TODO: 주소 검색 모달 열기
  }, []);

  /** 좌측 폼 업데이트 핸들러 */
  const updateLeftUserInfo = useCallback(
    (field: keyof UserInfo, value: string) => {
      setLeftUserInfo((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  /** 우측 폼 업데이트 핸들러 */
  const updateRightUserInfo = useCallback(
    (field: keyof UserInfo, value: string) => {
      setRightUserInfo((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  /* ============================= 컴포넌트 영역 ============================= */

  /** 기본 정보 폼 컬럼 렌더링 */
  const renderBasicInfoColumn = (
    userInfo: UserInfo,
    updateUserInfo: (field: keyof UserInfo, value: string) => void,
    side: "left" | "right"
  ) => (
    <S.FormTableColumn>
      {/* 성명 */}
      <S.FormTableRow $isFirst>
        <S.FormTableLabel $required>성명</S.FormTableLabel>
        <S.FormTableCell>
          <IsInputText
            size="xSmall"
            value={userInfo.name}
            onChange={(e) => updateUserInfo("name", e.target.value)}
            placeholderText="입력해주세요."
            labelShow={false}
            placeholderActive
            fullWidth
          />
        </S.FormTableCell>
      </S.FormTableRow>

      {/* 성명(영문) */}
      <S.FormTableRow>
        <S.FormTableLabel>성명(영문)</S.FormTableLabel>
        <S.FormTableCell>
          <IsInputText
            size="xSmall"
            value={userInfo.nameEn}
            onChange={(e) => updateUserInfo("nameEn", e.target.value)}
            placeholderText="Name"
            labelShow={false}
            placeholderActive
            fullWidth
          />
        </S.FormTableCell>
      </S.FormTableRow>

      {/* 구분 */}
      <S.FormTableRow>
        <S.FormTableLabel>구분</S.FormTableLabel>
        <S.FormTableCell>
          <IsSelect
            size="xSmall"
            value={userInfo.division}
            onChange={(value) => updateUserInfo("division", value)}
            options={DIVISION_OPTIONS}
            labelShow={false}
            fullWidth
          />
        </S.FormTableCell>
      </S.FormTableRow>

      {/* 주민등록번호 */}
      <S.FormTableRow>
        <S.FormTableLabel $required>주민등록번호</S.FormTableLabel>
        <S.FormTableCell>
          <IsInputText
            size="xSmall"
            value={userInfo.ssn}
            onChange={(e) => updateUserInfo("ssn", e.target.value)}
            placeholderText="'-' 없이 숫자만 입력"
            labelShow={false}
            placeholderActive
            fullWidth
          />
        </S.FormTableCell>
      </S.FormTableRow>

      {/* 생년월일 */}
      <S.FormTableRow>
        <S.FormTableLabel $required>생년월일</S.FormTableLabel>
        <S.FormTableCell>
          <IsInputText
            size="xSmall"
            type="date"
            value={userInfo.birthDate}
            onChange={(e) => updateUserInfo("birthDate", e.target.value)}
            placeholderText="연도-월-일"
            labelShow={false}
            placeholderActive
            fullWidth
            rightIconSlot={<CalendarIcon />}
          />
        </S.FormTableCell>
      </S.FormTableRow>

      {/* 휴대폰번호 */}
      <S.FormTableRow>
        <S.FormTableLabel>휴대폰번호</S.FormTableLabel>
        <S.FormTableCell>
          <S.PhoneInputGroup>
            <IsSelect
              size="xSmall"
              value={userInfo.phone1}
              onChange={(value) => updateUserInfo("phone1", value)}
              labelShow={false}
              options={PHONE_PREFIX_OPTIONS}
              width={70}
            />
            <S.PhoneSeparator>-</S.PhoneSeparator>
            <IsInputText
              size="xSmall"
              value={userInfo.phone2}
              onChange={(e) => updateUserInfo("phone2", e.target.value)}
              maxLength={4}
              labelShow={false}
              fullWidth
            />
            <S.PhoneSeparator>-</S.PhoneSeparator>
            <IsInputText
              size="xSmall"
              value={userInfo.phone3}
              onChange={(e) => updateUserInfo("phone3", e.target.value)}
              maxLength={4}
              labelShow={false}
              fullWidth
            />
          </S.PhoneInputGroup>
        </S.FormTableCell>
      </S.FormTableRow>

      {/* 이메일 */}
      <S.FormTableRow>
        <S.FormTableLabel>이메일</S.FormTableLabel>
        <S.FormTableCell>
          <S.EmailInputGroup>
            <IsInputText
              size="xSmall"
              value={userInfo.email1}
              onChange={(e) => updateUserInfo("email1", e.target.value)}
              labelShow={false}
              fullWidth
            />
            <S.EmailSeparator>@</S.EmailSeparator>
            <IsInputText
              size="xSmall"
              value={userInfo.email2}
              onChange={(e) => updateUserInfo("email2", e.target.value)}
              labelShow={false}
              fullWidth
            />
          </S.EmailInputGroup>
        </S.FormTableCell>
      </S.FormTableRow>

      {/* 주소 */}
      <S.FormTableRow $multiLine>
        <S.FormTableLabel $multiLine>주소</S.FormTableLabel>
        <S.FormTableCell $multiLine>
          <S.AddressInputGroup>
            <S.AddressSearchRow>
              <S.AddressSearchButton
                variant="solid"
                color="primary"
                size="xs"
                onClick={() => handleAddressSearch(side)}
              >
                주소검색
              </S.AddressSearchButton>
              <IsInputText
                size="xSmall"
                value={userInfo.zipCode}
                readOnly
                labelShow={false}
                fullWidth
              />
            </S.AddressSearchRow>
            <IsInputText
              size="xSmall"
              value={userInfo.addressDetail}
              onChange={(e) => updateUserInfo("addressDetail", e.target.value)}
              placeholderText="상세주소를 입력하세요."
              labelShow={false}
              placeholderActive
              fullWidth
            />
          </S.AddressInputGroup>
        </S.FormTableCell>
      </S.FormTableRow>

      {/* 결혼 여부 */}
      <S.FormTableRow $isLast>
        <S.FormTableLabel>결혼 여부</S.FormTableLabel>
        <S.FormTableCell>
          <RadioGroup
            name={`maritalStatus-${side}`}
            options={MARITAL_STATUS_OPTIONS}
            value={userInfo.maritalStatus}
            onChange={(value) =>
              updateUserInfo("maritalStatus", value as "married" | "single")
            }
            direction="horizontal"
            gap={16}
          />
        </S.FormTableCell>
      </S.FormTableRow>
    </S.FormTableColumn>
  );

  /* ============================= useEffect 영역 ============================= */

  /* ============================= 렌더링 ============================= */

  return (
    <>
      <title>사용자 관리</title>
      <S.PageContainer>
        {/* 페이지 헤더 */}
        <S.PageHeader>
          <S.PageTitle>사용자 관리</S.PageTitle>
        </S.PageHeader>

        {/* 메인 컨텐츠 */}
        <S.MainContainer>
          {/* 타이틀 */}
          <S.TitleSection>
            <S.MainTitle>사용자 관리</S.MainTitle>
          </S.TitleSection>

          {/* 검색 필터 - 피그마 기준: 컨테이너 + 입력그룹 + 버튼그룹 분리 */}
          <S.SearchFilterContainer>
            {/* 필터 입력 그룹 */}
            <S.FilterInputGroup>
              {/* 부서 */}
              <S.FilterFieldWrapper>
                <IsInputText
                  size="xSmall"
                  position="row"
                  label="부서"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholderText="부서명 입력"
                  placeholderActive
                  fullWidth
                />
              </S.FilterFieldWrapper>

              {/* 사원명 */}
              <S.FilterFieldWrapper>
                <IsInputText
                  size="xSmall"
                  position="row"
                  label="사원명"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholderText="사원명 입력"
                  labelShow={false}
                  placeholderActive
                  fullWidth
                />
              </S.FilterFieldWrapper>

              {/* 재직구분 */}
              <S.FilterFieldWrapper>
                <IsSelect
                  size="xSmall"
                  position="row"
                  label="재직구분"
                  value={employmentStatus}
                  onChange={setEmploymentStatus}
                  options={EMPLOYMENT_STATUS_OPTIONS}
                  fullWidth
                />
              </S.FilterFieldWrapper>

              {/* Check */}
              <IsCheckbox
                size="small"
                label="Check"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />

              {/* 분류 */}
              <S.FilterFieldWrapper>
                <IsSelect
                  size="xSmall"
                  position="row"
                  label="분류"
                  value={category}
                  onChange={setCategory}
                  options={CATEGORY_OPTIONS}
                  fullWidth
                />
              </S.FilterFieldWrapper>

              {/* 형태 */}
              <S.FilterFieldWrapper>
                <IsSelect
                  size="xSmall"
                  position="row"
                  label="형태"
                  value={type}
                  onChange={setType}
                  options={TYPE_OPTIONS}
                  fullWidth
                />
              </S.FilterFieldWrapper>
            </S.FilterInputGroup>

            {/* 검색/초기화 버튼 그룹 */}
            <S.SearchButtonGroup>
              <IsButton
                variant="solid"
                color="primary"
                size="xs"
                onClick={handleSearch}
                leftIconSlot={<SearchIcon />}
              >
                검색
              </IsButton>
              <IsButton
                variant="solid"
                color="secondary"
                size="sm"
                onClick={handleReset}
              >
                초기화
              </IsButton>
            </S.SearchButtonGroup>
          </S.SearchFilterContainer>

          {/* 컨텐츠 영역 (좌우 분할) */}
          <S.ContentWrapper>
            {/* 좌측 패널: 인사 정보 리스트 */}
            <S.LeftPanel>
              <S.PanelHeader>
                <S.PanelTitle>인사 정보</S.PanelTitle>
                <S.CountBadge>총 {userList.length}건</S.CountBadge>
              </S.PanelHeader>

              <S.ListContainer>
                {userList.length === 0 ? (
                  <S.EmptyState>데이터가 없습니다.</S.EmptyState>
                ) : (
                  userList.map((user) => (
                    <S.ListItem
                      key={user.id}
                      $selected={selectedUserId === user.id}
                      onClick={() => handleSelectUser(user.id)}
                    >
                      <S.ListItemText>{user.name}</S.ListItemText>
                    </S.ListItem>
                  ))
                )}
              </S.ListContainer>

              <S.PanelFooter>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </S.PanelFooter>
            </S.LeftPanel>

            {/* 우측 패널: 상세 정보 */}
            <S.RightPanel>
              <S.TabContainer>
                <Tabs
                  tabs={TABS}
                  activeTab={activeTab}
                  onTabChange={setActiveTab}
                  fullWidth
                />
              </S.TabContainer>

              <S.TabContent>
                {activeTab === "basic" && (
                  <S.FormTable>
                    {/* 좌측 폼 */}
                    {renderBasicInfoColumn(
                      leftUserInfo,
                      updateLeftUserInfo,
                      "left"
                    )}
                    {/* 우측 폼 */}
                    {renderBasicInfoColumn(
                      rightUserInfo,
                      updateRightUserInfo,
                      "right"
                    )}
                  </S.FormTable>
                )}

                {activeTab === "transaction" && (
                  <S.EmptyState>거래 정보 탭 내용</S.EmptyState>
                )}

                {activeTab === "salary" && (
                  <S.EmptyState>급여 정보 탭 내용</S.EmptyState>
                )}

                {activeTab === "manager" && (
                  <S.EmptyState>담당자 정보 탭 내용</S.EmptyState>
                )}
              </S.TabContent>
            </S.RightPanel>
          </S.ContentWrapper>
        </S.MainContainer>
      </S.PageContainer>
    </>
  );
}
