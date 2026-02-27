import * as S from "./PageContent.style";
import IconArrow from "@/styles/assets/svg/icon_title_arrow.svg?react";

interface PageContentProps {
  depth01Title: string;
  depth02Title?: string;
  depth03Title?: string;
  searchBox?: React.ReactElement;
  children: React.ReactElement;
  $height?: string;
  $gap?: string;
}

export const PageContent = ({
  depth01Title,
  depth02Title,
  depth03Title,
  searchBox,
  children,
  $height,
  $gap,
}: PageContentProps) => {
  return (
    <S.PageContent>
      <S.PageTitBox>
        {depth01Title}
        {depth02Title && (
          <>
            <IconArrow />
            {depth02Title}
          </>
        )}
        {depth03Title && (
          <>
            <IconArrow />
            {depth03Title}
          </>
        )}
      </S.PageTitBox>
      {searchBox && searchBox}
      <S.PageContentBox
        $shipInfoSet={searchBox ? true : false}
        $height={$height}
        $gap={$gap}
      >
        {children}
      </S.PageContentBox>
    </S.PageContent>
  );
};
