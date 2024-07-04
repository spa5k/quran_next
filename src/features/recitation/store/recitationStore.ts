// store.ts
import { create } from "zustand";

interface RecitationState {
  currentReciter: string | null;
  currentSurah: number | null;
  currentAyah: number | null;
  setReciter: (reciter: string) => void;
  setSurah: (surah: number) => void;
  setAyah: (ayah: number) => void;
}

export const useRecitationStore = create<RecitationState>((set) => ({
  currentReciter: null,
  currentSurah: null,
  currentAyah: null,
  setReciter: (reciter) => set({ currentReciter: reciter }),
  setSurah: (surah) => set({ currentSurah: surah }),
  setAyah: (ayah) => set({ currentAyah: ayah }),
}));
