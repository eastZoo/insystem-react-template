import styled from "styled-components";

export const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  height: 100%;
  align-items: flex-end;
`;

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const PageTitle = styled.h1`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 20px;
  color: #101828;
  letter-spacing: -0.4px;
`;

export const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
`;

export const PrimaryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 36px;
  padding: 0 12px;
  background-color: #0c4ca3;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  span {
    font-family: "Pretendard", sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: #f9fafb;
    letter-spacing: -0.28px;
    white-space: nowrap;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #f9fafb;
  }

  &:hover {
    background-color: #0a3d85;
  }
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
`;

export const SectionTitle = styled.h2`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #364153;
  letter-spacing: -0.32px;
  white-space: nowrap;
`;

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  padding: 16px;
  background: white;
  border: 1px solid #d1d5dc;
  border-radius: 6px;
  overflow: hidden;
`;

export const FormArea = styled.div<{ $width?: string }>`
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: flex-start;
  justify-content: center;
  width: ${({ $width }) => $width || "720px"};
`;

export const FormRow = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

export const FormRowFull = styled.div`
  display: flex;
  gap: 48px;
  align-items: flex-start;
  width: 100%;
`;

export const InputGroup = styled.div<{ $flex?: number }>`
  display: flex;
  gap: 8px;
  align-items: center;
  height: 36px;
  ${({ $flex }) => $flex && `flex: ${$flex}; min-width: 0;`}
`;

export const Label = styled.label`
  display: flex;
  gap: 2px;
  align-items: center;
  width: 80px;
  flex-shrink: 0;

  span {
    font-family: "Pretendard", sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: #364153;
    letter-spacing: -0.28px;
    white-space: nowrap;
  }
`;

export const RadioList = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
`;

export const RadioItem = styled.div<{ $active?: boolean }>`
  display: flex;
  gap: 9px;
  align-items: center;
  cursor: pointer;

  .radio-circle {
    width: 20px;
    height: 20px;
    border: 1.5px solid ${({ $active }) => ($active ? "#0c4ca3" : "#d1d5dc")};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
  }

  .radio-inner {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #0c4ca3;
  }

  span {
    font-family: "Pretendard", sans-serif;
    font-weight: 500;
    font-size: 14px;
    color: #364153;
    letter-spacing: -0.28px;
    white-space: nowrap;
  }
`;

export const DateRangeGroup = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;

  .separator {
    font-family: "Pretendard", sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: black;
    letter-spacing: -0.24px;
  }
`;

export const SelectInput = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 116px;
  height: 36px;
  padding: 0 8px 0 12px;
  background: white;
  border: 1px solid #d1d5dc;
  border-radius: 6px;

  span {
    font-family: "Pretendard", sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: #101828;
    letter-spacing: -0.24px;
  }

  select {
    width: 100%;
    height: 100%;
    border: none;
    background: transparent;
    font-family: "Pretendard", sans-serif;
    font-weight: 400;
    font-size: 12px;
    color: #101828;
    letter-spacing: -0.24px;
    cursor: pointer;
    outline: none;
  }
`;

export const TextInput = styled.input`
  flex: 1;
  height: 36px;
  min-width: 0;
  padding: 0 12px;
  background: white;
  border: 1px solid #d1d5dc;
  border-radius: 6px;
  font-family: "Pretendard", sans-serif;
  font-weight: 400;
  font-size: 12px;
  color: #101828;
  letter-spacing: -0.24px;

  &::placeholder {
    color: #99a1af;
  }

  &:focus {
    outline: none;
    border-color: #0c4ca3;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

export const OutlineButton = styled.button`
  display: flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 8px 0 12px;
  background: white;
  border: 1.5px solid #0c4ca3;
  border-radius: 4px;
  cursor: pointer;

  span {
    font-family: "Pretendard", sans-serif;
    font-weight: 600;
    font-size: 14px;
    color: #0c4ca3;
    letter-spacing: -0.28px;
    white-space: nowrap;
  }

  svg {
    width: 18px;
    height: 18px;
    color: #0c4ca3;
  }

  &:hover {
    background-color: rgba(12, 76, 163, 0.05);
  }
`;

export const ListSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-end;
  width: 100%;
`;

export const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 36px;
  width: 100%;
`;

export const ListTitleGroup = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

export const ListTitle = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 700;
  font-size: 16px;
  color: #1e2939;
  letter-spacing: -0.32px;
`;

export const ListCount = styled.span`
  font-family: "Pretendard", sans-serif;
  font-weight: 500;
  font-size: 16px;
  color: #364153;
  letter-spacing: -0.32px;

  strong {
    font-weight: 700;
    color: #0c4ca3;
  }
`;

export const GridContainer = styled.div`
  width: 100%;
  height: 430px;

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

/* 기존 호환성 유지를 위한 스타일 */
export const SubTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #364153;
  letter-spacing: -0.32px;
`;

export const FilterContainer = styled.div`
  position: relative;
  border: 1px solid #d1d5dc;
  padding: 16px;
  background: white;
  border-radius: 6px;
  margin-bottom: 20px;
`;

export const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
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

export const SelectBox = styled.div`
  gap: 10px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export const FilterDateBox = styled.div`
  gap: 12px;
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: center;
`;

export const RowGroup = styled.div`
  display: flex;
  align-items: center;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const InfoHeader = styled.div`
  display: flex;
  margin-bottom: 16px;
  gap: 10px;
`;

export const AssetCount = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #364153;
  span {
    font-weight: 700;
    color: #0c4ca3;
  }
`;

export const FilterButtons = styled.div`
  gap: 6px;
  position: absolute;
  right: 20px;
  display: flex;
`;
