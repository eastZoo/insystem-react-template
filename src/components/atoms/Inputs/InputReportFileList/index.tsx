import { InputProps } from "../Inputs";
import { Buttons } from "../../Buttons";
import * as S from "./InputFileList.style";
import { ReactComponent as IconAttach } from "../../../../styles/assets/svg/icon_attach.svg";
import { ReactComponent as IconDownload } from "../../../../styles/assets/svg/icon_edit_download.svg";
import { ReactComponent as IconDelete } from "../../../../styles/assets/svg/icon_edit_delete.svg";
import { ColDef } from "ag-grid-community";
import { Grid } from "../../../molecules/Grid";
import { reportResponseFileType } from "../../../../common/types/file";

interface InputFileProps extends InputProps {
  inputRef?: any;
  handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  files?: File[];
  allowMultiple?: boolean;
  onUpload?: () => void;
  reportFiles?: reportResponseFileType[];
  fileDownload?: (fileName: string) => void;
  fileDelete?: ({
    fileId,
    fileName,
  }: {
    fileId: string;
    fileName: string;
  }) => void;
}

export const InputReportFileList = (props: InputFileProps) => {
  const downloadButtonRender = (e: any) => {
    return (
      <Buttons
        type="button"
        size="sm"
        layout="icon"
        icon={<IconDownload />}
        onClick={() => {
          props.fileDownload && props.fileDownload(e.data.fileName);
        }}
      />
    );
  };

  const deleteButtonRender = (e: any) => {
    return (
      <Buttons
        type="button"
        size="sm"
        layout="icon"
        icon={<IconDelete />}
        onClick={() => {
          props.fileDelete &&
            props.fileDelete({
              fileId: e.data.fileId,
              fileName: e.data.fileName,
            });
        }}
      />
    );
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "파일명",
      field: "originalname",
      minWidth: 400,
      cellStyle: { "text-align": "left" },
    },

    {
      headerName: "다운로드",
      width: 80,
      cellRenderer: downloadButtonRender,
    },

    {
      headerName: "삭제",
      width: 80,
      cellRenderer: deleteButtonRender,
    },
  ];

  return (
    <S.InputFileListBox width={props.width}>
      <S.InputFileListHeader>
        <S.InputFileListContent
          htmlFor={props.id}
          // onClick={() => props.inputRef.current.click()}
        >
          {props.files && props.files.length > 0
            ? props.files[0].name
            : "파일을 선택해주세요."}
          <input
            type="file"
            ref={props.inputRef}
            id={props.id && props.id}
            multiple={props.allowMultiple}
            onChange={props.handleChange}
          />
          <p>
            {/* {props.inputRef.current?.value
              ? props.inputRef.current?.value
              : "업로드할 파일을 선택하세요."} */}
          </p>
          <IconAttach />
        </S.InputFileListContent>
        <Buttons
          type="button"
          size="md"
          layout="secondary"
          label="업로드"
          onClick={props.onUpload}
        />
      </S.InputFileListHeader>

      <S.InputFileList>
        {props.label}
        <Grid
          rowData={props.reportFiles}
          // rowSelection={`single`}
          columnDefs={columnDefs}
        />
      </S.InputFileList>

      {props.errored && (
        <S.InputFileListErroedTxt>
          파일을 등록해주세요.
        </S.InputFileListErroedTxt>
      )}
    </S.InputFileListBox>
  );
};
