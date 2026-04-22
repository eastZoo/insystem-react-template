import * as S from "./Header.style";
import { useEffect, useRef, useState } from "react";
import { Buttons } from "../../atoms/Buttons";
import { HeaderPopup } from "../HeaderPopup";
import IconMenu from "@/styles/assets/svg/icon_sidemenu.svg?react";

import { useAtomValue } from "jotai";
import { userState } from "@/store/loginUser";
import { useLogout } from "@/hooks/useAuth";
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

  // 페이지 새로고침 판별
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  const popupOutsideClick = (e: any) => {
    if (popupRef.current === e.target) {
      setPopupShow(false);
    }
  };

  useEffect(() => {
    if (!isRefresh) {
      setIsRefresh(true);
    }
  }, [isRefresh]);

  return (
    <>
      <S.HeaderSection>
        <S.ShipModelTit>
          {asideOpen === true ? (
            "메인 타이틀"
          ) : innerWidth < 1400 ? (
            <S.HeaderSidemenuBtn type="button" onClick={asideToggle}>
              <IconMenu />
            </S.HeaderSidemenuBtn>
          ) : (
            "메인 타이틀"
          )}
        </S.ShipModelTit>
        <S.HeaderBtnBox>
          <Buttons type="button" size="md" layout="icon" onClick={() => {}} />
          <Buttons
            type="button"
            size="md"
            layout="icon"
            onClick={() => {
              setPopupShow(!popupShow);
            }}
          >
            <>
              {/* 직책 : 사용자명 바인딩 */}
              <span style={{ margin: "0 8px" }}>{"사용자명" + " : "}</span>
              <span>홍길동</span>
            </>
          </Buttons>
        </S.HeaderBtnBox>
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
