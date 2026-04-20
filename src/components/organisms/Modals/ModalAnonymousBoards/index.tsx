import { Control } from "react-hook-form";
import { ModalProps, Modals } from "..";
import { Nullable } from "../../../../common/types/common";
import { Buttons } from "../../../atoms/Buttons";
import { ControlText } from "../../../atoms/Controls/ControlText";
import { ControlTextArea } from "../../../atoms/Controls/ControlTextArea";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { ControlSelect } from "../../../atoms/Controls/ControlSelect";
import { useQuery } from "@tanstack/react-query";
import { SelectOption } from "../../../../common/types/selectOption";
import { GET_ABOARD_CATEGORY } from "../../../../common/querykeys";
import { request } from "../../../../common/api";
import { CreateBoardsInputs } from "src/components/containers/AnonymousBoards/BoardsCreateModal";
import { ControlCheckBox } from "src/components/atoms/Controls/ControlCheckBox";
import { useAtomValue } from "jotai";
import { userState } from "src/states/loginUser";

interface ModalAnonymousBoardsProps extends ModalProps {
  control: Control<Nullable<CreateBoardsInputs>, any>;
  onSubmit: any;
  createModalShow: any;
  updateModalShow?: any;
  onDelete?: () => Promise<void>;
}

const ModalAnonymousBoards = ({
  control,
  onDelete,
  updateModalShow,
  ...props
}: ModalAnonymousBoardsProps) => {
  const userInfo = useAtomValue(userState);

  const { data: anonymousBoardOptions } = useQuery<SelectOption[]>({
    queryKey: [GET_ABOARD_CATEGORY],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/stm-code/AB_CATEGORY`,
      });
    },
  });

  return (
    <Modals
      modalTitle={props.createModalShow ? "게시판 작성" : "게시판 수정"}
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
            <ControlText
              control={control}
              size="md"
              width={250}
              direction="column"
              name="boardTitle"
              label="제목"
              placeholder="제목을 입력해주세요."
            />
            <ControlSelect
              control={control}
              size="md"
              width={200}
              direction="column"
              label="카테고리"
              placeholder="카테고리를 입력해주세요."
              name="boardCategory"
              options={anonymousBoardOptions}
            />
            <ControlCheckBox
              type="checkbox"
              control={control}
              size="md"
              direction="column"
              label="답변여부"
              name="isAnswer"
              defaultValue={false}
              disabled={userInfo?.auth !== "Admin"}
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
              name="boardDescription"
            />
          </ModalFormDiv>
          <ControlTextArea
            control={control}
            size="md"
            height={80}
            direction="column"
            label="코멘트"
            placeholder="코멘트를 입력해주세요."
            name="boardComment"
            disabled={userInfo?.auth !== "Admin"}
          />
        </ModalFormSection>
      </ModalFormBox>
    </Modals>
  );
};

export default ModalAnonymousBoards;
