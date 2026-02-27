import { Control } from "react-hook-form";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  majorScheduleState,
  projectState,
} from "src/states/projectManageState";
import { selectedMenuSelector } from "src/states/menu";
import { ModalProps, Modals } from "..";
import { Nullable } from "../../../../common/types/common";
import { Buttons } from "../../../atoms/Buttons";
import { ControlText } from "../../../atoms/Controls/ControlText";
import { ControlTextArea } from "../../../atoms/Controls/ControlTextArea";
import { CreateMajorScheduleInputs } from "../../../containers/MajorSchedule/MajorScheduleCreateModal";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { useWatch } from "react-hook-form";

interface ModalMajorScheduleProps extends ModalProps {
  control: Control<Nullable<CreateMajorScheduleInputs>, any>;
  onSubmit: any;
  updateModalShow?: any;
  onDelete?: () => Promise<void>;
}

const ModalMajorSchedule = ({
  control,
  onDelete,
  updateModalShow,
  ...props
}: ModalMajorScheduleProps) => {
  const setMenu = useSetRecoilState(selectedMenuSelector);
  const [majorScheduleStateName, setMajorScheduleStateName] =
    useRecoilState(majorScheduleState);
  const [projectStateName, setProjectStateName] = useRecoilState(projectState);

  const majorScheduleName = useWatch({
    control,
    name: "majorScheduleName",
  });

  const projectName = useWatch({
    control,
    name: "projectName",
  });

  return (
    <Modals
      modalTitle="대일정 등록/수정"
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
              <div
                style={{
                  position: "absolute",
                  right: "40px",
                  top: "0",
                  width: "150px",
                }}
              >
                <Buttons
                  type="button"
                  size="md"
                  layout="highlight"
                  label="단위일정 등록"
                  onClick={() => {
                    setMajorScheduleStateName(String(majorScheduleName));
                    setProjectStateName(String(projectName));
                    setMenu({
                      id: "menu-20250630081541-a02e6b58-0786-48b6-9aad-c670e80f2a85",
                    });
                  }}
                />
              </div>
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
              width={450}
              direction="column"
              label="프로젝트명"
              placeholder="프로젝트명을 입력해주세요."
              name="projectName"
              disabled
            />
          </ModalFormDiv>
          <ControlTextArea
            control={control}
            size="md"
            height={350}
            direction="column"
            label="설명"
            placeholder="프로젝트 설명을 입력해주세요."
            name="description"
            disabled
          />
        </ModalFormSection>
        <ModalFormSection>
          <ModalFormDiv>
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="대일정명"
              placeholder="대일정명을 입력해주세요."
              name="majorScheduleName"
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlText
              type="date"
              control={control}
              size="md"
              width={250}
              direction="column"
              label="계획시작날짜"
              name="majorDatePlanStart"
            />
            <ControlText
              type="date"
              control={control}
              size="md"
              width={250}
              direction="column"
              label="계획종료날짜"
              name="majorDatePlanEnd"
            />
          </ModalFormDiv>
          {/* <ModalFormDiv>
            <ControlText
              type="date"
              control={control}
              size="md"
              width={250}
              direction="column"
              label="시작날짜"
              name="majorDateStart"
            />
            <ControlText
              type="date"
              control={control}
              size="md"
              width={250}
              direction="column"
              label="종료날짜"
              name="majorDateEnd"
            />
          </ModalFormDiv> */}
          <ModalFormDiv>
            <ControlText
              type="number"
              control={control}
              size="md"
              width={250}
              direction="column"
              label="정렬순서"
              placeholder="정렬순서 입력해주세요."
              name="displayOrder"
            />
          </ModalFormDiv>
        </ModalFormSection>
      </ModalFormBox>
    </Modals>
  );
};

export default ModalMajorSchedule;
