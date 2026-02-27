import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    shadows: {
      popup: string;
      modal: string;
      field: string;
      item: string;
      card: string;
    };

    colors: {
      // Colors
      primary100: string;
      primary60: string;
      primary50: string;
      primary38: string;
      primary10: string;
      primary6: string;
      primary5: string;
      primaryHover: string;
      secondary100: string;

      // Basic
      white100: string;
      white80: string;
      white60: string;
      white38: string;
      white12: string;
      black100: string;
      black90: string;
      black80: string;
      black70: string;
      black60: string;
      black38: string;
      black30: string;
      black12: string;
      black10: string;
      black8: string;
      black5: string;
      black4: string;
      black2: string;
      gray100: string;

      // Status
      [greenStatus: string]: string;
      [greenStatus8: string]: string;
      greenStatusHover: string;
      [yellowStatus: string]: string;
      [redStatus: string]: string;
      [redStatus5: string]: string;
      [redStatus8: string]: string;
      redStatusHover: string;
      [blueStatus: string]: string;
      [grayStatus: string]: string;

      // Component
      flowLabelBox: string;
      labelBox: string;
      scrollTrack: string;
      authBackground: string;
      shipMonitorBackgroud: string;
      shipMonitorShade: string;
      shipMonitorBorder: string;
    };
  }
}
