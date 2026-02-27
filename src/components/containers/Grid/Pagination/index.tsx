import React, { useState } from "react";
import * as S from "./Pagination.style";
import { ReactComponent as IconArrowL } from "../../../../styles/assets/svg/icon_page_arrow_l.svg";
import { ReactComponent as IconArrowR } from "../../../../styles/assets/svg/icon_page_arrow_r.svg";

interface PagignationProps {
  gridRef: any;
  pageSize: number;
  total: number;
  onPageSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Pagignation = ({
  gridRef,
  pageSize,
  total,
  onPageSizeChange,
}: PagignationProps) => {
  const totalPages = Math.ceil(total / pageSize);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const goToPage = (page: number) => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.paginationGoToPage(page);
      setCurrentPage(page);
    }
  };

  const renderPageButtons = () => {
    const buttons: any[] = [];

    const endPage = totalPages - 1;

    if (totalPages <= 10) {
      for (let i = 0; i < totalPages; i++) {
        buttons.push(
          <S.PagingNumberButton
            key={i}
            onClick={() => goToPage(i)}
            $active={currentPage === i ? true : false}
          >
            {i + 1}
          </S.PagingNumberButton>
        );
      }
      return buttons;
    }

    buttons.push(
      <S.PagingNumberButton
        key={0}
        onClick={() => goToPage(0)}
        $active={currentPage === 0 ? true : false}
      >
        {1}
      </S.PagingNumberButton>
    );

    if (currentPage > 3) {
      buttons.push(<span key="start-ellipsis">...</span>);
    }

    const middleButtons = Array.from({ length: 4 }, (_, index) => {
      let startPage = currentPage - 2;
      if (currentPage < 4) {
        startPage = 1;
      }

      if (totalPages - currentPage < 5) {
        startPage = totalPages - 5;
      }
      const i = startPage + index;
      return (
        <S.PagingNumberButton
          key={i}
          onClick={() => goToPage(i)}
          $active={currentPage === i ? true : false}
        >
          {i + 1}
        </S.PagingNumberButton>
      );
    });

    buttons.push(...middleButtons);

    if (totalPages - currentPage >= 5) {
      buttons.push(<span key="end-ellipsis">...</span>);
    }

    buttons.push(
      <S.PagingNumberButton
        key={endPage}
        onClick={() => goToPage(endPage)}
        $active={currentPage === endPage ? true : false}
      >
        {endPage + 1}
      </S.PagingNumberButton>
    );

    return buttons;
  };

  return (
    <S.Pagination>
      <S.PageSizeBox>
        <span>Per Page</span>
        <select value={pageSize} onChange={onPageSizeChange}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </S.PageSizeBox>

      <S.PagingBox>
        <S.PagingArrowButton
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <IconArrowL width={26} height={26} />
        </S.PagingArrowButton>

        {renderPageButtons()}

        <S.PagingArrowButton
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
        >
          <IconArrowR width={26} height={26} />
        </S.PagingArrowButton>
      </S.PagingBox>
    </S.Pagination>
  );
};
