import { FormEventHandler, useState } from "react";
import { ModalProps, Modals } from "..";
import { Buttons } from "../../../atoms/Buttons";
import { InputText } from "../../../atoms/Inputs/InputText";
import { ModalFormBox } from "../Modals.style";

interface ModalSaveProps extends ModalProps {
  onSubmit: (fileName: string) => void;
}

export const ModalSave = ({
  formId,
  setModalShow,
  onSubmit,
}: // onSubmit,
ModalSaveProps) => {
  const [fileName, setFileName] = useState<string>("");
  return (
    <Modals
      modalTitle="저장하기"
      setModalShow={setModalShow}
      modalButtons={
        <>
          <Buttons
            type="button"
            size="md"
            layout="primary"
            label="저장"
            form={formId}
            onClick={() => onSubmit(fileName)}
          />
          <Buttons
            type="button"
            size="md"
            layout="secondary"
            label="취소"
            onClick={() => setModalShow(false)}
          />
        </>
      }
    >
      <ModalFormBox
        id={formId}
        // onSubmit={onSubmit}
        $flexDirection="column"
      >
        <InputText
          direction="column"
          size="md"
          width={520}
          label="저장명"
          placeholder="저장명을 입력하세요."
          onChange={(e) => setFileName(e.target.value)}
          value={fileName}
        />
      </ModalFormBox>
    </Modals>
  );
};
