// 행정구역 레이어 (center: [경도, 위도], zoom: 지역 클릭 시 이동·줌용 / sido·si: 지적도 하이라이트 쿼리용)
  export const districts = {
    allbusan: { url: "pmtiles://allbusan.pmtiles", layer: "busan_parcel", label: "부산 전체", center: [129.035, 35.106] as [number, number], zoom: 12, sido: "부산광역시", si: "" },
    changwon: { url: "pmtiles://changwon.pmtiles", layer: "changwon", label: "창원", center: [128.68, 35.23] as [number, number], zoom: 12, sido: "경상남도", si: "창원시" },
    gimhae: { url: "pmtiles://gimhae.pmtiles", layer: "gimhae", label: "김해", center: [128.88, 35.23] as [number, number], zoom: 12, sido: "경상남도", si: "김해시" },
    sacheon: { url: "pmtiles://sacheon.pmtiles", layer: "sacheon", label: "사천", center: [128.07, 34.93] as [number, number], zoom: 12, sido: "경상남도", si: "사천시" },
    changnyeong: { url: "pmtiles://changnyeong.pmtiles", layer: "changnyeong", label: "창녕", center: [128.07, 34.93] as [number, number], zoom: 12, sido: "경상남도", si: "창녕군" },
    goseong: { url: "pmtiles://goseong.pmtiles", layer: "goseong", label: "고성", center: [128.07, 34.93] as [number, number], zoom: 12, sido: "경상남도", si: "고성군" },

  } as const;
// 행정구역 도로 레이어
  export const roads = {
    busan_road: { url: "pmtiles://allbusan_road.pmtiles", layer: "road", label: "부산 도로" },
    gimhae_road: { url: "pmtiles://gimhae_road.pmtiles", layer: "gimhae_road", label: "김해 도로" },
    changwon_road: { url: "pmtiles://changwon_road.pmtiles", layer: "changwon_road", label: "창원 도로" },
  } as const;
// 행정구역 건물 레이어
  export const builds = {
    busan_builds: { url: "pmtiles://busanbuild.pmtiles", layer: "road", label: "부산 건물" },
    changwon_builds: { url: "pmtiles://changwon_build.pmtiles", layer: "changwon_build", label: "창원 건물" },
    gimhae_builds: { url: "pmtiles://gimhae_build.pmtiles", layer: "gimhae_build", label: "김해 건물" },
  } as const;
//상태 변경용 키
  export type DistrictKey = keyof typeof districts;
  export type RoadsKey = keyof typeof roads;
  export type BuildsKey = keyof typeof builds;
