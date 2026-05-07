import * as S from "./Header.style";
import { useRef, useState } from "react";
import { HeaderPopup } from "../HeaderPopup";

import { useAtomValue } from "jotai";
import { userState } from "@/store/loginUser";
import { useLogout } from "@/hooks/useAuth";

// 유저 아이콘 SVG
const UserIcon = () => (
  <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
    <circle cx="10" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M2 20C2 16.6863 5.58172 14 10 14C14.4183 14 18 16.6863 18 20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

interface HeaderProps {
  asideToggle?: any;
  asideOpen?: boolean;
  innerWidth: number;
}

export const Header = ({ asideOpen, asideToggle, innerWidth }: HeaderProps) => {
  const logoutMutation = useLogout();
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupShow, setPopupShow] = useState(false);
  const userInfo = useAtomValue(userState);

  const popupOutsideClick = (e: any) => {
    if (popupRef.current === e.target) {
      setPopupShow(false);
    }
  };

  // userInfo에서 사용자 정보 추출 (없으면 기본값)
  const userRole = "관리자";
  const userId = userInfo?.userId ?? "20241234";

  return (
    <>
      <S.HeaderSection>
        <S.HeaderTitle></S.HeaderTitle>
        <S.HeaderUserInfo>
          <S.UserInfoText>
            <S.UserRole>{userRole}</S.UserRole>
            <S.UserDivider />
            <S.UserId>{userId}</S.UserId>
          </S.UserInfoText>
          <S.UserIcon onClick={() => setPopupShow(!popupShow)}>
            <UserIcon />
          </S.UserIcon>
        </S.HeaderUserInfo>
      </S.HeaderSection>
      {/* 로그아웃 팝업 */}
      {popupShow && (
        <HeaderPopup
          logout={() => logoutMutation.mutate()}
          popupRef={popupRef}
          popupOutsideClick={popupOutsideClick}
        />
      )}
    </>
  );
};
