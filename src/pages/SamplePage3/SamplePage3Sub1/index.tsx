import { PageContent } from "@/components/organisms/PageContent";
import * as S from "./SamplePage3Sub1.style";

export default function SamplePage3Sub1() {
  return (
    <PageContent
      depth01Title="샘플 페이지3"
      depth02Title="샘플 페이지3-1"
      $height="100%"
      $gap="0"
    >
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", height: "100%", minHeight: 0 }}>
        <S.SubTitle>샘플 페이지3-1</S.SubTitle>
      </div>
    </PageContent>
  );
}
