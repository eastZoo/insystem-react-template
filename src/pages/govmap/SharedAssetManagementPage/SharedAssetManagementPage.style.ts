import styled from "styled-components";

export const SubTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.black90};
  margin-bottom: 18px;
`;

export const GridContainer = styled.div`
  width: 100%;
  margin-top: 16px;

  .ag-header-cell-comp-wrapper {
    justify-content: center;
  }

  .ag-checkbox .ag-input-wrapper {
    justify-content: center;
  }

  .ag-header-group-cell-label {
    background: transparent;
  }

  .ag-theme-quartz {
    .ag-header-row:nth-child(2) .ag-header-group-cell {
      background-color: #eee !important;
    }
  }
`;

export const FilterContainer = styled.div`
  position: relative;
  border: 2px solid ${(props) => props.theme.colors.black12};
  padding: 20px;
  background: white;
  border-radius: 8px;
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

export const Label = styled.label<{ required?: boolean }>`
  color: #364153;
  height: 100%;
  padding: 10px 10px 20px 12px;
  font-size: 16px;
  min-width: 110px;
  letter-spacing: -0.02em;

  &::after {
    color: #ef4444;
    content: ${({ required }) => (required ? "'*'" : "''")};
  }
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
  color: ${({ theme }) => theme.colors.black60};
  span {
    color: ${({ theme }) => theme.colors.primary100};
  }
`;

export const FilterButtons = styled.div`
  gap: 6px;
  position: absolute;
  right: 20px;
  display: flex;
`;
