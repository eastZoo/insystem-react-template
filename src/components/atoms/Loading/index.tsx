import * as S from "./Loading.style";

export const Loading = ({ width = 60, height = 60 }: any) => {
  return (
    <S.LoadingBox>
      <S.Loading width={width} height={height} />
      <S.LoadingTxt>LOADING...</S.LoadingTxt>
    </S.LoadingBox>
  );
};
