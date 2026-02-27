import { Control } from "react-hook-form";
import { ModalProps, Modals } from "..";
import { Nullable } from "../../../../common/types/common";
import { Buttons } from "../../../atoms/Buttons";
import { ControlText } from "../../../atoms/Controls/ControlText";
import { ControlTextArea } from "../../../atoms/Controls/ControlTextArea";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { useRecoilValue } from "recoil";
import { userState } from "../../../../states/loginUser";
import { CreateWeeklyInputs } from "../../../containers/WeeklyRecords/WeeklyCreateModal";
import { weeklyRecords } from "../../../../common/types/weeklyRecords";

interface ModalWeeklyProps extends ModalProps {
  control: Control<Nullable<CreateWeeklyInputs>, any>;
  onSubmit: any;
  createModalShow: any;
  updateModalShow?: any;
  onDelete?: () => Promise<void>;
  selectedWeeklyRecords: weeklyRecords | null;
}

const ModalWeeklyRecords = ({
  control,
  onDelete,
  updateModalShow,
  selectedWeeklyRecords,
  ...props
}: ModalWeeklyProps) => {
  const userInfo = useRecoilValue(userState);
  return (
    <Modals
      modalTitle={
        props.createModalShow ? "주간업무보고서 추가" : "주간업무보고서 수정"
      }
      formId={props.formId}
      setModalShow={props.setModalShow}
      // height={650}
      modalButtons={
        <>
          {((updateModalShow &&
            userInfo?.userName === selectedWeeklyRecords?.writer) ||
            selectedWeeklyRecords === null ||
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
            userInfo?.userName === selectedWeeklyRecords?.writer) ||
            userInfo?.auth === "Admin") && (
            <div style={{ position: "relative", left: "41.5%" }}>
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
              type="date"
              control={control}
              size="md"
              width={130}
              direction="column"
              name="weeklyRecordsName"
              label="주간업무보고서"
            />
            <ControlText
              control={control}
              size="md"
              width={130}
              direction="column"
              name="writer"
              label="작성자"
              disabled={userInfo?.auth !== "Admin"} // ❇️ 관리자만 수정 가능
            />
          </ModalFormDiv>
          <ModalFormDiv $alignItems="baseline">
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: 500,
                color: "#000000cc",
              }}
            >
              금주진행업무
            </span>
            <ControlText
              type="date"
              control={control}
              size="md"
              width={197}
              direction="column"
              name="weekworkStart"
            />
            <span>~</span>
            <ControlText
              type="date"
              control={control}
              size="md"
              width={197}
              direction="column"
              name="weekworkEnd"
            />
            <div />
            <span
              style={{
                fontSize: "1.2rem",
                fontWeight: 500,
                color: "#000000cc",
              }}
            >
              차주진행업무
            </span>
            <ControlText
              type="date"
              control={control}
              size="md"
              width={197}
              direction="column"
              name="nextWeekworkStart"
            />
            <span>~</span>
            <ControlText
              type="date"
              control={control}
              size="md"
              width={197}
              direction="column"
              name="nextWeekworkEnd"
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlTextArea
              control={control}
              size="lg"
              width={500}
              height={500}
              direction="column"
              placeholder="작업내용을 입력해주세요."
              name="weekDescription"
            />
            <div />
            <ControlTextArea
              control={control}
              size="lg"
              width={500}
              height={500}
              direction="column"
              placeholder="작업내용을 입력해주세요."
              name="nextweekDescription"
            />
          </ModalFormDiv>
          <ModalFormDiv>
            <ControlTextArea
              control={control}
              size="lg"
              width={1024}
              direction="column"
              placeholder="작업내용을 입력해주세요."
              label="특이사항"
              name="significant"
            />
          </ModalFormDiv>
        </ModalFormSection>
      </ModalFormBox>
    </Modals>
  );
};

export default ModalWeeklyRecords;
