// roadBuffer.ts
import type maplibregl from "maplibre-gl";
import { buffer as turfBuffer } from "@turf/turf";
import { roads, type RoadsKey } from "./districts";

// 최초 1회: 버퍼 소스/레이어 준비
export function mountRoadBuffer(map: maplibregl.Map) {
  if (!map.getSource("road-buffer")) {
    map.addSource("road-buffer", {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
  }
  if (!map.getLayer("road-buffer-fill")) {
    map.addLayer({
      id: "road-buffer-fill",
      type: "fill",
      source: "road-buffer",
      minzoom: 15,
      maxzoom: 24,
      paint: { "fill-color": "#0066ffff", "fill-opacity": 0.25 },
      layout: { visibility: "none" },
    });
  }
  if (!map.getLayer("road-buffer-outline")) {
    map.addLayer({
      id: "road-buffer-outline",
      type: "line",
      source: "road-buffer",
      minzoom: 15,
      maxzoom: 24,
      paint: { "line-color": "#0066ffff", "line-width": 1 },
      layout: { visibility: "none" },
    });
  }
}

// 갱신 + 표시 토글 (visible: true/false)
export function updateRoadBuffer(map: maplibregl.Map, visible: boolean, r:RoadsKey) {
  const src = map.getSource("roads") as maplibregl.VectorTileSource | undefined;
  if (!src) return;

  const { layer } = roads[r];

  // 화면 내 도로만 대상으로 하면 가볍습니다
 const rendered = map.queryRenderedFeatures({ layers: ["roads-fill","roads-line"] }) as maplibregl.MapGeoJSONFeature[];
  const roadFeats = rendered.filter((f) => {
  const srcLayer = f.sourceLayer ?? (f.layer as any)?.sourceLayer;
  return f.source === "roads" && srcLayer === layer;
});

  const bufs: GeoJSON.Feature[] = [];
  for (const f of roadFeats) {
    try {
      // 개별 피처 버퍼(20m)
      const g = (typeof (f as any).toJSON === "function") ? (f as any).toJSON() : f;
      const bf = turfBuffer(g as any, 20, { units: "meters" });
      if (bf && (bf as any).geometry) bufs.push(bf as any);
    } catch {}
  }

  const fc: GeoJSON.FeatureCollection = { type: "FeatureCollection", features: bufs };
  (map.getSource("road-buffer") as maplibregl.GeoJSONSource)?.setData(fc);

  const vis = visible ? "visible" : "none";
  if (map.getLayer("road-buffer-fill")) map.setLayoutProperty("road-buffer-fill", "visibility", vis);
  if (map.getLayer("road-buffer-outline")) map.setLayoutProperty("road-buffer-outline", "visibility", vis);
}
