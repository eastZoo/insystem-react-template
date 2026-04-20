import { Badge, IsButton } from "insystem-atoms";
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
  const { data: permissions, isLoading: permissionsLoading } =
    useTestPermissions();
  const { data: orders, isLoading: ordersLoading } = useTestOrders();
  const { data: stocks, isLoading: stocksLoading } = useTestStocks();

  const menusList = Array.isArray(menus) ? menus : [];
  const permissionsList = Array.isArray(permissions) ? permissions : [];
  const ordersList = Array.isArray(orders) ? orders : [];
  const stocksList = Array.isArray(stocks) ? stocks : [];

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
                      {me?.email} · {me?.role}
                    </S.UserMeta>
                  </>
                )}
              </S.UserInfo>
              <S.HookTag>useGetMe()</S.HookTag>
            </S.TopBarLeft>

            <S.TopBarRight>
              <Badge variant="success" size="sm" dot>
                API 연결됨
              </Badge>
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
              {pingFetching && (
                <Badge variant="warning" size="sm">
                  요청 중...
                </Badge>
              )}
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
                    <Badge
                      variant={pingFailures > 0 ? "danger" : "success"}
                      size="sm"
                    >
                      {pingFailures > 0 ? "갱신 필요" : "정상"}
                    </Badge>
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

          {/* ── Row 2: 권한 / 재고 ── */}
          <S.SectionGrid cols={2}>
            {/* 권한 목록 */}
            <S.SectionCard>
              <S.SectionHeader>
                <div>
                  <S.SectionTitle>역할별 권한</S.SectionTitle>
                  <S.HookTag>useTestPermissions()</S.HookTag>
                </div>
                <S.StatSub>{permissionsList.length}건</S.StatSub>
              </S.SectionHeader>
              {permissionsLoading ? (
                <S.SkeletonGroup>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <S.Skeleton key={i} h="48px" />
                  ))}
                </S.SkeletonGroup>
              ) : permissionsList.length === 0 ? (
                <S.EmptyState>권한 없음</S.EmptyState>
              ) : (
                <S.ItemList>
                  {permissionsList.map((perm) => (
                    <S.ItemRow key={perm.id}>
                      <S.ItemMain>
                        <S.ItemTitle>{perm.menuKey}</S.ItemTitle>
                        <S.ItemSub>
                          R:{perm.canRead ? "O" : "X"} C:
                          {perm.canCreate ? "O" : "X"} U:
                          {perm.canUpdate ? "O" : "X"} D:
                          {perm.canDelete ? "O" : "X"}
                        </S.ItemSub>
                      </S.ItemMain>
                      <S.RolePill>role: {perm.roleId.slice(0, 8)}…</S.RolePill>
                    </S.ItemRow>
                  ))}
                </S.ItemList>
              )}
            </S.SectionCard>

            {/* 재고 현황 */}
            <S.SectionCard>
              <S.SectionHeader>
                <div>
                  <S.SectionTitle>상품 재고</S.SectionTitle>
                  <S.HookTag>useTestStocks()</S.HookTag>
                </div>
                <S.StatSub>{stocksList.length}건</S.StatSub>
              </S.SectionHeader>
              {stocksLoading ? (
                <S.SkeletonGroup>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <S.Skeleton key={i} h="48px" />
                  ))}
                </S.SkeletonGroup>
              ) : stocksList.length === 0 ? (
                <S.EmptyState>재고 없음</S.EmptyState>
              ) : (
                <S.ItemList>
                  {stocksList.map((stock) => (
                    <S.ItemRow key={stock.id}>
                      <S.ItemMain>
                        <S.ItemTitle>{stock.productName}</S.ItemTitle>
                        <S.ItemSub>{stock.productKey}</S.ItemSub>
                      </S.ItemMain>
                      <S.ItemEnd>
                        <div>재고: {stock.quantity}개</div>
                        <S.PricePill>
                          ₩{stock.price.toLocaleString()}
                        </S.PricePill>
                      </S.ItemEnd>
                    </S.ItemRow>
                  ))}
                </S.ItemList>
              )}
            </S.SectionCard>
          </S.SectionGrid>

          {/* ── Row 3: 주문 목록 ── */}
          <S.SectionGrid cols={1}>
            <S.SectionCard>
              <S.SectionHeader>
                <div>
                  <S.SectionTitle>주문 목록</S.SectionTitle>
                  <S.HookTag>useTestOrders()</S.HookTag>
                </div>
                <S.StatSub>{ordersList.length}건</S.StatSub>
              </S.SectionHeader>
              {ordersLoading ? (
                <S.SkeletonGroup>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <S.Skeleton key={i} h="48px" />
                  ))}
                </S.SkeletonGroup>
              ) : ordersList.length === 0 ? (
                <S.EmptyState>
                  주문 없음 — Swagger에서 POST /api/app/orders로 주문을
                  생성해보세요
                </S.EmptyState>
              ) : (
                <S.ItemList>
                  {ordersList.map((order) => (
                    <S.ItemRow key={order.id}>
                      <S.ItemMain>
                        <S.ItemTitle>주문 #{order.id.slice(0, 8)}…</S.ItemTitle>
                        <S.ItemSub>
                          {order.items
                            .map((i) => `${i.productName} x${i.quantity}`)
                            .join(", ")}
                        </S.ItemSub>
                      </S.ItemMain>
                      <S.ItemEnd>
                        <div>₩{order.totalAmount.toLocaleString()}</div>
                        <Badge
                          variant={
                            order.status === "CANCELLED" ? "danger" : "success"
                          }
                          size="sm"
                        >
                          {order.status}
                        </Badge>
                      </S.ItemEnd>
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
