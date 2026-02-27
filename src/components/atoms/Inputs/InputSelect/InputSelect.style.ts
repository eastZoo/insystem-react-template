import styled from "styled-components";
import ImgArrow from "../../../../styles/assets/img/img_icon_arrow_down.png";

export const SelectBox = styled.div`
  display: flex;
  width: 100%;
  padding: 0 !important;
  background-image: url(${ImgArrow});
  background-repeat: no-repeat;
  background-size: 16px 16px;
  background-position: 95% center;
`;

export const Select = styled.select`
  width: 100%;
  padding: 0 30px 0 10px !important;
  border: none;
  -webkit-appearance: none;
  -mox-appearance: none;
  appearance: none;
  box-sizing: border-box;
  background: transparent;

  &::-ms-expand {
    display: none;
  }
`;

export const Placeholder = styled.option`
  color: ${(props) => props.theme.colors.black38};

  &[value=""] [disabled] {
    display: none;
  }
`;
