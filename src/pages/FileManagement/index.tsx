/**
 * 파일 관리 페이지
 * @description 파일/폴더 업로드, 조회, 수정, 삭제 기능을 제공하는 메인 페이지
 */
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { RowDoubleClickedEvent } from "ag-grid-community";
import type { AgGridReact } from "ag-grid-react";
import { IsInputSearch, IsSelect, IsFileDrop } from "insystem-atoms";
import {
  PlusIcon,
  DocumentIcon,
  DocumentCheckIcon,
  ClockIcon,
  SearchIcon,
  GridIcon,
  ListIcon,
  UploadIcon,
  FileUploadIcon,
  FolderUploadIcon,
  FolderCreateIcon,
  MoveIcon,
  TrashIcon,
} from "@/styles/icons";
import { UploadModal } from "@/components/molecules/UploadModal";
import { CreateFolderModal } from "@/components/atoms/CreateFolderModal";
import { EditFileModal } from "@/components/atoms/EditFileModal";
import {
  MoveFileModal,
  type FolderItem,
} from "@/components/atoms/MoveFileModal";
import { Alert } from "@/components/atoms/Alert";
import { Pagination } from "@/components/atoms/Pagination";
import Grid from "@/components/atoms/Grid";
import {
  type FileItem,
  type FileManagementGridContext,
  useFileManagementColumnDefs,
} from "./fileManagementGrid";
import { FileGridView } from "./FileGridView";
import {
  PageContainer,
  PageHeader,
  PageTitle,
  MainContainer,
  Content,
  ContentHeader,
  HeaderTextGroup,
  MainTitle,
  Description,
  UploadButtonWrapper,
  UploadButton,
  UploadMenu,
  MenuItem,
  MenuItemIcon,
  MenuItemLabel,
  MenuDivider,
  StatusCardGrid,
  StatusCard,
  CardIconWrap,
  CardTextGroup,
  CardNumber,
  CardLabel,
  TableContainer,
  TableContent,
  PaginationFooter,
  SearchBar,
  SearchLeft,
  SearchInputWrapper,
  SelectWrapper,
  SearchRight,
  ViewToggle,
  ViewButton,
  DragDropArea,
  SelectionActionBar,
  ActionBarItem,
  SelectionCount,
  SelectionCountNumber,
  SelectionCountText,
  ActionButton,
  VisibilitySelectWrapper,
  FileListContainer,
  FileListItem,
  FileListIcon,
  FileListName,
} from "./index.style";
import {
  useUploadFiles,
  useFileList,
  useCollectionStats,
  useCreateFolder,
  useMoveItem,
  useDeleteItem,
  useFolderTree,
  useUpdateFolder,
  useUpdateFile,
  type FileListItem as ApiFileListItem,
} from "@/lib/hooks/useCollection";
import type { AuthLevelType } from "@/components/molecules/UploadModal";

/* ========================================
   필터 옵션 상수
   ======================================== */

/** 파일 유형 필터 옵션 */
const FILE_TYPE_OPTIONS = [
  { value: "", label: "파일 유형" },
  { value: "pdf", label: "PDF" },
  { value: "doc", label: "DOC/DOCX" },
  { value: "img", label: "이미지" },
  { value: "etc", label: "기타" },
];

/** 날짜 필터 옵션 */
const DATE_OPTIONS = [
  { value: "", label: "날짜" },
  { value: "today", label: "오늘" },
  { value: "week", label: "최근 7일" },
  { value: "month", label: "최근 30일" },
  { value: "all", label: "전체" },
];

/** 공개 범위 필터 옵션 */
const SCOPE_OPTIONS = [
  { value: "", label: "공개 범위" },
  { value: "public", label: "전체 공개" },
  { value: "team", label: "팀 공개" },
  { value: "private", label: "비공개" },
];

/** 벡터화 상태 필터 옵션 */
const VECTOR_OPTIONS = [
  { value: "", label: "벡터화 상태" },
  { value: "complete", label: "완료" },
  { value: "pending", label: "대기중" },
  { value: "error", label: "오류" },
];

/* ========================================
   컴포넌트
   ======================================== */

/**
 * 파일 관리 페이지 컴포넌트
 */
export default function FileManagementPage() {
  const navigate = useNavigate();

  // 현재 폴더 코드 상태
  const [currentFolderCode, setCurrentFolderCode] = useState("ROOT");

  /* ===== 상태 관리 ===== */

  // 검색 및 필터 상태
  const [searchKeyword, setSearchKeyword] = useState("");
  const [fileType, setFileType] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [scopeFilter, setScopeFilter] = useState("");
  const [vectorFilter, setVectorFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    const saved = localStorage.getItem("fileManagement_viewMode");
    return saved === "grid" ? "grid" : "list";
  });

  // 업로드 메뉴 및 모달 상태
  const [showUploadMenu, setShowUploadMenu] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadModalType, setUploadModalType] = useState<"file" | "folder">(
    "file"
  );
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);

  // 수정 모달 상태
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFile, setEditingFile] = useState<FileItem | null>(null);

  // 이동 모달 상태
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [movingFile, setMovingFile] = useState<FileItem | null>(null);

  // 삭제 확인 알림 상태
  const [filePendingTrash, setFilePendingTrash] = useState<FileItem | null>(
    null
  );

  // 공개 범위 변경 모달 상태
  const [showVisibilityModal, setShowVisibilityModal] = useState(false);
  const [pendingVisibility, setPendingVisibility] = useState<
    "public" | "team" | "private" | null
  >(null);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // 선택된 파일 상태
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);

  // DOM 참조
  const uploadMenuRef = useRef<HTMLDivElement>(null);
  const uploadButtonRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<AgGridReact>(null);

  /* ===== API 훅 ===== */

  // 파일/폴더 목록 조회
  const {
    data: fileListData = [],
    isLoading: isLoadingFiles,
    refetch: refetchFiles,
  } = useFileList(currentFolderCode);

  // 통계 조회
  const { data: statsData } = useCollectionStats();

  // 폴더 트리 조회 (이동 모달용)
  const { data: folderTreeData = [] } = useFolderTree();

  // 폴더 생성
  const { mutate: createFolderMutation } = useCreateFolder();

  // 항목 이동
  const { mutate: moveItemMutation } = useMoveItem();

  // 항목 삭제
  const { mutate: deleteItemMutation } = useDeleteItem();

  // 폴더 수정
  const { mutate: updateFolderMutation } = useUpdateFolder();

  // 파일 수정
  const { mutate: updateFileMutation } = useUpdateFile();

  /* ===== 데이터 ===== */

  const columnDefs = useFileManagementColumnDefs();

  // API 데이터를 FileItem 형식으로 변환
  const files: FileItem[] = useMemo(() => {
    return fileListData.map((item: ApiFileListItem) => ({
      id: item.id,
      name: item.name,
      type: item.type,
      modifiedDate: item.modifiedDate,
      visibility: item.visibility,
      approvalStatus: "none" as const,
      size: item.size,
      // 추가 정보 (API 호출에 필요)
      fld_cd: item.fld_cd,
      file_id: item.file_id,
      file_seq: item.file_seq,
    }));
  }, [fileListData]);

  // 폴더 목록 (이동 모달용)
  const folders: FolderItem[] = useMemo(() => {
    return folderTreeData.map((item: any) => ({
      id: item.fld_cd,
      name: item.fld_nm,
    }));
  }, [folderTreeData]);

  /** 통계 데이터 */
  const stats = useMemo(
    () => ({
      totalFiles: statsData?.totalFiles ?? 0,
      myFiles: statsData?.myFiles ?? 0,
      pendingApproval: statsData?.pendingApproval ?? 0,
    }),
    [statsData]
  );

  /** 필터링된 파일 목록 */
  const filteredFiles = useMemo(() => {
    let result = [...files];

    // 1. 검색 키워드 필터
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase().trim();
      result = result.filter((file) =>
        file.name.toLowerCase().includes(keyword)
      );
    }

    // 2. 파일 유형 필터
    if (fileType) {
      result = result.filter((file) => {
        if (file.type === "folder") return false; // 폴더는 파일 유형 필터에서 제외

        const ext = file.name.split(".").pop()?.toLowerCase() || "";
        switch (fileType) {
          case "pdf":
            return ext === "pdf";
          case "doc":
            return ext === "doc" || ext === "docx";
          case "img":
            return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
          case "etc":
            return !["pdf", "doc", "docx", "jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(ext);
          default:
            return true;
        }
      });
    }

    // 3. 날짜 필터
    if (dateFilter && dateFilter !== "all") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      result = result.filter((file) => {
        // modifiedDate 형식: "2024.05.13" 또는 Date 객체
        const dateStr = file.modifiedDate;
        let fileDate: Date;

        if (typeof dateStr === "string") {
          // "2024.05.13" 형식 파싱
          const parts = dateStr.split(".");
          if (parts.length === 3) {
            fileDate = new Date(
              parseInt(parts[0]),
              parseInt(parts[1]) - 1,
              parseInt(parts[2])
            );
          } else {
            return true; // 파싱 실패시 포함
          }
        } else {
          fileDate = new Date(dateStr);
        }

        switch (dateFilter) {
          case "today":
            return fileDate >= today;
          case "week": {
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            return fileDate >= weekAgo;
          }
          case "month": {
            const monthAgo = new Date(today);
            monthAgo.setDate(monthAgo.getDate() - 30);
            return fileDate >= monthAgo;
          }
          default:
            return true;
        }
      });
    }

    // 4. 공개 범위 필터
    if (scopeFilter) {
      result = result.filter((file) => file.visibility === scopeFilter);
    }

    // 5. 벡터화 상태 필터 (현재 데이터에 없으므로 주석 처리)
    // if (vectorFilter) {
    //   result = result.filter((file) => file.vectorStatus === vectorFilter);
    // }

    return result;
  }, [files, searchKeyword, fileType, dateFilter, scopeFilter, vectorFilter]);

  /** 페이지네이션된 파일 목록 */
  const paginatedFiles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredFiles.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredFiles, currentPage]);

  /** 필터 변경 시 페이지 리셋 */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchKeyword, fileType, dateFilter, scopeFilter, vectorFilter]);

  /** 페이지 변경 핸들러 */
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  /* ===== 업로드 메뉴 핸들러 ===== */

  /** 업로드 버튼 클릭 - 메뉴 토글 */
  const handleUploadClick = useCallback(() => {
    setShowUploadMenu((prev) => !prev);
  }, []);

  /** 파일 업로드 메뉴 클릭 */
  const handleFileUpload = useCallback(() => {
    setShowUploadMenu(false);
    setUploadModalType("file");
    setShowUploadModal(true);
  }, []);

  /** 폴더 업로드 메뉴 클릭 */
  const handleFolderUpload = useCallback(() => {
    setShowUploadMenu(false);
    setUploadModalType("folder");
    setShowUploadModal(true);
  }, []);

  /** 폴더 생성 메뉴 클릭 */
  const handleCreateFolder = useCallback(() => {
    setShowUploadMenu(false);
    setShowCreateFolderModal(true);
  }, []);

  // 업로드 훅
  const { mutate: uploadFilesMutation, isPending: isUploading } =
    useUploadFiles();

  /* ===== 모달 제출 핸들러 ===== */

  /** 업로드 모달 제출 */
  const handleUploadSubmit = useCallback(
    (uploadedFiles: File[], authLevel: AuthLevelType, fldCd?: string) => {
      uploadFilesMutation(
        { files: uploadedFiles, authLevel, fldCd },
        { onSuccess: () => setShowUploadModal(false) }
      );
    },
    [uploadFilesMutation]
  );

  /** 폴더 생성 모달 제출 */
  const handleCreateFolderSubmit = useCallback(
    (folderName: string) => {
      createFolderMutation({
        folderName,
        parentFolderCode: currentFolderCode,
        userDivCode: "private",
      });
      setShowCreateFolderModal(false);
    },
    [createFolderMutation, currentFolderCode]
  );

  /** 파일/폴더 수정 저장 */
  const handleEditSave = useCallback(
    (fileName: string, visibility: "private" | "team" | "public") => {
      if (!editingFile) return;

      if (editingFile.type === "folder") {
        // 폴더 수정: 폴더명만 변경
        updateFolderMutation({
          fldCd: editingFile.id,
          folderName: fileName,
        });
      } else {
        // 파일 수정: 파일명 및 공개 범위 변경
        updateFileMutation({
          fileId: (editingFile as any).file_id,
          fileSeq: (editingFile as any).file_seq,
          fileName,
          visibility,
          fldCd: (editingFile as any).fld_cd,
        });
      }

      setShowEditModal(false);
      setEditingFile(null);
    },
    [editingFile, updateFolderMutation, updateFileMutation]
  );

  /** 승인 요청 취소 */
  const handleCancelApproval = useCallback(() => {
    console.log("승인 요청 취소:", editingFile);
    // TODO: 승인 취소 API 연동
  }, [editingFile]);

  /** 파일 이동 제출 */
  const handleMoveSubmit = useCallback(
    (targetFolderId: string) => {
      if (!movingFile) return;

      moveItemMutation({
        itemId: movingFile.id,
        itemType: movingFile.type,
        targetFolderCode: targetFolderId,
        // 파일인 경우 추가 정보
        ...(movingFile.type === "file" && {
          collectionNm: "test",
          embdModel: "bge-m3:latest",
          fileId: (movingFile as any).file_id,
          fileSeq: (movingFile as any).file_seq,
          currentFldCd: (movingFile as any).fld_cd,
        }),
      });
      setShowMoveModal(false);
      setMovingFile(null);
    },
    [movingFile, moveItemMutation]
  );

  /** 휴지통 이동 확인 */
  const handleTrashMoveConfirm = useCallback(() => {
    if (filePendingTrash) {
      deleteItemMutation({
        itemId: filePendingTrash.id,
        itemType: filePendingTrash.type,
        // 파일인 경우 추가 정보
        ...(filePendingTrash.type === "file" && {
          collectionNm: "test",
          embdModel: "bge-m3:latest",
          fileId: (filePendingTrash as any).file_id,
          fileSeq: (filePendingTrash as any).file_seq,
          fldCd: (filePendingTrash as any).fld_cd,
        }),
      });
    }
    setFilePendingTrash(null);
  }, [filePendingTrash, deleteItemMutation]);

  /* ===== 그리드 액션 핸들러 ===== */

  /** 파일 수정 클릭 */
  const handleFileEdit = useCallback((file: FileItem) => {
    setEditingFile(file);
    setShowEditModal(true);
  }, []);

  /** 파일 이동 클릭 */
  const handleFileMove = useCallback((file: FileItem) => {
    setMovingFile(file);
    setShowMoveModal(true);
  }, []);

  /** 파일 삭제 클릭 */
  const handleFileDelete = useCallback((file: FileItem) => {
    setFilePendingTrash(file);
  }, []);

  /** 폴더 클릭 - 해당 폴더 상세 페이지로 이동 */
  const handleFolderClick = useCallback(
    (file: FileItem) => {
      if (file.type === "folder") {
        navigate(`/file-management/folder/${file.id}`);
      }
    },
    [navigate]
  );

  /** 행 더블클릭 - 폴더인 경우 상세 페이지로 이동 */
  const handleRowDoubleClicked = useCallback(
    (event: RowDoubleClickedEvent<FileItem>) => {
      const file = event.data;
      if (file?.type === "folder") {
        handleFolderClick(file);
      }
    },
    [handleFolderClick]
  );

  /** 체크박스 선택 변경 */
  /** 체크박스 선택 변경 */
  const handleSelectionChanged = useCallback((event: any) => {
    const selectedRows = event.api.getSelectedRows() as FileItem[];
    setSelectedFiles(selectedRows);
  }, []);

  /** 선택 해제 */
  const handleClearSelection = useCallback(() => {
    // AG-Grid API를 통해 선택 상태 초기화
    gridRef.current?.api?.deselectAll();
    setSelectedFiles([]);
  }, []);

  /** 선택된 파일 일괄 이동 */
  const handleBulkMove = useCallback(() => {
    if (selectedFiles.length > 0) {
      setMovingFile(selectedFiles[0]);
      setShowMoveModal(true);
    }
  }, [selectedFiles]);

  /** 선택된 파일 일괄 삭제 */
  const handleBulkDelete = useCallback(() => {
    if (selectedFiles.length > 0) {
      setFilePendingTrash(selectedFiles[0]);
    }
  }, [selectedFiles]);

  /** 공개 범위 변경 선택 */
  const handleVisibilityChange = useCallback(
    (value: string) => {
      if (value && selectedFiles.length > 0) {
        setPendingVisibility(value as "public" | "team" | "private");
        setShowVisibilityModal(true);
      }
    },
    [selectedFiles]
  );

  /** 공개 범위 변경 확인 */
  const handleVisibilityConfirm = useCallback(() => {
    if (pendingVisibility && selectedFiles.length > 0) {
      console.log("공개 범위 변경:", pendingVisibility, selectedFiles);
      // TODO: 공개 범위 변경 API 연동
    }
    setShowVisibilityModal(false);
    setPendingVisibility(null);
  }, [pendingVisibility, selectedFiles]);

  /** 공개 범위 변경 모달 닫기 */
  const handleVisibilityModalClose = useCallback(() => {
    setShowVisibilityModal(false);
    setPendingVisibility(null);
  }, []);

  /** 공개 범위 라벨 반환 */
  const getVisibilityLabel = useCallback(
    (visibility: "public" | "team" | "private" | null) => {
      switch (visibility) {
        case "public":
          return "전체 공개";
        case "team":
          return "팀 공개";
        case "private":
          return "나만 보기";
        default:
          return "";
      }
    },
    []
  );

  /** 공개 범위별 설명 반환 */
  const getVisibilityDescription = useCallback(
    (visibility: "public" | "team" | "private" | null) => {
      switch (visibility) {
        case "public":
          return "모든 사용자의 AI 채팅에서 답변 출처로 사용될 수 있습니다.";
        case "team":
          return "팀원의 AI 채팅에서 답변 출처로 사용될 수 있습니다.";
        case "private":
          return "다른 사용자에게 공개되지 않습니다.";
        default:
          return "";
      }
    },
    []
  );

  /** 그리드 컨텍스트 (액션 핸들러 전달) */
  const gridContext = useMemo<FileManagementGridContext>(
    () => ({
      onEdit: handleFileEdit,
      onMove: handleFileMove,
      onDelete: handleFileDelete,
      onOpenFolder: handleFolderClick,
    }),
    [handleFileEdit, handleFileMove, handleFileDelete, handleFolderClick]
  );

  /* ===== 드래그 앤 드롭 핸들러 ===== */

  /** 파일 선택 */
  const handleFileChange = useCallback((newFiles: File[]) => {
    console.log("파일 선택:", newFiles);
  }, []);

  /** 파일 제거 */
  const handleFileRemove = useCallback(() => {
    console.log("파일 제거");
  }, []);

  /* ===== 모달 닫기 핸들러 ===== */

  /** 수정 모달 닫기 */
  const handleEditModalClose = useCallback(() => {
    setShowEditModal(false);
    setEditingFile(null);
  }, []);

  /** 이동 모달 닫기 */
  const handleMoveModalClose = useCallback(() => {
    setShowMoveModal(false);
    setMovingFile(null);
  }, []);

  /** 삭제 확인 알림 닫기 */
  const handleTrashAlertClose = useCallback(() => {
    setFilePendingTrash(null);
  }, []);

  /* ===== 사이드 이펙트 ===== */

  /** 뷰 모드 변경 시 localStorage에 저장 */
  useEffect(() => {
    localStorage.setItem("fileManagement_viewMode", viewMode);
  }, [viewMode]);

  /** 업로드 메뉴 외부 클릭 시 닫기 */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideMenu =
        uploadMenuRef.current && !uploadMenuRef.current.contains(target);
      const isOutsideButton =
        uploadButtonRef.current && !uploadButtonRef.current.contains(target);

      if (isOutsideMenu && isOutsideButton) {
        setShowUploadMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ===== 렌더링 ===== */

  return (
    <PageContainer>
      {/* 페이지 헤더 */}
      <PageHeader>
        <PageTitle>파일 관리</PageTitle>
      </PageHeader>

      {/* 메인 컨텐츠 */}
      <MainContainer>
        <Content>
          {/* 컨텐츠 헤더 */}
          <ContentHeader>
            <HeaderTextGroup>
              <MainTitle>내 파일</MainTitle>
              <Description>
                업로드한 문서를 관리하고 벡터화 상태를 확인하세요.
              </Description>
            </HeaderTextGroup>

            {/* 업로드 버튼 및 메뉴 */}
            <UploadButtonWrapper ref={uploadButtonRef}>
              <UploadButton
                variant="solid"
                color="primary"
                size="sm"
                leftIconSlot={<PlusIcon />}
                onClick={handleUploadClick}
              >
                업로드
              </UploadButton>
              {showUploadMenu && (
                <UploadMenu ref={uploadMenuRef}>
                  <MenuItem onClick={handleFileUpload}>
                    <MenuItemIcon>
                      <FileUploadIcon />
                    </MenuItemIcon>
                    <MenuItemLabel>파일 업로드</MenuItemLabel>
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem onClick={handleCreateFolder}>
                    <MenuItemIcon>
                      <FolderCreateIcon />
                    </MenuItemIcon>
                    <MenuItemLabel>폴더 생성하기</MenuItemLabel>
                  </MenuItem>
                </UploadMenu>
              )}
            </UploadButtonWrapper>
          </ContentHeader>

          {/* 상태 카드 */}
          <StatusCardGrid>
            <StatusCard>
              <CardIconWrap $color="cyan">
                <DocumentIcon />
              </CardIconWrap>
              <CardTextGroup>
                <CardNumber>{stats.totalFiles}</CardNumber>
                <CardLabel>전체 파일</CardLabel>
              </CardTextGroup>
            </StatusCard>

            <StatusCard>
              <CardIconWrap $color="gray">
                <DocumentCheckIcon />
              </CardIconWrap>
              <CardTextGroup>
                <CardNumber>{stats.myFiles}</CardNumber>
                <CardLabel>내가 올린 파일</CardLabel>
              </CardTextGroup>
            </StatusCard>

            <StatusCard>
              <CardIconWrap $color="orange">
                <ClockIcon />
              </CardIconWrap>
              <CardTextGroup>
                <CardNumber>{stats.pendingApproval}</CardNumber>
                <CardLabel>승인 대기</CardLabel>
              </CardTextGroup>
            </StatusCard>
          </StatusCardGrid>

          {/* 테이블 컨테이너 */}
          <TableContainer>
            {/* 검색 바 */}
            <SearchBar>
              <SearchLeft>
                <SearchInputWrapper>
                  <IsInputSearch
                    size="sm"
                    labelShow={false}
                    placeholder="파일 검색..."
                    suffix
                    suffixSlot={<SearchIcon />}
                    clearable
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onClear={() => setSearchKeyword("")}
                    fullWidth
                  />
                </SearchInputWrapper>
                <SelectWrapper>
                  <IsSelect
                    size="small"
                    labelShow={false}
                    options={FILE_TYPE_OPTIONS}
                    value={fileType}
                    onChange={setFileType}
                    fullWidth
                  />
                </SelectWrapper>
                <SelectWrapper>
                  <IsSelect
                    size="small"
                    labelShow={false}
                    options={DATE_OPTIONS}
                    value={dateFilter}
                    onChange={setDateFilter}
                    fullWidth
                  />
                </SelectWrapper>
                <SelectWrapper>
                  <IsSelect
                    size="small"
                    labelShow={false}
                    options={SCOPE_OPTIONS}
                    value={scopeFilter}
                    onChange={setScopeFilter}
                    fullWidth
                  />
                </SelectWrapper>
                <SelectWrapper>
                  <IsSelect
                    size="small"
                    labelShow={false}
                    options={VECTOR_OPTIONS}
                    value={vectorFilter}
                    onChange={setVectorFilter}
                    fullWidth
                  />
                </SelectWrapper>
              </SearchLeft>
              <SearchRight>
                <ViewToggle>
                  <ViewButton
                    $active={viewMode === "grid"}
                    onClick={() => setViewMode("grid")}
                    title="그리드 보기"
                    $position="left"
                  >
                    <GridIcon />
                  </ViewButton>
                  <ViewButton
                    $active={viewMode === "list"}
                    onClick={() => setViewMode("list")}
                    title="목록 보기"
                    $position="right"
                  >
                    <ListIcon />
                  </ViewButton>
                </ViewToggle>
              </SearchRight>
            </SearchBar>

            {/* 선택 액션 바 (리스트 뷰에서 항목 선택 시 표시) */}
            {viewMode === "list" && selectedFiles.length > 0 && (
              <SelectionActionBar>
                <VisibilitySelectWrapper>
                  <IsSelect
                    size="small"
                    labelShow={false}
                    options={[
                      { value: "", label: "공개 범위 변경" },
                      { value: "public", label: "전체 공개" },
                      { value: "team", label: "팀 공개" },
                      { value: "private", label: "나만 보기" },
                    ]}
                    value=""
                    onChange={handleVisibilityChange}
                    fullWidth
                  />
                </VisibilitySelectWrapper>
                <ActionBarItem $hasBorder>
                  <SelectionCount>
                    <SelectionCountNumber>
                      {selectedFiles.length}개
                    </SelectionCountNumber>
                    <SelectionCountText>선택됨</SelectionCountText>
                  </SelectionCount>
                </ActionBarItem>
                <ActionBarItem $hasBorder>
                  <ActionButton onClick={handleClearSelection}>
                    선택해제
                  </ActionButton>
                </ActionBarItem>
                <ActionBarItem $hasBorder>
                  <ActionButton onClick={handleBulkMove}>
                    <MoveIcon />
                    이동
                  </ActionButton>
                </ActionBarItem>
                <ActionBarItem>
                  <ActionButton onClick={handleBulkDelete}>
                    <TrashIcon />
                    삭제
                  </ActionButton>
                </ActionBarItem>
              </SelectionActionBar>
            )}

            {/* 파일 그리드 또는 드래그 앤 드롭 영역 */}
            <TableContent>
              {filteredFiles.length > 0 ? (
                viewMode === "grid" ? (
                  <FileGridView
                    files={paginatedFiles}
                    onFolderClick={handleFolderClick}
                    onFileClick={(file) => console.log("파일 클릭:", file)}
                    onMoreClick={(file, event) => {
                      console.log("더보기 클릭:", file, event);
                      handleFileEdit(file);
                    }}
                  />
                ) : (
                  <Grid
                    ref={gridRef}
                    rowData={paginatedFiles}
                    columnDefs={columnDefs}
                    context={gridContext}
                    rowHeight={40}
                    headerHeight={40}
                    height="auto"
                    domLayout="autoHeight"
                    isRadius={false}
                    selectionMode="multiRow"
                    onSelectionChanged={handleSelectionChanged}
                    onRowDoubleClicked={handleRowDoubleClicked}
                  />
                )
              ) : files.length > 0 ? (
                // 필터링 결과가 없을 때
                <DragDropArea style={{ textAlign: "center", padding: "40px" }}>
                  <p style={{ color: "#666", fontSize: "14px" }}>
                    검색 결과가 없습니다.
                  </p>
                </DragDropArea>
              ) : (
                <DragDropArea>
                  <IsFileDrop
                    labelShow={false}
                    fullWidth
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    leadText="끌어다 놓기 또는 "
                    actionText="선택하기"
                    infoText="JPG, PNG 형식만 허용됩니다(최대 2MB)"
                    dropIconSlot={<UploadIcon />}
                    onFileChange={handleFileChange}
                    onFileRemove={handleFileRemove}
                  />
                </DragDropArea>
              )}
            </TableContent>

            {/* 페이지네이션 */}
            {filteredFiles.length > 0 && (
              <PaginationFooter>
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredFiles.length}
                  itemsPerPage={ITEMS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              </PaginationFooter>
            )}
          </TableContainer>
        </Content>
      </MainContainer>

      {/* 모달 컴포넌트들 */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadSubmit}
        type={uploadModalType}
        fldCd={currentFolderCode}
      />

      <CreateFolderModal
        isOpen={showCreateFolderModal}
        onClose={() => setShowCreateFolderModal(false)}
        onCreate={handleCreateFolderSubmit}
      />

      <EditFileModal
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        onSave={handleEditSave}
        onCancelApproval={handleCancelApproval}
        file={
          editingFile
            ? {
                name: editingFile.name,
                type: editingFile.type,
                visibility:
                  editingFile.visibility === "pending"
                    ? "public"
                    : editingFile.visibility,
                approvalStatus: editingFile.approvalStatus || "none",
              }
            : null
        }
      />

      <MoveFileModal
        isOpen={showMoveModal}
        onClose={handleMoveModalClose}
        onMove={handleMoveSubmit}
        fileName={movingFile?.name}
        folders={folders}
      />

      <Alert
        isOpen={filePendingTrash !== null}
        onClose={handleTrashAlertClose}
        onConfirm={handleTrashMoveConfirm}
        title="휴지통으로 이동"
        description={
          <>
            선택하신 <strong>1개</strong>의{" "}
            {filePendingTrash?.type === "folder" ? "폴더" : "파일"}를 휴지통으로
            이동하시겠습니까?
          </>
        }
        cancelText="취소"
        confirmText="이동하기"
      />

      {/* 공개 범위 변경 모달 */}
      <Alert
        isOpen={showVisibilityModal}
        onClose={handleVisibilityModalClose}
        onConfirm={handleVisibilityConfirm}
        title={`${getVisibilityLabel(pendingVisibility)}로 변경`}
        description={
          <>
            선택한 <strong>{selectedFiles.length}개</strong>의 파일을{" "}
            <strong style={{ color: "rgba(30, 40, 70, 0.88)" }}>
              [{getVisibilityLabel(pendingVisibility)}]
            </strong>
            로 변경합니다.
            <br />
            {getVisibilityDescription(pendingVisibility)}
          </>
        }
        cancelText="취소"
        confirmText="변경하기"
        width={384}
      >
        <FileListContainer>
          {selectedFiles.map((file) => (
            <FileListItem key={file.id}>
              <FileListIcon>
                <DocumentIcon />
              </FileListIcon>
              <FileListName>{file.name}</FileListName>
            </FileListItem>
          ))}
        </FileListContainer>
      </Alert>
    </PageContainer>
  );
}
