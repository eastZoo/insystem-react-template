import { Buttons } from "../../../atoms/Buttons";
import { ModalProps, Modals } from "..";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { ControlText } from "../../../atoms/Controls/ControlText";
import { Control, Controller } from "react-hook-form";
import { Nullable } from "../../../../common/types/common";
import { useQuery } from "@tanstack/react-query";
import { SelectOption } from "../../../../common/types/selectOption";
import { GET_PROJECT_PM } from "../../../../common/querykeys";
import { request } from "../../../../common/api";
import { ReactComponent as IconFind } from "../../../../styles/assets/svg/icon_find.svg";
import { InputFileList } from "src/components/atoms/Inputs/InputFileList";
import React from "react";
import { Editor, Viewer } from "@toast-ui/react-editor";
import tableMergedCellPlugin from "@toast-ui/editor-plugin-table-merged-cell";
import { documentManage } from "src/common/types/documentManage";
import { CreateDocumentManageInputs } from "src/components/containers/DocumentManangement/DocumentManageCreateModal";
import { ControlSelect } from "src/components/atoms/Controls/ControlSelect";

interface ModalDocumentManageProps extends ModalProps {
  control: Control<Nullable<CreateDocumentManageInputs>, any>;
  onSubmit: any;
  selectedProjectModalShow?: boolean;
  setSelectedProjectModalShow?: any;
  createModalShow?: any;
  updateModalShow?: any;
  selectedDocumentManage: documentManage | null;
  onDelete?: () => Promise<void>;
  onFileDelete?: (file: any) => Promise<void>;
  tempImagesRef?: React.MutableRefObject<
    { blob: Blob; name: string; filePath?: string }[]
  >;
  editorRef?: any;
  editMode?: any;
  setEditMode?: any;
}

const ModalDocumentManage = ({
  control,
  onDelete,
  onFileDelete,
  createModalShow,
  updateModalShow,
  selectedProjectModalShow,
  setSelectedProjectModalShow,
  selectedDocumentManage,
  tempImagesRef,
  editorRef,
  editMode,
  setEditMode,
  ...props
}: ModalDocumentManageProps) => {
  const { data: assignedToOptions } = useQuery<SelectOption[]>({
    queryKey: [GET_PROJECT_PM],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/stm-user/ST_USER`,
      });
    },
  });
  /* 문서 구분 불러오기 */
  const { data: documentStateDivisionOptions } = useQuery<SelectOption[]>({
    queryKey: ["GET_DIVISION_OPTIONS"],
    queryFn: () => {
      return request<SelectOption[]>({
        method: "GET",
        url: `/stm-code/DOCUMENT_CATEGORY`,
      });
    },
  });

  // useEffect(() => {
  //   if (!updateModalShow) {
  //     setEditMode(true);
  //   }
  // }, [updateModalShow]);
  return (
    <Modals
      modalTitle={updateModalShow ? "문서관리 수정" : "문서관리 등록"}
      formId={props.formId}
      setModalShow={props.setModalShow}
      // width={40}
      // height={670}
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
            <div
              style={{
                display: "flex",
                position: "relative",
                left: "38%",
                gap: "5px",
              }}
            >
              {!editMode && (
                <Buttons
                  type="button"
                  size="md"
                  layout="highlight"
                  label="수정"
                  onClick={() => setEditMode(true)}
                />
              )}
              {editMode && (
                <Buttons
                  type="button"
                  size="md"
                  layout="highlight"
                  label="수정취소"
                  onClick={() => setEditMode(false)}
                />
              )}
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
      <>
        <ModalFormBox id={props.formId} $flexDirection={"row"}>
          <ModalFormSection>
            <ModalFormDiv $alignItems="flex-end">
              <ControlText
                control={control}
                size="md"
                width={504}
                direction="column"
                label="제목"
                placeholder="제목을 입력해주세요."
                name="documentTitle"
                disabled={!editMode}
              />
            </ModalFormDiv>
            <ModalFormDiv $alignItems="flex-end">
              <ControlSelect
                control={control}
                size="md"
                width={170}
                direction="column"
                label="문서구분"
                placeholder="문서구분을 선택해주세요."
                name="documentDivision"
                options={documentStateDivisionOptions}
                disabled={!editMode}
              />
              <ControlText
                type="date"
                control={control}
                size="md"
                direction="column"
                label="등록일자"
                name="documentWriteDate"
                disabled={!editMode}
              />
              <ControlText
                control={control}
                size="md"
                width={200}
                direction="column"
                name="projectName"
                label="프로젝트"
                disabled
              />
              {editMode && (
                <Buttons
                  type="button"
                  size="md"
                  layout="find"
                  onClick={() => {
                    setSelectedProjectModalShow(!selectedProjectModalShow);
                    // props.setModalShow(false);
                  }}
                >
                  <IconFind />
                </Buttons>
              )}
            </ModalFormDiv>
            <ModalFormDiv>
              <ControlSelect
                control={control}
                size="md"
                direction="column"
                width={170}
                name="participantName"
                label="작성자"
                placeholder="작성자를 입력하세요"
                options={assignedToOptions || []}
                disabled={!editMode}
              />
            </ModalFormDiv>
          </ModalFormSection>
          <ModalFormSection>
            {/* 파일 추가 ~ ing */}
            <Controller
              control={control}
              name="filePath"
              render={({ field }) => (
                <InputFileList
                  {...field}
                  label="파일 업로드"
                  onFileChange={(files) => field.onChange(files)}
                  onFileDelete={onFileDelete}
                  disabled={!editMode}
                />
              )}
            />
          </ModalFormSection>
        </ModalFormBox>
        <ModalFormBox id={props.formId} $flexDirection={"row"}>
          <ModalFormSection style={{ width: "100%", zIndex: "1" }}>
            {updateModalShow && !editMode ? (
              <Controller
                control={control}
                name="documentDescription"
                render={({ field: { value } }) => (
                  <div
                    style={{
                      height: 450,
                      overflowY: "auto",
                      textAlign: "left",
                    }}
                  >
                    <Viewer
                      key="viewer"
                      initialValue={value || " "}
                      plugins={[tableMergedCellPlugin]}
                    />
                  </div>
                )}
              />
            ) : (
              <Controller
                control={control}
                name="documentDescription"
                render={({ field: { onChange, value } }) => (
                  <Editor
                    key="editor"
                    ref={editorRef}
                    initialValue={value || " "}
                    initialEditType="wysiwyg"
                    height="450px"
                    previewStyle="vertical"
                    useCommandShortcut={true}
                    toolbarItems={[
                      ["heading", "bold", "italic", "strike"],
                      ["hr", "quote"],
                      ["ul", "ol", "task", "indent", "outdent"],
                      ["table", "image", "link"],
                      ["code", "codeblock"],
                      ["scrollSync"],
                    ]}
                    onChange={() => {
                      const editorInstance = editorRef.current?.getInstance();
                      const markdown = editorInstance.getMarkdown();
                      onChange(markdown);
                    }}
                    plugins={[tableMergedCellPlugin]}
                    hooks={{
                      addImageBlobHook: async (blob, callback) => {
                        const fileName = (blob as File).name;
                        const formData = new FormData();
                        formData.append("files", blob);

                        try {
                          const response = await request<any>({
                            method: "POST",
                            url: "/document-management/file/uploads",
                            data: formData,
                            headers: {
                              "Content-Type": "multipart/form-data",
                            },
                          });

                          const uploadedFile = Array.isArray(response)
                            ? response.find((f: any) => f.fileName === fileName)
                            : null;

                          if (uploadedFile) {
                            const serverUrl = `${process.env.REACT_APP_API_HOST}/file/download?filePath=${uploadedFile.filePath}&fileName=${uploadedFile.fileName}`;
                            callback(serverUrl, fileName);

                            tempImagesRef?.current.push({
                              blob,
                              name: fileName,
                              filePath: uploadedFile.filePath,
                            });
                          } else {
                            const tempUrl = URL.createObjectURL(blob);
                            callback(tempUrl, fileName);
                          }
                        } catch (err) {
                          console.error("이미지 업로드 실패", err);
                          const tempUrl = URL.createObjectURL(blob);
                          callback(tempUrl, fileName);
                        }
                      },
                    }}
                    // hooks={{
                    //   addImageBlobHook: async (blob, callback) => {
                    //     const tempUrl = URL.createObjectURL(blob);
                    //     const fileName = (blob as File).name;
                    //     callback(tempUrl, fileName); // 에디터에는 임시 URL 삽입
                    //     tempImagesRef?.current.push({
                    //       blob,
                    //       name: fileName,
                    //     }); // 확인 시 업로드할 이미지 저장
                    //   },
                    // }}
                  />
                )}
              />
            )}
          </ModalFormSection>
        </ModalFormBox>
      </>
    </Modals>
  );
};

export default ModalDocumentManage;
