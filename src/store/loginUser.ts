import { atom } from "jotai";
import type { User } from "@/types/User";

export const userState = atom<User | null>(null);
