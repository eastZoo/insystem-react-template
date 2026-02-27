import {
  ColDef,
  GetRowIdParams,
  SelectionChangedEvent,
} from "ag-grid-community";
import { ChangeEvent, FormEvent, useState } from "react";
import { ModalProps, Modals } from "..";
import useProjectRegister from "../../../../common/hooks/useProjectRegister";
import { Project } from "../../../../common/types/project";
import { Buttons } from "../../../atoms/Buttons";
import { InputText } from "../../../atoms/Inputs/InputText";
import { Grid } from "../../Grid";
import { SearchBar } from "../../SearchBar";
import { ModalFormSection } from "../Modals.style";

interface ModalProjectSelectProps extends ModalProps {
  onSubmit: (selectedRow: Project | undefined) => void;
}

const ModalProjectSelect = ({ ...props }: ModalProjectSelectProps) => {
  const [selectedProject, setSelectedProject] = useState<Project>();
  const [searchInputs, setSearchInputs] = useState<any>({});

  const { data: projectList, refetch } = useProjectRegister(searchInputs);

  /** 검색 조건 검색 버튼 */
  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    refetch();
  };

  /** value 변경 */
  const handleValueChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setSearchInputs({
      ...searchInputs,
      [name]: value,
    });
  };

  const onSelectionChanged = (e: SelectionChangedEvent<Project>) => {
    setSelectedProject(e.api.getSelectedRows()[0]);
  };

  const columnDefs: ColDef<Project>[] = [
    { headerName: "프로젝트명", field: "projectName", width: 260 },
    {
      headerName: "설명",
      field: "description",
      cellStyle: {
        display: "block",
      },
      minWidth: 381,
      flex: 1,
    },
    { headerName: "프로젝트구분", field: "projectCategoryName", width: 100 },
    { headerName: "PM", field: "projectManagerName", width: 100 },
    {
      headerName: "시작날짜",
      field: "projectDateStart",
      width: 100,
    },
    {
      headerName: "종료날짜",
      field: "projectDateEnd",
      width: 100,
    },
    { headerName: "단계", field: "projectPhaseName", width: 140 },
    { headerName: "자체/외주", field: "projectSource", width: 120 },
    {
      headerName: "총금액",
      field: "totalAmountExclTax",
      width: 140,
      valueFormatter: (params) => {
        if (!params.value) return "";
        return Number(params.value).toLocaleString(); // 숫자를 천 단위로 변환
      },
    },
  ];

  return (
    <Modals
      modalTitle="프로젝트 조회"
      setModalShow={props.setModalShow}
      width={80}
      height={650}
      modalButtons={
        <>
          <Buttons
            type="button"
            size="md"
            layout="primary"
            label="확인"
            form={props.formId}
            onClick={() => props.onSubmit(selectedProject)}
          />
          <Buttons
            type="button"
            size="md"
            layout="secondary"
            label="취소"
            onClick={() => props.setModalShow(false)}
          />
        </>
      }
    >
      <>
        <ModalFormSection $flexDirection="row">
          <SearchBar
            onSearch={handleSearch}
            searchInput={
              <>
                <InputText
                  name="projectName"
                  size="md"
                  placeholder="프로젝트명"
                  onChange={handleValueChange}
                />
              </>
            }
          />
        </ModalFormSection>
        <ModalFormSection>
          <Grid
            rowData={projectList}
            columnDefs={columnDefs}
            rowSelection="single"
            height={400}
            modalCalc={10}
            paging={false}
            onSelectionChanged={onSelectionChanged}
            getRowId={(params: GetRowIdParams) => params.data.oid}
            onRowDoubleClicked={(e: any) => {
              setSelectedProject(e.data); // 선택한 프로젝트 데이터 저장
              props.onSubmit(selectedProject);
            }}
          />
        </ModalFormSection>
      </>
    </Modals>
  );
};

export default ModalProjectSelect;
