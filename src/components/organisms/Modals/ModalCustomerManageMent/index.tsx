import { Control } from "react-hook-form";
import { ModalProps, Modals } from "..";
import { Nullable } from "src/common/types/common";
import { CreateCustomerInputs } from "src/components/containers/CustomerManageMent/CustomerManageCreateModal";
import { Buttons } from "src/components/atoms/Buttons";
import { ModalFormBox, ModalFormDiv, ModalFormSection } from "../Modals.style";
import { ControlText } from "src/components/atoms/Controls/ControlText";
import { ControlCheckBox } from "src/components/atoms/Controls/ControlCheckBox";
import { useState } from "react";
import { PostCode } from "@/components/organisms/Modals/ModalCustomerManageMent/PostCode";

interface ModalCustomerManageProps extends ModalProps {
  control: Control<Nullable<CreateCustomerInputs>, any>;
  onSubmit: any;
  createModalShow: any;
  updateModalShow?: any;
  onDelete?: () => Promise<void>;
  completeHandler?: any;
  postCodeOpen?: any;
  setPostCodeOpen?: any;
}

export const ModalCustomerManage = ({
  control,
  onDelete,
  updateModalShow,
  completeHandler,
  postCodeOpen,
  setPostCodeOpen,
  ...props
}: ModalCustomerManageProps) => {
  return (
    <>
      <Modals
        modalTitle={props.createModalShow ? "거래처 등록" : "거래처 수정"}
        formId={props.formId}
        setModalShow={props.setModalShow}
        modalButtons={
          <>
            <Buttons
              type="button"
              size="md"
              layout="primary"
              label="확인"
              form={props.formId}
              onClick={props.onSubmit}
            />

            <Buttons
              type="button"
              size="md"
              layout="secondary"
              label="취소"
              onClick={() => props.setModalShow(false)}
            />
            {updateModalShow && (
              <div style={{ position: "relative", left: "25%" }}>
                <Buttons
                  type="button"
                  size="md"
                  layout="warn"
                  label="삭제"
                  onClick={onDelete}
                />
              </div>
            )}
          </>
        }
      >
        <ModalFormBox id={props.formId} $flexDirection={"row"}>
          <ModalFormSection>
            <ModalFormDiv>
              <ControlText
                control={control}
                size="md"
                direction="column"
                name="customerCode"
                label="거래처코드"
                placeholder="거래처코드를 입력해주세요."
              />
              <ControlText
                control={control}
                size="md"
                direction="column"
                name="customerName"
                label="거래처명"
                placeholder="거래처명을 입력해주세요."
              />
            </ModalFormDiv>
            <ModalFormDiv>
              <ControlText
                control={control}
                size="md"
                direction="column"
                name="bizNo"
                label="사업자번호"
                placeholder="사업자번호를 입력해주세요."
              />
              <ControlText
                control={control}
                size="md"
                direction="column"
                name="ceoName"
                label="사업자명"
                placeholder="사업자명을 입력해주세요."
              />
            </ModalFormDiv>
            <ModalFormDiv $gap="5px" style={{ flexDirection: "column" }}>
              <ModalFormDiv style={{ alignItems: "flex-end" }}>
                <ControlText
                  control={control}
                  size="md"
                  direction="column"
                  name="zipName"
                  label="우편번호"
                  placeholder="우편번호 검색"
                />
                <Buttons
                  type="button"
                  size="md"
                  layout="ghost"
                  label="검색"
                  onClick={() => setPostCodeOpen(true)}
                />
              </ModalFormDiv>
              <ControlText
                control={control}
                size="md"
                direction="column"
                name="address"
                label="주소"
                placeholder="주소 검색"
              />
              <ControlText
                control={control}
                size="md"
                direction="column"
                name="addressDetail"
                label="상세주소"
                placeholder="상세주소를 입력해주세요."
              />
            </ModalFormDiv>
            <ModalFormDiv>
              <ControlText
                control={control}
                size="md"
                direction="column"
                name="bizType"
                label="업태"
                placeholder="업태를 입력해주세요."
              />
              <ControlText
                control={control}
                size="md"
                direction="column"
                name="bizItem"
                label="업종"
                placeholder="업종을 입력해주세요."
              />
            </ModalFormDiv>
            <ModalFormDiv>
              <ControlText
                control={control}
                size="md"
                direction="column"
                name="tel"
                label="전화번호"
                placeholder="전화번호를 입력해주세요."
              />
              <ControlText
                control={control}
                size="md"
                direction="column"
                name="hp"
                label="휴대폰번호"
                placeholder="휴대폰번호를 입력해주세요."
              />
            </ModalFormDiv>
            <ModalFormDiv>
              <ControlText
                control={control}
                size="md"
                direction="column"
                name="fax"
                label="팩스번호"
                placeholder="팩스번호를 입력해주세요."
              />
              <ControlText
                control={control}
                size="md"
                direction="column"
                name="email"
                label="이메일"
                placeholder="이메일을 입력해주세요."
              />
            </ModalFormDiv>
            <ModalFormDiv>
              <ControlText
                control={control}
                size="md"
                direction="column"
                name="taxName"
                label="담당자"
                placeholder="담당자를 입력해주세요."
              />
              <ControlCheckBox
                type="checkbox"
                control={control}
                size="md"
                direction="column"
                label="사용여부"
                name="useYn"
                defaultValue={true}
              />
            </ModalFormDiv>
            <ControlText
              control={control}
              size="md"
              direction="column"
              name="remark"
              label="비고"
              placeholder="비고를 입력해주세요."
            />
          </ModalFormSection>
        </ModalFormBox>
      </Modals>

      {postCodeOpen && (
        <PostCode
          close={() => setPostCodeOpen(false)}
          isComplete={completeHandler}
        />
      )}
    </>
  );
};
