import * as S from "./Grid.style";
import type {
  ColDef,
  ColGroupDef,
  RowDoubleClickedEvent,
  RowSelectionOptions,
  SelectionChangedEvent,
  CellValueChangedEvent,
  RowStyle,
  RowClassParams,
} from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { forwardRef, useMemo } from "react";

ModuleRegistry.registerModules([AllCommunityModule]);

interface GridProps<TData = any> {
  height?: number | string;
  rowData: TData[];
  isRadius?: boolean;
  rowHeight?: number;
  columnDefs: (ColDef<TData> | ColGroupDef<TData>)[];
  headerHeight?: number;
  /** AG-Grid v35+ 방식: "multiRow" | "singleRow" */
  selectionMode?: "multiRow" | "singleRow";
  groupHeaderHeight?: number;
  suppressCellFocus?: boolean;
  suppressRowClickSelection?: boolean;
  enableCellCopy?: boolean;
  context?: unknown;
  domLayout?: "normal" | "autoHeight" | "print";
  onGridReady?: (e: any) => void;
  onSelectionChanged?: (event: SelectionChangedEvent<TData>) => void;
  onRowClicked?: (event: any) => void;
  onRowDoubleClicked?: (event: RowDoubleClickedEvent<TData>) => void;
  onCellClicked?: (event: any) => void;
  onCellValueChanged?: (event: CellValueChangedEvent<TData>) => void;
  getRowStyle?: (params: RowClassParams<TData>) => RowStyle | undefined;
}

const Grid = forwardRef<AgGridReact, GridProps>(
  (
    {
      height = 400,
      rowData,
      isRadius = true,
      rowHeight = 40,
      columnDefs,
      selectionMode = "multiRow",
      headerHeight = 40,
      groupHeaderHeight = 60,
      suppressCellFocus = true,
      enableCellCopy = false,
      context,
      domLayout = "normal",
      onGridReady,
      onSelectionChanged,
      onRowClicked,
      onRowDoubleClicked,
      onCellClicked,
      onCellValueChanged,
      getRowStyle,
    },
    ref
  ) => {
    /** AG-Grid v35+ rowSelection 설정 */
    const rowSelection = useMemo<RowSelectionOptions>(
      () => ({
        mode: selectionMode,
        checkboxes: true,
        headerCheckbox: true,
        enableClickSelection: false,
      }),
      [selectionMode]
    );

    const handleCellClicked = (event: any) => {
      if (enableCellCopy && event.value) {
        navigator.clipboard.writeText(event.value);
      }
      onCellClicked?.(event);
    };

    return (
      <>
        <S.GridBox $isRadius={isRadius}>
          <div className="ag-theme-quartz" style={{ height, width: "100%" }}>
            <S.GridWrapper
              $rowHeight={rowHeight}
              $headerHeight={headerHeight}
              $groupHeaderHeight={groupHeaderHeight}
            >
              <AgGridReact
                ref={ref}
                rowData={rowData}
                columnDefs={columnDefs}
                rowHeight={rowHeight}
                headerHeight={headerHeight}
                groupHeaderHeight={groupHeaderHeight}
                rowSelection={rowSelection}
                context={context}
                domLayout={domLayout}
                suppressColumnVirtualisation={true}
                suppressAutoSize={true}
                onRowClicked={onRowClicked}
                onRowDoubleClicked={onRowDoubleClicked}
                onGridReady={onGridReady}
                onSelectionChanged={onSelectionChanged}
                onCellClicked={handleCellClicked}
                onCellValueChanged={onCellValueChanged}
                getRowStyle={getRowStyle}
                suppressCellFocus={suppressCellFocus}
              />
            </S.GridWrapper>
          </div>
        </S.GridBox>
      </>
    );
  }
);

Grid.displayName = "Grid";

export default Grid;
