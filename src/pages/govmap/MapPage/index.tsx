import type
{
  Feature,
  Polygon,
  MultiPolygon,
  LineString,
} from "geojson";

import maplibregl from "maplibre-gl";
import * as pmtiles from "pmtiles";
import { featureCollection, union as turfUnion, centroid, area, bearing as turfBearing, destination, booleanIntersects as turfIntersects } from "@turf/turf"
import difference from "@turf/difference";
import { useEffect, useRef, useState, useCallback } from "react";
import { computeParcelsAreaExcludingRoadBuffer, formatNetArea, computeParcelArea, computeParcelsArea, formatArea, metersLabel, computeLineMeters } from "@/components/logics/AreaMod";
import { savePnus, loadPnus, deletePnus } from "@/components/logics/PnuStorage";
import { saveDrawing,loadDrawing,deleteDrawing } from "@/components/logics/DrawingStorage";
import { districts, type DistrictKey, type RoadsKey, type BuildsKey } from "@/components/logics/districts"
import { mountCadastre } from "@/components/logics/mountCadastre";
import { mountRoads } from "@/components/logics/mountRoads";
import { splitPolygonWithLines } from "@/components/logics/parcelSplit";
import Toolbar from "@/components/ToolBar";
import { mountBuilds } from "@/components/logics/mountBuilds";
import { mountRoadBuffer, updateRoadBuffer } from "@/components/logics/roadBuffer";
import { mountBuildBuffer,updateBuildBuffer } from "@/components/logics/buildBuffer";
import { PageContent } from "@/components/organisms/PageContent";
import * as S from "./MapPage.style";
import { useAssetLocationPnuByDistrict } from "@/lib/hooks/useAssetLocationMapping";



export default function MapPage() {
  const fixedLine = 20; // 선 놓기 선 길이
  const key = "test";
  const satMaxZoom = 18.49; // 위성지도 최대 줌 제한
  const osmMaxZoom = 22; // 스트릿맵 제한해제
  // UI 상태
  const [showPopup, setShowPopup] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const [areaText, setAreaText] = useState("면적: -");
  const [lineText, setLineText] = useState("길이: -");
  const [roadBuffer, setRoadBuffer] = useState(false);
  const [district, setDistrict] = useState<DistrictKey>("allbusan"); // 지도 초기 상태
  const [road, setRoad] = useState<RoadsKey | undefined>("busan_road");
  const [build, setBuild] = useState<BuildsKey | undefined>("busan_builds");

  // 내부 동작 플래그(ref로 관리)
  const fixedLineRef = useRef(false);
  const fixedCenterRef = useRef<[number,number]|null>(null);
  const drawingRef = useRef(false);
  const lineCoordsRef = useRef<[number, number][]>([]);
  const showPopupRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const selectedPnusRef = useRef<Set<string>>(new Set());
  const selectedRoadRef = useRef<Set<string>>(new Set());
  const districtRef = useRef<DistrictKey>(district);
  const roadBufferRef = useRef(roadBuffer);

  const { sido, si } = districts[district];
  /** 현재 지역(도·시) 기준 저장된 PNU 목록 (지적도 하이라이트용, 쿼리 최소화) */
  const { data: pnuList = [] } = useAssetLocationPnuByDistrict(sido, si);

  /** PNU 목록으로 cadastre 하이라이트 필터 (정확 PNU 매칭) */
  const buildPnuHighlightFilter = useCallback((pnus: string[]) => {
    if (!pnus?.length) return ["literal", false] as const;
    return ["in", ["get", "PNU"], ["literal", pnus]] as any;
  }, []);

  useEffect(() => { districtRef.current = district; }, [district]); // 행정구역 변경용

  useEffect(() => { // 도로 변경용
    roadBufferRef.current = roadBuffer;
  }, [roadBuffer]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const mount = () => {
      // 0) DB PNU 하이라이트 레이어 제거 (cadastre 소스 제거 전에 제거 필요)
      if (map.getLayer("cadastre-db-highlight")) {
        map.removeLayer("cadastre-db-highlight");
      }
      // 1) 기존 선택/표시 리셋 (PNU가 지역마다 달라서 충돌 방지)
      selectedPnusRef.current.clear();
      if (map.getLayer("cadastre-highlight")) {
        map.setFilter("cadastre-highlight", ["in", ["get", "PNU"], ["literal", []]]);
      }
      setAreaText("면적: -");
      // 2) 분할 결과(인라인 소스 레이어)도 정리
      map.getStyle().layers
        .filter((l) => l.id.startsWith("parcel-slice-"))
        .forEach((l) => {
          if (map.getLayer(l.id)) map.removeLayer(l.id);
          if (map.getSource(l.id)) map.removeSource(l.id);
        });
      // 3) 새 지역 지적도 장착 (기존 함수 그대로 사용)
      mountCadastre(map, district);
      // 4) DB PNU 하이라이트 레이어 재추가 (현재 지역 도·시 기준 PNU만)
      const curLayer = districts[district].layer;
      map.addLayer(
        {
          id: "cadastre-db-highlight",
          type: "fill",
          source: "cadastre",
          "source-layer": curLayer,
          paint: { "fill-color": "#006AFF", "fill-opacity": 0.35 },
          filter: buildPnuHighlightFilter(pnuList),
        },
        "cadastre-line"
      );
      // 5) 선택한 지역 중심으로 줌하며 이동
      const { center, zoom } = districts[district];
      map.flyTo({ center, zoom: zoom ?? 15, duration: 800 });
    };

    if (map.isStyleLoaded()) {
      mount();
    } else {
      map.once("idle", mount);
    }
  }, [district]);

  /** PNU 목록 변경 시 하이라이트 필터만 갱신 */
  useEffect(() => {
    const map = mapRef.current;
    if (!map?.getLayer("cadastre-db-highlight")) return;
    map.setFilter("cadastre-db-highlight", buildPnuHighlightFilter(pnuList));
  }, [pnuList, buildPnuHighlightFilter]);

  // 도로·건물 레이어: road/build 값이 있으면 마운트, 없으면(빈문자열·undefined) 제거만 (cadastre만 표시)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const apply = () => {
      // Roads: 값이 있으면 마운트, 없으면 제거만
      ["roads-highlight", "roads-line", "roads-fill"].forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id);
      });
      if (map.getSource("roads")) map.removeSource("roads");
      if (road) {
        mountRoads(map, road);
        if (roadBufferRef.current) updateRoadBuffer(map, true, road);
      }

      // Builds: 값이 있으면 마운트, 없으면 제거만
      ["builds-highlight", "builds-line", "builds-fill"].forEach((id) => {
        if (map.getLayer(id)) map.removeLayer(id);
      });
      if (map.getSource("builds")) map.removeSource("builds");
      if (build) mountBuilds(map, build);
    };

    if (map.isStyleLoaded()) apply();
    else map.once("idle", apply);
  }, [district, road, build]);

const SavedFeatures = useCallback((): GeoJSON.Feature[] => {
const saved = loadDrawing(key); // 저장된 선들 불러오기
return saved.map(coords => ({
    type: "Feature",
    properties: { temp: false },
    geometry: { type: "LineString", coordinates: coords } as any,
  })); // 배열들 객체 전환
}, [key]);


// 도로,건물 제외 면적 합산
function computeParcelAreaExcludingRoadBuffer(
  map: maplibregl.Map,
  parcel: Feature<Polygon | MultiPolygon>
): number {
  // road-buffer 레이어만 타겟
  const bufferLayers = ["road-buffer-fill", "roads-fill","builds-fill","build-buffer-fill"];
  const layers = bufferLayers.filter((id) => map.getLayer(id));
  if (!layers.length) return area(parcel as any);
  // console.log("레이어: ",layers)
  // 화면에 표시된 도로버퍼만 수집
  const roadFeats = map.queryRenderedFeatures({ layers }) as any[];
  if (!roadFeats.length) return area(parcel as any);
  // console.log("로드피츠: ",roadFeats)
  // 필지와 실제 겹치는 버퍼만
  const candidates = roadFeats.filter((rf) => {
    try { return turfIntersects(parcel as any, rf as any); }
    catch { return false; }
  });
  // console.log("후보들: ",candidates)
  if (!candidates.length) return area(parcel as any);

  // union
  let unionGeom: Feature<Polygon | MultiPolygon> | null = null;

  try {
    if (candidates.length === 1) {
      unionGeom = candidates[0] as any;
    } else {
      const fc = featureCollection(candidates as any);
      unionGeom = turfUnion(fc as any) as any; // 단일 인자 union
    }
  } catch (e) {
    console.warn("union fail, fallback piece-by-piece", e);
    for (const rf of candidates) {
      try {
        unionGeom = unionGeom
          ? (turfUnion(unionGeom as any, rf as any) as any)
          : (rf as any);
      } catch {}
    }
  }

  if (!unionGeom) return area(parcel as any);

  // 차집합
  try {
    const fc = featureCollection([parcel as any, unionGeom as any]);
    const diff = difference(fc as any) as any;
    return diff ? area(diff as any) : 0;
  } catch {
    return 0;
  }
}

  // === ESC 버튼으로 종료하는 함수 ===
  const finishDrawing = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    drawingRef.current = false;
    setShowDrawing(false);
    map.doubleClickZoom.enable();

    const coords = [...lineCoordsRef.current];
    const m = computeLineMeters(coords);
    if (m > 0) {
      setLineText(`길이: ${metersLabel(m)}`);
    }
    else {
      setLineText("길이: -");
  }
    if (coords.length>=2)
    {
      saveDrawing(key, coords);
      console.log(key,coords);
    }
    lineCoordsRef.current=[];
    const features = SavedFeatures();
  (map.getSource("sketch") as maplibregl.GeoJSONSource|undefined)?.setData({
    type : "FeatureCollection",
    features,
  } as any);
  map.getCanvas().style.cursor = "";
},[SavedFeatures]);

 // 저장된 드로잉 초기 지도 로드시 자동 반영
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!map.getSource("sketch")) return;
    const features = SavedFeatures();
    (map.getSource("sketch") as maplibregl.GeoJSONSource | undefined)?.setData({
      type: "FeatureCollection",
      features,
    } as any);
  }, [SavedFeatures]);

  // 팝업 플래그 동기화
  useEffect(() => { showPopupRef.current = showPopup; }, [showPopup]);



  // === ESC 키로 종료 ===
  useEffect(() => {
    const onKey = (ev: KeyboardEvent) => {
      //선긋기 ESC 종료
      if (ev.key === "Escape" && drawingRef.current) {
        finishDrawing();
      }
      //고정 선 놓기 ESC 종료
      if (ev.key === "Escape" && fixedLineRef.current) {
        fixedLineRef.current = false;
        fixedCenterRef.current = null;
        (mapRef.current?.getSource("fixed-line-src") as maplibregl.GeoJSONSource)
          ?.setData({ type:"FeatureCollection", features: [] } as any);
        mapRef.current?.getCanvas().style.removeProperty("cursor");
        return;
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finishDrawing]);


  useEffect(() => {
    if (!containerRef.current) return;

    // PMTiles 프로토콜 등록
    const protocol = new pmtiles.Protocol();
    maplibregl.addProtocol("pmtiles", protocol.tile);

    // 기본 스타일 sat: 위성 osm: 일반 지도
    const localStyle: any = {
      version: 8,
      sources: {
        sat: {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "Esri, Maxar, Earthstar Geographics, and the GIS User Community",
        },
        osm: {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          attribution: "© OpenStreetMap contributors",
        },

      },
      layers: [
        { id: "sat-base", type: "raster", source: "sat", paint: { "raster-opacity": 1 } },
        { id: "osm-base", type: "raster", source: "osm", layout: { visibility: "none" }, paint: { "raster-opacity": 0 } },
      ],
    };

    // 지도 생성
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: localStyle,
      center: [129.035, 35.106],
      zoom: 15,
      maxZoom: satMaxZoom,
      hash: true,
      attributionControl: false,
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), "top-right");

    map.addControl(
      new maplibregl.AttributionControl({
        compact: true,
        customAttribution: [
          "출처: VWorld, © 국토지리정보원",
          "Powered by MapLibre GL JS",
          "개발: © 인시스템",
        ],
      }),
      "bottom-right"
    );
    // 맵 로드 될때
    map.on("load", () => {
      // 전환 애니메이션
      map.setPaintProperty("sat-base", "raster-opacity-transition", { duration: 200, delay: 0 });
      map.setPaintProperty("osm-base", "raster-opacity-transition", { duration: 200, delay: 0 });
      mountCadastre(map, district); // 지적도 레이어 붙이기
      if (road) {
        mountRoads(map, road);
        mountRoadBuffer(map);
      }
      if (build) {
        mountBuildBuffer(map);
        mountBuilds(map, build);
      }

      console.log(districts)

      // 고정선 소스
      map.addSource("fixed-line-src", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // 확정 라인(실선)
      map.addLayer({
        id: "fixed-line-solid",
        type: "line",
        source: "fixed-line-src",
        filter: ["all", ["==", ["get","temp"], false]],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-width": 4, "line-color": "#ff3b30" },
      }, "cadastre-line");

      // 미리보기(점선)
      map.addLayer({
        id: "fixed-line-preview",
        type: "line",
        source: "fixed-line-src",
        filter: ["all", ["==", ["get","temp"], true]],
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-width": 3, "line-color": "#ff9f0a", "line-dasharray": [2,2] },
      }, "cadastre-line");

      // ① 분할 결과 소스
      map.addSource("parcel-slices", {
        type: "geojson",
        data: { type: "FeatureCollection", features: [] },
      });

      // ② 분할 결과 레이어 (채움)
      map.addLayer(
        {
          id: "parcel-slices-fill",
          type: "fill",
          source: "parcel-slices",
          paint: {
            "fill-color": "#ffbf00",
            "fill-opacity": 0.35,
          },
        },
        "cadastre-line" // 경계선 위에 그리기
      );

      // ③ 분할 결과 레이어 (윤곽)
      map.addLayer(
        {
          id: "parcel-slices-outline",
          type: "line",
          source: "parcel-slices",
          paint: {
            "line-color": "#ff7f00",
            "line-width": 2,
          },
        },
        "cadastre-line"
      );

      // 스케치 소스/레이어
      map.addSource("sketch", { type: "geojson", data: { type: "FeatureCollection", features: [] } });

      map.addLayer({
        id: "sketch-line",
        type: "line",
        source: "sketch",
        filter: ["==", ["geometry-type"], "LineString"],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#00ff15ff", "line-width": 3, "line-opacity": 1 },
      });

      map.addLayer({
        id: "sketch-preview",
        type: "line",
        source: "sketch",
        filter: ["all", ["==", ["geometry-type"], "LineString"], ["==", ["get", "temp"], true]],
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#66a3ff", "line-width": 2, "line-dasharray": [2, 2] },
      });
      const features = SavedFeatures(); // 저장된 선 불러와서 스케치 레이어에 뿌리기
      (map.getSource("sketch") as maplibregl.GeoJSONSource).setData({
        type: "FeatureCollection",
        features,
      } as any);

      // 저장된 선택 불러오기
      const initial = loadPnus(key);

      selectedPnusRef.current = new Set(initial);

      if (initial.length) {
        map.setFilter("cadastre-highlight", ["in", ["get", "PNU"], ["literal", initial]]);
        const totalSqm = computeParcelsArea(map, "cadastre", districts[district].layer, "PNU", initial);
        const d = formatArea(totalSqm);
        setAreaText(`선택 ${initial.length}개 | ${d.label}`);
      } else {
        setAreaText("면적: -");
      }

      // 클릭 핸들러
      map.on("click", (e) => {
  if (fixedLineRef.current) {
    // === 고정선 모드 로직 (그대로) ===
    const p: [number, number] = [e.lngLat.lng, e.lngLat.lat];

    if (!fixedCenterRef.current) {
      fixedCenterRef.current = p;
      setFixedLineData(p, 90, true);
      return;
    }

    const center = fixedCenterRef.current;
    const bearing = turfBearing(
      { type: "Point", coordinates: center },
      { type: "Point", coordinates: p }
    );
    setFixedLineData(center, bearing, false);

    fixedLineRef.current = false;
    fixedCenterRef.current = null;
    mapRef.current?.getCanvas().style.removeProperty("cursor");
    return;
  }

  if (drawingRef.current) {
    // === 드로잉 모드 로직 (그대로) ===
    const p: [number, number] = [e.lngLat.lng, e.lngLat.lat];
    lineCoordsRef.current.push(p);
    const m = computeLineMeters(lineCoordsRef.current);
    setLineText(`길이 : ${metersLabel(m)}`);

    const features: GeoJSON.Feature[] = [...SavedFeatures()];
    if (lineCoordsRef.current.length >= 2) {
      features.push({
        type: "Feature",
        properties: { temp: false },
        geometry: { type: "LineString", coordinates: lineCoordsRef.current },
      } as any);
    }

    (map.getSource("sketch") as maplibregl.GeoJSONSource).setData({
      type: "FeatureCollection",
      features,
    } as any);

    return;
  }

  // ====== 여기부터: 일반 클릭 모드 ======
const curDistrict = districtRef.current;
const curLayer = districts[curDistrict].layer;

// 1) 필지 선택/해제 처리
const parcelFeats = map.queryRenderedFeatures(e.point, {
  layers: ["cadastre-fill", "cadastre-line"],
});

let pnu: string | undefined;
let list: string[] = Array.from(selectedPnusRef.current);

if (parcelFeats.length) {
  const f: any = parcelFeats[0];
  pnu = f.properties?.PNU as string | undefined;

  if (pnu) {
    const set = selectedPnusRef.current;
    if (set.has(pnu)) set.delete(pnu);
    else set.add(pnu);

    list = Array.from(set);

    // 필지 하이라이트
    map.setFilter("cadastre-highlight", [
      "in",
      ["get", "PNU"],
      ["literal", list],
    ]);

    if (!list.length) {
      setAreaText("면적: -");
    } else {
      // (A) 총 원면적 합계
      const totalSqm = computeParcelsArea(
        map,
        "cadastre",
        curLayer,
        "PNU",
        list
      );
      const d = formatArea(totalSqm);

      // (B) 선택 전체의 "도로 제외" 합산
      //  - source 기준으로 재조회(렌더링 가시성/뷰포트에 안 걸리도록)
      const selectedFeats = map.querySourceFeatures("cadastre", {
        sourceLayer: curLayer,
        filter: ["in", ["get", "PNU"], ["literal", list]] as any,
      }) as any[];

      const selectedParcels = selectedFeats.map((sf) => ({
        type: "Feature",
        properties: { PNU: sf.properties?.PNU },
        geometry: sf.geometry,
      })) as Feature<Polygon | MultiPolygon>[];

      // 지적도 선택 필지 객체 로그 (소스 원본 + GeoJSON Feature)
      console.log("[지적도 선택] PNU 목록:", list);
      console.log("[지적도 선택] 소스 feature 객체:", selectedFeats);
      console.log("[지적도 선택] GeoJSON Feature 배열:", selectedParcels);

      const totalNetSqm = computeParcelsAreaExcludingRoadBuffer(
        map,
        selectedParcels,
        computeParcelAreaExcludingRoadBuffer // 단일 필지 → 도로제외 함수(형님이 위에 구현한 것)
      );
      const nd = formatNetArea(totalNetSqm);

      // (C) 라벨: nd.label 자체가 단위를 포함하므로 추가 단위 붙이지 마세요
      setAreaText(
        `선택 ${list.length}개 | ${d.label} | ${nd.label}`
      );
    }
  }
}

  // 2) 도로 클릭 하이라이트 처리
  const roadFeats = map.queryRenderedFeatures(e.point, {
    layers: ["roads-fill", "roads-line"], // mountRoads에서 만든 레이어
  });

  if (roadFeats.length) {
    const rf: any = roadFeats[0];
    const sig = rf.properties?.SIG_CD;
    const rw = rf.properties?.RW_SN;

    if (sig && rw != null) {
      const key = `${sig}:${rw}`; // SIG_CD:RW_SN

      const roadSet = selectedRoadRef.current;
      if (roadSet.has(key)) roadSet.delete(key); // 토글: 있으면 제거
      else roadSet.add(key);                     // 없으면 추가

      const roadList = Array.from(roadSet);

      // roads-highlight 필터 갱신
      if (map.getLayer("roads-highlight")) {
        map.setFilter("roads-highlight", [
          "in",
          ["concat", ["get", "SIG_CD"], ":", ["to-string", ["get", "RW_SN"]]],
          ["literal", roadList],
        ]);
      }
    }
  }

  // 3) 팝업 처리 (필지 클릭된 경우에만)
  if (showPopupRef.current && e.lngLat && pnu) {
    const singleSqm = computeParcelArea(
      map,
      "cadastre",
      curLayer,
      "PNU",
      pnu
    );
    const ds = formatArea(singleSqm);

    new maplibregl.Popup()
      .setLngLat(e.lngLat)
      .setHTML(
        `<div style="font-size:13px;line-height:1.4">
          <div><b>PNU</b>: ${pnu}</div>
          <div><b>면적</b>: ${ds.m2} ㎡</div>
          <div>≈ ${ds.pyeong} 평</div>


          ${
            list.length
              ? `<hr style="opacity:.3" /><div><b>총 ${list.length}개</b></div><div>${formatArea(
                  computeParcelsArea(
                    map,
                    "cadastre",
                    districts[district].layer,
                    "PNU",
                    list
                  )
                ).label}</div>`
              : ""
          }
        </div>`
      )
      .addTo(map);
  }
});

      // 이동 프리뷰 (그릴 때만, 마지막 점 ↔ 현재 마우스)
      map.on("mousemove", (e) => {
          if (fixedLineRef.current && fixedCenterRef.current) {
            const center = fixedCenterRef.current;
            const cur: [number, number] = [e.lngLat.lng, e.lngLat.lat];
            const bearing = turfBearing({ type:"Point", coordinates:center }, { type:"Point", coordinates:cur });
            setFixedLineData(center, bearing, true); // temp=true (점선)
            return; // 고정선 분기 끝
          }
        if (!drawingRef.current || lineCoordsRef.current.length === 0) return;
        const cur: [number, number] = [e.lngLat.lng, e.lngLat.lat];

        const features: GeoJSON.Feature[] = [...SavedFeatures()];
        if (lineCoordsRef.current.length >= 2) {
          features.push({
            type: "Feature",
            properties: { temp: false },
            geometry: { type: "LineString", coordinates: lineCoordsRef.current },
          } as any);
        }

        features.push({
          type: "Feature",
          properties: { temp: true },
          geometry: { type: "LineString", coordinates: [lineCoordsRef.current[lineCoordsRef.current.length - 1], cur] },
        } as any);
        const totalPreviewCoords = [...lineCoordsRef.current,cur];
        const mPreview = computeLineMeters(totalPreviewCoords);
        setLineText(`길이: ${metersLabel(mPreview)}`);
        (map.getSource("sketch") as maplibregl.GeoJSONSource).setData({
          type: "FeatureCollection",
          features,
        } as any);
      });
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
      maplibregl.removeProtocol("pmtiles");
    };
  }, []); // 초기 로드 전용

const setFixedLineData = useCallback((
  center: [number, number],
  degree: number,
  temp: boolean
) => {
  const a = destination({ type:"Point", coordinates:center }, fixedLine/2000, degree, { units:"kilometers" });
  const b = destination({ type:"Point", coordinates:center }, fixedLine/2000, degree + 180, { units:"kilometers" });

  const fc: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { temp },
        geometry: { type: "LineString", coordinates: [
          b.geometry.coordinates as [number,number],
          a.geometry.coordinates as [number,number],
        ]},
      }
    ]
  };

  (mapRef.current?.getSource("fixed-line-src") as maplibregl.GeoJSONSource)?.setData(fc);
}, []);

const handleClearFixedLine = useCallback(() => {
  (mapRef.current?.getSource("fixed-line-src") as maplibregl.GeoJSONSource)
    ?.setData({ type:"FeatureCollection", features: [] } as any);
}, []);

const handleSplitAndReport = useCallback(() => {
  const map = mapRef.current;
  if (!map) return;

  // 1) 대상 필지: 1개만
  const list = Array.from(selectedPnusRef.current);
  if (list.length !== 1) {
    alert("분리할 필지를 1개만 선택하세요.");
    return;
  }
  const targetPnu = list[0];

  // 2) 원본 폴리곤
  const rendFeats = map.queryRenderedFeatures({
    layers: ["cadastre-fill","cadastre-line"],
    filter: ["==", ["get","PNU"], targetPnu]
  });
  if (!rendFeats.length) {
    alert("선택한 필지를 찾을 수 없습니다.");
    return;
   }
  const polygon = {
    type: "Feature",
    properties: { PNU: targetPnu },
    geometry: rendFeats[0].geometry, // WGS84 경위도
  } as Feature<Polygon | MultiPolygon>;


  // 3) 잘라낼 선들: (현재 그리고 있는 선) + (저장된 모든 선)
  const lineSets: [number, number][][] = [];
  if (lineCoordsRef.current.length >= 2) lineSets.push([...lineCoordsRef.current]);

  const saved = loadDrawing(key); // LineString[][]
  for (const coords of saved) if (coords.length >= 2) lineSets.push(coords);

  if (!lineSets.length) {
    alert("분할에 사용할 선을 먼저 그려주세요.");
    return;
  }

  const cutLines = lineSets.map((coords) => ({
    type: "Feature",
    properties: {},
    geometry: { type: "LineString", coordinates: coords },
  })) as Feature<LineString>[];

  // 4) 실제 분리 (선 두께 여유: 0.3m → 필요시 0.5m)
  const fc = splitPolygonWithLines(polygon, cutLines, 0.3);
  if (!fc || !fc.features || fc.features.length < 2) {
    alert("분리 실패.");
    return;
  }

const colorList = ["#ff0019ff","#00ff37ff","#0091ffff","#ffff00ff","#ff8800ff","#00ffffff"];
fc.features.forEach((f, i) => {
  map.addLayer({
    id: `parcel-slice-${i}`,
    type: "fill",
    source: {
      type: "geojson",
      data: f,
    },
    paint: {
      "fill-color": colorList[i % colorList.length],
      "fill-opacity": 0.5,
    },
  });

});
  // 5) 조각별 면적 계산
  const areas = fc.features.map((f, i) => ({
    idx: i + 1,
    sqm: area(f as any),
  }));
  const total = areas.reduce((a, b) => a + b.sqm, 0);

  // 6) 표 HTML 구성
  const htmlRows = areas
    .map(({ idx, sqm }) => {
      const d = formatArea(sqm);
      const pct = total > 0 ? ((sqm / total) * 100).toFixed(1) : "0.0";
      const color = colorList[(idx - 1) % colorList.length];
      return `<tr>
        <td>
          <div style="display:flex;align-items:center;gap:6px">
          <div style="width:14px;height:14px;background:${color};border-radius:3px;border:1px solid #555"></div>
            ${idx}
          </div>
        </td>
        <td style="text-align:right">${d.m2} ㎡</td>
        <td style="text-align:right">${d.pyeong} 평</td>
        <td style="text-align:right">${pct}%</td>
      </tr>`;
    })
    .join("");
  const summary = formatArea(total).label;

  // 7) 팝업 위치(폴리곤 중심) + 좌표 가드
  const c = centroid(polygon as any);
  const coords = c?.geometry?.type === "Point" ? c.geometry.coordinates : null;
  if (!coords || !Number.isFinite(coords[0]) || !Number.isFinite(coords[1])) {
    console.warn("centroid 계산 실패. 화면 중심에 표시합니다.");
    const center = map.getCenter();
    coords && console.debug("centroid:", coords);
    new maplibregl.Popup({ maxWidth: "320px" })
      .setLngLat([center.lng, center.lat])
      .setHTML(`
        <div style="font-size:13px;line-height:1.4">
        <div><b>PNU</b>: ${targetPnu}</div>
        <div style="margin:6px 0 8px;"><b>분할 ${areas.length}조각</b> | 총 ${summary}</div>
        <table style="width:100%;border-collapse:collapse;font-size:12px">
        <thead><tr><th>#</th><th style="text-align:right">㎡</th><th style="text-align:right">평</th><th style="text-align:right">%</th></tr></thead>
        <tbody>${htmlRows}</tbody>
        </table>
        </div>
      `)
      .addTo(map);
  } else {
    new maplibregl.Popup({ maxWidth: "320px" })
      .setLngLat([coords[0], coords[1]])
      .setHTML(`
        <div style="font-size:13px;line-height:1.4">
          <div><b>PNU</b>: ${targetPnu}</div>
          <div style="margin:6px 0 8px;"><b>분할 ${areas.length}조각</b> | 총 ${summary}</div>
          <table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead><tr><th>#</th><th style="text-align:right">㎡</th>
            <th style="text-align:right">평</th>
            <th style="text-align:right">%</th>
            </tr>
            </thead>
            <tbody>${htmlRows}</tbody>
          </table>
        </div>
      `)
      .addTo(map);
  }

  // 상단 라벨 갱신 + 디버그 출력
  setAreaText(`분할 ${areas.length}조각 | 총 ${summary}`);
  console.table(areas.map(a => ({ piece: a.idx, sqm: Math.round(a.sqm) })));
}, []);


const handleToggleRoadBuffer = useCallback(() => {
  const map = mapRef.current;
  if (!map) return;

  setRoadBuffer((prev) => {
    const next = !prev;
    if (road) updateRoadBuffer(map, next, road);
    if (build) updateBuildBuffer(map, next, build);
    return next;
  });
}, [road, build]);

const handlePlaceFixedLine = useCallback(() => {
  fixedLineRef.current = true;
  fixedCenterRef.current = null;
  // 미리보기 지우기
  (mapRef.current?.getSource("fixed-line-src") as maplibregl.GeoJSONSource)
    ?.setData({ type:"FeatureCollection", features: [] } as any);
  mapRef.current?.getCanvas().style.setProperty("cursor", "crosshair");
  alert("지도에서 첫 번째 클릭: 중심점 선택 → 마우스를 움직여 방향 지정 → 두 번째 클릭으로 확정");
}, []);

  // 드로잉 저장 핸들러
  const handleSaveDrawing = useCallback(() => {
  const coords = lineCoordsRef.current;
  saveDrawing(key, coords);
  alert(`드로잉 저장`);
}, []);

  //드로잉 불러오기 핸들러
  const handleLoadDrawing = useCallback(() => {
  const map = mapRef.current;
  if (!map) return;
  const features = SavedFeatures();
  (map.getSource("sketch") as maplibregl.GeoJSONSource)?.setData({
    type: "FeatureCollection",
    features,
  });
  alert(`저장된 드로잉 불러옴`);
}, [SavedFeatures]);

  const handleChangeLineColor = useCallback((color: string) => {
  const map = mapRef.current;
  if (!map) return;
  if (map.getLayer("cadastre-line")) {
    map.setPaintProperty("cadastre-line", "line-color", color);
  }
}, []);

  const handleDeleteDrawing = useCallback(() => {
    deleteDrawing(key);
    // 지도에서 표시도 지워주기
    (mapRef.current?.getSource("sketch") as maplibregl.GeoJSONSource)?.setData({
      type: "FeatureCollection",
      features: [],
    });
    alert("저장된 드로잉을 삭제했어요.");
    setLineText("길이: -");
    handleClearFixedLine();
  }, []);

  const handleClickSat = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setLayoutProperty("sat-base", "visibility", "visible");
    map.setLayoutProperty("osm-base", "visibility", "none");
    map.setPaintProperty("sat-base", "raster-opacity", 1);
    map.setPaintProperty("osm-base", "raster-opacity", 0);
    map.setMaxZoom(satMaxZoom);
    if (map.getZoom() > satMaxZoom) {
      map.easeTo({ zoom: satMaxZoom, duration: 150 });
    }
  }, []);

  const handleClickOsm = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setLayoutProperty("sat-base", "visibility", "none");
    map.setLayoutProperty("osm-base", "visibility", "visible");
    map.setPaintProperty("sat-base", "raster-opacity", 0);
    map.setPaintProperty("osm-base", "raster-opacity", 1);
    map.setMaxZoom(osmMaxZoom);
  }, []);

  const handleTogglePopup = useCallback(() => {
    setShowPopup((prev) => {
      const next = !prev;
      if (!next) document.querySelectorAll(".maplibregl-popup").forEach((el) => el.remove());
      return next;
    });
  }, []);
  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "q" || e.key === "Q") {
      handleTogglePopup();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [handleTogglePopup]);
  // 선긋기 핸들러
  const handleStartDraw = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    drawingRef.current = true;
    setShowDrawing(true);
    lineCoordsRef.current = [];
    map.doubleClickZoom.disable();
    map.getCanvas().style.cursor = "crosshair";
  }, []);

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "d" || e.key === "D") {
      handleStartDraw();
    }
  };

  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [handleStartDraw]);

  const handleStopDraw = useCallback(() => {
    finishDrawing();
    setShowDrawing(false);
  }, [finishDrawing]);

  // 초기화 핸들러
  const handleClear = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;
    drawingRef.current = false;
    lineCoordsRef.current = [];
    selectedPnusRef.current.clear();
    selectedRoadRef.current.clear();
    (map.getSource("sketch") as any)?.setData({ type: "FeatureCollection", features: [] });
    map.doubleClickZoom.enable();
    if (map.getLayer("cadastre-highlight")) {
      map.setFilter("cadastre-highlight", ["in", ["get", "PNU"], ["literal", []]]);
    }
      if (map.getLayer("roads-highlight")) {
        map.setFilter("roads-highlight", [
          "in",
          ["concat", ["get", "SIG_CD"], ":", ["to-string", ["get", "RW_SN"]]],
          ["literal",[]],
        ]);
      };
    map.getCanvas().style.cursor = "";
    handleClearFixedLine();
    setShowDrawing(false);
    setAreaText("면적: -");
    setLineText("길이: -");
    document.querySelectorAll(".maplibregl-popup").forEach((el) => el.remove());
    deleteDrawing(key)
      map.getStyle().layers
    .filter(l => l.id.startsWith("parcel-slice-"))
    .forEach(l => {
      if (map.getLayer(l.id)) map.removeLayer(l.id);
      if (map.getSource(l.id)) map.removeSource(l.id); // 인라인 소스 정리
    });

  }, []);

  // 저장 핸들러
  const handleSavePnus = useCallback(() => {
    const set = selectedPnusRef.current;
    savePnus(key, set);
    console.log(key,set);
    alert(`선택된 필지 ${set.size}개 저장`);
  }, []);

  // 불러오기 핸들러
  const handleLoadPnus = useCallback(() => {
    const map = mapRef.current;
    if (!map) return;

    const list = loadPnus(key);
    selectedPnusRef.current = new Set(list);

    if (map.getLayer("cadastre-highlight")) {
      map.setFilter("cadastre-highlight", ["in", ["get", "PNU"], ["literal", list]]);
    }
    if (!list.length) {
      setAreaText("면적: -");
    } else {
      const totalSqm = computeParcelsArea(map, "cadastre", districts[district].layer, "PNU", list);
      const d = formatArea(totalSqm);
      setAreaText(`선택 ${list.length}개 | ${d.label}`);
    }
    alert(`저장된 필지 ${list.length}개 불러옴`);
  }, []);

  // 삭제 핸들러
  const handleDeletePnus = useCallback(() => {
    deletePnus(key);
    alert("저장된 필지 선택을 삭제했어요.");
  }, []);

  return (
    <PageContent
      depth01Title="지도 >  "
      depth02Title="지도맵"
      $height="100%"
      $gap="0"
    >
      <S.MapContainer>
        <S.MapWrapper>
          <div ref={containerRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
        </S.MapWrapper>
        <Toolbar
          onToggleRoadBuffer={handleToggleRoadBuffer}
          onChangeLineColor={handleChangeLineColor}
          onClickSat={handleClickSat}
          onClickOsm={handleClickOsm}
          onTogglePopup={handleTogglePopup}
          onStartDraw={handleStartDraw}
          onStopDraw={handleStopDraw}
          onClear={handleClear}
          onSavePnus={handleSavePnus}
          onLoadPnus={handleLoadPnus}
          onDeletePnus={handleDeletePnus}
          onSaveDrawing={handleSaveDrawing}
          onLoadDrawing={handleLoadDrawing}
          onDeleteDrawing={handleDeleteDrawing}
          onSetDistrict={setDistrict}
          onSetRoad={setRoad}
          onSetBuild={setBuild}
          onSplitByDrawing={handleSplitAndReport}
          onPlaceFixedLine={handlePlaceFixedLine}
          areaText={areaText}
          district={district}
          lineText={lineText}
          showDrawing={showDrawing}
          showPopup={showPopup}
        />
      </S.MapContainer>
    </PageContent>
  );
};
