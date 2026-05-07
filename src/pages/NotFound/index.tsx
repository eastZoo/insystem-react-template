import { useNavigate } from "react-router-dom";
import * as S from "./NotFoundPage.style";

/**
 * 404 페이지
 * - 없는 경로 접근 시 표시
 */
export default function NotFoundPage() {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <S.NotFoundContainer>
      <S.NotFoundContent>
        <S.NotFoundIcon />
        <S.NotFoundTitle>페이지를 찾을 수 없습니다</S.NotFoundTitle>
        <S.NotFoundDescription>
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          <br />
          URL을 확인하시거나 홈으로 돌아가시기 바랍니다.
        </S.NotFoundDescription>
        <S.NotFoundActions>
          <S.BackButton onClick={handleGoBack}>이전 페이지</S.BackButton>
          <S.HomeButton onClick={handleGoHome}>홈으로 가기</S.HomeButton>
        </S.NotFoundActions>
      </S.NotFoundContent>
    </S.NotFoundContainer>
  );
}
