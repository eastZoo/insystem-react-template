import { IsButton, IsChip } from "insystem-atoms";
import * as S from "./HomePage.style";
import { useGetMe, useLogout } from "@/hooks/useAuth";
import {
  useTestPing,
  useTestUsers,
  useTestMenus,
  useTestPermissions,
  useTestOrders,
  useTestStocks,
} from "@/hooks/useTest";

/**
 * HomePage — API 연동 테스트 샘플
 *
 * 백엔드의 /api/app/test/* 엔드포인트를 호출하여
 * 각 모듈(Users, Menus, Permissions, Orders, Stocks)의 데이터를 표시합니다.
 *
 * [토큰 갱신 테스트]
 * useTestPing()은 30초마다 자동 호출됩니다.
 * Access Token(15분)이 만료되면 axios 인터셉터가 자동으로
 * Refresh Token으로 갱신 후 재시도합니다.
 * 하단 "토큰 갱신 모니터" 섹션에서 갱신 상태를 확인할 수 있습니다.
 */
export default function HomePage() {
  // ── Auth ──────────────────────────────────────────────────
  const { data: me, isLoading: meLoading } = useGetMe();
  const logoutMutation = useLogout();

  // ── Ping (30초 폴링) ──────────────────────────────────────
  const {
    data: ping,
    dataUpdatedAt: pingUpdatedAt,
    isLoading: pingLoading,
    isFetching: pingFetching,
    failureCount: pingFailures,
  } = useTestPing();

  // ── Test APIs ─────────────────────────────────────────────
  const { data: usersData, isLoading: usersLoading } = useTestUsers(1, 5);
  const { data: menus, isLoading: menusLoading } = useTestMenus();

  const menusList = Array.isArray(menus) ? menus : [];

  return (
    <>
      <title>홈 — API 연동 테스트</title>
      <S.PageRoot>
        <S.Shell>
          {/* ── TopBar: useGetMe / useLogout ── */}
          <S.TopBar>
            <S.TopBarLeft>
              <S.AvatarFallback>{me?.name?.[0] ?? "?"}</S.AvatarFallback>
              <S.UserInfo>
                {meLoading ? (
                  <S.Skeleton w="120px" h="14px" />
                ) : (
                  <>
                    <S.UserName>{me?.name ?? "—"}</S.UserName>
                    <S.UserMeta>
                      {me?.userId} · {me?.role}
                    </S.UserMeta>
                  </>
                )}
              </S.UserInfo>
              <S.HookTag>useGetMe()</S.HookTag>
            </S.TopBarLeft>

            <S.TopBarRight>
              <IsChip>API 연결됨</IsChip>
              <IsButton
                type="button"
                variant="outlined"
                size="sm"
                disabled={logoutMutation.isPending}
                onClick={() => logoutMutation.mutate()}
              >
                {logoutMutation.isPending ? "처리중…" : "로그아웃"}
              </IsButton>
              <S.HookTag>useLogout()</S.HookTag>
            </S.TopBarRight>
          </S.TopBar>

          {/* ── 토큰 갱신 모니터 (30초 폴링) ── */}
          <S.SectionCard style={{ marginBottom: 20 }}>
            <S.SectionHeader>
              <div>
                <S.SectionTitle>토큰 갱신 모니터</S.SectionTitle>
                <S.HookTag>useTestPing() — 30초마다 자동 호출</S.HookTag>
              </div>
              {pingFetching && <IsChip>요청 중...</IsChip>}
            </S.SectionHeader>
            {pingLoading ? (
              <S.Skeleton h="48px" />
            ) : (
              <S.ItemList>
                <S.ItemRow>
                  <S.ItemMain>
                    <S.ItemTitle>서버 시간</S.ItemTitle>
                    <S.ItemSub>{ping?.serverTime ?? "—"}</S.ItemSub>
                  </S.ItemMain>
                  <S.ItemMain>
                    <S.ItemTitle>인증 사용자</S.ItemTitle>
                    <S.ItemSub>
                      {ping?.user?.email ?? "—"} ({ping?.user?.role ?? "—"})
                    </S.ItemSub>
                  </S.ItemMain>
                  <S.ItemMain>
                    <S.ItemTitle>마지막 성공</S.ItemTitle>
                    <S.ItemSub>
                      {pingUpdatedAt
                        ? new Date(pingUpdatedAt).toLocaleTimeString("ko-KR")
                        : "—"}
                    </S.ItemSub>
                  </S.ItemMain>
                  <S.ItemEnd>
                    <div>실패 횟수: {pingFailures}</div>
                    <IsChip color={pingFailures > 0 ? "danger" : "success"}>
                      {pingFailures > 0 ? "갱신 필요" : "정상"}
                    </IsChip>
                  </S.ItemEnd>
                </S.ItemRow>
              </S.ItemList>
            )}
          </S.SectionCard>

          {/* ── Row 1: 사용자 / 메뉴 ── */}
          <S.SectionGrid cols={2}>
            {/* 사용자 목록 */}
            <S.SectionCard>
              <S.SectionHeader>
                <div>
                  <S.SectionTitle>사용자 목록</S.SectionTitle>
                  <S.HookTag>useTestUsers(1, 5)</S.HookTag>
                </div>
                {usersData && (
                  <S.StatSub>총 {usersData.meta?.total ?? 0}명</S.StatSub>
                )}
              </S.SectionHeader>
              {usersLoading ? (
                <S.SkeletonGroup>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <S.Skeleton key={i} h="48px" />
                  ))}
                </S.SkeletonGroup>
              ) : (usersData?.items ?? []).length === 0 ? (
                <S.EmptyState>사용자 없음</S.EmptyState>
              ) : (
                <S.ItemList>
                  {(usersData?.items ?? []).map((user) => (
                    <S.ItemRow key={user.id}>
                      <S.ItemAvatar>{user.name[0]}</S.ItemAvatar>
                      <S.ItemMain>
                        <S.ItemTitle>{user.name}</S.ItemTitle>
                        <S.ItemSub>{user.email}</S.ItemSub>
                      </S.ItemMain>
                      <S.RolePill>{user.role?.name ?? "—"}</S.RolePill>
                    </S.ItemRow>
                  ))}
                </S.ItemList>
              )}
            </S.SectionCard>

            {/* 메뉴 목록 */}
            <S.SectionCard>
              <S.SectionHeader>
                <div>
                  <S.SectionTitle>메뉴 정의</S.SectionTitle>
                  <S.HookTag>useTestMenus()</S.HookTag>
                </div>
                <S.StatSub>{menusList.length}건</S.StatSub>
              </S.SectionHeader>
              {menusLoading ? (
                <S.SkeletonGroup>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <S.Skeleton key={i} h="48px" />
                  ))}
                </S.SkeletonGroup>
              ) : menusList.length === 0 ? (
                <S.EmptyState>메뉴 없음</S.EmptyState>
              ) : (
                <S.ItemList>
                  {menusList.map((menu) => (
                    <S.ItemRow key={menu.menuKey}>
                      <S.ItemMain>
                        <S.ItemTitle>{menu.menuName}</S.ItemTitle>
                        <S.ItemSub>
                          {menu.menuKey} · {menu.path ?? "(경로 없음)"} ·{" "}
                          {menu.navSection ?? "—"}
                        </S.ItemSub>
                      </S.ItemMain>
                      <S.CategoryPill>sortRef: {menu.sortRef}</S.CategoryPill>
                    </S.ItemRow>
                  ))}
                </S.ItemList>
              )}
            </S.SectionCard>
          </S.SectionGrid>
        </S.Shell>
      </S.PageRoot>
    </>
  );
}
