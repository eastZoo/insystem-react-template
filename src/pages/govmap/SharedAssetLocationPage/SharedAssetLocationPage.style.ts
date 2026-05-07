import styled from "styled-components";

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

export const SubTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.black90};
  margin-bottom: 18px;
`;

export const AssetAction = styled.div`
  position: relative;
  border: 2px solid ${(props) => props.theme.colors.black12};
  padding: 20px;
  background: white;
  border-radius: 8px;
  margin-bottom: 20px;
`;

export const GridContainer = styled.div`
  width: 100%;
  margin-top: 16px;
  display: flex;
  flex-direction: column;

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

export const ResultItem = styled.li`
  margin-left: 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.black70};
  margin-bottom: 8px;
`;

export const ResultList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Circle = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colors.black38};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 500;
  flex-shrink: 0;
`;

export const Em = styled.em`
  color: ${({ theme }) => theme.colors.primary100};
  font-style: normal;
  font-weight: 600;
  margin: 0 2px;
`;
