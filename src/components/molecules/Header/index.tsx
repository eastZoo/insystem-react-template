import * as S from "./Header.style";
import { useEffect, useRef, useState } from "react";
import { Buttons } from "../../atoms/Buttons";
import { HeaderPopup } from "../HeaderPopup";
import { useLogout } from "@/lib/hooks/useLogout";

import { ChangePasswordModal } from "../../containers/Member/ChangePasswordModal";
import { useRecoilValue } from "recoil";
import { userState } from "@/store/loginUser";

interface HeaderProps {
  asideToggle?: any;
  asideOpen?: boolean;
  innerWidth: number;
}

export const Header = ({ asideOpen, asideToggle, innerWidth }: HeaderProps) => {
  const logout = useLogout();
  const popupRef = useRef<HTMLDivElement>(null);
  const [popupShow, setPopupShow] = useState(false);
  const [modalPasswordShow, setModalPasswordShow] = useState(false);
  const [modalChangeUserInfoShow, setModalChangeUserInfoShow] = useState(false);
  const userInfo = useRecoilValue(userState);

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
        <S.HeaderBtnBox>
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
              <span style={{ margin: "0 8px" }}>
                {userInfo?.dutiesName + " : "}
              </span>
              <span>{userInfo?.userName}</span>
            </>
          </Buttons>
        </S.HeaderBtnBox>
      </S.HeaderSection>
      {popupShow && (
        <HeaderPopup
          logout={logout}
          popupRef={popupRef}
          popupOutsideClick={popupOutsideClick}
          handleModal={() => {
            setPopupShow(false);
            setModalPasswordShow(!modalPasswordShow);
          }}
          changedInfo={() => {
            setPopupShow(false);
            setModalChangeUserInfoShow(!modalChangeUserInfoShow);
          }}
        />
      )}

      {modalPasswordShow && (
        <ChangePasswordModal
          setModalShow={setModalPasswordShow}
          userId={userInfo?.userId}
          formId="change_password"
        />
      )}
    </>
  );
};
