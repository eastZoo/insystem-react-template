import React, { useState } from "react";
import * as S from "./buttons.style";

interface ButtonsProps {
  type: "reset" | "submit" | "button" | undefined;
  size: "xsm" | "sm" | "md" | "md-icon" | "lg";
  layout:
  | "primary"
  | "secondary"
  | "highlight"
  | "warn"
  | "destructive"
  | "ghost"
  | "icon"
  | "find"
  | "cancelModal"
  | "outline"
  | "selectCondition"
  | "selectCondition active"
  | "disabled";
  label?: string;
  form?: string;
  onClick?: any;
  autoFocus?: any;
  children?: React.ReactElement;
  icon?: React.ReactElement;
  disabled?: boolean;
  tooltip?: React.ReactElement;
  tooltipPosition?: "left" | "center" | "right";
}

export const Buttons = (props: ButtonsProps) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <S.Buttons
      type={props.type}
      $size={props.size}
      $layout={props.layout}
      onClick={props.onClick}
      form={props.form && props.form}
      autoFocus={props.autoFocus}
      disabled={props.disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {props.icon && props.icon}
      {props.label}
      {props.children}
      {props.tooltip && showTooltip && (
        <S.ButtonTooltipBox
          $tooltipPosition={
            props.tooltipPosition ? props.tooltipPosition : "right"
          }
        >
          {props.tooltip}
        </S.ButtonTooltipBox>
      )}
    </S.Buttons>
  );
};
