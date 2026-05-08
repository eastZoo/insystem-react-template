import { useState, useRef, useEffect } from "react";
import {
  districts,
  districtList,
  type DistrictKey,
  type RoadsKey,
  type BuildsKey,
} from "./logics/districts";

type ToolbarProps = {
  onToggleRoadBuffer?: () => void;
  onPlaceFixedLine?: () => void;
  onSplitByDrawing?: () => void;
  onClickSat: () => void;
  onClickOsm: () => void;
  onSelectAll?: () => void;
  onSetDistrict: (d: DistrictKey) => void;
  onSetRoad: (r?: RoadsKey) => void;
  onSetBuild: (b?: BuildsKey) => void;
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
  onChangeLineColor: (color: string) => void;
  areaText: string;
  lineText: string;
  district: DistrictKey;
  showPopup: boolean;
  showDrawing: boolean;
};

// 클릭 기반 드롭다운 훅
function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return { open, setOpen, ref };
}

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
  district,
}: ToolbarProps) {
  // 클릭 기반 드롭다운 상태
  const optionsDropdown = useDropdown();
  const drawingDropdown = useDropdown();
  const parcelDropdown = useDropdown();

  // 지역 선택 시 자동으로 road/build 연결
  const handleSelectDistrict = (key: DistrictKey) => {
    const d = districts[key];
    onSetDistrict(key);
    onSetRoad(d.roadKey);
    onSetBuild(d.buildKey);
  };

  // 현재 선택된 지역 라벨
  const currentDistrictLabel = districts[district]?.label ?? "지역 선택";

  return (
    <>
      <style>{`
        /* 공통 버튼 스타일 */
        .tb-btn {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 6px 10px; border: none; border-radius: 6px;
          background: #fff; color: #333; font-size: 12px; font-weight: 500;
          cursor: pointer; white-space: nowrap;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: all 0.15s ease;
        }
        .tb-btn:hover { background: #f0f4ff; box-shadow: 0 2px 6px rgba(0,0,0,0.12); }
        .tb-btn.active { background: #4f46e5; color: #fff; }
        .tb-btn.danger:hover { background: #fee2e2; color: #dc2626; }
        .tb-btn svg { width: 14px; height: 14px; flex-shrink: 0; }

        /* 드롭다운 컨테이너 */
        .tb-dropdown { position: relative; }
        .tb-dropdown-menu {
          position: absolute; top: calc(100% + 4px); left: 0;
          min-width: 160px; padding: 4px;
          background: #fff; border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          z-index: 1001;
        }
        .tb-dropdown-menu button {
          display: flex; align-items: center; gap: 6px;
          width: 100%; padding: 8px 10px; margin: 1px 0;
          border: none; border-radius: 6px;
          background: transparent; color: #333; font-size: 12px;
          text-align: left; cursor: pointer;
          transition: background 0.1s ease;
        }
        .tb-dropdown-menu button svg {
          width: 14px; height: 14px; flex-shrink: 0; color: #666;
        }
        .tb-dropdown-menu button:hover { background: #f3f4f6; }
        .tb-dropdown-menu button:hover svg { color: #333; }
        .tb-dropdown-menu button.active { background: #e0e7ff; color: #4f46e5; font-weight: 600; }
        .tb-dropdown-menu button.active svg { color: #4f46e5; }
        .tb-dropdown-menu button.danger:hover { background: #fee2e2; color: #dc2626; }
        .tb-dropdown-menu button.danger:hover svg { color: #dc2626; }
        .tb-dropdown-menu .sep { height: 1px; background: #e5e7eb; margin: 4px 0; }

        /* 상단 툴바 */
        .tb-top {
          position: absolute; top: 10px; left: 10px; right: 10px; z-index: 1000;
          display: flex; justify-content: space-between; align-items: flex-start;
          pointer-events: none;
        }
        .tb-top > * { pointer-events: auto; }

        /* 좌측 메뉴 그룹 */
        .tb-left {
          display: flex; gap: 6px; flex-wrap: wrap; align-items: center;
          background: rgba(255,255,255,0.95); padding: 6px;
          border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* 우측 컨트롤 그룹 */
        .tb-right {
          display: flex; gap: 6px; flex-wrap: wrap; align-items: center;
          background: rgba(255,255,255,0.95); padding: 6px;
          border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        /* 면적/길이 표시 */
        .tb-stat {
          display: flex; align-items: center; gap: 4px;
          padding: 5px 8px; background: #f1f5f9;
          border-radius: 4px; font-size: 11px; font-weight: 600; color: #475569;
        }
        .tb-stat svg { width: 12px; height: 12px; color: #94a3b8; flex-shrink: 0; }

        /* 지역 선택 드롭다운 (스크롤) */
        .tb-district-menu {
          max-height: 240px; overflow-y: auto;
        }
        .tb-district-menu::-webkit-scrollbar { width: 4px; }
        .tb-district-menu::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }

        /* 색상 선택 */
        .tb-color-input {
          width: 28px; height: 28px; padding: 0; border: 2px solid #e5e7eb;
          border-radius: 6px; cursor: pointer; overflow: hidden;
        }
        .tb-color-input::-webkit-color-swatch { border: none; }
        .tb-color-input::-webkit-color-swatch-wrapper { padding: 0; }
      `}</style>

      <div className="tb-top">
        {/* 좌측: 메뉴 드롭다운들 */}
        <div className="tb-left">
          {/* 지역 선택 */}
          <div className="tb-dropdown" ref={optionsDropdown.ref}>
            <button
              className="tb-btn"
              onClick={() => optionsDropdown.setOpen(!optionsDropdown.open)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {currentDistrictLabel}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginLeft: 2}}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
            {optionsDropdown.open && (
              <div className="tb-dropdown-menu tb-district-menu">
                {districtList.map((d) => (
                  <button
                    key={d.key}
                    className={district === d.key ? "active" : ""}
                    onClick={() => {
                      handleSelectDistrict(d.key);
                      optionsDropdown.setOpen(false);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                    {d.label}
                    {d.roadKey && <span style={{fontSize: 10, color: '#94a3b8', marginLeft: 'auto'}}>도로+건물</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 드로잉 */}
          <div className="tb-dropdown" ref={drawingDropdown.ref}>
            <button
              className={`tb-btn ${showDrawing ? "active" : ""}`}
              onClick={() => drawingDropdown.setOpen(!drawingDropdown.open)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                <path d="M2 2l7.586 7.586"/>
              </svg>
              드로잉 {showDrawing ? "(진행중)" : ""}
            </button>
            {drawingDropdown.open && (
              <div className="tb-dropdown-menu">
                <button onClick={() => {
                  showDrawing ? onStopDraw() : onStartDraw();
                  drawingDropdown.setOpen(false);
                }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    {showDrawing
                      ? <><rect x="6" y="6" width="12" height="12" rx="2"/></>
                      : <><polygon points="5 3 19 12 5 21 5 3"/></>
                    }
                  </svg>
                  {showDrawing ? "드로잉 종료" : "드로잉 시작"}
                </button>
                <div className="sep" />
                <button onClick={() => { onSaveDrawing(); drawingDropdown.setOpen(false); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  저장
                </button>
                <button onClick={() => { onLoadDrawing(); drawingDropdown.setOpen(false); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  불러오기
                </button>
                <button className="danger" onClick={() => { onDeleteDrawing(); drawingDropdown.setOpen(false); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  삭제
                </button>
                <div className="sep" />
                <button onClick={() => { onSplitByDrawing?.(); drawingDropdown.setOpen(false); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="2" x2="12" y2="22"/>
                    <path d="M8 6l-4 6 4 6"/>
                    <path d="M16 6l4 6-4 6"/>
                  </svg>
                  드로잉으로 분리
                </button>
                <button onClick={() => { onPlaceFixedLine?.(); drawingDropdown.setOpen(false); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                  선 놓기
                </button>
              </div>
            )}
          </div>

          {/* 필지 */}
          <div className="tb-dropdown" ref={parcelDropdown.ref}>
            <button
              className="tb-btn"
              onClick={() => parcelDropdown.setOpen(!parcelDropdown.open)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <line x1="3" y1="9" x2="21" y2="9"/>
                <line x1="9" y1="21" x2="9" y2="9"/>
              </svg>
              필지
            </button>
            {parcelDropdown.open && (
              <div className="tb-dropdown-menu">
                <button onClick={() => { onSavePnus(); parcelDropdown.setOpen(false); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  저장
                </button>
                <button onClick={() => { onLoadPnus(); parcelDropdown.setOpen(false); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  불러오기
                </button>
                <button className="danger" onClick={() => { onDeletePnus(); parcelDropdown.setOpen(false); }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  삭제
                </button>
                <div className="sep" />
                {onSelectAll && (
                  <button onClick={() => { onSelectAll(); parcelDropdown.setOpen(false); }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2"/>
                      <polyline points="9 11 12 14 22 4"/>
                    </svg>
                    전체 선택
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 옵션 (팝업, 초기화) */}
          <button
            className={`tb-btn ${showPopup ? "active" : ""}`}
            onClick={onTogglePopup}
            title="필지 클릭 시 팝업 표시"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            팝업 {showPopup ? "ON" : "OFF"}
          </button>

          <button className="tb-btn danger" onClick={onClear} title="선택 초기화">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
            </svg>
            초기화
          </button>

          {/* 면적/길이 표시 */}
          {areaText && (
            <div className="tb-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
              </svg>
              {areaText}
            </div>
          )}
          {lineText && (
            <div className="tb-stat">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {lineText}
            </div>
          )}
        </div>

        {/* 우측: 베이스맵 + 색상 */}
        <div className="tb-right">
          <button className="tb-btn" onClick={onClickSat} title="위성 지도">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            위성
          </button>
          <button className="tb-btn" onClick={onClickOsm} title="오픈스트리트맵">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
              <line x1="8" y1="2" x2="8" y2="18"/>
              <line x1="16" y1="6" x2="16" y2="22"/>
            </svg>
            오픈맵
          </button>
          <button className="tb-btn" onClick={onToggleRoadBuffer} title="도로 버퍼 켜기/끄기">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
              <line x1="4" y1="22" x2="4" y2="15"/>
            </svg>
            버퍼
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#64748b" }}>선 색상</span>
            <input
              type="color"
              className="tb-color-input"
              onChange={(e) => onChangeLineColor(e.target.value)}
              title="드로잉 선 색상 변경"
            />
          </div>
        </div>
      </div>
    </>
  );
}
