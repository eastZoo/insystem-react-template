import { useState, useEffect } from "react";
import styled from "styled-components";
import { IsButton, IsInputText } from "insystem-atoms";
import { Modal } from "../Modal";

export interface CreateFolderModalProps {
  /** 모달 표시 여부 */
  isOpen: boolean;
  /** 모달 닫기 핸들러 */
  onClose: () => void;
  /** 폴더 생성 핸들러 */
  onCreate: (folderName: string) => void;
}

/**
 * CreateFolderModal 컴포넌트
 * 폴더 생성 모달
 * Figma design: node 131-10265
 */
export const CreateFolderModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateFolderModalProps) => {
  /** ============================= state 영역 ============================= */
  const [folderName, setFolderName] = useState("");

  /** ============================= useEffect 영역 ============================= */
  useEffect(() => {
    if (!isOpen) {
      setFolderName("");
    }
  }, [isOpen]);

  /** ============================= 비즈니스 로직 영역 ============================= */
  const handleCreate = () => {
    if (folderName.trim()) {
      onCreate(folderName.trim());
      handleClose();
    }
  };

  const handleClose = () => {
    setFolderName("");
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && folderName.trim()) {
      handleCreate();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} width={432}>
      {/* Content */}
      <Content>
        {/* Title */}
        <Title>폴더 생성하기</Title>

        {/* Folder Name Input */}
        <InputWrapper>
          <IsInputText
            label="폴더 명"
            placeholderText="폴더 명을 입력해주세요."
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={handleKeyDown}
            fullWidth
          />
        </InputWrapper>
      </Content>

      {/* Actions */}
      <Actions>
        <IsButton variant="solid" color="secondary" onClick={handleClose}>
          취소
        </IsButton>
        <IsButton
          variant="solid"
          color="primary"
          onClick={handleCreate}
          disabled={!folderName.trim()}
        >
          생성하기
        </IsButton>
      </Actions>
    </Modal>
  );
};

export default CreateFolderModal;

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

const InputWrapper = styled.div`
  width: 100%;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 16px;
`;
