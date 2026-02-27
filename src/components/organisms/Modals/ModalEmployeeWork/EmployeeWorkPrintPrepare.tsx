import { EmployeeWorkPrintModal } from "src/components/containers/EmployeeWork/EmployeeWorkPrintModal";
import { Buttons } from "src/components/atoms/Buttons";
import { useState } from "react";
import {
  ModalBackground,
  ModalCloseButton,
  ModalContainer,
  ModalHeader,
} from "src/components/containers/AnnualRegist/style/printModal.style";

interface EmployeeWorkPrintPrepareProps {
  data: any; // calendar 선택된 항목
  userInfo: any;
  onClose: () => void;
}

function Modal({ children, size }: any) {
  return (
    // Modal 배경
    <ModalBackground>
      {/* Modal Wrap */}
      <ModalContainer className={`${size}`}>
        {/* Modal 내용 */}
        {children}
      </ModalContainer>
    </ModalBackground>
  );
}

function ModalHeaderButton({ children, close, title, printRef }: any) {
  return (
    // Modal 헤더
    <ModalHeader>
      <div className="modal-header">
        <span className="modal-title">{title}</span>
        {/* Modal 내용 */}
        {children}
      </div>
      <ModalCloseButton onClick={close}>X</ModalCloseButton>
    </ModalHeader>
  );
}

export const EmployeeWorkPrintPrepare = ({
  data,
  userInfo,
  onClose,
}: EmployeeWorkPrintPrepareProps) => {
  const [department, setDepartmentName] = useState<
    "개발팀" | "디자인팀" | "경영관리팀"
  >("개발팀");
  const [type, setType] = useState<"연차" | "반차" | "반반차">("연차");
  const [halfDayTime, setHalfDayTime] = useState<"오전" | "오후">("오전");
  const [print, setPrint] = useState(false);
  const [printIndex, setPrintIndex] = useState<number | null>(null);

  return (
    <>
      <Modal size="md">
        <ModalHeaderButton title="출력 사전 설정" close={onClose} />
        <div style={{ padding: 20 }}>
          <div>
            <label
              style={{
                fontSize: "1.2rem",
                fontWeight: 500,
              }}
            >
              소속
            </label>
            <div style={{ marginTop: "10px" }}>
              {["개발팀", "디자인팀", "경영관리팀"].map((d) => (
                <label key={d} style={{ marginRight: 12, fontSize: "1.2rem" }}>
                  <input
                    type="radio"
                    name="department"
                    value={d}
                    checked={department === d}
                    onChange={() => setDepartmentName(d as any)}
                  />
                  {d}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <label
              style={{
                fontSize: "1.2rem",
                fontWeight: 500,
              }}
            >
              휴가 종류
            </label>
            <div style={{ marginTop: "10px" }}>
              {["연차", "반차", "반반차"].map((v) => (
                <label key={v} style={{ marginRight: 12, fontSize: "1.2rem" }}>
                  <input
                    type="radio"
                    name="type"
                    value={v}
                    checked={type === v}
                    onChange={() => setType(v as any)}
                  />
                  {v}
                </label>
              ))}
            </div>
          </div>

          {(type === "반차" || type === "반반차") && (
            <div style={{ marginTop: 12 }}>
              <label
                style={{
                  fontSize: "1.2rem",
                  fontWeight: 500,
                }}
              >
                시간 선택
              </label>
              <div style={{ marginTop: "10px" }}>
                {["오전", "오후"].map((v) => (
                  <label key={v} style={{ marginRight: 12 }}>
                    <input
                      type="radio"
                      name="halfDayTime"
                      value={v}
                      checked={halfDayTime === v}
                      onChange={() => setHalfDayTime(v as any)}
                    />
                    {v}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 20,
              textAlign: "right",
            }}
          >
            <Buttons
              type="button"
              size="md"
              layout="highlight"
              label="출력"
              onClick={() => setPrintIndex(0)}
            />
            <Buttons
              type="button"
              size="md"
              layout="secondary"
              label="취소"
              onClick={() => onClose()}
            />
          </div>
        </div>
      </Modal>

      {/* 출력용 컴포넌트 */}
      {printIndex !== null && data.user_name[printIndex] && (
        <EmployeeWorkPrintModal
          show={printIndex !== null}
          onClose={() => {
            // 현재 모달을 닫고 제거
            setPrintIndex(null);

            // 다음 인쇄 대상을 잠깐 delay 후 설정
            setTimeout(() => {
              const next = (printIndex ?? 0) + 1;
              if (next < data.user_name.length) {
                setPrintIndex(next);
              }
            }, 300); // 모달 unmount 대기 시간
          }}
          userInfo={userInfo}
          formData={{
            ...data,
            title: type,
            time: halfDayTime,
            user_name: data.user_name[printIndex],
            duties: data.duties[printIndex],
            departmentName: department,
          }}
        />
      )}
    </>
  );
};
