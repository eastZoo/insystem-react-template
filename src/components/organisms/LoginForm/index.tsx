import * as S from "./LoginForm.style";
import type { Control } from "react-hook-form";
import type { FormEventHandler } from "react";
import { Buttons } from "../../atoms/Buttons";
import { ControlText } from "../../atoms/Controls/ControlText";

interface LoginFormProps {
  onSubmit: FormEventHandler;
  control: Control<any>;
  isLoading?: boolean;
}

export const LoginForm = ({ onSubmit, control, isLoading = false }: LoginFormProps) => {
  return (
    <S.LoginFormBox>
      <S.LoginFormTit>LOGIN</S.LoginFormTit>
      <S.LoginForm onSubmit={onSubmit}>
        <ControlText
          control={control}
          size="lg"
          placeholder="아이디를 입력하세요"
          name="mbrUserId"
        />
        <ControlText
          type="password"
          control={control}
          size="lg"
          placeholder="비밀번호를 입력하세요"
          name="mbrUserPwd"
        />
        <Buttons
          type="submit"
          layout={isLoading ? "disabled" : "primary"}
          size="lg"
          label={isLoading ? "로그인 중..." : "Login"}
          disabled={isLoading}
        />
      </S.LoginForm>
      <S.LoginFormExp>
        * 비밀번호를 모를 경우에는 관리자에게 문의하세요.
      </S.LoginFormExp>
    </S.LoginFormBox>
  );
};
