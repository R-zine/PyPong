import { Upgrades } from "./../constants";
import { create } from "zustand";

interface IStore {
  stage: "intro" | "game" | "upgrade";
  setStage: (newStage: IStore["stage"]) => void;
  score: { current: number; total: number };
  incrementScore: () => void;
  progress: { total: number; spent: number };
  upgrades: { [upgrade: string]: number };
  buyUpgrade: (upgrade: string) => void;
  error: string;
  clearError: () => void;
}

export const useStore = create<IStore>((set, get) => ({
  stage: "intro",
  setStage: (newStage: IStore["stage"]) => set({ stage: newStage }),
  score: { current: 0, total: 0 },
  incrementScore: () =>
    set((state) => ({
      score: {
        current:
          state.score.current +
          (!state.upgrades["Score Multiplier"]
            ? 1
            : state.upgrades["Score Multiplier"] === 1
            ? 2
            : state.upgrades["Score Multiplier"] === 2
            ? 5
            : 10),
        total:
          state.score.total +
          (!state.upgrades["Score Multiplier"]
            ? 1
            : state.upgrades["Score Multiplier"] === 1
            ? 2
            : state.upgrades["Score Multiplier"] === 2
            ? 5
            : 10),
      },
    })),
  progress: {
    total: Object.keys(Upgrades).reduce(
      (acc, el) => (acc += Upgrades[el][2].price),
      0
    ),
    spent: 0,
  },
  upgrades: {
    "Enemy Paddle": 0,
    "Your Paddle": 0,
    "Balls And Lives": 0,
    "Score Multiplier": 0,
    ballcalypse: 0,
  },
  buyUpgrade: (upgrade: string) => {
    let currentUpgrades = structuredClone(get().upgrades);
    currentUpgrades[upgrade]++;

    const currentPrice = Upgrades[upgrade][currentUpgrades[upgrade] - 1].price;

    if (currentPrice > get().score.current)
      set({ error: `You don't have ${currentPrice} to spend!` });
    else
      set((state) => ({
        upgrades: currentUpgrades,
        progress: {
          ...state.progress,
          spent: state.progress.spent + currentPrice,
        },
        score: { ...state.score, current: state.score.current - currentPrice },
      }));
  },
  error: "",
  clearError: () => set({ error: "" }),
}));
