import * as S from "./ExplainText.style";

interface ExplainTextProps {
  children?: React.ReactElement;
}

export const ExplainText = ({ children }: ExplainTextProps) => {
  return <S.ExplainText>{children}</S.ExplainText>;
};
