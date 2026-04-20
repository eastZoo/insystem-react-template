import type { SVGAttributes } from "react";

/** Heroicons 스타일 outline — `currentColor`로 버튼/텍스트 색에 맞춤 */
const paths = {
  login: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
    />
  ),
} as const;

export type IconName = keyof typeof paths;

type IconProps = {
  name: IconName;
} & Omit<SVGAttributes<SVGSVGElement>, "children">;

/**
 * 이름별 SVG 아이콘. 새 이름은 `paths`에 동일 키로 path를 추가하면 됩니다.
 */
export function Icon({
  name,
  width = "1.125em",
  height = "1.125em",
  "aria-hidden": ariaHidden = true,
  ...rest
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      width={width}
      height={height}
      aria-hidden={ariaHidden}
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
