import { Control } from "react-hook-form";
import { Nullable } from "src/common/types/common";
import { CreateStmCodeInputs } from "src/components/containers/StmCode/StmCodeCreateModal";
import { ModalProps, Modals } from "..";
import { Buttons } from "src/components/atoms/Buttons";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { ControlText } from "src/components/atoms/Controls/ControlText";
import { ControlTextArea } from "src/components/atoms/Controls/ControlTextArea";
import { ControlCheckBox } from "src/components/atoms/Controls/ControlCheckBox";
import { LineBreaks } from "src/components/atoms/LineBreaks";

interface ModalStmCodeProps extends ModalProps {
  control: Control<Nullable<CreateStmCodeInputs>, any>;
  onSubmit: any;
  updateModalShow?: any;
  onDelete?: () => Promise<void>;
  isCreateCode?: any;
  setIsCreateCode?: any;
}

export const ModalStmCode = ({
  control,
  onDelete,
  updateModalShow,
  isCreateCode,
  setIsCreateCode,
  ...props
}: ModalStmCodeProps) => {
  return (
    <Modals
      modalTitle={
        isCreateCode
          ? updateModalShow
            ? "코드 카테고리 수정"
            : "코드 카테고리 등록"
          : updateModalShow
          ? "공통 코드 수정"
          : "공통 코드 등록"
      }
      formId={props.formId}
      setModalShow={props.setModalShow}
      width={25}
      //   height={650}
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
            onClick={() => {
              props.setModalShow(false);
              if (isCreateCode) {
                setIsCreateCode(false);
              }
            }}
          />
          {updateModalShow && (
            <div style={{ position: "relative", left: "30%" }}>
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
      <ModalFormBox id={props.formId} $flexDirection={"row"}>
        <ModalFormSection>
          <ControlText
            control={control}
            size="md"
            direction="column"
            label="카테고리 구분"
            placeholder="구분을 입력해주세요."
            name="cmcdType"
            disabled
          />
          <LineBreaks /> {/* br 개수 컴포넌트 */}
          <ModalFormDiv>
            <ControlText
              type="number"
              control={control}
              size="md"
              width={50}
              direction="column"
              label="정렬순서"
              name="cmcdSeq"
            />
            <ControlText
              control={control}
              size="md"
              direction="column"
              label="코드"
              placeholder="코드를 입력해주세요."
              width={378}
              name="cmCode"
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlCheckBox
              type="checkbox"
              control={control}
              size="md"
              direction="column"
              label="사용여부"
              name="useYn"
              defaultValue={true}
            />
            <ControlText
              control={control}
              size="md"
              width={387}
              direction="column"
              label="코드 이름"
              placeholder="코드 이름을 입력해주세요."
              name="cmcdName"
            />
          </ModalFormDiv>
          <ControlText
            control={control}
            size="md"
            direction="column"
            label="비고1"
            placeholder="비고1 입력해주세요."
            name="attribute1"
          />
          <ControlText
            control={control}
            size="md"
            direction="column"
            label="비고2"
            placeholder="비고2 입력해주세요."
            name="attribute2"
          />
          <ControlText
            control={control}
            size="md"
            direction="column"
            label="비고3"
            placeholder="비고3 입력해주세요."
            name="attribute3"
          />
          <ControlText
            control={control}
            size="md"
            direction="column"
            label="비고4"
            placeholder="비고4 입력해주세요."
            name="attribute4"
          />
          <ControlText
            control={control}
            size="md"
            direction="column"
            label="비고5"
            placeholder="비고5 입력해주세요."
            name="attribute5"
          />
        </ModalFormSection>
      </ModalFormBox>
    </Modals>
  );
};
