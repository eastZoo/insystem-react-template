import { createRoot } from "react-dom/client";
import { PopupAlert } from "../atoms/PopupAlert";

const confirmRoot = document.createElement("div");
const body = document.querySelector("body");
body?.appendChild(confirmRoot);

interface Props {
  title?: string;
  text: string;
  options?: {
    falseButtonText?: string;
    trueButtonText?: string;
  };
}

interface ConfirmDialogProps {
  title?: string;
  text: string;
  options?: {
    falseButtonText?: string;
    trueButtonText?: string;
  };
  giveAnswer: (answer: boolean) => void;
}

function ConfirmDialog({
  title,
  text,
  giveAnswer,
  options,
}: ConfirmDialogProps) {
  return (
    <PopupAlert
      title={title ?? "알림"}
      text={text}
      buttons={
        <>
          <button
            type="button"
            className="confirm_btn"
            onClick={() => giveAnswer(true)}
            autoFocus
          >
            {options?.trueButtonText ? options?.trueButtonText : "확인"}
          </button>
          <button
            type="button"
            className="cancel_btn"
            onClick={() => giveAnswer(false)}
          >
            {options?.falseButtonText ? options?.falseButtonText : "취소"}
          </button>
        </>
      }
    />
  );
}

export const confirmDialog = ({
  text,
  title,
  options,
}: Props): Promise<boolean> =>
  new Promise((res) => {
    const root = createRoot(confirmRoot);

    const giveAnswer = (answer: boolean) => {
      root.unmount();
      res(answer);
    };

    root.render(
      <ConfirmDialog
        title={title}
        text={text}
        giveAnswer={giveAnswer}
        options={options}
      />
    );
  });
