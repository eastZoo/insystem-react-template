import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CustomToast, type ToastVariant } from "./CustomToast";
import * as S from "./Toast.style";

export type ShowToastOptions = {
  type: ToastVariant;
  message: string;
  title?: string;
  durationMs?: number;
};

type ToastItem = ShowToastOptions & { id: number };

type ToastContextValue = {
  showToast: (opts: ShowToastOptions) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((opts: ShowToastOptions) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const duration = opts.durationMs ?? 3800;

    setToasts((prev) => [...prev, { ...opts, id }]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <S.ToastViewport aria-label="알림 영역">
        {toasts.map((t) => (
          <CustomToast
            key={t.id}
            variant={t.type}
            title={t.title}
            message={t.message}
          />
        ))}
      </S.ToastViewport>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast는 ToastProvider 내부에서만 사용할 수 있습니다.");
  }
  return ctx;
}
