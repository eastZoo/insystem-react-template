import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { RECOIL_PERSIST_KEY } from "@/lib/constants/sharedStrings";
import type { User } from "@/types/User";

const { persistAtom } = recoilPersist({
  key: RECOIL_PERSIST_KEY,
});

export const userState = atom<User | null>({
  key: `user`,
  default: null,
  effects_UNSTABLE: [persistAtom],
});
