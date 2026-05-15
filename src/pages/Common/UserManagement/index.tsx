/**
 * 사용자 관리 페이지
 * @description 사용자 정보 조회, 등록, 수정 기능을 제공하는 페이지
 */
import { useState, useCallback } from "react";
import { IsInputText, IsSelect, IsButton, IsCheckbox, IsTabItem } from "insystem-atoms";
import { RadioGroup } from "@/components/atoms/RadioGroup";
import { Pagination } from "@/components/atoms/Pagination";
import { FilterBar } from "@/components/atoms/FilterBar";
import { PageHeader } from "@/components/atoms/PageHeader";
import { PageTemplate } from "@/components/template/PageTemplate";
import { FormTable, FormField } from "@/components/atoms/FormTable";
import { CalendarIcon } from "@/styles/icons";
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

  /** 추가 핸들러 */
  const handleAdd = useCallback(() => {
    console.log("추가");
    // TODO: 신규 사용자 추가 로직
    setLeftUserInfo(initialUserInfo);
    setRightUserInfo(initialUserInfo);
    setSelectedUserId(null);
  }, []);

  /** 저장 핸들러 */
  const handleSave = useCallback(() => {
    console.log("저장:", { leftUserInfo, rightUserInfo });
    // TODO: API 호출하여 저장
  }, [leftUserInfo, rightUserInfo]);

  /** 삭제 핸들러 */
  const handleDelete = useCallback(() => {
    if (!selectedUserId) {
      console.log("삭제할 사용자를 선택해주세요.");
      return;
    }
    console.log("삭제:", selectedUserId);
    // TODO: API 호출하여 삭제
  }, [selectedUserId]);

  /* ============================= 컴포넌트 영역 ============================= */

  /** 기본 정보 폼 컬럼 렌더링 */
  const renderBasicInfoColumn = (
    userInfo: UserInfo,
    updateUserInfo: (field: keyof UserInfo, value: string) => void,
    side: "left" | "right"
  ) => (
    <FormTable.Column>
      {/* 성명 */}
      <FormField label="성명" required isFirst>
        <IsInputText
          size="xSmall"
          value={userInfo.name}
          onChange={(e) => updateUserInfo("name", e.target.value)}
          placeholderText="입력해주세요."
          fullWidth
        />
      </FormField>

      {/* 성명(영문) */}
      <FormField label="성명(영문)">
        <IsInputText
          size="xSmall"
          value={userInfo.nameEn}
          onChange={(e) => updateUserInfo("nameEn", e.target.value)}
          placeholderText="Name"
          fullWidth
        />
      </FormField>

      {/* 구분 */}
      <FormField label="구분">
        <IsSelect
          size="xSmall"
          value={userInfo.division}
          onChange={(value) => updateUserInfo("division", value)}
          options={DIVISION_OPTIONS}
          fullWidth
        />
      </FormField>

      {/* 주민등록번호 */}
      <FormField label="주민등록번호" required>
        <IsInputText
          size="xSmall"
          value={userInfo.ssn}
          onChange={(e) => updateUserInfo("ssn", e.target.value)}
          placeholderText="'-' 없이 숫자만 입력"
          fullWidth
        />
      </FormField>

      {/* 생년월일 */}
      <FormField label="생년월일" required>
        <IsInputText
          size="xSmall"
          type="date"
          value={userInfo.birthDate}
          onChange={(e) => updateUserInfo("birthDate", e.target.value)}
          placeholderText="연도-월-일"
          fullWidth
          rightIconSlot={<CalendarIcon />}
        />
      </FormField>

      {/* 휴대폰번호 */}
      <FormTable.Row>
        <FormTable.Label>휴대폰번호</FormTable.Label>
        <FormTable.Cell>
          <S.PhoneInputGroup>
            <IsSelect
              size="xSmall"
              value={userInfo.phone1}
              onChange={(value) => updateUserInfo("phone1", value)}
              options={PHONE_PREFIX_OPTIONS}
              width={70}
            />
            <S.PhoneSeparator>-</S.PhoneSeparator>
            <IsInputText
              size="xSmall"
              value={userInfo.phone2}
              onChange={(e) => updateUserInfo("phone2", e.target.value)}
              maxLength={4}
              fullWidth
            />
            <S.PhoneSeparator>-</S.PhoneSeparator>
            <IsInputText
              size="xSmall"
              value={userInfo.phone3}
              onChange={(e) => updateUserInfo("phone3", e.target.value)}
              maxLength={4}
              fullWidth
            />
          </S.PhoneInputGroup>
        </FormTable.Cell>
      </FormTable.Row>

      {/* 이메일 */}
      <FormTable.Row>
        <FormTable.Label>이메일</FormTable.Label>
        <FormTable.Cell>
          <S.EmailInputGroup>
            <IsInputText
              size="xSmall"
              value={userInfo.email1}
              onChange={(e) => updateUserInfo("email1", e.target.value)}
              fullWidth
            />
            <S.EmailSeparator>@</S.EmailSeparator>
            <IsInputText
              size="xSmall"
              value={userInfo.email2}
              onChange={(e) => updateUserInfo("email2", e.target.value)}
              fullWidth
            />
          </S.EmailInputGroup>
        </FormTable.Cell>
      </FormTable.Row>

      {/* 주소 */}
      <FormTable.Row multiLine>
        <FormTable.Label multiLine>주소</FormTable.Label>
        <FormTable.Cell multiLine>
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
                fullWidth
              />
            </S.AddressSearchRow>
            <IsInputText
              size="xSmall"
              value={userInfo.addressDetail}
              onChange={(e) => updateUserInfo("addressDetail", e.target.value)}
              placeholderText="상세주소를 입력하세요."
              fullWidth
            />
          </S.AddressInputGroup>
        </FormTable.Cell>
      </FormTable.Row>

      {/* 결혼 여부 */}
      <FormField label="결혼 여부" isLast>
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
      </FormField>
    </FormTable.Column>
  );

  /* ============================= useEffect 영역 ============================= */

  /* ============================= 렌더링 ============================= */

  return (
    <PageTemplate title="사용자 관리">
      {/* 페이지 헤더 (타이틀 + CRUD 버튼) */}
      <PageHeader
        title="사용자 관리"
        onAdd={handleAdd}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      {/* 검색 필터 - FilterBar 컴포넌트 사용 */}
      <FilterBar
        rows={[
          {
            // Row 1: 부서, 사원명, 재직구분, 체크
            items: [
              <IsInputText
                key="department"
                size="xSmall"
                position="row"
                label="부서"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholderText="부서명 입력"
                fullWidth
              />,
              <IsInputText
                key="employeeName"
                size="xSmall"
                position="row"
                label="사원명"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholderText="사원명 입력"
                fullWidth
              />,
              <IsSelect
                key="employmentStatus"
                size="xSmall"
                position="row"
                label="재직구분"
                value={employmentStatus}
                onChange={setEmploymentStatus}
                options={EMPLOYMENT_STATUS_OPTIONS}
                fullWidth
              />,
              {
                element: (
                  <IsCheckbox
                    size="small"
                    label="Check"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                ),
                width: "auto",
              },
            ],
          },
          {
            // Row 2: 분류, 형태
            items: [
              <IsSelect
                key="category"
                size="xSmall"
                position="row"
                label="분류"
                value={category}
                onChange={setCategory}
                options={CATEGORY_OPTIONS}
                fullWidth
              />,
              <IsSelect
                key="type"
                size="xSmall"
                position="row"
                label="형태"
                value={type}
                onChange={setType}
                options={TYPE_OPTIONS}
                fullWidth
              />,
            ],
          },
        ]}
        onSearch={handleSearch}
        onClear={handleReset}
      />

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
          <S.TabBar>
            {TABS.map((tab, index) => (
              <IsTabItem
                key={tab.id}
                active={activeTab === tab.id}
                size="S"
                position={
                  index === 0
                    ? "start"
                    : index === TABS.length - 1
                      ? "end"
                      : "center"
                }
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </IsTabItem>
            ))}
          </S.TabBar>

          <S.TabContent>
            {activeTab === "basic" && (
              <FormTable>
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
              </FormTable>
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
    </PageTemplate>
  );
}
