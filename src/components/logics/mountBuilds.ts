// mountBuilds.ts
import type maplibregl from "maplibre-gl";
import { builds, type BuildsKey} from "./districts";
export function mountBuilds(map: maplibregl.Map,b: BuildsKey) {
  const { url, layer } = builds[b]; // ← layer는 info로 확인한 정확한 이름

  // 1) 기존 정리
  ["builds-highlight","builds-line","builds-fill"].forEach(id => {
    if (map.getLayer(id)) map.removeLayer(id);
  });
  if (map.getSource("builds")) map.removeSource("builds");

  // 2) 소스
  map.addSource("builds", { type: "vector", url }); // pmtiles:///busanbuild.pmtiles

  // 3) 폴리곤 + 멀티폴리곤 모두 표시
  map.addLayer({
    id: "builds-fill",
    type: "fill",
    source: "builds",
    "source-layer": layer,
    // filter: ["==", ["geometry-type"], "Polygon"],           // 제거
    filter: ["in", ["geometry-type"], ["literal", ["Polygon", "MultiPolygon"]]],
    paint: { "fill-color": "#8e44ad", "fill-opacity": 0.18 },
  }); // , "cadastre-line" 처럼 beforeId 필요하면 여기에

  map.addLayer({
    id: "builds-line",
    type: "line",
    source: "builds",
    "source-layer": layer,
    paint: { "line-color": "#8e44ad", "line-width": 1 },
  });

  map.addLayer({
    id: "builds-highlight",
    type: "fill",
    source: "builds",
    "source-layer": layer,
    paint: { "fill-color": "#e67e22", "fill-opacity": 0.45 },
    filter: ["in", ["get","UFID"], ["literal", []]], // ← UFID 필드가 실제로 존재하는지 info로 확인
  }, "builds-line");

  // 4) 디버그: 실제로 타일이 로딩되는지 확인
  map.once("idle", () => {
    try {
      const feats = map.querySourceFeatures("builds", { sourceLayer: layer });
      console.log("[builds] sourceFeatures:", feats?.length, feats?.[0]);
      const rend = map.queryRenderedFeatures({ layers: ["builds-fill","builds-line"] });
      console.log("[builds] renderedFeatures:", rend?.length, rend?.[0]);
    } catch (e) {
      console.warn("builds debug error:", e);
    }
  });
}
