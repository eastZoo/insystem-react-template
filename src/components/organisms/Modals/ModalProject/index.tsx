import { useQuery } from "@tanstack/react-query";
import { Control, useFormContext } from "react-hook-form";
import { ModalProps, Modals } from "..";
import { request } from "../../../../common/api";
import {
  GET_PROJECT_CATEGORYS,
  GET_PROJECT_PHASE,
  GET_PROJECT_PM,
} from "../../../../common/querykeys";
import { Nullable } from "../../../../common/types/common";
import { SelectOption } from "../../../../common/types/selectOption";
import { Buttons } from "../../../atoms/Buttons";
import { ControlSelect } from "../../../atoms/Controls/ControlSelect";
import { ControlText } from "../../../atoms/Controls/ControlText";
import { ControlTextArea } from "../../../atoms/Controls/ControlTextArea";
import { CreateProjectInputs } from "../../../containers/Project/ProjectCreateModal";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { InputText } from "../../../atoms/Inputs/InputText";
import { ControlCheckBox } from "../../../atoms/Controls/ControlCheckBox";

interface ModalProjectProps extends ModalProps {
  control: Control<Nullable<CreateProjectInputs>, any>;
  onSubmit: any;
  updateModalShow?: any;
  onDelete?: () => Promise<void>;
}

const ModalProject = ({
  control,
  onDelete,
  updateModalShow,
  ...props
}: ModalProjectProps) => {
  const { watch, setValue } = useFormContext();

  const handleNumberInput = (
    value: string,
    setValue: (name: string, value: number | null) => void,
    fieldName: string
  ) => {
    let numericValue = value.replace(/[^0-9]/g, "");
    numericValue = numericValue.slice(0, 10);
    const numValue = numericValue.length > 0 ? Number(numericValue) : null; // 쉼표 제거 후 숫자로 변환
    // const numericValue = value.replace(/[^0-9]/g, "");
    // const numValue =
    //   Number(value.replaceAll(",", "")) ||
    //   Number(numericValue.replaceAll(",", "")) ||
    //   null; // 쉼표 제거 후 숫자로 변환
    setValue(fieldName, numValue); // 숫자로 저장
    return numValue !== null ? numValue.toLocaleString() : ""; // 쉼표 포함된 값 반환
  };

  const { totalAmountExclTax, advancePayment, interimPayment, finalPayment } =
    watch();

  const { data: projectCategoryOptions } = useQuery<SelectOption[]>({
    queryKey: [GET_PROJECT_CATEGORYS],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/stm-code/PJ_CATEGORY`,
      });
    },
  });

  const { data: projectPhaseOptions } = useQuery<SelectOption[]>({
    queryKey: [GET_PROJECT_PHASE],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/stm-code/PJ_PHASE`,
      });
    },
  });

  const { data: projectManagerOptions } = useQuery<SelectOption[]>({
    queryKey: [GET_PROJECT_PM],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/stm-user/ST_USER`,
      });
    },
  });

  return (
    <Modals
      modalTitle="프로젝트 등록"
      formId={props.formId}
      setModalShow={props.setModalShow}
      height={650}
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
            <div style={{ position: "relative", left: "41%" }}>
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
          <ModalFormDiv>
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="프로젝트명"
              placeholder="프로젝트명을 입력해주세요."
              name="projectName"
            />
            <ControlSelect
              control={control}
              size="md"
              width={250}
              direction="column"
              label="프로젝트 구분"
              placeholder="프로젝트 구분을 입력해주세요."
              name="projectCategory"
              options={projectCategoryOptions}
            />
          </ModalFormDiv>
          <ControlTextArea
            control={control}
            size="md"
            height={200}
            direction="column"
            label="설명"
            placeholder="프로젝트 설명을 입력해주세요."
            name="description"
          />
          <ModalFormDiv>
            <ControlText
              type="date"
              control={control}
              size="md"
              width={250}
              direction="column"
              label="시작날짜"
              name="projectDateStart"
            />
            <ControlText
              type="date"
              control={control}
              size="md"
              width={250}
              direction="column"
              label="종료날짜"
              name="projectDateEnd"
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlSelect
              control={control}
              size="md"
              width={250}
              direction="column"
              label="PM"
              placeholder="PM을 입력해주세요."
              name="projectManager"
              options={projectManagerOptions}
            />
            <ControlSelect
              control={control}
              size="md"
              width={250}
              direction="column"
              label="프로젝트 단계"
              placeholder="프로젝트 단계을 입력해주세요."
              name="projectPhase"
              options={projectPhaseOptions}
            />
          </ModalFormDiv>

          <ControlText
            control={control}
            size="md"
            width={250}
            direction="column"
            label="자체/외주"
            placeholder="자체/외주를 입력해주세요."
            name="projectSource"
          />
        </ModalFormSection>
        <ModalFormSection>
          <ModalFormDiv>
            <InputText
              width={250}
              direction="column"
              label="총금액(부가세별도)"
              placeholder="총금액을 입력해주세요."
              name="totalAmountExclTax"
              value={
                totalAmountExclTax ? totalAmountExclTax.toLocaleString() : ""
              } // 쉼표 포함된 값으로 표시
              onChange={(e) => {
                e.target.value = handleNumberInput(
                  e.target.value,
                  setValue,
                  "totalAmountExclTax"
                );
              }}
            />
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="입금방법"
              placeholder="입금방법을 입력해주세요."
              name="paymentMethod"
            />
          </ModalFormDiv>
          <InputText
            size="md"
            width={250}
            direction="column"
            label="선금"
            placeholder="선금을 입력해주세요."
            name="advancePayment"
            value={advancePayment ? advancePayment.toLocaleString() : ""}
            onChange={(e) => {
              e.target.value = handleNumberInput(
                e.target.value,
                setValue,
                "advancePayment"
              );
            }}
          />
          <InputText
            size="md"
            width={250}
            direction="column"
            label="중도금"
            placeholder="중도금을 입력해주세요."
            name="interimPayment"
            value={interimPayment ? interimPayment.toLocaleString() : ""}
            onChange={(e) => {
              e.target.value = handleNumberInput(
                e.target.value,
                setValue,
                "interimPayment"
              );
            }}
          />
          <InputText
            size="md"
            width={250}
            direction="column"
            label="잔금"
            placeholder="잔금을 입력해주세요."
            name="finalPayment"
            value={finalPayment ? finalPayment.toLocaleString() : ""}
            onChange={(e) => {
              e.target.value = handleNumberInput(
                e.target.value,
                setValue,
                "finalPayment"
              );
            }}
          />
          <ModalFormDiv>
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="도입거래처"
              placeholder="도입거래처를 입력해주세요."
              name="introducingClient"
            />
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="매출거래처"
              placeholder="매출거래처 입력해주세요."
              name="salesClient"
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlCheckBox
              type="checkbox"
              control={control}
              size="md"
              direction="column"
              label="차트 출력"
              name="chartYn"
              defaultValue={true}
            />
          </ModalFormDiv>
        </ModalFormSection>
      </ModalFormBox>
    </Modals>
  );
};

export default ModalProject;
