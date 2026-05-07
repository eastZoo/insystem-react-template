/**
 * SharedAssetManagementPage — 공유재산 정보관리 페이지
 *
 * gov_map에서 마이그레이션됨
 * 공유재산 정보 조회 및 관리 기능 제공
 */

import { PageContent } from "@/components/organisms/PageContent";
import * as S from "./SharedAssetManagementPage.style";
import { useMemo } from "react";

export default function SharedAssetManagementPage() {
  /** ============================= state 영역 ============================= */

  /** ============================= API 영역 ============================= */

  /** ============================= 비즈니스 로직 영역 ============================= */

  /** ============================= 컴포넌트 영역 ============================= */

  // 더미 데이터
  const rowData = useMemo(() => [
    {
      id: 1,
      type: "행정",
      isClassified: true,
      result: "행정확정",
      areaSqm: 123,
      grade: "-",
      assetName: "경상남도 남해군 창선면 광천면...",
      code: "경상남도 남해군 창선면 광천리 일반지번 65-2",
    },
    {
      id: 2,
      type: "행정",
      isClassified: true,
      result: "분할대상",
      areaSqm: 123,
      grade: "-",
      assetName: "경상남도 남해군 창선면 광천면...",
      code: "경상남도 남해군 창선면 광천리 일반지번 65-2",
    },
    {
      id: 3,
      type: "상업",
      isClassified: true,
      result: "상업확정",
      areaSqm: 456,
      grade: "-",
      assetName: "부산광역시 해운대구 우동...",
      code: "부산광역시 해운대구 우동 일반지번 78-1",
    },
  ], []);

  /** ============================= useEffect 영역 ============================= */

  return (
    <PageContent
      depth01Title="공유재산 정보관리"
      $height="100%"
    >
      <div style={{ padding: "24px" }}>
        <S.SubTitle>재산 검색</S.SubTitle>

        <S.FilterContainer>
          <S.FilterGroup>
            <S.FilterRow>
              <S.Label>재산구분</S.Label>
              <input type="text" placeholder="재산구분 입력" style={{ padding: "8px", width: "200px" }} />
            </S.FilterRow>
            <S.FilterRow>
              <S.Label>분류처리여부</S.Label>
              <input type="text" placeholder="분류처리여부 입력" style={{ padding: "8px", width: "200px" }} />
            </S.FilterRow>
            <S.FilterRow>
              <S.Label>분류결과</S.Label>
              <input type="text" placeholder="분류결과 입력" style={{ padding: "8px", width: "200px" }} />
            </S.FilterRow>
          </S.FilterGroup>

          <S.FilterGroup>
            <S.FilterRow>
              <S.Label>면적(㎡)</S.Label>
              <input type="text" placeholder="면적 입력" style={{ padding: "8px", width: "200px" }} />
            </S.FilterRow>
            <S.FilterRow>
              <S.Label>공시지가</S.Label>
              <input type="text" placeholder="공시지가 입력" style={{ padding: "8px", width: "200px" }} />
            </S.FilterRow>
            <S.FilterRow>
              <S.Label>자산명</S.Label>
              <input type="text" placeholder="자산명 입력" style={{ padding: "8px", width: "200px" }} />
            </S.FilterRow>
            <S.FilterButtons>
              <button type="button" style={{ padding: "8px 16px", cursor: "pointer" }}>
                저장 📄
              </button>
            </S.FilterButtons>
          </S.FilterGroup>
        </S.FilterContainer>

        <S.InfoHeader>
          <S.SubTitle>자산현황목록</S.SubTitle>
          <S.AssetCount>
            총 <span>{rowData.length}</span>건
          </S.AssetCount>
        </S.InfoHeader>

        <S.GridContainer>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>No.</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>재산구분</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>분류처리여부</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>분류결과</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>면적(㎡)</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>공시지가</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>자산명</th>
                <th style={{ padding: "12px", border: "1px solid #ddd" }}>법정동 코드</th>
              </tr>
            </thead>
            <tbody>
              {rowData.map((row) => (
                <tr key={row.id}>
                  <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>{row.id}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{row.type}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "center" }}>
                    {row.isClassified ? "O" : "X"}
                  </td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{row.result}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd", textAlign: "right" }}>{row.areaSqm}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{row.grade}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{row.assetName}</td>
                  <td style={{ padding: "12px", border: "1px solid #ddd" }}>{row.code}</td>
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
