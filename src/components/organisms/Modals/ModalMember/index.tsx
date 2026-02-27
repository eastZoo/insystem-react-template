import { Control, useFormContext } from "react-hook-form";
import { ModalProps, Modals } from "..";
import { Buttons } from "../../../atoms/Buttons";
import { ControlText } from "../../../atoms/Controls/ControlText";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { Nullable } from "../../../../common/types/common";
import { ControlCheckBox } from "../../../atoms/Controls/ControlCheckBox";
import { ControlSelect } from "../../../atoms/Controls/ControlSelect";
import { useQuery } from "@tanstack/react-query";
import { SelectOption } from "../../../../common/types/selectOption";
import {
  GET_PERMISSION_SELECT_OPTIONS,
  GET_PROJECT_PM,
} from "../../../../common/querykeys";
import { request } from "../../../../common/api";
import { CreateMemberInputs } from "../../../containers/Member/MemberCreateModal";
import { ChromePicker } from "react-color";
import { InputText } from "../../../atoms/Inputs/InputText";
import { useEffect } from "react";
interface ModalMembersProps extends ModalProps {
  control: Control<Nullable<CreateMemberInputs>, any>;
  onSubmit: any;
  createModalShow: boolean;
  updateModalShow?: any;
  onDelete?: () => Promise<void>;
}

export const ModalMember = ({
  control,
  createModalShow,
  updateModalShow,
  onDelete,
  ...props
}: ModalMembersProps) => {
  const { watch, setValue } = useFormContext();

  useEffect(() => {
    if (!watch("userColor")) {
      setValue("userColor", "#fff");
    }
  }, [watch, setValue]);

  const userColor = watch("userColor");

  /* ✔️ 직책 selectedOption 불러오기 */
  const { data: stmUserDutiesOptions } = useQuery<SelectOption[]>({
    queryKey: [GET_PROJECT_PM],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/stm-code/ST_USER`,
      });
    },
  });
  /* ✔️ 부서 selectedOption 불러오기 */
  const { data: stmUserDepartmentOptions } = useQuery<SelectOption[]>({
    queryKey: ["GET_USER_DEPARTMENT"],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/stm-code/ST_DEPARTMENT`,
      });
    },
  });
  /* ✔️ 권한 selectedOption 불러오기 */
  const { data: permissionSelectOptions } = useQuery({
    queryKey: [GET_PERMISSION_SELECT_OPTIONS],
    queryFn: async () => {
      const response = await request<SelectOption[]>({
        method: "GET",
        url: "/stm-permission/select/options",
      });

      return response;
    },
  });

  return (
    <Modals
      modalTitle={createModalShow ? "계정 추가" : "계정 관리"}
      formId={props.formId}
      setModalShow={props.setModalShow}
      height={700}
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
            <div style={{ position: "relative", left: "36%" }}>
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
              label="사용자 ID"
              placeholder="사용자 ID를 입력해주세요."
              name="userId"
              disabled={!createModalShow}
            />
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="사용자명"
              placeholder="사용자명을 입력해주세요."
              name="userName"
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="전화번호"
              placeholder="전화번호를 입력해주세요."
              name="tel"
            />
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="휴대전화"
              placeholder="휴대전화를 입력해주세요."
              name="hp"
            />
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="이메일"
              placeholder="이메일을 입력해주세요."
              name="email"
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlText
              type="date"
              control={control}
              size="md"
              width={250}
              direction="column"
              label="입사일"
              placeholder="입사일을 입력해주세요."
              name="joinDate"
            />
            <ControlSelect
              control={control}
              size="md"
              width={250}
              direction="column"
              label="부서"
              placeholder="부서를 입력해주세요."
              name="department"
              options={stmUserDepartmentOptions}
            />
            <ControlSelect
              control={control}
              size="md"
              width={250}
              direction="column"
              label="직책"
              placeholder="직책을 입력해주세요."
              name="duties"
              options={stmUserDutiesOptions}
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <InputText
              size="md"
              width={250}
              label="사용자 색상"
              placeholder="사용자 색상을 입력해주세요."
              name="userColor"
              value={userColor || "#fff"}
              onChange={(e) => setValue("userColor", e.target.value)}
            />
            <ControlSelect
              control={control}
              size="md"
              width={250}
              direction="column"
              label="권한"
              placeholder="권한을 입력해주세요."
              name="auth"
              options={permissionSelectOptions}
            />
            <ControlCheckBox
              type="checkbox"
              control={control}
              size="md"
              direction="column"
              label="사용여부"
              name="useYn"
              defaultValue={true}
            />
          </ModalFormDiv>
          <ModalFormDiv>
            {/* 사용자 색상 선택기 추가 */}
            <ChromePicker
              color={userColor || "#fff"} // default color
              onChange={
                (color: any) => setValue("userColor", color.hex) // 색상 값 저장
              }
            />
          </ModalFormDiv>
        </ModalFormSection>
      </ModalFormBox>
    </Modals>
  );
};
