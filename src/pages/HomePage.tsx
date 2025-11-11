/**
 * 홈/대시보드 페이지
 * - 인증된 사용자만 접근 가능 (ProtectedRoute로 보호됨)
 */
export default function HomePage() {
  return (
    <>
      <title>홈</title>
      <div style={{ padding: "24px" }}>
        <h1>홈</h1>
        <p>환영합니다! 여기가 대시보드 메인 화면입니다.</p>
      </div>
    </>
  );
}
