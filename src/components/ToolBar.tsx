type DistrictKey = "allbusan"|"gimhae"|"changwon"|"sacheon"|"changnyeong"|"goseong";
type RoadsKey = "gimhae_road"|"changwon_road"|"busan_road";
type BuildsKey = "gimhae_builds"|"busan_builds"|"changwon_builds";
type ToolbarProps = {
  onToggleRoadBuffer?: () => void,
  onPlaceFixedLine?: () => void,
  onSplitByDrawing?: () => void;
  onClickSat: () => void;
  onClickOsm: () => void;
  onSelectAll?: () => void;
  onSetDistrict: (d: DistrictKey) => void;
  onSetRoad:(r?: RoadsKey) => void,
  onSetBuild:(b?: BuildsKey) => void,
  onTogglePopup: () => void;
  onStartDraw: () => void;
  onClear: () => void;
  onStopDraw: () => void;
  onSavePnus: () => void;
  onLoadPnus: () => void;
  onSaveDrawing: () => void;
  onLoadDrawing: () => void;
  onDeleteDrawing: () => void;
  onDeletePnus: () => void;
  onChangeLineColor: ( color: string) => void;
  areaText: string;
  lineText: string,
  district: DistrictKey;
  showPopup: boolean;
  showDrawing: boolean;

};

export default function Toolbar({
  onToggleRoadBuffer,
  onPlaceFixedLine,
  onSplitByDrawing,
  onClickSat,
  onClickOsm,
  onTogglePopup,
  onSelectAll,
  onStartDraw,
  onStopDraw,
  onClear,
  onSavePnus,
  onLoadPnus,
  onDeletePnus,
  onSaveDrawing,
  onLoadDrawing,
  onDeleteDrawing,
  onChangeLineColor,
  onSetDistrict,
  onSetRoad,
  onSetBuild,
  showPopup,
  showDrawing,
  areaText,
  lineText,
}: ToolbarProps) {
  return (
    <>
      {/* 우상단: 베이스맵 전환 */}
      <div
        style={{
          position: "absolute",
          top: 4,
          right: 50,
          zIndex: 1000,
          display: "flex",
          gap: 8,
          borderRadius: 8,
          padding: 8,
        }}
      ><button onClick={onToggleRoadBuffer}>끄기 켜기</button>
        <button onClick={onClickSat}>위성</button>
        <button onClick={onClickOsm}>오픈맵</button>
        <button onClick={() => {
          onSetDistrict("sacheon");
          onSetBuild(undefined);
          onSetRoad(undefined);
        }}>사천</button>
        <button onClick={() => {
          onSetDistrict("changnyeong");
          onSetBuild(undefined);
          onSetRoad(undefined);
        }}>창녕</button>
        <button onClick={() => {
          onSetDistrict("goseong");
          onSetBuild(undefined);
          onSetRoad(undefined);
        }}>고성</button>
        <button onClick={() => {
          onSetDistrict("changwon");
          onSetBuild("changwon_builds");
          onSetRoad("changwon_road")}}>창원</button>
        <button onClick={() => {
          onSetDistrict("gimhae");
          onSetBuild("gimhae_builds");
          onSetRoad("gimhae_road")}}>김해</button>
        <button onClick={() => {
          onSetDistrict("allbusan");
          onSetBuild("busan_builds");
          onSetRoad("busan_road")}}>부산</button>
        <div style={{ marginLeft: 8 }}>
          <label style={{ fontSize: 12 }}>선 색상: </label>
          <input
          type="color"
          onChange={(e) => onChangeLineColor(e.target.value)}
          />
</div>
      </div>

      {/* 좌상단: 가로 메뉴 + hover 드롭다운 (ul/li 최소구현) */}
      <style>{`
        .toolbar {
          position: absolute; top: 12px; left: 12px; z-index: 1000;
          background: rgba(255,255,255,0.9); border: 1px solid #ddd; border-radius: 8px; padding: 8px;
        }
        .menubar {
          list-style: none; margin: 0; padding: 0;
          display: flex; gap: 12px; align-items: center;
        }
        .menu { position: relative; }
        .menu > button {
          padding: 6px 12px; border: 1px solid #ddd; border-radius: 6px;
          background: #f9f9f9; cursor: pointer; white-space: nowrap;
        }
        .submenu {
          list-style: none; margin: 0; padding: 6px;
          position: absolute; top: 100%; left: 0; display: none; min-width: 160px;
          background: #fff; border: 1px solid #e5e5e5; border-radius: 8px;
          box-shadow: 0 6px 12px rgba(0,0,0,0.12);
        }
        .menu:hover > .submenu { display: block; }
        .submenu li { margin: 0; }
        .submenu li > button {
          width: 100%; text-align: left; padding: 6px 10px; margin: 2px 0;
          border: 1px solid #eee; border-radius: 6px; background: #fff; cursor: pointer;
        }
        .submenu li > button:hover { background: #f5f7ff; }
        .sep { height: 1px; background: #eee; margin: 6px 0; }
        .area {
          font-weight: 600; margin-left: 8px;
        }
      `}</style>

      <div className="toolbar">
        <ul className="menubar">
          {/* 옵션 */}
          <li className="menu">
            <button>옵션</button>
            <ul className="submenu">
              <li><button onClick={onTogglePopup}>팝업 {showPopup ? "켜짐" : "꺼짐"}</button></li>
              {onSelectAll && <li><button onClick={onSelectAll}>면적 전체 선택</button></li>}
              <li className="sep" />
              <li><button onClick={onClear}>초기화</button></li>
            </ul>
          </li>

          {/* 드로잉 */}
          <li className="menu">
            <button>드로잉</button>
            <ul className="submenu">
              <li>
                <button onClick={showDrawing ? onStopDraw : onStartDraw}>
                  {showDrawing ? "드로잉 종료" : "드로잉 시작"}
                </button>
              </li>
              <li className="sep" />
              <li><button onClick={onSaveDrawing}>저장</button></li>
              <li><button onClick={onLoadDrawing}>불러오기</button></li>
              <li><button onClick={onDeleteDrawing}>삭제</button></li>
              <li><button onClick={onSplitByDrawing}>드로잉으로 분리</button></li>
              <li><button onClick={onPlaceFixedLine}>선 놓기</button></li>
            </ul>
          </li>

          {/* 필지 */}
          <li className="menu">
            <button>필지</button>
            <ul className="submenu">
              <li><button onClick={onSavePnus}>저장</button></li>
              <li><button onClick={onLoadPnus}>불러오기</button></li>
              <li><button onClick={onDeletePnus}>삭제</button></li>
            </ul>
          </li>

          {/* 면적 표기(항상 노출) */}
          <li><span className="area">{areaText}</span></li>
          <li><span className="area">{lineText}</span></li>
        </ul>
      </div>
    </>
  );
}
