import React from "react";
import { ModalProps, Modals } from "..";
import { Buttons } from "src/components/atoms/Buttons";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { ControlText } from "src/components/atoms/Controls/ControlText";
import { Control } from "react-hook-form";
import { Nullable } from "src/common/types/common";
import { Screen } from "src/common/types/screen";
import { useQuery } from "@tanstack/react-query";
import { SelectOption } from "src/common/types/selectOption";
import { GET_MENU_TYPE, GET_SCREEN_TYPE } from "src/common/querykeys";
import { request } from "src/common/api";
import { ControlSelect } from "src/components/atoms/Controls/ControlSelect";
import { ControlCheckBox } from "src/components/atoms/Controls/ControlCheckBox";

interface Props extends ModalProps {
  control: Control<Nullable<Screen>, any>;
  onSubmit: any;
  updateModalShow?: boolean;
  onDelete?: () => Promise<void>;
}

const ModalScreen = ({
  control,
  onDelete,
  updateModalShow,
  ...props
}: Props) => {
  const { data: screenTypeOptions } = useQuery<SelectOption[]>({
    queryKey: [GET_SCREEN_TYPE],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/stm-code/SCREEN_TYPE`,
      });
    },
  });

  const { data: menuTypeOptions } = useQuery<SelectOption[]>({
    queryKey: [GET_MENU_TYPE],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/stm-code/MENU_TYPE`,
      });
    },
  });

  return (
    <Modals
      modalTitle="화면 등록"
      formId={props.formId}
      setModalShow={props.setModalShow}
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
            <div style={{ position: "relative", left: "20%" }}>
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
      <ModalFormBox id={props.formId} $flexDirection="row">
        <ModalFormSection>
          <ModalFormDiv>
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="화면번호"
              placeholder="화면번호를 입력해주세요"
              name="screenNo"
              type="number"
              disabled
            />
            <ControlSelect
              control={control}
              size="md"
              width={250}
              direction="column"
              label="업무구분"
              placeholder="업무구분를 입력해주세요"
              name="menuType"
              options={menuTypeOptions}
            />
          </ModalFormDiv>
          <ControlText
            control={control}
            size="md"
            direction="column"
            label="화면명"
            placeholder="화면명를 입력해주세요"
            name="screenName"
          />
          <ModalFormDiv>
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="소스경로"
              placeholder="소스경로를 입력해주세요"
              name="filePath"
            />
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              label="라우트경로"
              placeholder="라우트경로를 입력해주세요"
              name="path"
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlSelect
              control={control}
              size="md"
              width={250}
              direction="column"
              label="화면유형"
              placeholder="화면유형를 입력해주세요"
              name="screenType"
              options={screenTypeOptions}
            />
            <ControlCheckBox
              type="checkbox"
              control={control}
              size="md"
              direction="column"
              label="사용여부"
              name="isUse"
              defaultValue={true}
            />
          </ModalFormDiv>
          <ModalFormDiv></ModalFormDiv>
        </ModalFormSection>
      </ModalFormBox>
    </Modals>
  );
};

export default ModalScreen;
