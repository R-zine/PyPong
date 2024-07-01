import { create } from "zustand";

interface IStore {
  stage: "intro" | "game" | "upgrade";
  setStage: (newStage: IStore["stage"]) => void;
}

export const useStore = create<IStore>((set) => ({
  stage: "intro",
  setStage: (newStage: IStore["stage"]) => set({ stage: newStage }),
}));
