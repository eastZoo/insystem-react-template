import * as S from "./AuthTemplate.style";
import LogoNavy from "../../../styles/assets/svg/logo_navy.svg?react";

interface AuthTemplateProps {
  children: React.ReactElement;
  title: string;
  subTitle: string;
}

export const AuthTemplate = ({ children, title, subTitle }: AuthTemplateProps) => {
  return (
    <S.AuthTemplate>
      <S.AuthTitleSection>
        <S.AuthTitleBg />
        <S.AuthTitleBox>
          {title}
          <span>{subTitle}</span>
        </S.AuthTitleBox>
      </S.AuthTitleSection>

      <S.AuthInputSection>
        {children}

        <S.AuthLogoBox>
          <LogoNavy />
        </S.AuthLogoBox>
      </S.AuthInputSection>
    </S.AuthTemplate>
  );
};
