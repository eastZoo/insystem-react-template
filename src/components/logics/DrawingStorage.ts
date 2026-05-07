export type PathCoords = [number, number][]; // 경로 구성 배열 타입 [경도,위도]
const KEY_PREFIX = "drawing:"; // 충돌방지 키 접두사


/* 드로잉 저장 */
export function saveDrawing(key: string, coords: PathCoords) {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + key);
    const list = raw ? (JSON.parse(raw) as PathCoords[]) : [];
    list.push(coords); // 기존 배열에 새 선 추가
    localStorage.setItem(KEY_PREFIX + key, JSON.stringify(list));
  } catch (e) {
    console.error("saveDrawing error:", e);
  }
}

/* 드로잉 불러오기 */
export function loadDrawing(key: string): PathCoords[] {
  try {
    const raw = localStorage.getItem(KEY_PREFIX + key);
    return raw ? (JSON.parse(raw) as PathCoords[]) : [];
  } catch (e) {
    console.error("loadDrawing error:", e);
    return [];
  }
}

/* 드로잉 삭제 */
export function deleteDrawing(key: string) {
    try {
        localStorage.removeItem(KEY_PREFIX + key);
    } catch (e) {
        console.error("deleteDrawing error",e);
    }
}
