import { atom } from 'jotai';

/**
 * 샘플 Jotai atom. 실제 사용 시 `any` 대신 구체 타입을 지정하세요.
 *
 * 컴포넌트에서 사용:
 *
 * * 1) 읽기 + 쓰기
 * ```tsx
 * import { useAtom } from 'jotai';
 * import { exampleAtom } from '@/store/exampleAtom';
 *
 * function MyComponent() {
 *   const [value, setValue] = useAtom(exampleAtom);
 *   return (
 *     <button type="button" onClick={() => setValue('hello')}>
 *       {String(value)}
 *     </button>
 *   );
 * }
 * ```
 *
 * * 2) 읽기만 (불필요한 리렌더 줄이기)
 * ```tsx
 * import { useAtomValue } from 'jotai';
 * import { exampleAtom } from '@/store/exampleAtom';
 *
 * function Display() {
 *   const value = useAtomValue(exampleAtom);
 *   return <span>{String(value)}</span>;
 * }
 * ```
 *
 * * 3) 쓰기만 (값 구독 없음 → 이 atom 변경 시 이 컴포넌트는 리렌더되지 않음)
 * ```tsx
 * import { useSetAtom } from 'jotai';
 * import { exampleAtom } from '@/store/exampleAtom';
 *
 * function ResetButton() {
 *   const setValue = useSetAtom(exampleAtom);
 *   return (
 *     <button type="button" onClick={() => setValue(null)}>
 *       초기화
 *     </button>
 *   );
 * }
 * ```
 *
 * * 리렌더 동작:
 * * - 한 컴포넌트가 `useSetAtom`으로 이 atom 값을 바꾸면, 같은 atom을 `useAtom` 또는 `useAtomValue`로
 * *   읽고 있던 컴포넌트는 Jotai가 구독을 감지해 자동으로 리렌더됩니다.
 * * - `useSetAtom`만 쓰는 컴포넌트는 값을 구독하지 않으므로, 이 atom이 바뀌어도 리렌더되지 않습니다.
 *
 * ? 이 템플릿은 루트에 Jotai Provider를 두지 않아도 위 훅으로 전역처럼 공유됩니다.
 * ? 스토어를 화면별로 분리하려면 Jotai `Provider`와 `createStore`를 사용하세요.
 */
export const exampleAtom = atom<any>(null);
