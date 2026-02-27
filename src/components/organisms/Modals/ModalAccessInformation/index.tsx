import { Buttons } from "../../../atoms/Buttons";
import { ModalProps, Modals } from "..";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { ControlText } from "../../../atoms/Controls/ControlText";
import { Control, Controller } from "react-hook-form";
import { Nullable } from "../../../../common/types/common";
import { InputFileList } from "src/components/atoms/Inputs/InputFileList";
import { accessInformation } from "src/common/types/accessInformation";
import { CreateAccessInfoInputs } from "src/components/containers/AccessInformation/AccessInfoCreateModal";
import { ControlTextArea } from "src/components/atoms/Controls/ControlTextArea";

interface ModalAccessInfoProps extends ModalProps {
  control: Control<Nullable<CreateAccessInfoInputs>, any>;
  onSubmit: any;
  createModalShow?: any;
  updateModalShow?: any;
  selectedAccessInfo: accessInformation | null;
  onDelete?: () => Promise<void>;
  onFileDelete?: (file: any) => Promise<void>;
}

const ModalAccessInformation = ({
  control,
  onDelete,
  onFileDelete,
  createModalShow,
  updateModalShow,
  selectedAccessInfo,
  ...props
}: ModalAccessInfoProps) => {
  return (
    <Modals
      modalTitle={updateModalShow ? "접속정보 수정" : "접속정보 등록"}
      formId={props.formId}
      setModalShow={props.setModalShow}
      // width={40}
      // height={670}
      modalButtons={
        <>
          <Buttons
            type="button"
            size="md"
            layout="primary"
            label="확인"
            form={props.formId}
            onClick={props.onSubmit}
          />

          <Buttons
            type="button"
            size="md"
            layout="secondary"
            label="취소"
            onClick={() => props.setModalShow(false)}
          />
          {updateModalShow && (
            <div
              style={{
                display: "flex",
                position: "relative",
                left: "40%",
                gap: "5px",
              }}
            >
              <Buttons
                type="button"
                size="md"
                layout="warn"
                label="삭제"
                onClick={onDelete}
              />
            </div>
          )}
        </>
      }
    >
      <>
        <ModalFormBox id={props.formId} $flexDirection={"row"}>
          <ModalFormSection>
            <ModalFormDiv>
              <ControlText
                control={control}
                size="md"
                width={300}
                direction="column"
                label="제목"
                placeholder="제목을 입력해주세요."
                name="accessTitle"
              />
            </ModalFormDiv>
            <ControlTextArea
              control={control}
              size="md"
              height={250}
              direction="column"
              label="내용"
              placeholder="내용을 입력해주세요."
              name="accessDescription"
            />
          </ModalFormSection>
          <ModalFormSection>
            <ModalFormDiv>
              <ControlText
                control={control}
                size="md"
                width={200}
                direction="column"
                label="UserName"
                placeholder="UserName을 입력해주세요."
                name="accessUserName"
              />
              <ControlText
                control={control}
                size="md"
                width={200}
                direction="column"
                label="Password"
                placeholder="password를 입력해주세요."
                name="accessPassword"
              />
            </ModalFormDiv>
            <ModalFormDiv>
              <ControlText
                control={control}
                size="md"
                width={200}
                direction="column"
                label="IP"
                placeholder="IP를 입력해주세요."
                name="accessIp"
              />
              <ControlText
                control={control}
                size="md"
                width={200}
                direction="column"
                label="PORT"
                placeholder="port를 입력해주세요."
                name="accessPort"
              />
            </ModalFormDiv>
            {/* 파일 추가 ~ ing */}
            <Controller
              control={control}
              name="keyFile"
              render={({ field }) => (
                <InputFileList
                  {...field}
                  label="KEY 파일 업로드"
                  onFileChange={(files) => field.onChange(files)}
                  onFileDelete={onFileDelete}
                />
              )}
            />
          </ModalFormSection>
        </ModalFormBox>
      </>
    </Modals>
  );
};

export default ModalAccessInformation;
