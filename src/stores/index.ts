import type { User } from "@/api";
import { atom, createStore } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const jotaiStore = createStore();

export const navbarTitleAtom = atom("BisaBimbel");
export const currentClassAtom = atomWithStorage<number | null>(
  "currentClass",
  null,
);

export const userProfileAtom = atomWithStorage<User | null>(
  "userProfile",
  null,
);
