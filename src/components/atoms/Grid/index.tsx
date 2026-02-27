import * as S from "./Grid.style";
import type { ColDef, ColGroupDef } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { forwardRef } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Loading } from "@/components/atoms/Loading";

ModuleRegistry.registerModules([AllCommunityModule]);

interface GridProps {
  columnDefs: (ColDef | ColGroupDef)[];
  rowData: any[];
  height?: number | string;
  rowHeight?: number;
  headerHeight?: number;
  groupHeaderHeight?: number;
  rowSelection?: "single" | "multiple";
  suppressRowClickSelection?: boolean;
  loading?: boolean;
  onRowClicked?: (event: any) => void;
  onGridReady?: (e: any) => void;
}

const Grid = forwardRef<any, GridProps>(
  (
    {
      columnDefs,
      rowData,
      height = 400,
      rowSelection,
      rowHeight = 48,
      headerHeight = 45,
      groupHeaderHeight = 60,
      suppressRowClickSelection,
      loading = false,
      onRowClicked,
      onGridReady,
    },
    ref
  ) => {
    return (
      <S.GridBox>
        {loading ? (
          <S.LoadingContainer style={{ height }}>
            <Loading />
          </S.LoadingContainer>
        ) : (
          <S.GridWrapper
            rowHeight={rowHeight}
            headerHeight={headerHeight}
            groupHeaderHeight={groupHeaderHeight}
          >
            <div className="ag-theme-quartz" style={{ height, width: "100%" }}>
              <AgGridReact
                ref={ref}
                rowData={rowData}
                columnDefs={columnDefs}
                rowHeight={rowHeight}
                headerHeight={headerHeight}
                groupHeaderHeight={groupHeaderHeight}
                rowSelection={rowSelection}
                suppressColumnVirtualisation={true}
                suppressAutoSize={true}
                onRowClicked={onRowClicked}
                onGridReady={onGridReady}
                suppressRowClickSelection={suppressRowClickSelection}
              />
            </div>
          </S.GridWrapper>
        )}
      </S.GridBox>
    );
  }
);

Grid.displayName = "Grid";

export default Grid;
