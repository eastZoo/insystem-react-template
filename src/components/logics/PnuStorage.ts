//저장 함수
export function savePnus(key: string, pnus: Set<string>)
{
  const arr = Array.from(pnus);
  localStorage.setItem(key,JSON.stringify(arr));
}
//불러오기 함수
export function loadPnus(key: string): string[]{
  const raw = localStorage.getItem(key);
  if(!raw) return[];
  try { return JSON.parse(raw) as string[]; }
  catch { return[];}
}
//삭제 함수
export function deletePnus(key: string)
{
  localStorage.removeItem(key);
}
