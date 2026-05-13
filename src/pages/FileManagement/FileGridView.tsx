/**
 * 파일 그리드 뷰 컴포넌트
 * @description 파일과 폴더를 그리드 형태로 표시하는 컴포넌트
 */
import { useMemo, useCallback } from "react";
import { type FileItem } from "./fileManagementGrid";
import {
  GridViewContainer,
  FolderGridRow,
  FolderGridItem,
  FolderTitleBox,
  FolderIcon,
  FolderName,
  FolderMoreButton,
  FileGridRow,
  FileGridItem,
  FileThumbnail,
  FileTypeIcon,
  FileTitleBox,
  FileName,
  FileInfoWrap,
  FileInfo,
  VisibilityBadge,
} from "./index.style";

/* ========================================
   아이콘 컴포넌트
   ======================================== */

/** 폴더 아이콘 */
const FolderSvgIcon = () => (
  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M16.5 14.25C16.5 14.6478 16.342 15.0294 16.0607 15.3107C15.7794 15.592 15.3978 15.75 15 15.75H3C2.60218 15.75 2.22064 15.592 1.93934 15.3107C1.65804 15.0294 1.5 14.6478 1.5 14.25V3.75C1.5 3.35218 1.65804 2.97064 1.93934 2.68934C2.22064 2.40804 2.60218 2.25 3 2.25H6.75L8.25 4.5H15C15.3978 4.5 15.7794 4.65804 16.0607 4.93934C16.342 5.22064 16.5 5.60218 16.5 6V14.25Z"
      fill="currentColor"
    />
  </svg>
);

/** 더보기(ellipsis) 아이콘 */
const EllipsisIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="6" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <circle cx="18" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

/** 기본 문서 아이콘 */
const DocumentSvgIcon = () => (
  <svg viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M33.8333 7.25H14.5C12.6159 7.25 10.8091 7.99821 9.47631 9.33109C8.14353 10.664 7.39532 12.4707 7.39532 14.3548V43.6452C7.39532 45.5293 8.14353 47.336 9.47631 48.6689C10.8091 50.0018 12.6159 50.75 14.5 50.75H43.5C45.3841 50.75 47.1909 50.0018 48.5237 48.6689C49.8565 47.336 50.6047 45.5293 50.6047 43.6452V24.0217L33.8333 7.25Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.8333 7.25V24.0217H50.6047"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19.3333 31.125H38.6667"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M19.3333 40.5417H31.8333"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

/** PDF 아이콘 */
const PdfIcon = () => (
  <svg viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M33.8333 7.25H14.5C12.6159 7.25 10.8091 7.99821 9.47631 9.33109C8.14353 10.664 7.39532 12.4707 7.39532 14.3548V43.6452C7.39532 45.5293 8.14353 47.336 9.47631 48.6689C10.8091 50.0018 12.6159 50.75 14.5 50.75H43.5C45.3841 50.75 47.1909 50.0018 48.5237 48.6689C49.8565 47.336 50.6047 45.5293 50.6047 43.6452V24.0217L33.8333 7.25Z"
      stroke="#E53935"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.8333 7.25V24.0217H50.6047"
      stroke="#E53935"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="29"
      y="42"
      fill="#E53935"
      fontSize="12"
      fontWeight="bold"
      textAnchor="middle"
      fontFamily="Pretendard"
    >
      PDF
    </text>
  </svg>
);

/** Word 문서 아이콘 */
const DocxIcon = () => (
  <svg viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M33.8333 7.25H14.5C12.6159 7.25 10.8091 7.99821 9.47631 9.33109C8.14353 10.664 7.39532 12.4707 7.39532 14.3548V43.6452C7.39532 45.5293 8.14353 47.336 9.47631 48.6689C10.8091 50.0018 12.6159 50.75 14.5 50.75H43.5C45.3841 50.75 47.1909 50.0018 48.5237 48.6689C49.8565 47.336 50.6047 45.5293 50.6047 43.6452V24.0217L33.8333 7.25Z"
      stroke="#2196F3"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.8333 7.25V24.0217H50.6047"
      stroke="#2196F3"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="29"
      y="42"
      fill="#2196F3"
      fontSize="10"
      fontWeight="bold"
      textAnchor="middle"
      fontFamily="Pretendard"
    >
      DOCX
    </text>
  </svg>
);

/** HWP 아이콘 */
const HwpIcon = () => (
  <svg viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M33.8333 7.25H14.5C12.6159 7.25 10.8091 7.99821 9.47631 9.33109C8.14353 10.664 7.39532 12.4707 7.39532 14.3548V43.6452C7.39532 45.5293 8.14353 47.336 9.47631 48.6689C10.8091 50.0018 12.6159 50.75 14.5 50.75H43.5C45.3841 50.75 47.1909 50.0018 48.5237 48.6689C49.8565 47.336 50.6047 45.5293 50.6047 43.6452V24.0217L33.8333 7.25Z"
      stroke="#00B0F0"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.8333 7.25V24.0217H50.6047"
      stroke="#00B0F0"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="29"
      y="42"
      fill="#00B0F0"
      fontSize="11"
      fontWeight="bold"
      textAnchor="middle"
      fontFamily="Pretendard"
    >
      HWP
    </text>
  </svg>
);

/** Excel 아이콘 */
const XlsxIcon = () => (
  <svg viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M33.8333 7.25H14.5C12.6159 7.25 10.8091 7.99821 9.47631 9.33109C8.14353 10.664 7.39532 12.4707 7.39532 14.3548V43.6452C7.39532 45.5293 8.14353 47.336 9.47631 48.6689C10.8091 50.0018 12.6159 50.75 14.5 50.75H43.5C45.3841 50.75 47.1909 50.0018 48.5237 48.6689C49.8565 47.336 50.6047 45.5293 50.6047 43.6452V24.0217L33.8333 7.25Z"
      stroke="#4CAF50"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.8333 7.25V24.0217H50.6047"
      stroke="#4CAF50"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="29"
      y="42"
      fill="#4CAF50"
      fontSize="10"
      fontWeight="bold"
      textAnchor="middle"
      fontFamily="Pretendard"
    >
      XLSX
    </text>
  </svg>
);

/** PPT 아이콘 */
const PptxIcon = () => (
  <svg viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M33.8333 7.25H14.5C12.6159 7.25 10.8091 7.99821 9.47631 9.33109C8.14353 10.664 7.39532 12.4707 7.39532 14.3548V43.6452C7.39532 45.5293 8.14353 47.336 9.47631 48.6689C10.8091 50.0018 12.6159 50.75 14.5 50.75H43.5C45.3841 50.75 47.1909 50.0018 48.5237 48.6689C49.8565 47.336 50.6047 45.5293 50.6047 43.6452V24.0217L33.8333 7.25Z"
      stroke="#FF5722"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M33.8333 7.25V24.0217H50.6047"
      stroke="#FF5722"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <text
      x="29"
      y="42"
      fill="#FF5722"
      fontSize="10"
      fontWeight="bold"
      textAnchor="middle"
      fontFamily="Pretendard"
    >
      PPTX
    </text>
  </svg>
);

/** 이미지 아이콘 */
const ImageIcon = () => (
  <svg viewBox="0 0 58 58" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect
      x="7"
      y="12"
      width="44"
      height="34"
      rx="4"
      stroke="#9C27B0"
      strokeWidth="3"
    />
    <circle cx="19" cy="24" r="4" stroke="#9C27B0" strokeWidth="2" />
    <path
      d="M7 38L18 27L28 37L36 29L51 44"
      stroke="#9C27B0"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ========================================
   유틸리티 함수
   ======================================== */

/**
 * 파일 확장자 추출
 * @param fileName 파일명
 * @returns 확장자 (대문자)
 */
function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1) return "";
  return fileName.substring(lastDotIndex + 1).toUpperCase();
}

/**
 * 확장자에 따른 아이콘 컴포넌트 반환
 * @param extension 파일 확장자
 * @returns 아이콘 컴포넌트
 */
function getFileIcon(extension: string): React.ReactNode {
  switch (extension.toLowerCase()) {
    case "pdf":
      return <PdfIcon />;
    case "doc":
    case "docx":
      return <DocxIcon />;
    case "hwp":
    case "hwpx":
      return <HwpIcon />;
    case "xls":
    case "xlsx":
      return <XlsxIcon />;
    case "ppt":
    case "pptx":
      return <PptxIcon />;
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "webp":
    case "svg":
      return <ImageIcon />;
    default:
      return <DocumentSvgIcon />;
  }
}

/**
 * 공개 범위 라벨 반환
 * @param visibility 공개 범위 값
 * @returns 라벨 텍스트
 */
function getVisibilityLabel(visibility: string): {
  label: string;
  variant: "team" | "private" | "public" | "pending";
} {
  switch (visibility) {
    case "team":
      return { label: "팀 공개", variant: "team" };
    case "public":
      return { label: "전체공개", variant: "public" };
    case "pending":
      return { label: "승인대기", variant: "pending" };
    default:
      return { label: "나만보기", variant: "private" };
  }
}

/* ========================================
   Props 타입 정의
   ======================================== */

interface FileGridViewProps {
  /** 파일/폴더 목록 */
  files: FileItem[];
  /** 폴더 클릭 핸들러 */
  onFolderClick?: (file: FileItem) => void;
  /** 파일 클릭 핸들러 */
  onFileClick?: (file: FileItem) => void;
  /** 더보기 버튼 클릭 핸들러 */
  onMoreClick?: (file: FileItem, event: React.MouseEvent) => void;
}

/* ========================================
   메인 컴포넌트
   ======================================== */

/**
 * 파일 그리드 뷰 컴포넌트
 */
export function FileGridView({
  files,
  onFolderClick,
  onFileClick,
  onMoreClick,
}: FileGridViewProps) {
  /** 폴더와 파일 분리 */
  const { folders, fileItems } = useMemo(() => {
    const folders = files.filter((f) => f.type === "folder");
    const fileItems = files.filter((f) => f.type === "file");
    return { folders, fileItems };
  }, [files]);

  /** 폴더 클릭 핸들러 */
  const handleFolderClick = useCallback(
    (file: FileItem) => {
      onFolderClick?.(file);
    },
    [onFolderClick]
  );

  /** 파일 클릭 핸들러 - 새 탭에서 파일 열기 */
  const handleFileClick = useCallback(
    (file: FileItem) => {
      // 파일인 경우 새 탭에서 열기
      if (file.file_id && file.file_seq !== undefined) {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
        const viewerUrl = `${apiBaseUrl}/api/app/collection/file/view?fileId=${file.file_id}&fileSeq=${file.file_seq}`;
        window.open(viewerUrl, "_blank");
      }
      onFileClick?.(file);
    },
    [onFileClick]
  );

  /** 더보기 버튼 클릭 핸들러 */
  const handleMoreClick = useCallback(
    (file: FileItem, event: React.MouseEvent) => {
      event.stopPropagation();
      onMoreClick?.(file, event);
    },
    [onMoreClick]
  );

  return (
    <GridViewContainer>
      {/* 폴더 그리드 */}
      {folders.length > 0 && (
        <FolderGridRow>
          {folders.map((folder) => (
            <FolderGridItem
              key={folder.id}
              onClick={() => handleFolderClick(folder)}
              onDoubleClick={() => handleFolderClick(folder)}
            >
              <FolderTitleBox>
                <FolderIcon>
                  <FolderSvgIcon />
                </FolderIcon>
                <FolderName>{folder.name}</FolderName>
              </FolderTitleBox>
              <FolderMoreButton
                onClick={(e) => handleMoreClick(folder, e)}
                title="더보기"
              >
                <EllipsisIcon />
              </FolderMoreButton>
            </FolderGridItem>
          ))}
        </FolderGridRow>
      )}

      {/* 파일 그리드 */}
      {fileItems.length > 0 && (
        <FileGridRow>
          {fileItems.map((file) => {
            const extension = getFileExtension(file.name);
            const visibility = getVisibilityLabel(file.visibility);

            return (
              <FileGridItem key={file.id} onClick={() => handleFileClick(file)}>
                {/* 썸네일 */}
                <FileThumbnail>
                  <FileTypeIcon>{getFileIcon(extension)}</FileTypeIcon>
                </FileThumbnail>

                {/* 파일 정보 */}
                <FileTitleBox>
                  <FileName title={file.name}>{file.name}</FileName>
                  <FileInfoWrap>
                    <FileInfo>
                      <span>{extension}</span>
                      {file.size && (
                        <>
                          <span>·</span>
                          <span>{file.size}</span>
                        </>
                      )}
                    </FileInfo>
                    <VisibilityBadge $variant={visibility.variant}>
                      {visibility.label}
                    </VisibilityBadge>
                  </FileInfoWrap>
                </FileTitleBox>
              </FileGridItem>
            );
          })}
        </FileGridRow>
      )}
    </GridViewContainer>
  );
}

export default FileGridView;
