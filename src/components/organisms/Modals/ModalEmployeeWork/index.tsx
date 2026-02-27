import { Buttons } from "../../../atoms/Buttons";
import { ModalProps, Modals } from "..";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { ControlText } from "../../../atoms/Controls/ControlText";
import { ControlTextArea } from "../../../atoms/Controls/ControlTextArea";
import { Control } from "react-hook-form";
import { Nullable } from "../../../../common/types/common";
import { useQuery } from "@tanstack/react-query";
import { SelectOption } from "../../../../common/types/selectOption";
import { GET_PROJECT_PM } from "../../../../common/querykeys";
import { request } from "../../../../common/api";
import { CreateCalendarInputs } from "../../../../components/containers/EmployeeWork/EmployeeWorkCreateModal";
import { ControlTagSelect } from "src/components/atoms/Controls/ControlTagAutocomplete";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { userState } from "src/states/loginUser";
import { EmployeeWorkPrintPrepare } from "./EmployeeWorkPrintPrepare";

interface ModalEmployeeProps extends ModalProps {
  control: Control<Nullable<CreateCalendarInputs>, any>;
  selectedEvent: any | null;
  onSubmit: any;
  createModalShow?: any;
  updateModalShow?: any;
  onDelete?: () => Promise<void>;
}

const ModalEmployeeWork = ({
  control,
  onDelete,
  createModalShow,
  updateModalShow,
  selectedEvent,
  ...props
}: ModalEmployeeProps) => {
  const { data: assignedToOptions } = useQuery<SelectOption[]>({
    queryKey: [GET_PROJECT_PM],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/stm-user/ST_USER`,
      });
    },
    select: (data) => {
      const extraOptions: SelectOption[] = [
        { label: "전체휴무", value: "ALL_OFF" },
        { label: "사내행사", value: "COMPANY_EVENT" },
      ];

      return [...extraOptions, ...data];
    },
  });

  return (
    <>
      <Modals
        modalTitle={updateModalShow ? "근무현황 수정" : "근무현황 등록"}
        formId={props.formId}
        setModalShow={props.setModalShow}
        // width={40}
        // height={670}
        modalButtons={
          <>
            {selectedEvent?.isHoliday === "Y" ? (
              ""
            ) : (
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
            {updateModalShow && !selectedEvent?.isHoliday && (
              <div style={{ position: "relative", left: "35%" }}>
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
                width={612}
                direction="column"
                label="제목"
                placeholder="근무현황을 입력해주세요."
                name="workTitle"
              />
            </ModalFormDiv>
            <ModalFormDiv>
              {/* <ControlText
              control={control}
              size="md"
              width={612}
              direction="column"
              label="담당자"
              placeholder="담당자를 입력해주세요."
              name="userName"
              options={assignedToOptions}
            /> */}
              <ControlTagSelect
                control={control}
                size="md"
                direction="column"
                width={612}
                name="userName"
                label="담당자"
                placeholder="담당자를 입력하세요"
                options={assignedToOptions || []}
              />
            </ModalFormDiv>
            <ModalFormDiv>
              <ControlText
                type="date"
                control={control}
                size="md"
                width={300}
                direction="column"
                label="시작날짜"
                name="employeeWorkStart"
              />
              <ControlText
                type="date"
                control={control}
                size="md"
                width={300}
                direction="column"
                label="종료날짜"
                name="employeeWorkEnd"
              />
            </ModalFormDiv>
            <ControlTextArea
              control={control}
              size="md"
              height={180}
              direction="column"
              label="설명"
              placeholder="설명을 입력해주세요."
              name="employeeDescription"
            />
          </ModalFormSection>
        </ModalFormBox>
      </Modals>
    </>
  );
};

export default ModalEmployeeWork;
