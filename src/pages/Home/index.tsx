import * as S from "./HomePage.style";

/**
 * 홈/대시보드 페이지
 */
export default function HomePage() {
  return (
    <S.HomePageContainer>
      <title>대시보드</title>
      {/* 헤더 */}
      <S.Header>
        <S.Title>대시보드</S.Title>
      </S.Header>
    </S.HomePageContainer>
  );
}
