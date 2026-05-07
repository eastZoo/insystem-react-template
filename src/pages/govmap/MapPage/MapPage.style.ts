import styled from "styled-components";

/** 지도 + 툴바를 감싸는 컨테이너. 부모 flex에서 남는 영역을 채우고 overflow 방지 */
export const MapContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
`;

/** 지도 캔버스 전용 래퍼. flex로 남는 공간 채우고, 내부 지도가 넘치지 않도록 제한 */
export const MapWrapper = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
`;
