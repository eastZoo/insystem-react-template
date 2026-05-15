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
  GetDataPath,
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
  /** 체크박스 표시 여부 (기본값: true) */
  showCheckbox?: boolean;
  groupHeaderHeight?: number;
  suppressCellFocus?: boolean;
  suppressRowClickSelection?: boolean;
  enableCellCopy?: boolean;
  context?: unknown;
  domLayout?: "normal" | "autoHeight" | "print";
  /** Tree Data 관련 props (Enterprise) */
  treeData?: boolean;
  getDataPath?: GetDataPath<TData>;
  /** Row Grouping 관련 props (Community) */
  autoGroupColumnDef?: ColDef<TData>;
  groupDefaultExpanded?: number;
  groupDisplayType?: "singleColumn" | "multipleColumns" | "groupRows" | "custom";
  suppressAggFuncInHeader?: boolean;
  animateRows?: boolean;
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
      showCheckbox = true,
      headerHeight = 40,
      groupHeaderHeight = 60,
      suppressCellFocus = true,
      enableCellCopy = false,
      context,
      domLayout = "normal",
      treeData,
      getDataPath,
      autoGroupColumnDef,
      groupDefaultExpanded,
      groupDisplayType,
      suppressAggFuncInHeader,
      animateRows,
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
        checkboxes: showCheckbox,
        headerCheckbox: showCheckbox,
        enableClickSelection: !showCheckbox,
      }),
      [selectionMode, showCheckbox]
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
                treeData={treeData}
                getDataPath={getDataPath}
                autoGroupColumnDef={autoGroupColumnDef}
                groupDefaultExpanded={groupDefaultExpanded}
                groupDisplayType={groupDisplayType}
                suppressAggFuncInHeader={suppressAggFuncInHeader}
                animateRows={animateRows}
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
