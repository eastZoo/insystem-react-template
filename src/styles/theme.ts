import type { DefaultTheme } from "styled-components";

export const theme: DefaultTheme = {
  shadows: {
    popup: "0px 2px 10px 0px rgba(0,0,0,0.1)",
    modal: "0px 8px 24px 0px rgba(0,0,0,.14)",
    field: "0px 6px 16px 0px rgba(0,0,0,.06)",
    item: "0px 5px 10px 0px rgba(0,0,0,.08)",
    card: "0px 12px 12px 0px rgba(0,0,0,.10)",
  },

  colors: {
    // ── Achromatic Primary (브랜드 포인트: 진한 회색/차콜) ─────────────
    primary100: "#1F1F1F",       // 차콜 — 주요 강조
    primary60: "#1F1F1F99",
    primary50: "#1F1F1F80",
    primary38: "#1F1F1F61",
    primary10: "#1F1F1F19",
    primary6: "#1F1F1F0f",
    primary5: "#1F1F1F0d",
    primaryHover: "#111111",     // 차콜 hover (더 진하게)
    secondary100: "#3D3D3D",     // 다크 그레이

    // ── White scale ────────────────────────────────────────────────────
    white100: "#FFFFFF",
    white80: "#FFFFFFcc",
    white60: "#FFFFFF99",
    white38: "#FFFFFF61",
    white12: "#FFFFFF1f",

    // ── Black scale ────────────────────────────────────────────────────
    black100: "#000000",
    black90: "#0A0A0A",
    black80: "#141414",
    black70: "#1F1F1F",
    black60: "#2E2E2E",
    black38: "#5C5C5C",
    black30: "#707070",
    black12: "#E0E0E0",
    black10: "#E8E8E8",
    black8: "#EFEFEF",
    black5: "#F5F5F5",
    black4: "#F9F9F9",
    black2: "#FAFAFA",

    // ── Gray scale ─────────────────────────────────────────────────────
    gray100: "#CCCCCC",          // 기본 경계선/구분선

    // ── Status (무채색 기반으로 재정의) ────────────────────────────────
    greenStatus: "#4A4A4A",      // 성공 → 진회색
    greenStatus8: "#4A4A4A14",
    greenStatusHover: "#333333",
    yellowStatus: "#8A8A8A",     // 경고 → 중간 회색
    redStatus: "#2E2E2E",        // 에러 → 다크 그레이
    redStatus5: "#2E2E2E0d",
    redStatus8: "#2E2E2E14",
    redStatusHover: "#1A1A1A",
    blueStatus: "#5A5A5A",       // 정보 → 회색
    grayStatus: "#9E9E9E",       // 비활성

    // ── Component ──────────────────────────────────────────────────────
    flowLabelBox: "#555555",
    labelBox: "#3D3D3D",
    scrollTrack: "#DEDEDE",
    authBackground: "#00000033",
    shipMonitorBackgroud: "#B0B0B0",
    shipMonitorShade: "#9A9A9A",
    shipMonitorBorder: "#888888",
  },
};
