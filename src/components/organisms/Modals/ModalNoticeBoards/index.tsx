import { Control } from "react-hook-form";
import { ModalProps, Modals } from "..";
import { Nullable } from "src/common/types/common";
import { CreateNoticeBoardInputs } from "src/components/containers/NoticesBoard/NoticeCreateModal";
import { Buttons } from "src/components/atoms/Buttons";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { ControlText } from "src/components/atoms/Controls/ControlText";
import { ControlSelect } from "src/components/atoms/Controls/ControlSelect";
import { ControlCheckBox } from "src/components/atoms/Controls/ControlCheckBox";
import { ControlTextArea } from "src/components/atoms/Controls/ControlTextArea";
import { useQuery } from "@tanstack/react-query";
import { SelectOption } from "src/common/types/selectOption";
import {
  GET_ABOARD_CATEGORY,
  GET_NOTICE_CATEGORY,
  GET_PROJECT_PM,
} from "src/common/querykeys";
import { request } from "src/common/api";

interface ModalNoticeBoardsProps extends ModalProps {
  control: Control<Nullable<CreateNoticeBoardInputs>, any>;
  onSubmit: any;
  createModalShow: any;
  updateModalShow?: any;
  onDelete?: () => Promise<void>;
}

export const ModalNoticeBoards = ({
  control,
  onDelete,
  updateModalShow,
  ...props
}: ModalNoticeBoardsProps) => {
  const { data: noticeBoardOptions } = useQuery<SelectOption[]>({
    queryKey: [GET_NOTICE_CATEGORY],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/stm-code/NOTICE_CATEGORY`,
      });
    },
  });
  const { data: authorNameOptions } = useQuery<SelectOption[]>({
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
      modalTitle={props.createModalShow ? "게시판 작성" : "게시판 수정"}
      formId={props.formId}
      setModalShow={props.setModalShow}
      //   width={50}
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
            onClick={() => props.setModalShow(false)}
          />
          {updateModalShow && (
            <div style={{ position: "relative", left: "32%" }}>
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
              width={200}
              direction="column"
              name="noticeTitle"
              label="제목"
              placeholder="제목을 입력해주세요."
            />
            <ControlCheckBox
              type="checkbox"
              control={control}
              size="md"
              direction="column"
              label="상단고정여부"
              name="isPinned"
              defaultValue={false}
              //   disabled={userInfo?.auth !== "Admin"}
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlSelect
              control={control}
              size="md"
              //   width={200}
              direction="column"
              label="카테고리"
              placeholder="카테고리를 입력해주세요."
              name="noticeCategory"
              options={noticeBoardOptions}
            />
            <ControlSelect
              control={control}
              size="md"
              //   width={150}
              direction="column"
              label="작성자"
              placeholder="작성자를 입력해주세요."
              name="noticeAuthorName"
              options={authorNameOptions}
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlTextArea
              control={control}
              size="md"
              width={480}
              height={300}
              direction="column"
              label="내용"
              placeholder="내용을 입력해주세요."
              name="noticeDescription"
            />
          </ModalFormDiv>
        </ModalFormSection>
      </ModalFormBox>
    </Modals>
  );
};
