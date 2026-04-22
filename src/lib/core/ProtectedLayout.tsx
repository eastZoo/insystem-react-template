import type { ReactElement } from "react";
import { MainTemplate } from "@/components/template/MainTemplate";
import TabContents from "@/lib/core/TabContents";

/**
 * 인증된 사용자 전용 셸(헤더·사이드·탭).
 * 탭이 없을 때 콘텐츠 영역에는 `children`(해당 라우트 페이지)이 표시됩니다.
 */
export default function ProtectedLayout({
  children,
}: {
  children: ReactElement;
}) {
  return (
    <MainTemplate defaultComponent={children}>
      <TabContents />
    </MainTemplate>
  );
}
