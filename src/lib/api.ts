/**
 * api.ts — 하위 호환 래퍼
 *
 * 새 프로젝트에서는 `@/lib/axios` 를 직접 import 하세요.
 * 기존 코드에서 `@/lib/api` 를 import 하는 곳은 그대로 동작합니다.
 */
export { api, request, setUserIp } from "./axios";
