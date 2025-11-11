import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      text: string;
      bg: string;
      muted: string;
    };
    radius: {
      sm: string;
      md: string;
      lg: string;
    };
    spacing: (n: number) => string;
  }
}
