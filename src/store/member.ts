import { atom } from "jotai";
import type { Member } from "@/types/member";

export const memberState = atom<Member | null>(null);
