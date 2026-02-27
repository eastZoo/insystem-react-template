import { GetRowIdParams } from "ag-grid-community";
import { Modals } from "..";
import { InputText } from "../../../atoms/Inputs/InputText";
import { Grid } from "../../Grid";
import { ModalFormBox } from "../Modals.style";
import { Buttons } from "../../../atoms/Buttons";
export const ModalSubScheduleChart = ({ ...props }) => {
  return (
    <Modals
      formId={props.formId}
      modalTitle={props.modalShow ? "실적리스트" : ""}
      setModalShow={props.setModalShow}
      width={75}
      height={650}
      modalButtons={
        <>
          <Buttons
            type="button"
            size="md"
            layout="primary"
            label="확인"
            onClick={() => props.setModalShow(false)}
            // form={props.formId}
            // onClick={props.onSubmit}
          />
        </>
      }
    >
      <>
        <ModalFormBox id={props.formId} $flexDirection={"row"}>
          <InputText
            size="md"
            width={250}
            direction="column"
            name="subScheduleName"
            label="단위일정명"
            value={props?.modalData?.subScheduleName}
            disabled
          />
          <InputText
            size="md"
            width={250}
            direction="column"
            name="subSchedulePhase"
            label="단계"
            value={props?.modalData?.subSchedulePhaseName}
            disabled
          />
        </ModalFormBox>
        <Grid
          rowData={props.performanceRecordsList}
          columnDefs={props.columnDefs}
          getRowId={(params: GetRowIdParams) => params.data.oid}
        />
      </>
    </Modals>
  );
};
