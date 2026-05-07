/**
 * SharedAssetLocationPage — 공유재산 위치표시 페이지
 *
 * gov_map에서 마이그레이션됨
 * 자산현황 검색 및 위치 매핑 기능 제공
 */

import { PageContent } from "@/components/organisms/PageContent";
import * as S from "./SharedAssetLocationPage.style";
import { useMemo } from "react";

export default function SharedAssetLocationPage() {
  /** ============================= state 영역 ============================= */

  /** ============================= API 영역 ============================= */

  /** ============================= 비즈니스 로직 영역 ============================= */

  /** ============================= 컴포넌트 영역 ============================= */

  // 더미 데이터
  const assetData = useMemo(() => [
    {
      linkSerialNo: "1",
      propertyUseTypeCode: "행정재산",
      assetCurrentStatusCode: "처리됨",
      propertyArea: "1,234",
      propertyValue: "50,000,000",
      assetName: "경상남도 사천시 서포면...",
      legalDongCode: "경상남도 사천시 서포면 외구리 일반지번 236-30",
    },
    {
      linkSerialNo: "2",
      propertyUseTypeCode: "일반재산",
      assetCurrentStatusCode: "미처리",
      propertyArea: "567",
      propertyValue: "25,000,000",
      assetName: "부산광역시 해운대구...",
      legalDongCode: "부산광역시 해운대구 우동 일반지번 78-1",
    },
  ], []);

  /** ============================= useEffect 영역 ============================= */

  return (
    <PageContent
      depth01Title="공유재산 위치표시"
      $height="100%"
    >
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
        <S.SubTitle>재산검색</S.SubTitle>

        <S.FilterContainer>
          <S.FilterRow>
            <S.Label>재산분류처리</S.Label>
            <button type="button" style={{ padding: "8px 16px", cursor: "pointer" }}>
              자동분류처리 실행 →
            </button>
            <S.ResultItem>
              분류결과:
              ① 행정 재산 확정 : <S.Em>0</S.Em>건
              ② 행정/일반 분할대상 : <S.Em>0</S.Em>건
              ③ 일반재산 변경대상 : <S.Em>0</S.Em>건
            </S.ResultItem>
          </S.FilterRow>
          <S.FilterRow>
            <S.Label>지도반영적용</S.Label>
            <button type="button" style={{ padding: "8px 16px", cursor: "pointer" }}>
              분류결과 지도반영 →
            </button>
          </S.FilterRow>
          <S.FilterRow>
            <S.Label>지도반영보기</S.Label>
            <button type="button" style={{ padding: "8px 16px", cursor: "pointer" }}>
              분류결과 지도보기 🗺
            </button>
          </S.FilterRow>
        </S.FilterContainer>

        <S.InfoHeader>
          <S.SubTitle>자산현황목록</S.SubTitle>
          <S.AssetCount>
            총 <span>{assetData.length}</span>건
          </S.AssetCount>
        </S.InfoHeader>

        <S.GridContainer>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>No.</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>재산구분</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>분류처리여부</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>면적(㎡)</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>공시지가</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>자산명</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>법정동 코드</th>
              </tr>
            </thead>
            <tbody>
              {assetData.map((row, idx) => (
                <tr key={row.linkSerialNo}>
                  <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{idx + 1}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{row.propertyUseTypeCode}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{row.assetCurrentStatusCode}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "right" }}>{row.propertyArea}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "right" }}>{row.propertyValue}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{row.assetName}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{row.legalDongCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ marginTop: "16px", color: "#666", fontSize: "14px" }}>
            * ag-grid 컴포넌트 연동 시 Grid 컴포넌트로 교체하세요.
          </p>
        </S.GridContainer>
      </div>
    </PageContent>
  );
}
