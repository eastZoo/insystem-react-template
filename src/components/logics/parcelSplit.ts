// src/components/logics/parcelSplit.ts
import type {
  Feature, FeatureCollection, Polygon, MultiPolygon, LineString
} from "geojson";
import { buffer, union, difference, cleanCoords, rewind, booleanIntersects } from "@turf/turf";

export function splitPolygonWithLines(
  polygon: Feature<Polygon | MultiPolygon>,
  cutLines: Feature<LineString>[],
  epsilonMeters = 0.3
): FeatureCollection<Polygon> | null {
  if (!cutLines?.length) return null;

  const cleaned = cleanCoords(rewind(polygon as any, { reverse: false })); // 폴리곤 정규화용 (좌표 오류/방향 문제 예방)

  // 1) 라인 → 얇은 버퍼들
  const bands: Feature<Polygon | MultiPolygon>[] = [];
  for (const ln of cutLines) {
    if (!ln || ln.type !== "Feature" || ln.geometry?.type !== "LineString") continue;
    const b = buffer(ln as any, epsilonMeters, { units: "meters" }) as Feature<Polygon | MultiPolygon>;
    const intersects = booleanIntersects(cleaned as any, b as any);
    if (!intersects) {
      console.warn("[splitPolygonWithLines] Line did not intersect polygon", ln);
      continue;
    }
    bands.push(b);
  }

  if (!bands.length) {
    console.warn("[splitPolygonWithLines] No valid intersecting lines");
    return null;
  }

  // 2) 버퍼 합집합 (union) — 1인자(FeatureCollection) 버전
  let merged = bands[0];
  for (let i = 1; i < bands.length; i++) {
    const ufc: FeatureCollection<Polygon | MultiPolygon> = {
      type: "FeatureCollection",
      features: [merged as any, bands[i] as any],
    };
    const u = union(ufc as any);
    if (!u) {
      console.warn(`[splitPolygonWithLines] union failed at index ${i}`);
      continue;
    }
    merged = u as Feature<Polygon | MultiPolygon>;
  }

  // 3) 차집합 (difference) — 1인자(FeatureCollection) 버전
  const dfc: FeatureCollection<Polygon | MultiPolygon> = {
    type: "FeatureCollection",
    features: [cleaned as any, merged as any],
  };
  const diff = difference(dfc as any) as Feature<Polygon | MultiPolygon> | null;
  if (!diff) {
    console.warn("[splitPolygonWithLines] difference() returned null");
    return null;
  }

  // 4) 결과 펼치기
  const out: FeatureCollection<Polygon> = { type: "FeatureCollection", features: [] };
  const g = diff.geometry;
  if (g.type === "Polygon") {
    out.features.push({ type: "Feature", properties: {}, geometry: g });
  } else if (g.type === "MultiPolygon") {
    for (const coords of g.coordinates) {
      out.features.push({
        type: "Feature",
        properties: {},
        geometry: { type: "Polygon", coordinates: coords },
      });
    }
  }

  if (out.features.length < 2) {
    console.warn("[splitPolygonWithLines] split result has only one piece");
    console.table(out.features.map((f, i) => ({ idx: i, area: f.geometry.coordinates[0].length })));
    return null;
  }

  return out;
}
