import { useRef, useState } from "react";
import { InputProps, Inputs } from "../Inputs";
import * as S from "./InputFile.style";
import { ReactComponent as IconAttach } from "../../../../styles/assets/svg/icon_attach.svg";

export const InputFile = (props: InputProps) => {
  const fileRef = useRef<any>("");
  const [fileName, setFileName] = useState("");

  function changeFile() {
    if (fileRef.current?.value !== null) {
      const file = fileRef.current?.value;
      let fileValue = file.split("/").pop().split("\\").pop();
      setFileName(fileValue);
    }
  }

  return (
    <Inputs
      id={props.id && props.id}
      label={props.label && props.label}
      size={props.size}
      width={props.width}
      direction={props.direction}
      errored={props.errored}
      erroredTxt={props.erroredTxt}
    >
      <S.InputFileLabel size={props.size} htmlFor={props.id}>
        <>
          <S.InputFilePlaceholder $placeholder={fileName === "" ? true : false}>
            {fileName === "" ? props.placeholder : fileName}
          </S.InputFilePlaceholder>
          <IconAttach />
          <input
            id={props.id && props.id}
            type="file"
            ref={fileRef}
            onChange={changeFile}
          />
        </>
      </S.InputFileLabel>
    </Inputs>
  );
};
