import styled from "styled-components";

// ─────────────────────────────────────────────────────────────
// 레이아웃
// ─────────────────────────────────────────────────────────────

export const PageRoot = styled.div`
  min-height: 100vh;
  background: #f8fafc;
`;

export const Shell = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(5)};
`;

// ─────────────────────────────────────────────────────────────
// TopBar
// ─────────────────────────────────────────────────────────────

export const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(7)};
  padding: ${({ theme }) => theme.spacing(4)} ${({ theme }) => theme.spacing(5)};
  background: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid rgba(107, 114, 128, 0.14);
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.05);
`;

export const TopBarLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(4)};
`;

export const Avatar = styled.img`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${({ theme }) => theme.colors.primary}33;
`;

export const AvatarFallback = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary}22;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

export const UserInfo = styled.div``;

export const UserName = styled.div`
  font-size: 0.9rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;
`;

export const UserMeta = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
`;

export const TopBarRight = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
`;

// ─────────────────────────────────────────────────────────────
// 섹션 공통
// ─────────────────────────────────────────────────────────────

export const SectionGrid = styled.div<{ cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ cols = 2 }) => cols}, 1fr);
  gap: ${({ theme }) => theme.spacing(5)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SectionCard = styled.section`
  background: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid rgba(107, 114, 128, 0.14);
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.04);
  padding: ${({ theme }) => theme.spacing(5)};
  overflow: hidden;
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing(3)};
  margin-bottom: ${({ theme }) => theme.spacing(4)};
`;

export const SectionTitle = styled.h2`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.01em;
`;

/** 코드에서 어떤 훅을 사용했는지 표시하는 뱃지 */
export const HookTag = styled.code`
  display: inline-block;
  margin-top: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.primary}12;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.7rem;
  font-family: "Fira Code", "Consolas", monospace;
  font-weight: 600;
  white-space: nowrap;
`;

export const Skeleton = styled.div<{ h?: string; w?: string }>`
  height: ${({ h = "16px" }) => h};
  width: ${({ w = "100%" }) => w};
  border-radius: 6px;
  background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
`;

export const SkeletonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

// ─────────────────────────────────────────────────────────────
// 대시보드 통계 카드
// ─────────────────────────────────────────────────────────────

export const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing(4)};
  margin-bottom: ${({ theme }) => theme.spacing(5)};

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const StatCard = styled.div<{ $color?: string }>`
  background: ${({ theme }) => theme.colors.bg};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid rgba(107, 114, 128, 0.14);
  box-shadow: 0 2px 8px rgba(17, 24, 39, 0.04);
  padding: ${({ theme }) => theme.spacing(5)};
  border-top: 3px solid ${({ $color = "#3b82f6" }) => $color};
`;

export const StatLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.muted};
  margin-bottom: ${({ theme }) => theme.spacing(2)};
`;

export const StatValue = styled.div`
  font-size: 1.6rem;
  font-weight: 800;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: -0.03em;
  line-height: 1;
`;

export const StatSub = styled.div`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: ${({ theme }) => theme.spacing(1)};
`;

// ─────────────────────────────────────────────────────────────
// 리스트 / 테이블 공통
// ─────────────────────────────────────────────────────────────

export const ItemList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const ItemRow = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radius.md};
  background: #f8fafc;
  border: 1px solid rgba(107, 114, 128, 0.08);
  font-size: 0.82rem;
  transition: background 0.12s;

  &:hover {
    background: #f1f5f9;
  }
`;

export const ItemAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary}1a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  flex-shrink: 0;
`;

export const ItemMain = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ItemTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ItemSub = styled.div`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ItemEnd = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.muted};
  flex-shrink: 0;
  text-align: right;
`;

// ─────────────────────────────────────────────────────────────
// 배지 / 상태
// ─────────────────────────────────────────────────────────────

export const StatusDot = styled.span<{ $read?: boolean }>`
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${({ $read, theme }) =>
    $read ? "transparent" : theme.colors.primary};
  border: ${({ $read }) => ($read ? "1.5px solid #d1d5db" : "none")};
  flex-shrink: 0;
`;

export const CategoryPill = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.secondary}18;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 0.68rem;
  font-weight: 700;
  flex-shrink: 0;
`;

export const RolePill = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 100px;
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.68rem;
  font-weight: 700;
  flex-shrink: 0;
`;

export const PricePill = styled.span`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 100px;
  background: #f0fdf4;
  color: #16a34a;
  font-size: 0.72rem;
  font-weight: 700;
  flex-shrink: 0;
`;

// ─────────────────────────────────────────────────────────────
// 차트 바 (간이 막대 시각화)
// ─────────────────────────────────────────────────────────────

export const BarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing(2)};
`;

export const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(2)};
  font-size: 0.78rem;
`;

export const BarLabel = styled.span`
  width: 80px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.muted};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const BarTrack = styled.div`
  flex: 1;
  height: 8px;
  background: #f1f5f9;
  border-radius: 100px;
  overflow: hidden;
`;

export const BarFill = styled.div<{ $pct: number; $color?: string }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $color = "#3b82f6" }) => $color};
  border-radius: 100px;
  transition: width 0.5s ease;
`;

export const BarValue = styled.span`
  width: 44px;
  text-align: right;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  flex-shrink: 0;
`;

// ─────────────────────────────────────────────────────────────
// 알림
// ─────────────────────────────────────────────────────────────

export const NotifRow = styled.li<{ $read?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing(3)};
  padding: ${({ theme }) => theme.spacing(3)};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ $read }) => ($read ? "transparent" : "#eff6ff")};
  border: 1px solid ${({ $read }) => ($read ? "rgba(107,114,128,0.08)" : "#bfdbfe")};
  font-size: 0.82rem;
  cursor: pointer;
  transition: background 0.12s;

  &:hover {
    background: #f1f5f9;
  }
`;

export const NotifContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NotifTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

export const NotifMsg = styled.div`
  font-size: 0.72rem;
  color: ${({ theme }) => theme.colors.muted};
  margin-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// ─────────────────────────────────────────────────────────────
// Empty / 에러 상태
// ─────────────────────────────────────────────────────────────

export const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing(6)} 0;
  font-size: 0.82rem;
  color: ${({ theme }) => theme.colors.muted};
`;
