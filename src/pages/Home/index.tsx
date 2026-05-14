import { PageTemplate } from "@/components/template/PageTemplate";
import { PageHeader } from "@/components/atoms/PageHeader";

/**
 * 홈/대시보드 페이지
 */
export default function HomePage() {
  return (
    <PageTemplate title="대시보드">
      <PageHeader title="대시보드" />
      {/* TODO: 대시보드 컨텐츠 추가 */}
    </PageTemplate>
  );
}
