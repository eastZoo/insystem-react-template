import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import {
  DropzoneContainer,
  DropzoneDesign,
} from "src/components/atoms/Inputs/InputDropzone/dropzone.style";

interface useDropZoneProps {
  onDrop: (
    acceptedFiles: any[],
    fileRejection: FileRejection[],
    event: DropEvent
  ) => void;
  children?: React.ReactElement[] | React.ReactElement;
}

export const FileDropZone = ({ onDrop, children }: useDropZoneProps) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noKeyboard: true, // 키보드로 업로드 막기
    noClick: true, // 클릭으로 업로드 막기
  });
  return (
    <>
      <DropzoneContainer {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <DropzoneDesign>업로드 할 파일을 내려놓으세요</DropzoneDesign>
        ) : (
          children
        )}
      </DropzoneContainer>
    </>
  );
};
