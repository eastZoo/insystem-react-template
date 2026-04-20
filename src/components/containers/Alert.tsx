import { createRoot } from "react-dom/client";
import { PopupAlert } from "../atoms/PopupAlert";

const confirmRoot = document.createElement("div");
const body = document.querySelector("body");
body?.appendChild(confirmRoot);

interface Props {
  title?: string;
  text: string;
  options?: {
    buttonText?: string;
  };
}

interface AlertProps {
  title?: string;
  text: string;
  options?: {
    buttonText?: string;
  };
  giveAnswer: (answer: boolean) => void;
}

function Alert({ title, text, giveAnswer, options }: AlertProps) {
  return (
    <PopupAlert
      title={title ?? "알림"}
      text={text}
      buttons={
        <>
          <button
            className="confirm_btn"
            onClick={() => giveAnswer(true)}
            color="primary"
            autoFocus
          >
            {options?.buttonText ? options?.buttonText : "확인"}
          </button>
        </>
      }
    ></PopupAlert>
  );
}

export const showAlert = (
  text: string,
  alertOptions?: Props
): Promise<boolean> =>
  new Promise((res) => {
    // const confirmRoot = document.createElement("div");
    // const body = document.querySelector("body");
    // body?.appendChild(confirmRoot);

    const root = createRoot(confirmRoot);

    const giveAnswer = (answer: boolean) => {
      root.unmount();
      // body?.removeChild(confirmRoot); // 알림을 닫을 때 div도 제거
      res(answer);
    };

    root.render(
      <Alert
        title={alertOptions?.title}
        text={text}
        giveAnswer={giveAnswer}
        options={alertOptions?.options}
      />
    );
  });
