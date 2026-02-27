import IconLogout from "@/styles/assets/svg/icon_logout.svg?react";
import IconPassword from "@/styles/assets/svg/icon_password.svg?react";
import IconUser from "@/styles/assets/svg/icon_user.svg?react";
import { HeaderPopupItem } from "@/components/atoms/HeaderPopupItem";
import * as S from "./HeaderPopup.style";

interface HeaderPopupProps {
  popupRef: React.ForwardedRef<HTMLDivElement>;
  popupOutsideClick: (e: any) => void;
  logout: () => void;
}

export const HeaderPopup = ({
  popupRef,
  popupOutsideClick,
  logout,
}: HeaderPopupProps) => {
  const popupItem = [

    {
      id: 1,
      title: "로그아웃",
      icon: <IconLogout width={20} height={20} />,
      onClick: logout,
    },
  ];

  return (
    <S.HeaderPopupBg ref={popupRef} onClick={(e: any) => popupOutsideClick(e)}>
      <S.HeaderPopup>
        <S.HeaderPopupList>
          {popupItem.map((item: any) => {
            return (
              <HeaderPopupItem
                key={item.id}
                title={item.title}
                icon={item.icon}
                onClick={item.onClick}
              />
            );
          })}
        </S.HeaderPopupList>
      </S.HeaderPopup>
    </S.HeaderPopupBg>
  );
};
