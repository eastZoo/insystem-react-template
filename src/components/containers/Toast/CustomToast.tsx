import * as S from "./Toast.style";

export type ToastVariant = "success" | "error" | "info";

interface CustomToastProps {
  variant: ToastVariant;
  title?: string;
  message: string;
}

const defaultTitles: Record<ToastVariant, string> = {
  success: "완료",
  error: "오류",
  info: "알림",
};

export function CustomToast({ variant, title, message }: CustomToastProps) {
  return (
    <S.ToastRoot $variant={variant} role="status" aria-live="polite">
      <S.ToastLabel>{title ?? defaultTitles[variant]}</S.ToastLabel>
      <S.ToastMessage>{message}</S.ToastMessage>
    </S.ToastRoot>
  );
}
