import { useLogout } from "@/lib/hooks/useAuth";
import * as S from "./SidemenuFooter.style";
import IconUser from "@/styles/assets/svg/icon_user.svg";

export const SidemenuFooter = () => {
  const logoutMutation = useLogout();

  // 사용자 정보가 없을 경우 기본값 사용
  const userName = "홍길동";
  const userEmail = "admin@example.com";

  return (
    <S.SidemenuFooterContainer>
      <S.UserInfo>
        <S.UserText>
          <S.UserIcon>
            <img src={IconUser} alt="user" />
          </S.UserIcon>
          <S.UserName>{userName}</S.UserName>
          <S.Separator>|</S.Separator>
          <S.UserEmail>{userEmail}</S.UserEmail>
        </S.UserText>
      </S.UserInfo>
      <S.LogoutButton onClick={() => logoutMutation.mutate()}>
        로그아웃
      </S.LogoutButton>
    </S.SidemenuFooterContainer>
  );
};
