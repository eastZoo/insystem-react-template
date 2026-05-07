// MapLibre + Turf 기반 면적/길이 유틸리티
import type { Feature, Polygon, MultiPolygon, GeoJsonProperties } from "geojson";
import type { Map as MapLibreMap, MapGeoJSONFeature } from "maplibre-gl";
import area from "@turf/area";
import tlength from "@turf/length"


/** GeoJSON Feature 배열의 면적 합산 */
export function areaSumFromFeatures(parts: (MapGeoJSONFeature | any)[]): number
{
  let sum = 0;
  for (const part of parts) {
    const gj = typeof (part as any).toJSON === "function" ? (part as any).toJSON() : part; // toJSON()을 통해 순수 GeoJSON으로 변환
    try { sum += area(gj as any); } catch {}
  }
  return sum;
}

export const metersLabel = (m: number) =>
  m < 1000 ? `${Math.round(m)} m` : `${(m/1000).toFixed(2)} km`; // 길이(m)를 읽기 쉬운 텍스트로 변환

export const computeLineMeters = (coords: [number, number][]) => { // LineString 좌표 배열의 총 길이(m)를 계산
  if (coords.length < 2) return 0;
  const km = tlength(
    { type: "Feature", geometry: { type: "LineString", coordinates: coords }, properties: {} } as any,
    { units: "kilometers" }
  );
  return km * 1000;
};
/** 소스/레이어에서 key=value로 매칭되는 조각들 면적 합산 (단일) */
export function computeParcelArea(
  map: MapLibreMap,
  sourceId: string,
  sourceLayer: string,
  key: string,
  value: string | number
): number {
  const parts = map.querySourceFeatures(sourceId, {
    sourceLayer,
    filter: ["==", ["get", key], value] as any,
  }) as MapGeoJSONFeature[];
  return areaSumFromFeatures(parts);
}

/** 추가: 면적 합산 (다중) */
export function computeParcelsArea(
  map: MapLibreMap,
  sourceId: string,
  sourceLayer: string,
  key: string,
  values: (string | number)[]
): number {
  if (!values || values.length === 0) return 0;
  const parts = map.querySourceFeatures(sourceId, {
    sourceLayer,
    filter: ["in", ["get", key], ["literal", values]] as any,
  }) as MapGeoJSONFeature[];
  return areaSumFromFeatures(parts);
}

/** 면적 단위 변환 및 라벨 텍스트 */
export function formatArea(sqm: number) {
  const pyeong = sqm / 3.3058;
  return {
    m2: Math.round(sqm).toLocaleString(),
    pyeong: Math.round(pyeong * 100) / 100,
    label: `면적: ${Math.round(sqm).toLocaleString()} ㎡ (≈ ${Math.round(pyeong * 100) / 100} 평)`,
  };
}
/* 선택된 여러 필지의 '도로 제외 면적' 합산 */
export function computeParcelsAreaExcludingRoadBuffer(
  map: MapLibreMap,
  parcels: Feature<Polygon | MultiPolygon, GeoJsonProperties>[],
  singleFn: (map: MapLibreMap, parcel: Feature<Polygon | MultiPolygon, GeoJsonProperties>) => number
): number {
  let total = 0;
  for (const p of parcels) {
    try {
      total += singleFn(map, p);
    } catch {}
  }
  return total;
}
/* 도로 제외 포맷 라벨 */
export function formatNetArea(sqm: number) {
  const pyeong = sqm / 3.3058;
  return {
    m2: Math.round(sqm).toLocaleString(),
    pyeong: Math.round(pyeong * 100) / 100,
    label: `도로 제외: ${Math.round(sqm).toLocaleString()} ㎡ (≈ ${Math.round(pyeong * 100) / 100} 평)`,
  };
}
