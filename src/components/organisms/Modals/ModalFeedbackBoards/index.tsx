import { Control } from "react-hook-form";
import { ModalProps, Modals } from "..";
import { Nullable } from "../../../../common/types/common";
import { Buttons } from "../../../atoms/Buttons";
import { ControlTextArea } from "../../../atoms/Controls/ControlTextArea";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { ControlSelect } from "../../../atoms/Controls/ControlSelect";
import { useQuery } from "@tanstack/react-query";
import { SelectOption } from "../../../../common/types/selectOption";
import {
  GET_FEEDBACK_CATEGORY,
  GET_FEEDBACK_STATE,
} from "../../../../common/querykeys";
import { request } from "../../../../common/api";
import { CreateFeedbackBoardsInputs } from "src/components/containers/ProjectFeedbackBoards/FeedbackCreateModal";

interface ModalFeedbackBoardsProps extends ModalProps {
  control: Control<Nullable<CreateFeedbackBoardsInputs>, any>;
  onSubmit: any;
  createModalShow: any;
  updateModalShow?: any;
  onDelete?: () => Promise<void>;
}

const ModalFeedbackBoards = ({
  control,
  onDelete,
  updateModalShow,
  ...props
}: ModalFeedbackBoardsProps) => {
  /* 피드백 게시판 상태 불러오기 */
  const { data: feedbackBoardStateOptions } = useQuery<SelectOption[]>({
    queryKey: [GET_FEEDBACK_STATE],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/stm-code/SUB_PHASE`,
      });
    },
  });

  /* 피드백 게시판 카테고리 불러오기 */
  const { data: feedbackBoardOptions } = useQuery<SelectOption[]>({
    queryKey: [GET_FEEDBACK_CATEGORY],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/stm-code/PFB_CATEGORY`,
      });
    },
  });
  return (
    <Modals
      modalTitle={props.createModalShow ? "피드백 작성" : "피드백 수정"}
      formId={props.formId}
      setModalShow={props.setModalShow}
      // width={50}
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
              width={200}
              direction="column"
              label="진행상태"
              placeholder="상태를 입력해주세요."
              name="feedbackState"
              options={feedbackBoardStateOptions}
            />
            <ControlSelect
              control={control}
              size="md"
              width={200}
              direction="column"
              label="카테고리"
              placeholder="카테고리를 입력해주세요."
              name="feedbackCategory"
              options={feedbackBoardOptions}
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlTextArea
              control={control}
              size="md"
              width={880}
              height={400}
              direction="column"
              label="내용"
              placeholder="내용을 입력해주세요."
              name="feedbackRequest"
            />
          </ModalFormDiv>
        </ModalFormSection>
      </ModalFormBox>
    </Modals>
  );
};

export default ModalFeedbackBoards;
