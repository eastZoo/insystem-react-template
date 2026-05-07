import type { ReactElement } from "react";
import { MainTemplate } from "@/components/template/MainTemplate";
import TabContents from "@/lib/core/TabContents";
import useMenuData from "@/lib/hooks/useMenuData";

/**
 * 인증된 사용자 전용 셸(헤더·사이드·탭).
 * 탭이 없을 때 콘텐츠 영역에는 `children`(해당 라우트 페이지)이 표시됩니다.
 *
 * useMenuData: 사용자 메뉴 데이터를 API에서 가져와 상태에 저장
 */
export default function ProtectedLayout({
  children,
}: {
  children: ReactElement;
}) {
  // 사용자 메뉴 데이터 로드 (API → menuState)
  useMenuData();

  return (
    <MainTemplate defaultComponent={children}>
      <TabContents />
    </MainTemplate>
  );
}
