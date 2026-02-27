import * as S from "./SidemenuTop.style";
import IconMenu from "@/styles/assets/svg/icon_sidemenu.svg?react";
import IconLogo from "@/styles/assets/svg/logo-light-sample.svg?react";
import { Link } from "react-router-dom";

interface SidemenuTopProps {
  asideToggle?: any;
}

export const SidemenuTop = ({ asideToggle }: SidemenuTopProps) => {
  return (
    <S.SidemenuTop>
      <S.SidemenuBtn type="button" onClick={asideToggle}>
        <IconMenu width={20} height={20} />
      </S.SidemenuBtn>
      <S.SidemenuTopSpan>
        <Link
          to={"/"}
          style={{ textDecoration: "none", color: "inherit" }}
          onClick={() => {
            window.location.reload();
          }}
        >
          {/* 텍스트 혹은 아이콘 둘 중 하나를 선택해서 사용 */}
          <span>SAMPLE</span>
          {/* <IconLogo width={100} height={20} /> */}
        </Link>
      </S.SidemenuTopSpan>
    </S.SidemenuTop>
  );
};
