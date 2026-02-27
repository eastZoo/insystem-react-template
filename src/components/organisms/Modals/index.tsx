import * as S from "./Modals.style";
import { useRef } from "react";
import IconComment from "@/styles/assets/svg/icon_close.svg";

export interface ModalProps {
  modalTitle?: React.ReactElement | string;
  modalButtons?: React.ReactElement;
  children?: React.ReactElement;
  setModalShow?: any;
  formId?: string;
  width?: any;
  height?: any;
  statusNow?: any;
  statusTxt?: boolean;
  passwordAlert?: boolean;
  modalType?: "create" | "modify";
  modalCloseButton?: boolean;
  $padding?: string;
}

export const Modals = ({
  modalType = "create",
  modalTitle,
  setModalShow,
  modalButtons,
  width,
  height,
  children,
  modalCloseButton,
  $padding,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const modalOutsideClick = (e: any) => {
    if (modalRef.current === e.target) {
      // return setModalShow(false); //❇️ 모달 외부 클릭 시 닫힘 끔
    }
  };

  return (
    <S.ModalBg ref={modalRef} onClick={(e: any) => modalOutsideClick(e)}>
      <S.Modal $width={width} $height={height}>
        <S.ModalTitBox>
          {modalTitle}
          {/* {modalCloseButton && ( */}
          <S.CloseBtnBox>
            <IconComment
              
            />
          </S.CloseBtnBox>
          {/* )} */}
        </S.ModalTitBox>
        <S.ModalContentBox $padding={$padding}>{children}</S.ModalContentBox>
        <S.ModalButtonBox>{modalButtons}</S.ModalButtonBox>
      </S.Modal>
    </S.ModalBg>
  );
};
