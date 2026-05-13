import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import {
  PlusIconSmall,
  EllipsisIcon,
  ChevronDownIcon,
  ArrowUpIcon,
  LogoIcon,
  EditIcon,
  TrashIcon,
} from "@/styles/icons";
import {
  useChatRooms,
  useChatMessages,
  useSendMessage,
  useCreateChatWithMessage,
  useUpdateChatTitle,
  useDeleteChatRoom,
  groupChatRoomsByDate,
  formatRelativeTime,
  CHAT_QUERY_KEYS,
  type ChatRoomItem,
  type ChatMessageItem,
  type ReferencedFileItem,
} from "@/lib/hooks/useChat";
import { Alert } from "@/components/atoms/Alert";
import { useQueryClient } from "@tanstack/react-query";

/** 그룹 라벨 */
const groupLabels: Record<string, string> = {
  today: "오늘",
  yesterday: "어제",
  thisWeek: "이번 주",
  older: "이전",
};

/**
 * 채팅
 * Figma design: node 118-13787 (빈 상태), node 118-13472 (대화 상태)
 */
export default function ChatPage() {
  /** ============================= state 영역 ============================= */
  const [selectedModel, setSelectedModel] = useState("GPT");
  const [inputMessage, setInputMessage] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(
    null
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  /** 채팅 메뉴 관련 state */
  const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editChatId, setEditChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const queryClient = useQueryClient();

  /** ============================= API 훅 ============================= */
  const { data: chatRoomsData, isLoading: isRoomsLoading } = useChatRooms(
    1,
    100
  );
  const {
    data: messagesData,
    isLoading: isMessagesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMessages(selectedChatId, 30);
  const { mutate: sendMessageMutation } = useSendMessage();
  const { mutate: createChatWithMessageMutation } = useCreateChatWithMessage();
  const { mutate: updateTitleMutation } = useUpdateChatTitle();
  const { mutate: deleteChatMutation } = useDeleteChatRoom();

  /** ============================= 파생 데이터 ============================= */
  const chatRooms = useMemo(
    () => chatRoomsData?.rooms || [],
    [chatRoomsData?.rooms]
  );

  const groupedChats = useMemo(
    () => groupChatRoomsByDate(chatRooms),
    [chatRooms]
  );

  const currentMessages = useMemo(() => {
    if (!messagesData?.pages) return [];
    // 모든 페이지의 메시지를 합침 (역순으로 가져오므로 정방향으로 정렬)
    const allMessages = messagesData.pages.flatMap((page) => page.messages);
    return allMessages;
  }, [messagesData?.pages]);

  const hasMessages = currentMessages.length > 0 || pendingUserMessage !== null;

  /** ============================= 비즈니스 로직 영역 ============================= */
  const handleNewChat = () => {
    setSelectedChatId(null);
    setPendingUserMessage(null);
    setInputMessage("");
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setPendingUserMessage(null);
    setInputMessage("");
  };

  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim() || isLoading) return;

    const message = inputMessage.trim();
    setInputMessage("");
    setIsLoading(true);

    if (!selectedChatId) {
      // 새 채팅: 채팅방 생성 + 첫 메시지 전송
      setPendingUserMessage(message);

      createChatWithMessageMutation(
        { message },
        {
          onSuccess: (data) => {
            if (data) {
              setSelectedChatId(data.chatId);
              setPendingUserMessage(null);
              // 메시지 목록 갱신
              queryClient.invalidateQueries({
                queryKey: CHAT_QUERY_KEYS.messages(data.chatId),
              });
            }
            setIsLoading(false);
          },
          onError: () => {
            setPendingUserMessage(null);
            setIsLoading(false);
          },
        }
      );
    } else {
      // 기존 채팅방에 메시지 전송
      setPendingUserMessage(message);

      sendMessageMutation(
        { chatId: selectedChatId, message },
        {
          onSuccess: () => {
            setPendingUserMessage(null);
            setIsLoading(false);
          },
          onError: () => {
            setPendingUserMessage(null);
            setIsLoading(false);
          },
        }
      );
    }
  }, [
    inputMessage,
    isLoading,
    selectedChatId,
    createChatWithMessageMutation,
    sendMessageMutation,
    queryClient,
  ]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleChatMenu = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setOpenMenuChatId(openMenuChatId === chatId ? null : chatId);
  };

  /** 메뉴 닫기 */
  const handleCloseMenu = useCallback(() => {
    setOpenMenuChatId(null);
  }, []);

  /** 수정하기 클릭 */
  const handleEditChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    const room = chatRooms.find((r: ChatRoomItem) => r.chatId === chatId);
    if (room) {
      setEditChatId(chatId);
      setEditTitle(room.title);
      setShowEditModal(true);
    }
    setOpenMenuChatId(null);
  };

  /** 수정 확인 */
  const handleEditConfirm = () => {
    if (editChatId && editTitle.trim()) {
      updateTitleMutation({ chatId: editChatId, title: editTitle.trim() });
    }
    setShowEditModal(false);
    setEditChatId(null);
    setEditTitle("");
  };

  /** 수정 취소 */
  const handleEditCancel = () => {
    setShowEditModal(false);
    setEditChatId(null);
    setEditTitle("");
  };

  /** 삭제하기 클릭 */
  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    setChatToDelete(chatId);
    setShowDeleteAlert(true);
    setOpenMenuChatId(null);
  };

  /** 삭제 확인 */
  const handleDeleteConfirm = () => {
    if (!chatToDelete) {
      setShowDeleteAlert(false);
      return;
    }

    const chatIdToDelete = chatToDelete;

    // Alert 닫기 및 state 초기화
    setShowDeleteAlert(false);
    setChatToDelete(null);

    // 삭제 mutation 호출 (콜백에서 추가 처리)
    deleteChatMutation(chatIdToDelete, {
      onSuccess: () => {
        // 삭제된 채팅방이 현재 선택된 채팅방이면 선택 해제
        if (selectedChatId === chatIdToDelete) {
          setSelectedChatId(null);
          setPendingUserMessage(null);
        }
      },
    });
  };

  /** 삭제 취소 */
  const handleDeleteCancel = () => {
    setShowDeleteAlert(false);
    setChatToDelete(null);
  };

  /** 참조 파일 클릭 핸들러 */
  const handleFileClick = (file: ReferencedFileItem) => {
    // API 엔드포인트로 파일 직접 열기 (브라우저에서 PDF 등 표시)
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "";
    const viewerUrl = `${apiBaseUrl}/api/app/collection/file/view?fileId=${file.fileId}&fileSeq=${file.fileSeq}`;
    window.open(viewerUrl, "_blank");
  };

  /** 역방향 무한 스크롤 처리 */
  const handleMessagesScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || !hasNextPage || isFetchingNextPage) return;

    // 상단에 도달하면 이전 메시지 로드
    if (container.scrollTop < 100) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  /** ============================= useEffect 영역 ============================= */
  // 메시지가 추가되면 스크롤 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, pendingUserMessage, isLoading]);

  // Textarea 자동 높이 조절
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputMessage]);

  // 메뉴 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        handleCloseMenu();
      }
    };

    if (openMenuChatId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuChatId, handleCloseMenu]);

  /** ============================= 렌더링 헬퍼 ============================= */
  /** 마크다운 스타일 텍스트 렌더링 (간단 버전) */
  const renderMessageContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, idx) => {
      // Bold 처리 (**text**)
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts: (string | React.ReactNode)[] = [];
      let lastIndex = 0;
      let match;

      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.slice(lastIndex, match.index));
        }
        parts.push(
          <strong key={`bold-${idx}-${match.index}`}>{match[1]}</strong>
        );
        lastIndex = match.index + match[0].length;
      }
      if (lastIndex < line.length) {
        parts.push(line.slice(lastIndex));
      }

      return (
        <MessageLine key={idx}>
          {parts.length > 0 ? parts : line || <br />}
        </MessageLine>
      );
    });
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader>
        <PageTitle>채팅</PageTitle>
      </PageHeader>

      {/* Main Container */}
      <MainContainer>
        {/* Left Sidebar - Chat History */}
        <Sidebar>
          {/* New Chat Button */}
          <NewChatSection>
            <NewChatButton onClick={handleNewChat}>
              <PlusIconSmall />
              <span>새 채팅</span>
            </NewChatButton>
          </NewChatSection>

          {/* Chat History List */}
          <ChatHistoryContainer>
            {isRoomsLoading ? (
              <LoadingText>불러오는 중...</LoadingText>
            ) : chatRooms.length === 0 ? (
              <EmptyHistoryText>대화 내역이 없습니다.</EmptyHistoryText>
            ) : (
              (["today", "yesterday", "thisWeek", "older"] as const).map(
                (group) =>
                  groupedChats[group]?.length > 0 && (
                    <ChatGroup key={group}>
                      <GroupLabel>{groupLabels[group]}</GroupLabel>
                      {groupedChats[group].map((chat) => (
                        <ChatItemWrapper key={chat.chatId}>
                          <ChatItem
                            $active={selectedChatId === chat.chatId}
                            onClick={() => handleChatSelect(chat.chatId)}
                          >
                            <ChatItemContent>
                              <ChatTitle>{chat.title}</ChatTitle>
                              <ChatTimestamp>
                                {formatRelativeTime(chat.updatedAt)}
                              </ChatTimestamp>
                            </ChatItemContent>
                            <ChatMenuButton
                              onClick={(e) => handleChatMenu(e, chat.chatId)}
                            >
                              <EllipsisIcon />
                            </ChatMenuButton>
                          </ChatItem>

                          {/* Chat Menu Tooltip */}
                          {openMenuChatId === chat.chatId && (
                            <ChatMenu ref={menuRef}>
                              <ChatMenuItem
                                onClick={(e) => handleEditChat(e, chat.chatId)}
                              >
                                <MenuItemIcon>
                                  <EditIcon />
                                </MenuItemIcon>
                                <MenuItemLabel>수정하기</MenuItemLabel>
                              </ChatMenuItem>
                              <ChatMenuItem
                                onClick={(e) =>
                                  handleDeleteClick(e, chat.chatId)
                                }
                              >
                                <MenuItemIcon>
                                  <TrashIcon />
                                </MenuItemIcon>
                                <MenuItemLabel>삭제하기</MenuItemLabel>
                              </ChatMenuItem>
                            </ChatMenu>
                          )}
                        </ChatItemWrapper>
                      ))}
                    </ChatGroup>
                  )
              )
            )}
          </ChatHistoryContainer>
        </Sidebar>

        {/* Main Chat Area */}
        <ChatArea>
          {/* Model Selector */}
          <ModelSelectorWrapper>
            <ModelSelector>
              <ModelButton>
                <span>{selectedModel}</span>
                <ChevronDownIcon />
              </ModelButton>
            </ModelSelector>
          </ModelSelectorWrapper>

          {/* Chat Content */}
          <ChatContentWrapper>
            {hasMessages ? (
              /* 대화 내용이 있을 때 — 빈 화면에서 전환 시 진입 애니메이션 */
              <ActiveChatColumn>
                <MessagesAnimShell>
                  <MessagesContainer
                    ref={messagesContainerRef}
                    onScroll={handleMessagesScroll}
                  >
                    {/* 이전 메시지 로딩 표시 */}
                    {isFetchingNextPage && (
                      <LoadingMoreWrapper>
                        <LoadingDots>
                          <span />
                          <span />
                          <span />
                        </LoadingDots>
                      </LoadingMoreWrapper>
                    )}

                    {/* 메시지 목록 */}
                    {currentMessages.map((message) => (
                      <MessageWrapper
                        key={message.chatNo}
                        $role={message.senderType === "user" ? "user" : "assistant"}
                      >
                        {message.senderType === "user" ? (
                          <UserMessage>{message.message}</UserMessage>
                        ) : (
                          <AssistantMessageWrapper>
                            <AssistantMessage>
                              {renderMessageContent(message.message)}
                            </AssistantMessage>
                            {/* 참조 파일 표시 */}
                            {message.referencedFiles && message.referencedFiles.length > 0 && (
                              <ReferencedFilesSection>
                                <ReferenceLabel>참조:</ReferenceLabel>
                                {message.referencedFiles.map((file, idx) => (
                                  <FileBadge
                                    key={`${file.fileId}-${file.fileSeq}-${idx}`}
                                    onClick={() => handleFileClick(file)}
                                  >
                                    {file.fileName}
                                  </FileBadge>
                                ))}
                              </ReferencedFilesSection>
                            )}
                          </AssistantMessageWrapper>
                        )}
                      </MessageWrapper>
                    ))}

                    {/* 전송 중인 사용자 메시지 */}
                    {pendingUserMessage && (
                      <MessageWrapper $role="user">
                        <UserMessage>{pendingUserMessage}</UserMessage>
                      </MessageWrapper>
                    )}

                    {/* AI 응답 대기 중 로딩 표시 */}
                    {isLoading && (
                      <MessageWrapper $role="assistant">
                        <AssistantMessageWrapper>
                          <LoadingDots>
                            <span />
                            <span />
                            <span />
                          </LoadingDots>
                        </AssistantMessageWrapper>
                      </MessageWrapper>
                    )}

                    <div ref={messagesEndRef} />
                  </MessagesContainer>
                </MessagesAnimShell>

                <BottomInputAnimShell>
                  <ChatInputSection>
                    <ChatInputContainer>
                      <ChatTextarea
                        ref={textareaRef}
                        placeholder="업로드 한 문서 기반으로 질문하세요..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        rows={1}
                        disabled={isLoading}
                      />
                      <SendButton
                        onClick={handleSendMessage}
                        $hasContent={!!inputMessage.trim() && !isLoading}
                        disabled={isLoading}
                      >
                        <ArrowUpIcon />
                      </SendButton>
                    </ChatInputContainer>
                  </ChatInputSection>
                </BottomInputAnimShell>
              </ActiveChatColumn>
            ) : (
              /* 빈 상태 - 입력창이 중앙에 위치 */
              <EmptyState>
                <EmptyStateContent>
                  <LogoIcon />
                  <EmptyStateTextGroup>
                    <EmptyStateTitle>무엇이 궁금하신가요?</EmptyStateTitle>
                    <EmptyStateSubtitle>
                      업로드 된 문서를 바탕으로 자유롭게 질문해 보세요.
                    </EmptyStateSubtitle>
                  </EmptyStateTextGroup>
                </EmptyStateContent>

                {/* 중앙 위치 입력창 */}
                <CenteredInputContainer>
                  <ChatTextarea
                    ref={textareaRef}
                    placeholder="업로드 한 문서 기반으로 질문하세요..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={1}
                    disabled={isLoading}
                  />
                  <SendButton
                    onClick={handleSendMessage}
                    $hasContent={!!inputMessage.trim() && !isLoading}
                    disabled={isLoading}
                  >
                    <ArrowUpIcon />
                  </SendButton>
                </CenteredInputContainer>
              </EmptyState>
            )}
          </ChatContentWrapper>
        </ChatArea>
      </MainContainer>

      {/* 대화 삭제 확인 Alert */}
      <Alert
        isOpen={showDeleteAlert}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="대화 삭제"
        description="이 대화를 삭제하시겠습니까?"
        cancelText="취소"
        confirmText="삭제"
        confirmVariant="danger"
      />

      {/* 제목 수정 모달 */}
      <Alert
        isOpen={showEditModal}
        onClose={handleEditCancel}
        onConfirm={handleEditConfirm}
        title="대화 제목 수정"
        description=""
        cancelText="취소"
        confirmText="저장"
      >
        <EditTitleInput
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          placeholder="새 제목을 입력하세요"
          maxLength={50}
          autoFocus
        />
      </Alert>
    </PageContainer>
  );
}

/** ============================= Styled Components ============================= */

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: rgba(112, 115, 124, 0.16);
`;

const PageHeader = styled.header`
  display: flex;
  align-items: center;
  height: 56px;
  padding: 0 24px;
  background: #f7f7f8;
  border-bottom: 1px solid rgba(112, 115, 124, 0.22);
  flex-shrink: 0;
`;

const PageTitle = styled.h1`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.467;
  letter-spacing: 0.144px;
  color: #1b2a6b;
  margin: 0;
`;

const MainContainer = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

/* ===== Left Sidebar ===== */
const Sidebar = styled.aside`
  display: flex;
  flex-direction: column;
  width: 240px;
  min-width: 240px;
  height: 100%;
  background: #ffffff;
  border-right: 1px solid #e4e8f4;
  overflow: hidden;
`;

const NewChatSection = styled.div`
  padding: 14px 12px 15px;
  border-bottom: 1px solid #e4e8f4;
`;

const NewChatButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 10px 9px 11px;
  background: #2ec4a0;
  border: none;
  border-radius: 8px;
  color: #ffffff;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: #26a88a;
  }

  svg {
    flex-shrink: 0;
  }
`;

const ChatHistoryContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(112, 115, 124, 0.3);
    border-radius: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const LoadingText = styled.div`
  padding: 20px;
  text-align: center;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  color: #a0aabf;
`;

const EmptyHistoryText = styled.div`
  padding: 20px;
  text-align: center;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  color: #a0aabf;
`;

const ChatGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const GroupLabel = styled.div`
  padding: 11px 8px 6px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #a0aabf;
`;

const ChatItem = styled.div<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 9px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
  background: ${({ $active }) =>
    $active ? "rgba(0, 102, 255, 0.08)" : "transparent"};

  &:hover {
    background: ${({ $active }) =>
      $active ? "rgba(0, 102, 255, 0.08)" : "rgba(112, 115, 124, 0.08)"};
  }
`;

const ChatItemContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
  padding: 1px 0 2px;
`;

const ChatTitle = styled.div`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: #1b2a6b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ChatTimestamp = styled.div`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: #a0aabf;
`;

const ChatMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  padding: 0;
  margin: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  color: #a0aabf;
  opacity: 0;
  transition: opacity 0.15s ease;
  flex-shrink: 0;

  ${ChatItem}:hover & {
    opacity: 1;
  }

  &:hover {
    color: #70737c;
  }
`;

/* ===== Main Chat Area ===== */
const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #f4f6fb;
  overflow: hidden;
`;

const ModelSelectorWrapper = styled.div`
  padding: 16px 16px 0;
  flex-shrink: 0;
`;

const ModelSelector = styled.div`
  display: flex;
`;

const ModelButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;

  span {
    font-family: "Pretendard Variable", "Pretendard", sans-serif;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.5;
    letter-spacing: 0.0912px;
    color: rgba(46, 47, 51, 0.88);
  }

  svg {
    color: rgba(46, 47, 51, 0.88);
  }

  &:hover {
    background: rgba(0, 102, 255, 0.08);
  }
`;

const ChatContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

/** 빈 화면 → 대화 화면 전환 시 스레드·입력창 진입 */
const chatThreadEnter = keyframes`
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const bottomInputFromCenter = keyframes`
  from {
    opacity: 0;
    transform: translateY(calc(-1 * min(26vh, 220px)));
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ActiveChatColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

const MessagesAnimShell = styled.div`
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  animation: ${chatThreadEnter} 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
`;

const BottomInputAnimShell = styled.div`
  flex-shrink: 0;
  animation: ${bottomInputFromCenter} 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  animation-delay: 0.06s;
`;

/* ===== Messages ===== */
const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(112, 115, 124, 0.3);
    border-radius: 8px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
`;

const MessageWrapper = styled.div<{ $role: "user" | "assistant" }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ $role }) => ($role === "user" ? "flex-end" : "flex-start")};
  width: 100%;
`;

const UserMessage = styled.div`
  max-width: 70%;
  padding: 13px 16px;
  background: #1b2a6b;
  border-radius: 8px;
  color: #ffffff;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.0912px;
  white-space: pre-wrap;
  word-break: break-word;
`;

const AssistantMessageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`;

const AssistantMessage = styled.div`
  padding: 8px 0;
  color: #171719;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.0912px;

  strong {
    font-weight: 700;
  }
`;

const MessageLine = styled.div`
  min-height: 1.5em;
`;

/* ===== Referenced Files Section ===== */
const ReferencedFilesSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  padding: 4px;
`;

const ReferenceLabel = styled.span`
  color: rgba(35, 46, 80, 0.61);
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.3px;
`;

const FileBadge = styled.button`
  display: inline-flex;
  padding: 4px 9px 5px;
  background: rgba(35, 46, 80, 0.61);
  border: none;
  border-radius: 5px;
  color: #ffffff;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0.3px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(35, 46, 80, 0.8);
  }
`;

/* ===== Loading Dots Animation ===== */
const dotPulse = keyframes`
  0%, 80%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  40% {
    opacity: 1;
    transform: scale(1);
  }
`;

const LoadingDots = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 0;

  span {
    width: 8px;
    height: 8px;
    background: #a0aabf;
    border-radius: 50%;
    animation: ${dotPulse} 1.4s ease-in-out infinite;

    &:nth-child(1) {
      animation-delay: 0s;
    }
    &:nth-child(2) {
      animation-delay: 0.2s;
    }
    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
`;

const LoadingMoreWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 8px 0;
`;

/* ===== Empty State ===== */
const EmptyState = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
`;

const EmptyStateContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const EmptyStateTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
`;

const EmptyStateTitle = styled.h2`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.24px;
  color: rgba(46, 47, 51, 0.88);
  margin: 0;
`;

const EmptyStateSubtitle = styled.p`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  letter-spacing: 0.0912px;
  color: rgba(55, 56, 60, 0.61);
  margin: 0;
`;

/* ===== Chat Input ===== */
const ChatInputSection = styled.div`
  padding: 17px 16px 16px;
  border-top: 1px solid #e4e8f4;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
`;

const CenteredInputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 614px;
  max-width: 100%;
  padding: 9px 17px;
  background: #ffffff;
  border: 1px solid #e4e8f4;
  border-radius: 8px;
`;

const ChatInputContainer = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  width: 100%;
  max-width: 928px;
  padding: 9px 17px;
  background: #ffffff;
  border: 1px solid #e4e8f4;
  border-radius: 8px;
`;

const ChatTextarea = styled.textarea`
  flex: 1;
  min-width: 0;
  min-height: 22px;
  max-height: 120px;
  padding: 0;
  border: none;
  background: transparent;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 22.4px;
  color: #171719;
  outline: none;
  resize: none;
  overflow-y: auto;

  &::placeholder {
    color: #a0aabf;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(112, 115, 124, 0.3);
    border-radius: 4px;
  }
`;

const SendButton = styled.button<{ $hasContent?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 6px;
  background: ${({ $hasContent }) =>
    $hasContent ? "#2EC4A0" : "rgba(46, 196, 160, 0.5)"};
  border: none;
  border-radius: 8px;
  color: #ffffff;
  cursor: pointer;
  transition: background 0.15s ease;
  flex-shrink: 0;

  &:hover {
    background: ${({ $hasContent }) =>
      $hasContent ? "#26A88A" : "rgba(46, 196, 160, 0.5)"};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

/* ===== Chat Menu Tooltip ===== */
const ChatItemWrapper = styled.div`
  position: relative;
`;

const ChatMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 100;
  min-width: 140px;
  padding: 4px 0;
  background: #ffffff;
  border: 1px solid #eaebec;
  border-radius: 8px;
  box-shadow:
    0px 4px 6px -1px rgba(23, 23, 23, 0.06),
    0px 2px 4px -2px rgba(23, 23, 23, 0.06);
`;

const ChatMenuItem = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: rgba(23, 23, 25, 0.075);
  }
`;

const MenuItemIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: rgba(46, 47, 51, 0.88);
  flex-shrink: 0;
`;

const MenuItemLabel = styled.span`
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.334;
  letter-spacing: 0.302px;
  color: rgba(46, 47, 51, 0.88);
`;

/* ===== Edit Title Input ===== */
const EditTitleInput = styled.input`
  width: 100%;
  padding: 10px 12px;
  margin-top: 8px;
  border: 1px solid #e4e8f4;
  border-radius: 8px;
  font-family: "Pretendard Variable", "Pretendard", sans-serif;
  font-size: 14px;
  color: #171719;
  outline: none;

  &:focus {
    border-color: #2ec4a0;
  }

  &::placeholder {
    color: #a0aabf;
  }
`;
