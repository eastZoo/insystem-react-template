import { useState, useEffect } from "react";
import styled from "styled-components";
import { IsInputSearch } from "insystem-atoms";
import { Modal } from "../Modal";
import { Alert } from "../Alert";

/** 공개 설정 타입 */
type VisibilityType = "private" | "team" | "public";

/** 승인 상태 타입 */
type ApprovalStatus = "none" | "pending" | "approved";

export interface EditFileModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 저장 핸들러 */
  onSave: (fileName: string, visibility: VisibilityType) => void;
  /** 승인 요청 취소 핸들러 */
  onCancelApproval?: () => void;
  /** 현재 파일 정보 */
  file: {
    name: string;
    type: "file" | "folder";
    visibility: VisibilityType;
    approvalStatus?: ApprovalStatus;
  } | null;
}

/** ============================= Icons ============================= */

const RadioCheckedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="#0066FF" />
    <circle cx="10" cy="10" r="6" fill="white" />
  </svg>
);

const RadioCheckedPendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="10" fill="#EAB308" />
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

const InfoCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8 14.5C11.5899 14.5 14.5 11.5899 14.5 8C14.5 4.41015 11.5899 1.5 8 1.5C4.41015 1.5 1.5 4.41015 1.5 8C1.5 11.5899 4.41015 14.5 8 14.5ZM8 5.5C8.41421 5.5 8.75 5.16421 8.75 4.75C8.75 4.33579 8.41421 4 8 4C7.58579 4 7.25 4.33579 7.25 4.75C7.25 5.16421 7.58579 5.5 8 5.5ZM8 6.5C8.41421 6.5 8.75 6.83579 8.75 7.25V11.25C8.75 11.6642 8.41421 12 8 12C7.58579 12 7.25 11.6642 7.25 11.25V7.25C7.25 6.83579 7.58579 6.5 8 6.5Z"
      fill="rgba(55, 56, 60, 0.61)"
    />
  </svg>
);

/**
 * EditFileModal 컴포넌트
 * 파일 수정 모달
 * Figma design: node 138-2169, 144-4774
 */
export const EditFileModal = ({
  isOpen,
  onClose,
  onSave,
  onCancelApproval,
  file,
}: EditFileModalProps) => {
  /** ============================= state 영역 ============================= */
  const [fileName, setFileName] = useState("");
  const [visibility, setVisibility] = useState<VisibilityType>("private");
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>("none");
  const [showPublicAlert, setShowPublicAlert] = useState(false);
  const [showCancelAlert, setShowCancelAlert] = useState(false);

  /** 파일 정보가 변경되면 state 업데이트 */
  useEffect(() => {
    if (file) {
      setFileName(file.name);
      setVisibility(file.visibility);
      setApprovalStatus(file.approvalStatus || "none");
    }
  }, [file]);

  /** ============================= 비즈니스 로직 영역 ============================= */
  const handleFileNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.value);
  };

  const handleClearFileName = () => {
    setFileName("");
  };

  const handleVisibilityChange = (newVisibility: VisibilityType) => {
    // 승인 요청 중이거나 승인 완료 상태에서는 다른 옵션 선택 불가
    if (
      visibility === "public" &&
      (approvalStatus === "pending" || approvalStatus === "approved")
    ) {
      return;
    }
    setVisibility(newVisibility);
  };

  const handleSave = () => {
    // 폴더인 경우 바로 저장 (visibility 무시)
    if (file?.type === "folder") {
      onSave(fileName, "private");
      handleClose();
      return;
    }
    // 전체 공개 선택 시 경고 모달 표시 (승인 요청 전 상태일 때만)
    if (visibility === "public" && approvalStatus === "none") {
      setShowPublicAlert(true);
      return;
    }
    onSave(fileName, visibility);
    handleClose();
  };

  /** 전체 공개 승인 요청 확인 */
  const handlePublicConfirm = () => {
    setShowPublicAlert(false);
    onSave(fileName, visibility);
    handleClose();
  };

  /** 전체 공개 승인 요청 취소 (Alert 닫기) */
  const handlePublicCancel = () => {
    setShowPublicAlert(false);
  };

  /** 요청 취소 버튼 클릭 */
  const handleCancelRequest = () => {
    setShowCancelAlert(true);
  };

  /** 요청 취소 확인 */
  const handleCancelConfirm = () => {
    setShowCancelAlert(false);
    setApprovalStatus("none");
    setVisibility("private");
    onCancelApproval?.();
  };

  /** 요청 취소 Alert 닫기 */
  const handleCancelAlertClose = () => {
    setShowCancelAlert(false);
  };

  const handleClose = () => {
    setFileName("");
    setVisibility("private");
    setApprovalStatus("none");
    onClose();
  };

  /** 공개 설정 옵션 */
  const visibilityOptions: {
    value: VisibilityType;
    title: string;
    description: string;
    badge?: string;
    badgeType?: "default" | "pending" | "approved";
  }[] = [
    {
      value: "private",
      title: "나만보기",
      description: "내 AI 채팅에서만 답변 출처로 사용됩니다.",
    },
    {
      value: "team",
      title: "팀 공유",
      description: "팀원의 AI 채팅에서도 답변 출처로 사용됩니다.",
    },
    {
      value: "public",
      title: "전체 공개",
      description: "사내 모든 구성원의 AI 채팅에서 답변 출처로 사용됩니다.",
      badge:
        approvalStatus === "pending"
          ? "승인 요청 중..."
          : approvalStatus === "approved"
            ? "승인 완료"
            : "승인 필요",
      badgeType:
        approvalStatus === "pending"
          ? "pending"
          : approvalStatus === "approved"
            ? "approved"
            : "default",
    },
  ];

  /** 전체 공개 옵션의 상태별 스타일 결정 */
  const getPublicOptionState = () => {
    if (visibility !== "public") return "inactive";
    if (approvalStatus === "pending") return "pending";
    if (approvalStatus === "approved") return "approved";
    return "active";
  };

  /** 폴더 타입 여부 */
  const isFolder = file?.type === "folder";

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleClose}>
        {/* Content */}
        <Content>
          {/* Title */}
          <Title>수정하기</Title>

          {/* File/Folder Name Input */}
          <InputSection>
            <InputLabel>{isFolder ? "폴더 명" : "파일 명"}</InputLabel>
            <IsInputSearch
              labelShow={false}
              value={fileName}
              onChange={handleFileNameChange}
              placeholder={
                isFolder ? "폴더명을 입력하세요" : "파일명을 입력하세요"
              }
              clearable
              onClear={handleClearFileName}
              fullWidth
              disabled={!isFolder}
            />
          </InputSection>

          {/* 폴더인 경우 안내 문구 표시 */}
          {isFolder ? (
            <FolderInfoSection>
              <InfoIconWrapper>
                <InfoCircleIcon />
              </InfoIconWrapper>
              <FolderInfoText>
                폴더 내부 파일은 '나만보기'로 업로드되며, 업로드 후 파일 별로
                공개 범위를 변경할 수 있습니다.
              </FolderInfoText>
            </FolderInfoSection>
          ) : (
            /* 파일인 경우 Visibility Settings 표시 */
            <VisibilitySection>
              <SectionHeader>
                <SectionTitle>공개 설정</SectionTitle>
                <SectionDescription>
                  AI가 답변할 때 이 파일을 활용할 수 있는 범위를 설정해 주세요.
                </SectionDescription>
              </SectionHeader>

              <RadioGroup>
                {visibilityOptions.map((option) => {
                  const isPublic = option.value === "public";
                  const publicState = isPublic ? getPublicOptionState() : null;

                  return (
                    <RadioItem
                      key={option.value}
                      $state={
                        isPublic
                          ? publicState!
                          : visibility === option.value
                            ? "active"
                            : "inactive"
                      }
                      onClick={() => handleVisibilityChange(option.value)}
                    >
                      <RadioWrapper>
                        <RadioButton>
                          {visibility === option.value ? (
                            publicState === "pending" ? (
                              <RadioCheckedPendingIcon />
                            ) : (
                              <RadioCheckedIcon />
                            )
                          ) : (
                            <RadioUncheckedIcon />
                          )}
                        </RadioButton>
                        <RadioContent>
                          <RadioTop>
                            <RadioTitleRow>
                              <RadioTitle>{option.title}</RadioTitle>
                              {option.badge && (
                                <Badge $type={option.badgeType || "default"}>
                                  {option.badge}
                                </Badge>
                              )}
                            </RadioTitleRow>
                            <RadioDescription>
                              {option.description}
                            </RadioDescription>
                          </RadioTop>

                          {/* 승인 요청 중 상태일 때 하단 영역 표시 */}
                          {isPublic && publicState === "pending" && (
                            <RadioBottom>
                              <PendingText>
                                관리자 승인 후 적용돼요.
                              </PendingText>
                              <CancelRequestButton
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCancelRequest();
                                }}
                              >
                                요청 취소
                              </CancelRequestButton>
                            </RadioBottom>
                          )}
                        </RadioContent>
                      </RadioWrapper>
                    </RadioItem>
                  );
                })}
              </RadioGroup>
            </VisibilitySection>
          )}
        </Content>

        {/* Actions */}
        <Actions>
          <CancelButton type="button" onClick={handleClose}>
            취소
          </CancelButton>
          <SaveButton type="button" onClick={handleSave}>
            저장하기
          </SaveButton>
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

      {/* 요청 취소 Alert */}
      <Alert
        isOpen={showCancelAlert}
        onClose={handleCancelAlertClose}
        onConfirm={handleCancelConfirm}
        title="전체공개 요청 취소"
        description={
          <>
            전체공개 요청을 취소할까요?
            <br />
            취소하면 공개 범위는 나만보기로 복귀됩니다.
          </>
        }
        cancelText="닫기"
        confirmText="요청 취소"
        confirmVariant="danger"
      />
    </>
  );
};

export default EditFileModal;

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

/* ===== File Name Input Section ===== */
const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InputLabel = styled.label`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.429;
  letter-spacing: 0.203px;
  color: rgba(46, 47, 51, 0.88);
`;

/* ===== Visibility Section ===== */
const VisibilitySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/* ===== Folder Info Section (Figma 118-12434) ===== */
const FolderInfoSection = styled.div`
  display: flex;
  gap: 4px;
  align-items: flex-start;
`;

const InfoIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 16px;
  height: 16px;
`;

const FolderInfoText = styled.p`
  flex: 1;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.385;
  letter-spacing: 0.252px;
  color: rgba(55, 56, 60, 0.61);
  margin: 0;
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

/* ===== Radio Group ===== */
const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

type RadioItemState = "inactive" | "active" | "pending" | "approved";

const RadioItem = styled.div<{ $state: RadioItemState }>`
  display: flex;
  flex-direction: column;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: ${({ $state }) =>
    $state === "pending" || $state === "approved" ? "default" : "pointer"};
  transition: all 0.15s ease;

  ${({ $state }) => {
    switch ($state) {
      case "active":
        return `
          background: rgba(0, 102, 255, 0.08);
          border: 1px solid #0066FF;
        `;
      case "pending":
        return `
          background: rgba(234, 179, 8, 0.08);
          border: 1px solid #EAB308;
        `;
      case "approved":
        return `
          background: rgba(0, 102, 255, 0.08);
          border: 1px solid #0066FF;
        `;
      default:
        return `
          background: transparent;
          border: 1px solid rgba(112, 115, 124, 0.22);

          &:hover {
            border-color: rgba(112, 115, 124, 0.4);
          }
        `;
    }
  }}
`;

const RadioWrapper = styled.div`
  display: flex;
  gap: 8px;
`;

const RadioButton = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
`;

const RadioContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 8px;
`;

const RadioTop = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
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

type BadgeType = "default" | "pending" | "approved";

const Badge = styled.span<{ $type: BadgeType }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.273;
  letter-spacing: 0.342px;

  ${({ $type }) => {
    switch ($type) {
      case "pending":
        return `
          background: rgba(234, 179, 8, 0.12);
          color: #EAB308;
        `;
      case "approved":
        return `
          background: rgba(0, 191, 64, 0.12);
          color: #00BF40;
        `;
      default:
        return `
          background: rgba(112, 115, 124, 0.12);
          color: rgba(55, 56, 60, 0.61);
        `;
    }
  }}
`;

const RadioDescription = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.334;
  letter-spacing: 0.302px;
  color: rgba(55, 56, 60, 0.61);
`;

/* ===== Pending State Bottom Section ===== */
const RadioBottom = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid rgba(234, 179, 8, 0.12);
`;

const PendingText = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.334;
  letter-spacing: 0.302px;
  color: #eab308;
`;

const CancelRequestButton = styled.button`
  padding: 3px 4px;
  background: transparent;
  border: none;
  border-radius: 8px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.334;
  letter-spacing: 0.302px;
  color: rgba(55, 56, 60, 0.61);
  text-decoration: underline;
  cursor: pointer;
  transition: opacity 0.15s ease;

  &:hover {
    opacity: 0.7;
  }
`;

/* ===== Action Buttons ===== */
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

const SaveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 20px;
  background: #2ec4a0;
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
    background: #26a88a;
  }
`;
