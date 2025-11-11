import { atom } from "recoil";

export const usernameState = atom<string>({
  key: "usernameState",
  default: "eastzoo",
});
