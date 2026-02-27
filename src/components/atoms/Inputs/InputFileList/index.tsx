import { useEffect, useState } from "react";
import { InputProps } from "../Inputs";
import { Buttons } from "../../Buttons";
import * as S from "./InputFileList.style";
import { ReactComponent as IconAttach } from "../../../../styles/assets/svg/icon_attach.svg";
import { ReactComponent as IconDownload } from "../../../../styles/assets/svg/icon_edit_download.svg";
import { ReactComponent as IconDelete } from "../../../../styles/assets/svg/icon_edit_delete.svg";
import { ColDef } from "ag-grid-community";
import { Grid } from "../../../molecules/Grid";
import { showAlert } from "src/components/containers/Alert";
import { DropEvent } from "react-dropzone";
import { FileDropZone } from "../InputDropzone";

interface InputFileProps extends InputProps {
  inputRef?: any;
  onFileChange?: (files: File[]) => void; // 부모 컴포넌트로 파일을 전달하는 함수 추가
  onFileDelete?: (file: any) => Promise<void>;
  isDownload?: any;
  $minHeight?: any;
}

export const InputFileList = (props: InputFileProps) => {
  // const [files, setFiles] = useState<File[]>([]);
  // const files = props.value || [];

  const [localFiles, setLocalFiles] = useState<File[]>(props.value || []); // 로컬 상태로 관리

  useEffect(() => {
    setLocalFiles(props.value || []); // 부모 컴포넌트에서 전달된 파일 업데이트
  }, [props.value]);

  const downloadButtonRender = (e: any) => {
    return (
      <Buttons
        type="button"
        size="sm"
        layout="icon"
        icon={<IconDownload />}
        onClick={() => {
          const fileUrl = URL.createObjectURL(e.data); // 파일의 URL을 생성
          const link = document.createElement("a");
          link.href = fileUrl;
          link.download = e.data.name; // 다운로드 시 파일명
          link.click(); // 클릭해서 다운로드 시작
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
        // onClick={() => {
        //   const updatedFiles = localFiles.filter(
        //     (file: any) => file !== e.data
        //   );
        //   setLocalFiles(updatedFiles); // 삭제된 파일 상태 업데이트
        //   if (props.onFileChange) {
        //     props.onFileChange(updatedFiles); // 부모 컴포넌트로 변경된 파일 전달
        //   }
        //   props.onFileChange?.(updatedFiles);
        // }}
        disabled={props.disabled}
        onClick={() => props.onFileDelete?.(e.data)}
      />
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);

    // 30MB 제한 (30 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 30 * 1024 * 1024;
    const oversizeFiles = selectedFiles.filter(
      (file) => file.size > MAX_FILE_SIZE
    );

    if (oversizeFiles.length > 0) {
      showAlert("30MB를 초과하는 파일은 업로드할 수 없습니다.");
      return; // 업로드 중단
    }

    setLocalFiles([...localFiles, ...selectedFiles]);
    if (props.onFileChange) {
      props.onFileChange([...localFiles, ...selectedFiles]); // 부모 컴포넌트로 파일 전달
    }
  };

  const columnDefs: ColDef[] = [
    {
      headerName: "파일명",
      field: "name",
      minWidth: 400,
    },

    {
      headerName: "다운로드",
      width: 80,
      cellRenderer: downloadButtonRender,
    },

    {
      headerName: "삭제",
      width: 80,
      cellRenderer: !props.isDownload && deleteButtonRender,
    },
  ];

  const onDrop = (acceptedFiles: any[], _: any, e: DropEvent) => {
    const MAX_FILE_SIZE = 30 * 1024 * 1024;
    const oversizeFiles = acceptedFiles.filter(
      (file) => file.size > MAX_FILE_SIZE
    );

    if (oversizeFiles.length > 0) {
      showAlert("30MB를 초과하는 파일은 업로드할 수 없습니다.");
      return; // 업로드 중단
    }

    setLocalFiles([...localFiles, ...acceptedFiles]);
    if (props.onFileChange) {
      props.onFileChange([...localFiles, ...acceptedFiles]); // 부모 컴포넌트로 파일 전달
    }
  };
  return (
    <S.InputFileListBox $width={props.width}>
      {props.label && (
        <S.InputLabel
          htmlFor={props.id && props.id}
          direction={props.direction === "column" ? "column" : "row"}
        >
          <>{props.label}</>
        </S.InputLabel>
      )}
      {!props.isDownload && (
        <S.InputFileListHeader>
          <S.InputFileListContent
            htmlFor={props.id}
            // onClick={() => props.inputRef.current.click()}
          >
            <input
              type="file"
              ref={props.inputRef}
              id={props.id && props.id}
              multiple
              onChange={handleChange}
              disabled={props.disabled}
            />
            <p>
              {/* {props.inputRef.current?.value
              ? props.inputRef.current?.value
              : "업로드할 파일을 선택하세요."} */}
            </p>
            <IconAttach />
          </S.InputFileListContent>
          {/* <Buttons type="button" size="md" layout="secondary" label="업로드" /> */}
        </S.InputFileListHeader>
      )}
      <S.InputFileList $minHeight={props.$minHeight}>
        <FileDropZone onDrop={onDrop}>
          <Grid
            rowData={localFiles}
            // rowSelection={`single`}
            columnDefs={columnDefs}
          />
        </FileDropZone>
        <S.FileCost>※ 30MB를 초과하는 파일은 업로드할 수 없습니다.</S.FileCost>
      </S.InputFileList>
      {props.errored && (
        <S.InputFileListErroedTxt>
          파일을 등록해주세요.
        </S.InputFileListErroedTxt>
      )}
    </S.InputFileListBox>
  );
};
