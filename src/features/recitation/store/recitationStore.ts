import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RecitationState {
  currentReciter: string | null;
  currentSurah: number | null;
  currentAyah: number | null;
  isPlaying: boolean;
  selectedReciter: string;
  currentStyle: string;
  setReciter: (reciter: string) => void;
  setSurah: (surah: number) => void;
  setAyah: (ayah: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setSelectedReciter: (reciter: string) => void;
  setCurrentAyah: (ayah: string) => void;
  setCurrentStyle: (style: string) => void;
}

export const useRecitationStore = create<RecitationState>()(
  persist(
    (set, get) => ({
      currentReciter: "1",
      currentSurah: null,
      currentAyah: null,
      isPlaying: false,
      selectedReciter: "1",
      currentStyle: "mujawaad",
      setCurrentStyle: (style) => set({ currentStyle: style }),
      setReciter: (reciter) => set({ currentReciter: reciter }),
      setSurah: (surah) => set({ currentSurah: surah }),
      setAyah: (ayah) => set({ currentAyah: ayah }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setSelectedReciter: (reciter) => set({ selectedReciter: reciter }),
      setCurrentAyah: (ayah) => set({ currentAyah: parseInt(ayah, 10) }),
    }),
    {
      name: "recitation-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
