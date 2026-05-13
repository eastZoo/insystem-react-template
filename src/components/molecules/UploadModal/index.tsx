import { useState, useRef } from "react";
import styled from "styled-components";
import { Modal } from "../../atoms/Modal";
import { Alert } from "../../atoms/Alert";

/** 공개 설정 타입 - auth_level 코드 값 */
export type AuthLevelType = "SY02000001" | "SY02000002" | "SY02000003" | "SY02000004";

export interface UploadModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 업로드 핸들러 - auth_level 코드값 및 fld_cd 전달 */
  onUpload: (files: File[], authLevel: AuthLevelType, fldCd?: string) => void;
  /** 모달 타입 (file: 파일, folder: 폴더) */
  type?: "file" | "folder";
  /** 폴더코드 (선택적, 미지정시 기본 폴더에 업로드) */
  fldCd?: string;
}

/** ============================= Icons ============================= */
const RadioCheckedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="#0066FF" />
    <circle cx="10" cy="10" r="6" fill="white" />
  </svg>
);

const RadioUncheckedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle
      cx="10"
      cy="10"
      r="9.25"
      stroke="rgba(112, 115, 124, 0.22)"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

const DocumentUploadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path
      d="M6.25 17.5C5.5625 17.5 4.97396 17.2552 4.48437 16.7656C3.99479 16.276 3.75 15.6875 3.75 15V12.5H5V15C5 15.3542 5.1224 15.6615 5.36719 15.9219C5.61198 16.1823 5.91146 16.3125 6.26562 16.3125H13.7344C14.0885 16.3125 14.388 16.1823 14.6328 15.9219C14.8776 15.6615 15 15.3542 15 15V12.5H16.25V15C16.25 15.6875 16.0052 16.276 15.5156 16.7656C15.026 17.2552 14.4375 17.5 13.75 17.5H6.25ZM9.375 13.75V5.3125L6.5625 8.125L5.625 7.1875L10 2.8125L14.375 7.1875L13.4375 8.125L10.625 5.3125V13.75H9.375Z"
      fill="rgba(46, 47, 51, 0.88)"
    />
  </svg>
);

/**
 * UploadModal 컴포넌트
 * 파일 또는 폴더 업로드 모달
 * Figma design: node 138-1927
 */
export const UploadModal = ({
  isOpen,
  onClose,
  onUpload,
  type = "file",
  fldCd,
}: UploadModalProps) => {
  /** ============================= state 영역 ============================= */
  const [files, setFiles] = useState<File[]>([]);
  const [authLevel, setAuthLevel] = useState<AuthLevelType>("SY02000002"); // 기본값: 해당부서
  const [isDragging, setIsDragging] = useState(false);
  const [showPublicAlert, setShowPublicAlert] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** ============================= 비즈니스 로직 영역 ============================= */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSelectClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = () => {
    // 전체 공개 선택 시 경고 모달 표시
    if (authLevel === "SY02000001") {
      setShowPublicAlert(true);
      return;
    }
    onUpload(files, authLevel, fldCd);
    handleClose();
  };

  /** 전체 공개 승인 요청 확인 */
  const handlePublicConfirm = () => {
    setShowPublicAlert(false);
    onUpload(files, authLevel, fldCd);
    handleClose();
  };

  /** 전체 공개 승인 요청 취소 */
  const handlePublicCancel = () => {
    setShowPublicAlert(false);
  };

  const handleClose = () => {
    setFiles([]);
    setAuthLevel("SY02000002");
    onClose();
  };

  /** 공개 설정 옵션 - auth_level 코드 매핑 */
  const authLevelOptions: {
    value: AuthLevelType;
    title: string;
    description: string;
    badge?: string;
  }[] = [
    {
      value: "SY02000001",
      title: "전체",
      description: "사내 모든 구성원의 AI 채팅에서 답변 출처로 사용됩니다.",
      badge: "승인 필요",
    },
    {
      value: "SY02000002",
      title: "해당부서",
      description: "해당 부서원의 AI 채팅에서 답변 출처로 사용됩니다.",
    },
    {
      value: "SY02000003",
      title: "해당부서 및 하위부서",
      description: "해당 부서 및 하위 부서원의 AI 채팅에서 답변 출처로 사용됩니다.",
    },
    {
      value: "SY02000004",
      title: "비공개",
      description: "내 AI 채팅에서만 답변 출처로 사용됩니다.",
    },
  ];

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        {/* Content */}
      <Content>
        {/* Title */}
        <Title>PDF 파일 업로드</Title>

        {/* Custom Drag Drop Area */}
        <DragDropArea
          $isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <DragDropContent>
            <IconWrapper>
              <DocumentUploadIcon />
            </IconWrapper>
            <TextRow>
              <LeadText>끌어다 놓기 또는 </LeadText>
              <SelectButton type="button" onClick={handleSelectClick}>
                선택하기
              </SelectButton>
            </TextRow>
            <InfoText>
              {files.length > 0
                ? `${files.length}개 PDF 파일 선택됨`
                : ".pdf 파일만 지원 (여러 파일 선택 가능)"}
            </InfoText>
          </DragDropContent>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
          />
        </DragDropArea>

        {/* Visibility Settings */}
        <VisibilitySection>
          <SectionHeader>
            <SectionTitle>공개 설정</SectionTitle>
            <SectionDescription>
              AI가 답변할 때 이 파일을 활용할 수 있는 범위를 설정해 주세요.
            </SectionDescription>
          </SectionHeader>

          <RadioGroup>
            {authLevelOptions.map((option) => (
              <RadioItem
                key={option.value}
                $active={authLevel === option.value}
                onClick={() => setAuthLevel(option.value)}
              >
                <RadioButton>
                  {authLevel === option.value ? (
                    <RadioCheckedIcon />
                  ) : (
                    <RadioUncheckedIcon />
                  )}
                </RadioButton>
                <RadioContent>
                  <RadioTitleRow>
                    <RadioTitle>{option.title}</RadioTitle>
                    {option.badge && <Badge>{option.badge}</Badge>}
                  </RadioTitleRow>
                  <RadioDescription>{option.description}</RadioDescription>
                </RadioContent>
              </RadioItem>
            ))}
          </RadioGroup>
        </VisibilitySection>
      </Content>

      {/* Actions */}
      <Actions>
        <CancelButton type="button" onClick={handleClose}>
          취소
        </CancelButton>
        <UploadButton type="button" onClick={handleUpload}>
          업로드하기
        </UploadButton>
      </Actions>
    </Modal>

      {/* 전체 공개 승인 요청 Alert */}
      <Alert
        isOpen={showPublicAlert}
        onClose={handlePublicCancel}
        onConfirm={handlePublicConfirm}
        title="전체공개로 변경"
        description={
          <>
            전체공개는 <strong>관리자 승인 후</strong> 적용됩니다.
            <br />
            승인 요청을 보낼까요?
          </>
        }
        cancelText="닫기"
        confirmText="승인 요청"
      />
    </>
  );
};

export default UploadModal;

/** ============================= Styled Components ============================= */

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 16px 16px;
`;

const Title = styled.h2`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.24px;
  color: #171719;
  margin: 0;
`;

/* ===== Drag & Drop Area (Figma 138:1931) ===== */
const DragDropArea = styled.div<{ $isDragging: boolean }>`
  position: relative;
  width: 100%;
  height: 140px;
  border: 1px dashed
    ${({ $isDragging }) =>
      $isDragging ? "#0066FF" : "rgba(112, 115, 124, 0.52)"};
  border-radius: 8px;
  background: ${({ $isDragging }) =>
    $isDragging ? "rgba(0, 102, 255, 0.04)" : "white"};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    border-color: rgba(112, 115, 124, 0.7);
  }
`;

const DragDropContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const TextRow = styled.div`
  display: flex;
  align-items: center;
`;

const LeadText = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.429;
  letter-spacing: 0.203px;
  color: rgba(46, 47, 51, 0.88);
`;

const SelectButton = styled.button`
  background: transparent;
  border: none;
  padding: 3px 4px;
  border-radius: 8px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.429;
  letter-spacing: 0.203px;
  color: #0066ff;
  text-decoration: underline;
  text-decoration-skip-ink: none;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const InfoText = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.334;
  letter-spacing: 0.302px;
  color: rgba(55, 56, 60, 0.61);
  text-align: center;
`;

const HiddenInput = styled.input`
  position: absolute;
  width: 0;
  height: 0;
  opacity: 0;
  pointer-events: none;
`;

/* ===== Visibility Section ===== */
const VisibilitySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SectionTitle = styled.h3`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.429;
  letter-spacing: 0.203px;
  color: rgba(46, 47, 51, 0.88);
  margin: 0;
`;

const SectionDescription = styled.p`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.385;
  letter-spacing: 0.252px;
  color: rgba(55, 56, 60, 0.61);
  margin: 0;
`;

/* ===== Radio Group (Figma 139:2463) ===== */
const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const RadioItem = styled.div<{ $active: boolean }>`
  display: flex;
  gap: 8px;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;

  ${({ $active }) =>
    $active
      ? `
    background: rgba(0, 102, 255, 0.08);
    border: 1px solid #0066FF;
  `
      : `
    background: transparent;
    border: 1px solid rgba(112, 115, 124, 0.22);

    &:hover {
      border-color: rgba(112, 115, 124, 0.4);
    }
  `}
`;

const RadioButton = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
`;

const RadioContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RadioTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RadioTitle = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.429;
  letter-spacing: 0.203px;
  color: rgba(46, 47, 51, 0.88);
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  background: rgba(112, 115, 124, 0.12);
  border-radius: 4px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.273;
  letter-spacing: 0.342px;
  color: rgba(55, 56, 60, 0.61);
`;

const RadioDescription = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.334;
  letter-spacing: 0.302px;
  color: rgba(55, 56, 60, 0.61);
`;

/* ===== Action Buttons (Figma 138:1938) ===== */
const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 16px;
`;

const CancelButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  background: rgba(112, 115, 124, 0.08);
  border: none;
  border-radius: 8px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.091px;
  color: rgba(46, 47, 51, 0.88);
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(112, 115, 124, 0.16);
  }
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  background: #2EC4A0;
  border: none;
  border-radius: 8px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: 0.091px;
  color: white;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #26A88A;
  }
`;
