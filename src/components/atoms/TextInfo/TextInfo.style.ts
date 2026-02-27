import styled from "styled-components";

export const TextInfoBox = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const TextInfoTitle = styled.div`
  color: ${(props) => props.theme.colors.black60};
  font-size: 1.1rem;
  font-weight: 500;
`;

export const TextInfo = styled.div`
  font-size: 1.4rem;
  font-weight: 500;
`;
