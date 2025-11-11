import type { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  colors: {
    primary: "#3b82f6",
    secondary: "#10b981",
    text: "#111827",
    bg: "#ffffff",
    muted: "#6b7280",
  },
  radius: {
    sm: "6px",
    md: "10px",
    lg: "16px",
  },
  spacing: (n: number) => `${n * 4}px`,
};
