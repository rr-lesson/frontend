import { atom, createStore } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const jotaiStore = createStore();

export const navbarTitleAtom = atom("RR Lesson");
export const currentClassAtom = atomWithStorage<number | null>(
  "currentClass",
  null,
);
