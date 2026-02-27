import { Buttons } from "../../../atoms/Buttons";
import { ModalProps, Modals } from "..";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { ControlText } from "../../../atoms/Controls/ControlText";
import { Control, Controller } from "react-hook-form";
import { Nullable } from "../../../../common/types/common";
import { useQuery } from "@tanstack/react-query";
import { SelectOption } from "../../../../common/types/selectOption";
import { GET_PROJECT_PM } from "../../../../common/querykeys";
import { request } from "../../../../common/api";
import { ReactComponent as IconFind } from "../../../../styles/assets/svg/icon_find.svg";
import { InputFileList } from "src/components/atoms/Inputs/InputFileList";
import React from "react";
import { environmentalVar } from "src/common/types/environmentalVar";
import { CreateEnvironmentalVarInputs } from "src/components/containers/EnvironmentalVar/EnvironmentalVarCreateModal";
import { ControlTextArea } from "src/components/atoms/Controls/ControlTextArea";
import { ControlTagSelect } from "src/components/atoms/Controls/ControlTagAutocomplete";

interface ModalEnvironmentalVarProps extends ModalProps {
  control: Control<Nullable<CreateEnvironmentalVarInputs>, any>;
  onSubmit: any;
  selectedProjectModalShow?: boolean;
  setSelectedProjectModalShow?: any;
  createModalShow?: any;
  updateModalShow?: any;
  selectedEnvironmentalVar: environmentalVar | null;
  onDelete?: () => Promise<void>;
  onFileDelete?: (file: any) => Promise<void>;
  tempImagesRef?: React.MutableRefObject<{ blob: Blob; name: string }[]>;
  editorRef?: any;
}

const ModalEnvironmentalVar = ({
  control,
  onDelete,
  onFileDelete,
  createModalShow,
  updateModalShow,
  selectedProjectModalShow,
  setSelectedProjectModalShow,
  selectedEnvironmentalVar,
  tempImagesRef,
  editorRef,
  ...props
}: ModalEnvironmentalVarProps) => {
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
      modalTitle={updateModalShow ? "환경 변수 수정" : "환경 변수 등록"}
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
            <ModalFormDiv $alignItems="flex-end">
              <ControlText
                control={control}
                size="md"
                width={312}
                direction="column"
                name="projectName"
                label="프로젝트"
                disabled
              />
              <Buttons
                type="button"
                size="md"
                layout="find"
                onClick={() => {
                  setSelectedProjectModalShow(!selectedProjectModalShow);
                  // props.setModalShow(false);
                }}
              >
                <IconFind />
              </Buttons>
            </ModalFormDiv>
            <ModalFormDiv>
              <ControlText
                control={control}
                size="md"
                width={356}
                direction="column"
                label="제목"
                placeholder="제목을 입력해주세요."
                name="envTitle"
              />
            </ModalFormDiv>
            <ControlTagSelect
              control={control}
              size="md"
              direction="column"
              name="participantName"
              label="작성자"
              placeholder="작성자를 입력하세요"
              options={assignedToOptions || []}
            />
            <ControlTextArea
              control={control}
              size="md"
              height={140}
              direction="column"
              label="내용"
              placeholder="내용을 입력해주세요."
              name="envDescription"
            />
          </ModalFormSection>
          <ModalFormSection>
            {/* 파일 추가 ~ ing */}
            <ModalFormDiv>
              <Controller
                control={control}
                name="filePath"
                render={({ field }) => (
                  <InputFileList
                    {...field}
                    label="env 파일 업로드"
                    onFileChange={(files) => field.onChange(files)}
                    onFileDelete={onFileDelete}
                  />
                )}
              />
            </ModalFormDiv>
          </ModalFormSection>
        </ModalFormBox>
      </>
    </Modals>
  );
};

export default ModalEnvironmentalVar;
