import * as S from "./TextInfo.style";

interface TextInfoProps {
  title: string;
  value?: any;
}

export const TextInfo = (props: TextInfoProps) => {
  return (
    <S.TextInfoBox>
      <S.TextInfoTitle>{props.title}</S.TextInfoTitle>
      <S.TextInfo>{props.value && props.value}</S.TextInfo>
    </S.TextInfoBox>
  );
};
