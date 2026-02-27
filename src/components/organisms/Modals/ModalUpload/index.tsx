import { useQuery } from "@tanstack/react-query";
import { ColDef } from "ag-grid-community";
import dayjs from "dayjs";
import { useState } from "react";
import { ModalProps, Modals } from "..";
import { request } from "../../../../common/api";
import { Buttons } from "../../../atoms/Buttons";
import { ExplainText } from "../../../atoms/ExplainText";
import { Grid } from "../../Grid";
import * as S from "./ModalUpload.style";

interface ModalUploadProps extends ModalProps {
  changeTradeId: (id: number) => void;
}

export const ModalUpload = ({
  setModalShow,
  changeTradeId,
}: ModalUploadProps) => {
  const [trendId, setTrendId] = useState<number | null>(null);

  const handleRowChange = (e: any) => {
    const rows = e?.api?.getSelectedRows();
    if (rows[0]?.chtTrdId) {
      setTrendId(rows[0].chtTrdId);
    } else {
      setTrendId(null);
    }
  };

  const handleLoad = () => {
    if (trendId) {
      changeTradeId(trendId);
      setModalShow(false);
    }
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "선택",
      // field: "chtTrdId",
      checkboxSelection: true,
      width: 50,
      suppressAutoSize: false,
    },
    {
      headerName: "저장명",
      field: "chtTrdFileName",
    },
    {
      headerName: "등록자",
      field: "userName",
      width: 80,
      suppressAutoSize: false,
    },
    {
      headerName: "등록일시",
      field: "userTime",
      width: 140,
      valueGetter: (params: any) =>
        dayjs(params.data.userTime).format("YYYY.MM.DD HH:mm:ss"),
      suppressAutoSize: false,
    },
  ];

  return (
    <Modals
      modalTitle="불러오기"
      setModalShow={setModalShow}
      modalButtons={
        <>
          <Buttons
            type="button"
            size="md"
            layout="primary"
            label="불러오기"
            disabled={!trendId}
            onClick={handleLoad}
          />
          <Buttons
            type="button"
            size="md"
            layout="secondary"
            label="취소"
            onClick={() => setModalShow(false)}
          />
        </>
      }
    >
      <>
        <ExplainText>
          <>※ 저장된 데이터를 선택하고 '불러오기' 버튼을 누르세요.</>
        </ExplainText>

        <S.ModalUploadGrid>
          <Grid
            columnDefs={columnDefs}
            rowSelection={`single`}
            onSelectionChanged={handleRowChange}
          />
        </S.ModalUploadGrid>
      </>
    </Modals>
  );
};
