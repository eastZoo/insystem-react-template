import { Link } from "react-router-dom";

/**
 * 404 페이지
 * - 없는 경로 접근 시 표시
 */
export default function NotFoundPage() {
  return (
    <>
      <title>404 - 페이지 없음</title>
      <div style={{ padding: "24px" }}>
        <h2>404</h2>
        <p>페이지를 찾을 수 없습니다.</p>
        <Link to="/">홈으로 가기</Link>
      </div>
    </>
  );
}
