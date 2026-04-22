/**
 * API가 `T[]` 또는 `{ items: T[] }` 로 내려줄 때 클라이언트에서 배열로 통일합니다.
 */
export function normalizeList<T>(data: unknown): T[] {
  if (data == null) return [];
  if (Array.isArray(data)) return data as T[];
  if (
    typeof data === "object" &&
    "items" in data &&
    Array.isArray((data as { items: unknown }).items)
  ) {
    return (data as { items: T[] }).items;
  }
  return [];
}
