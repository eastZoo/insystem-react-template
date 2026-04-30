import * as S from "./SidemenuFooter.style";
import type { UserInfo } from "@/types/domain.types";

interface SidemenuFooterProps {
  isCollapsed?: boolean;
  onLogout: () => void;
  userInfo?: UserInfo;
}

/** 로그아웃 아이콘 - Figma stroke 스타일 */
const LogoutIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.6667 11.3333L14 8L10.6667 4.66667"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 8H6"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SidemenuFooter = ({
  isCollapsed = false,
  onLogout,
  userInfo,
}: SidemenuFooterProps) => {
  // 이름의 첫 글자를 아바타에 표시
  const avatarInitial = userInfo?.userName?.charAt(0) || "-";

  return (
    <S.SidemenuFooterContainer $isCollapsed={isCollapsed}>
      <S.UserInfo $isCollapsed={isCollapsed}>
        <S.UserAvatar $isCollapsed={isCollapsed}>{avatarInitial}</S.UserAvatar>
        <S.UserText $isCollapsed={isCollapsed}>
          <S.UserName>{userInfo?.userName || "-"}</S.UserName>
          <S.UserRole>
            {[userInfo?.userTeam, userInfo?.userRole]
              .filter(Boolean)
              .join(" · ") || "-"}
          </S.UserRole>
        </S.UserText>
      </S.UserInfo>
      <S.LogoutButton $isCollapsed={isCollapsed} onClick={onLogout}>
        <LogoutIcon />
        <span>로그아웃</span>
      </S.LogoutButton>
    </S.SidemenuFooterContainer>
  );
};
