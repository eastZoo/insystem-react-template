import styled from "styled-components";

export const SidemenuSection = styled.section`
  grid-area: MN;
  display: grid;
  width: 100%;
  height: 100svh;
  background: ${(props) => props.theme.colors.black90};
  grid-template-rows: 52px auto;
`;
