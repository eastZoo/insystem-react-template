// buildBuffer.ts
import type maplibregl from "maplibre-gl";
import { buffer as turfBuffer } from "@turf/turf";
import { builds, type BuildsKey } from "./districts";

// 1) 최초 1회: 건물 버퍼 소스/레이어 준비
export function mountBuildBuffer(map: maplibregl.Map) {
  if (!map.getSource("build-buffer")) {
    map.addSource("build-buffer", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
  }

  if (!map.getLayer("build-buffer-fill")) {
    map.addLayer({
      id: "build-buffer-fill",
      type: "fill",
      source: "build-buffer",
      minzoom: 15,
      maxzoom: 24,
      paint: { "fill-color": "#8e44adAA", "fill-opacity": 0.22 },
      layout: { visibility: "none" },
    });
  }

  if (!map.getLayer("build-buffer-outline")) {
    map.addLayer({
      id: "build-buffer-outline",
      type: "line",
      source: "build-buffer",
      minzoom: 15,
      maxzoom: 24,
      paint: { "line-color": "#8e44adFF", "line-width": 1 },
      layout: { visibility: "none" },
    });
  }
}


// 2) 갱신 + 표시 토글 (visible: true/false)
export function updateBuildBuffer(
  map: maplibregl.Map,
  visible: boolean,
  b: BuildsKey
) {
  const src = map.getSource("builds") as maplibregl.VectorTileSource | undefined;
  if (!src) return;

  // busan_builds 설정 가져오기
  const { layer } = builds[b];

  // 화면 내 건물만 가져오기
  const rendered = map.queryRenderedFeatures({
    layers: ["builds-fill", "builds-line"],
  }) as maplibregl.MapGeoJSONFeature[];

  const feats = rendered.filter((f) => {
    const srcLayer = f.sourceLayer ?? (f.layer as any)?.sourceLayer;
    return f.source === "builds" && srcLayer === layer;
  });

  const bufs: GeoJSON.Feature[] = [];

  for (const f of feats) {
    try {
      // Feature → GeoJSON 변환
      const g = (typeof (f as any).toJSON === "function")
        ? (f as any).toJSON()
        : f;

      // 건물 20m 확장 버퍼 생성
      const bf = turfBuffer(g as any, 20, { units: "meters" });
      if (bf && (bf as any).geometry) bufs.push(bf as any);

    } catch {}
  }

  // 결과를 GeoJSON 소스에 반영
  const fc: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: bufs };
  (map.getSource("build-buffer") as maplibregl.GeoJSONSource)?.setData(fc);

  // 표시 ON/OFF
  const vis = visible ? "visible" : "none";
  map.setLayoutProperty("build-buffer-fill", "visibility", vis);
  map.setLayoutProperty("build-buffer-outline", "visibility", vis);
}
