import styled from "styled-components";

// ─── 페이지 컨테이너 ─────────────────────────────────────────────
export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  height: 100%;
  padding: 0;
`;

export const PageTitle = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 10px;
`;

export const PageTitleText = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 20px;
  line-height: normal;
  letter-spacing: -0.4px;
  color: #101828;
  margin: 0;
`;

// ─── 섹션 타이틀 ─────────────────────────────────────────────────
export const SectionTitle = styled.h2`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: normal;
  letter-spacing: -0.32px;
  color: #364153;
  margin: 0;
`;

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

// ─── 검색 폼 컨테이너 ────────────────────────────────────────────
export const SearchContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  background: #ffffff;
  border: 1px solid #d1d5dc;
  border-radius: 6px;
  padding: 16px;
  overflow: hidden;
`;

export const SearchFormArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 720px;
`;

export const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const SearchRowWide = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 48px;
  width: 100%;
`;

// ─── 라벨 ────────────────────────────────────────────────────────
export const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 2px;
  width: 80px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: normal;
  letter-spacing: -0.28px;
  color: #364153;
  white-space: nowrap;
  flex-shrink: 0;
`;

// ─── 라디오 버튼 ─────────────────────────────────────────────────
export const RadioGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 8px 0;
`;

export const RadioItem = styled.label<{ $checked?: boolean }>`
  display: flex;
  align-items: center;
  gap: 9px;
  cursor: pointer;
`;

export const RadioCircle = styled.div<{ $checked?: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  border: 1.5px solid ${({ $checked }) => ($checked ? "#0c4ca3" : "#d1d5dc")};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
`;

export const RadioDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #0c4ca3;
`;

export const RadioLabel = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: normal;
  letter-spacing: -0.28px;
  color: #364153;
  white-space: nowrap;
`;

// ─── 입력 필드 ───────────────────────────────────────────────────
export const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const InputGroupFlex = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
  height: 36px;
`;

export const SelectInput = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 116px;
  height: 36px;
  background: #ffffff;
  border: 1px solid #d1d5dc;
  border-radius: 6px;
  padding: 0 8px 0 12px;
  cursor: pointer;
`;

export const SelectValue = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: normal;
  letter-spacing: -0.24px;
  color: #101828;
`;

export const SelectIcon = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 16px;
    height: 16px;
    color: #6a7282;
  }
`;

export const RangeSeparator = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: normal;
  letter-spacing: -0.24px;
  color: #000000;
`;

export const TextInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 36px;
  background: #ffffff;
  border: 1px solid #d1d5dc;
  border-radius: 6px;
  padding: 0 12px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  color: #101828;

  &::placeholder {
    color: #99a1af;
  }

  &:focus {
    outline: none;
    border-color: #0c4ca3;
  }
`;

// ─── 버튼 영역 ───────────────────────────────────────────────────
export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const OutlineButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px 0 12px;
  background: transparent;
  border: 1.5px solid #0c4ca3;
  border-radius: 4px;
  cursor: pointer;

  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: normal;
  letter-spacing: -0.28px;
  text-align: center;
  color: #0c4ca3;
  white-space: nowrap;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: rgba(12, 76, 163, 0.05);
  }
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px 0 12px;
  background: #0c4ca3;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  font-family: "Pretendard", sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: normal;
  letter-spacing: -0.28px;
  text-align: center;
  color: #f9fafb;
  white-space: nowrap;

  svg {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: #0a3d85;
  }

  &:disabled {
    background: #b4c8e2;
    cursor: not-allowed;
  }
`;

export const DisabledButton = styled(PrimaryButton)`
  background: #b4c8e2;
  cursor: not-allowed;

  &:hover {
    background: #b4c8e2;
  }
`;

// ─── 처리 섹션 컨테이너 ──────────────────────────────────────────
export const ProcessContainer = styled.div`
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #d1d5dc;
  border-radius: 6px;
  padding: 16px;
  overflow: hidden;
`;

export const ProcessContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ProcessRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const ProcessInputButton = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ProcessLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  width: 80px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: normal;
  letter-spacing: -0.28px;
  color: #364153;
  white-space: nowrap;
`;

export const ResultList = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
`;

export const ResultLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  width: 55px;
  overflow: hidden;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: normal;
  letter-spacing: -0.28px;
  color: #6a7282;
  white-space: nowrap;
`;

export const ResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: normal;
  letter-spacing: -0.28px;
  color: #4a5565;
  white-space: nowrap;
`;

export const ResultCount = styled.span`
  display: flex;
  align-items: center;
  gap: 1px;
`;

export const CountValue = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  color: #0c4ca3;
`;

export const Divider = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: normal;
  letter-spacing: -0.28px;
  color: #d1d5dc;
`;

export const CompletedText = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 14px;
  line-height: normal;
  letter-spacing: -0.28px;
  color: transparent;
`;

// ─── 그리드 섹션 ─────────────────────────────────────────────────
export const GridSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
`;

export const GridHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const GridTitle = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 16px;
  line-height: normal;
  letter-spacing: -0.32px;
  color: #1e2939;
`;

export const GridCount = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  line-height: 0;
  letter-spacing: -0.32px;
  color: #364153;
`;

export const GridCountValue = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  color: #0c4ca3;
`;

export const GridContainer = styled.div`
  position: relative;
  width: 100%;
  height: 430px;
  overflow: hidden;

  .ag-header-cell-comp-wrapper {
    justify-content: center;
  }

  .ag-checkbox .ag-input-wrapper {
    justify-content: center;
  }

  .ag-header {
    background-color: #6a7282;
    border-radius: 6px 6px 0 0;
  }

  .ag-header-cell-label {
    justify-content: center;
  }

  .ag-header-cell-text {
    font-family: "Pretendard", sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: white;
  }

  .ag-row {
    background: white;
    border-bottom: 1px solid rgba(12, 76, 163, 0.05);
  }

  .ag-row-selected {
    background: rgba(12, 76, 163, 0.1);
  }

  .ag-cell {
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: "Pretendard", sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: black;
    border-right: 1px solid rgba(12, 76, 163, 0.05);
  }
`;

// ─── 테이블 스타일 ───────────────────────────────────────────────
export const Table = styled.div`
  width: 100%;
  border-radius: 6px 6px 0 0;
  overflow: hidden;
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  background: #6a7282;
  border-radius: 6px 6px 0 0;
`;

export const TableHeaderCell = styled.div<{ $width: number; $first?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: ${({ $width }) => $width}px;
  padding: 10px;
  border-right: 1px solid rgba(12, 76, 163, 0.05);
  ${({ $first }) => $first && `border-left: 1px solid rgba(12, 76, 163, 0.05);`}

  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: normal;
  color: #ffffff;
  white-space: nowrap;
`;

export const TableRow = styled.div<{ $selected?: boolean; $even?: boolean }>`
  display: flex;
  align-items: center;
  height: 40px;
  background: ${({ $selected }) =>
    $selected ? "rgba(12, 76, 163, 0.1)" : "#ffffff"};
  border-bottom: 1px solid rgba(12, 76, 163, 0.05);
`;

export const TableCell = styled.div<{
  $width: number;
  $first?: boolean;
  $align?: "left" | "center" | "right";
}>`
  display: flex;
  align-items: center;
  justify-content: ${({ $align }) =>
    $align === "left"
      ? "flex-start"
      : $align === "right"
        ? "flex-end"
        : "center"};
  height: 100%;
  width: ${({ $width }) => $width}px;
  padding: 10px;
  border-right: 1px solid rgba(12, 76, 163, 0.05);
  ${({ $first }) => $first && `border-left: 1px solid rgba(12, 76, 163, 0.05);`}

  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: normal;
  color: #000000;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const CellNo = styled.span`
  font-size: 12px;
`;

export const CellMedium = styled.span`
  font-weight: 500;
`;

export const Checkbox = styled.div<{ $checked?: boolean }>`
  width: 14px;
  height: 14px;
  border-radius: 2px;
  border: 1px solid
    ${({ $checked }) => ($checked ? "#ffffff" : "rgba(12, 76, 163, 0.1)")};
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: 14px;
    height: 14px;
    color: #0c4ca3;
  }
`;

// ─── 스크롤바 (선택적) ───────────────────────────────────────────
export const ScrollbarTrack = styled.div`
  position: absolute;
  right: 0;
  top: 30px;
  width: 10px;
  height: 360px;
  background: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 2px;
`;

export const ScrollbarThumb = styled.div`
  width: 6px;
  height: 109px;
  background: #a2a2a2;
  border-radius: 20px;
`;

// ─── 레거시 호환 ─────────────────────────────────────────────────
export const InfoHeader = styled.div`
  display: flex;
  margin-bottom: 16px;
  gap: 10px;
`;

export const AssetCount = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.black60 || "#4a5565"};
  span {
    color: ${({ theme }) => theme.colors?.primary100 || "#0c4ca3"};
  }
`;

export const SubTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors?.black90 || "#1e2939"};
  margin-bottom: 18px;
`;

export const FilterContainer = styled.div`
  position: relative;
  border: 1px solid #d1d5dc;
  padding: 16px;
  background: white;
  border-radius: 6px;
  margin-bottom: 20px;
`;

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 440px;
  position: relative;
  margin-right: 20px;
  margin-bottom: 6px;

  span {
    font-size: 1.4rem;
    white-space: nowrap;
  }
`;

export const Circle = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors?.black38 || "#99a1af"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 500;
  flex-shrink: 0;
`;

export const Em = styled.em`
  color: ${({ theme }) => theme.colors?.primary100 || "#0c4ca3"};
  font-style: normal;
  font-weight: 600;
  margin: 0 2px;
`;
