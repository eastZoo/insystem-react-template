import { useQuery } from "@tanstack/react-query";
import { Control, useWatch } from "react-hook-form";
import { ModalProps, Modals } from "..";
import { request } from "../../../../common/api";
import { GET_PROJECT_PM, GET_SUB_SCHEDULE } from "../../../../common/querykeys";
import { Nullable } from "../../../../common/types/common";
import { SelectOption } from "../../../../common/types/selectOption";
import { Buttons } from "../../../atoms/Buttons";
import { ControlSelect } from "../../../atoms/Controls/ControlSelect";
import { ControlText } from "../../../atoms/Controls/ControlText";
import { ControlTextArea } from "../../../atoms/Controls/ControlTextArea";
import { CreateSubScheduleInputs } from "../../../containers/SubSchedule/SubScheduleCreateModal";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { SubSchedules } from "../../../../types/Subschedule";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../states/loginUser";
import { se } from "date-fns/locale";

interface ModalSubScheduleProps extends ModalProps {
  control: Control<Nullable<CreateSubScheduleInputs>, any>;
  onSubmit: any;
  updateModalShow?: any;
  onDelete?: () => Promise<void>;
  selectedSubSchedule: SubSchedules | null;
  isPerformance?: boolean;
  setIsPerformance?: (value: boolean) => void;
}

const ModalSubSchedule = ({
  control,
  onDelete,
  updateModalShow,
  selectedSubSchedule,
  isPerformance,
  setIsPerformance,
  ...props
}: ModalSubScheduleProps) => {
  const userInfo = useRecoilValue(userState);
  const selectedProject = useWatch({
    control,
    name: "projectName",
  });

  const { data: projectOptions } = useQuery<SelectOption[]>({
    queryKey: [GET_SUB_SCHEDULE],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/project-register/PROJECT`,
      });
    },
  });

  const { data: majorOptions } = useQuery<SelectOption[]>({
    queryKey: ["GET_MAJOR_OPT", selectedProject],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/major-schedules/lookup?projectOid=${selectedProject}`,
      });
    },
    enabled: !!selectedProject,
  });

  const { data: assignedToOptions } = useQuery<SelectOption[]>({
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
      modalTitle={updateModalShow ? "단위일정 수정" : "단위일정 등록"}
      formId={props.formId}
      setModalShow={props.setModalShow}
      width={57}
      // height={670}
      modalButtons={
        <>
          {((updateModalShow &&
            userInfo?.oid === selectedSubSchedule?.assignedTo) ||
            selectedSubSchedule === null ||
            userInfo?.auth === "Admin") && (
            <Buttons
              type="button"
              size="md"
              layout="primary"
              label="확인"
              form={props.formId}
              onClick={props.onSubmit}
            />
          )}
          <Buttons
            type="button"
            size="md"
            layout="secondary"
            label="취소"
            onClick={() => props.setModalShow(false)}
          />

          {((updateModalShow &&
            userInfo?.oid === selectedSubSchedule?.assignedTo) ||
            (updateModalShow && userInfo?.auth === "Admin")) && (
            <div style={{ position: "relative", left: "40%" }}>
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
            <ControlSelect
              control={control}
              size="md"
              width={250}
              direction="column"
              label="프로젝트명"
              placeholder="프로젝트 명을 입력해주세요."
              name="projectName"
              options={projectOptions}
            />
            <ControlSelect
              control={control}
              size="md"
              width={250}
              direction="column"
              label="대일정"
              placeholder="대일정을 입력해주세요."
              name="majorScheduleName"
              options={majorOptions}
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="단위일정명"
              placeholder="단위일정명을 입력해주세요."
              name="subScheduleName"
            />
            {/* <ControlSelect
              control={control}
              size="md"
              width={250}
              direction="column"
              label="범위일정 단계"
              placeholder="범위일정 단계을 입력해주세요."
              name="subSchedulePhase"
              options={subSchedulePhase}
            /> */}
          </ModalFormDiv>
          <ControlTextArea
            control={control}
            size="md"
            height={180}
            direction="column"
            label="설명"
            placeholder="단위일정 설명을 입력해주세요."
            name="description"
          />
          <ModalFormDiv>
            <ControlText
              type="date"
              control={control}
              size="md"
              width={250}
              direction="column"
              label="계획시작일"
              name="subDatePlanStart"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
            <ControlText
              type="date"
              control={control}
              size="md"
              width={250}
              direction="column"
              label="계획종료일"
              name="subDatePlanEnd"
              defaultValue={new Date().toISOString().split("T")[0]}
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="난이도"
              placeholder="난이도를 입력해주세요."
              name="difficultyLevel"
            />
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="중요도"
              placeholder="중요도를 입력해주세요."
              name="priorityLevel"
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlSelect
              control={control}
              size="md"
              width={250}
              direction="column"
              label="담당자"
              placeholder="담당자를 입력해주세요."
              name="assignedTo"
              options={assignedToOptions}
            />
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
        {/* {!updateModalShow && ( */}
        <ModalFormSection>
          <ModalFormDiv>
            <>
              <label style={{ marginBottom: 8, display: "block" }}>
                <input
                  type="checkbox"
                  checked={isPerformance}
                  style={{ marginRight: 15, transform: "scale(2)" }}
                  onChange={(e) => setIsPerformance?.(e.target.checked)}
                />
                실적등록
              </label>
            </>
          </ModalFormDiv>
          {isPerformance === true && (
            <>
              <ModalFormDiv>
                <ControlText
                  type="date"
                  control={control}
                  size="md"
                  width={150}
                  direction="column"
                  label="작업시작날짜"
                  name="workDate"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
                <ControlText
                  type="date"
                  control={control}
                  size="md"
                  width={150}
                  direction="column"
                  label="작업종료날짜"
                  name="workDateEnd"
                  defaultValue={new Date().toISOString().split("T")[0]}
                />
                <ControlText
                  control={control}
                  size="md"
                  width={150}
                  direction="column"
                  label="작업시간"
                  name="workDuration"
                  defaultValue="8"
                />
              </ModalFormDiv>
              <ModalFormDiv>
                <ControlTextArea
                  control={control}
                  size="md"
                  width={474}
                  height={180}
                  direction="column"
                  label="작업내용"
                  placeholder="작업내용을 입력해주세요."
                  name="workDescription"
                />
              </ModalFormDiv>
            </>
          )}
          {/* <ModalFormDiv>
            <ControlCheckBox
              type="checkbox"
              control={control}
              size="md"
              direction="column"
              label="지연여부"
              name="isDelayed"
              defaultValue={false}
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlTextArea
              control={control}
              size="md"
              width={450}
              height={150}
              direction="column"
              label="지연사유"
              placeholder="지연사유를 입력해주세요."
              name="delayReason"
            />
          </ModalFormDiv> */}
        </ModalFormSection>
        {/* )} */}
      </ModalFormBox>
    </Modals>
  );
};

export default ModalSubSchedule;
