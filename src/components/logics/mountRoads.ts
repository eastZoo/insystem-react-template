import type maplibregl from "maplibre-gl";
import { roads,type RoadsKey } from "./districts";

// 도로 벡터 소스/레이어 장착 헬퍼
export function mountRoads(map: maplibregl.Map, r:RoadsKey) {
  const { url, layer } = roads[r]; // pmtiles://allbusan_road.pmtiles, "road"

  // 기존 레이어/소스 제거
  ["roads-highlight", "roads-fill", "roads-line"].forEach((id) => {
    if (map.getLayer(id)) map.removeLayer(id);
  });
  if (map.getSource("roads")) map.removeSource("roads");

  // 재등록
  map.addSource("roads", { type: "vector", url });

  // 도로가 Polygon/Line 혼재 가능 → 표시용 레이어 두 개
  map.addLayer({
    id: "roads-fill",
    type: "fill",
    source: "roads",
    "source-layer": layer,
    filter: ["==", ["geometry-type"], "Polygon"],
    paint: { "fill-color": "#0066ff", "fill-opacity": 0.15 },
  });

  map.addLayer({
    id: "roads-line",
    type: "line",
    source: "roads",
    "source-layer": layer,
    paint: { "line-color": "#0066ff", "line-width": 1.5 },
  });

  // 도로 하이라이트 (복합키: SIG_CD:RW_SN)
  map.addLayer(
    {
      id: "roads-highlight",
      type: "fill",
      source: "roads",
      "source-layer": layer,
      paint: { "fill-color": "#00fff7ff", "fill-opacity": 1.0 },
      // ["concat", ["get","SIG_CD"], ":", ["to-string", ["get","RW_SN"]]] 와 리스트 매칭
      filter: ["in", ["concat", ["get","SIG_CD"], ":", ["to-string", ["get","RW_SN"]]], ["literal", []]],
    },
    "roads-line" // 경계선 위에 올리기
  );
}
