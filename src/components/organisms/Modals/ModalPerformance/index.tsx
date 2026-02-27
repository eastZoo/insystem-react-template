import { Control } from "react-hook-form";
import { ModalProps, Modals } from "..";
import { Nullable } from "../../../../common/types/common";
import { ReactComponent as IconFind } from "../../../../styles/assets/svg/icon_find.svg";
import { Buttons } from "../../../atoms/Buttons";
import { ControlCheckBox } from "../../../atoms/Controls/ControlCheckBox";
import { ControlText } from "../../../atoms/Controls/ControlText";
import { ControlTextArea } from "../../../atoms/Controls/ControlTextArea";
import { CreatePerformanceRecordsInputs } from "../../../containers/PerformanceRecords/PerformanceCreateModal";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../states/loginUser";
import { ControlSelect } from "../../../atoms/Controls/ControlSelect";
import { useQuery } from "@tanstack/react-query";
import { SelectOption } from "../../../../common/types/selectOption";
import { GET_PROJECT_PM } from "../../../../common/querykeys";
import { request } from "../../../../common/api";
import { performanceRecords } from "../../../../common/types/performanceRecords";

interface ModalPerformanceRecordsProps extends ModalProps {
  control: Control<Nullable<CreatePerformanceRecordsInputs>, any>;
  onSubmit: any;
  createModalShow: any;
  selectedSubScheduleModalShow?: boolean;
  setSelectedSubScheduleModalShow?: any;
  updateModalShow?: any;
  onDelete?: () => Promise<void>;
  selectedPerformance: performanceRecords | null;
}

const ModalPerformance = ({
  control,
  selectedSubScheduleModalShow,
  setSelectedSubScheduleModalShow,
  selectedPerformance,
  onDelete,
  updateModalShow,
  ...props
}: ModalPerformanceRecordsProps) => {
  const userInfo = useRecoilValue(userState);
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
      modalTitle={props.createModalShow ? "실적 등록" : "실적 수정"}
      formId={props.formId}
      setModalShow={props.setModalShow}
      height={650}
      modalButtons={
        <>
          {((updateModalShow &&
            userInfo?.oid === selectedPerformance?.assignedTo) ||
            selectedPerformance === null ||
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
            userInfo?.oid === selectedPerformance?.assignedTo) ||
            userInfo?.auth === "Admin") && (
            <div style={{ position: "relative", left: "37%" }}>
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
          <ModalFormDiv $alignItems="flex-end">
            <ControlText
              control={control}
              size="md"
              width={650}
              direction="column"
              name="subScheduleName"
              label="단위일정"
              disabled
            />
            <Buttons
              type="button"
              size="md"
              layout="find"
              onClick={() => {
                setSelectedSubScheduleModalShow(!selectedSubScheduleModalShow);
                // props.setModalShow(false);
              }}
            >
              <IconFind />
            </Buttons>
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlText
              type="date"
              control={control}
              size="md"
              width={130}
              direction="column"
              label="작업시작날짜"
              name="workDate"
            />
            <ControlText
              type="date"
              control={control}
              size="md"
              width={130}
              direction="column"
              label="작업종료날짜"
              name="workDateEnd"
            />
            <ControlText
              control={control}
              size="md"
              width={50}
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
              width={650}
              height={200}
              direction="column"
              label="작업내용"
              placeholder="작업내용을 입력해주세요."
              name="workDescription"
            />
          </ModalFormDiv>
          <ModalFormDiv>
            {/* <ControlText
              control={control}
              size="md"
              width={500}
              direction="column"
              label="담당자"
              placeholder="담당자를 입력해주세요."
              name="assignedTo"
              disabled={userInfo?.auth !== "Admin"} // ❇️ 관리자만 수정 가능
            /> */}
            <ControlSelect
              control={control}
              size="md"
              // width={250}
              direction="column"
              label="담당자"
              placeholder="담당자를 입력해주세요."
              name="assignedTo"
              options={assignedToOptions}
              disabled={userInfo?.auth !== "Admin"}
            />
            <ControlCheckBox
              type="checkbox"
              control={control}
              size="md"
              direction="column"
              label="출장여부"
              name="isTravel"
              defaultValue={false}
            />
          </ModalFormDiv>
        </ModalFormSection>
      </ModalFormBox>
    </Modals>
  );
};

export default ModalPerformance;
