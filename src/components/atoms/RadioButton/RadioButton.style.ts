import styled from "styled-components";

export const RadioButtonContainer = styled.div<{
  layout?: "flex" | "grid";
  $gridColumns?: number;
}>`
  display: ${(props) => (props.layout === "grid" ? "grid" : "flex")};

  ${(props) =>
    props.layout === "grid" &&
    props.$gridColumns &&
    `
    grid-template-columns: repeat(${props.$gridColumns}, auto);
    gap: 12px 20px;
  `}

  ${(props) =>
    props.layout !== "grid" &&
    `
    gap: 16px;
  `}

  align-items: center;
`;

export const RadioButtonLabel = styled.label`
  display: flex;
  gap: 10px;

  font-family: Pretendard;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.44;
  letter-spacing: -0.32px;
  text-align: left;
  color: #333;
  cursor: pointer;
  white-space: nowrap;
`;

export const RadioButtonInput = styled.input`
  width: 25px;
  height: 25px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  border: 2px solid #ddd;
  border-radius: 50%;
  position: relative;
  cursor: pointer;

  &:checked {
    border: 2px solid ${({ theme }) => theme.colors.primary100};
    background-color: #fff;
  }

  &:checked::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 70%;
    height: 70%;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.primary100};
  }
`;
