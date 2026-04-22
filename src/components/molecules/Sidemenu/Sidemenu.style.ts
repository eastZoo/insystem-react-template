import styled from "styled-components";

export const SidemenuSection = styled.section`
  grid-area: MN;
  display: grid;
  width: 100%;
  height: 100svh;
  background: linear-gradient(
    to left,
    ${(props) => props.theme.colors.sidemenuBackgroundLight},
    ${(props) => props.theme.colors.sidemenuBackground}
  );
  grid-template-rows: 90px 1fr auto;
`;
