// store.ts
import { create } from "zustand";

interface RecitationState {
  currentReciter: string | null;
  currentSurah: number | null;
  currentAyah: number | null;
  isPlaying: boolean;
  setReciter: (reciter: string) => void;
  setSurah: (surah: number) => void;
  setAyah: (ayah: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
}

const DEFAULT_RECITER = "Abdul_Basit_Murattal_64kbps"; // Set your default reciter here

export const useRecitationStore = create<RecitationState>((set) => ({
  currentReciter: DEFAULT_RECITER,
  currentSurah: null,
  currentAyah: null,
  isPlaying: false,
  setReciter: (reciter) => set({ currentReciter: reciter }),
  setSurah: (surah) => set({ currentSurah: surah }),
  setAyah: (ayah) => set({ currentAyah: ayah }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}));
