import { create, createStore } from "zustand";

interface CountState {
  count: number;
  inc: () => void;
  dec: () => void;
  reset: () => void;
}

export const useMyCount = create<CountState>((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set(() => ({ count: 0 })),
}));

export const countStore = createStore<CountState>((set) => ({
  count: 0,
  inc: () => set((state) => ({ count: state.count + 1 })),
  dec: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set(() => ({ count: 0 })),
}));
