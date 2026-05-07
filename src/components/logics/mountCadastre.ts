import type maplibregl from "maplibre-gl";
import { districts, type DistrictKey } from "./districts";

// 지적도 벡터 소스/레이어 장착 헬퍼
export function mountCadastre(map: maplibregl.Map, d: DistrictKey) {
  const { url, layer } = districts[d];

  // 기존 레이어/소스 제거
  ["cadastre-highlight", "cadastre-line", "cadastre-fill"].forEach((id) => {
    if (map.getLayer(id)) map.removeLayer(id);
  });
  if (map.getSource("cadastre")) map.removeSource("cadastre");




  // 재등록
  map.addSource("cadastre", {
    type: "vector",
    url,
    attribution: "지적편집도 / © 데이터 소유기관",
  });

  map.addLayer({
    id: "cadastre-fill",
    type: "fill",
    source: "cadastre",
    "source-layer": layer,
    paint: { "fill-color": "#ffffff", "fill-opacity": 0.35 },
  });

  map.addLayer({
    id: "cadastre-line",
    type: "line",
    source: "cadastre",
    "source-layer": layer,
    paint: { "line-color": "#aa0000", "line-width": 0.5 },
  });

  map.addLayer(
    {
      id: "cadastre-highlight",
      type: "fill",
      source: "cadastre",
      "source-layer": layer,
      paint: { "fill-color": "#0bf926ff", "fill-opacity": 0.5 },
      filter: ["in", ["get", "PNU"], ["literal", []]],
    },
    "cadastre-line"
  );
}
