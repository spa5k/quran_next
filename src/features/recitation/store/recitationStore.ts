import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RecitationState {
  currentReciter: string | null;
  currentSurah: number | null;
  currentAyah: number | null;
  isPlaying: boolean;
  selectedReciter: string;
  currentStyle: string;
  duration: number;
  currentTime: number;
  setReciter: (reciter: string) => void;
  setSurah: (surah: number) => void;
  setAyah: (ayah: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setSelectedReciter: (reciter: string) => void;
  setCurrentAyah: (ayah: string) => void;
  setCurrentStyle: (style: string) => void;
  setDuration: (duration: number) => void;
  setCurrentTime: (time: number) => void;
}

export const useRecitationStore = create<RecitationState>()(
  persist(
    (set, get) => ({
      currentReciter: "abdul_baset",
      currentSurah: null,
      currentAyah: null,
      isPlaying: false,
      selectedReciter: "abdul_baset",
      currentStyle: "mujawaad",
      duration: 0,
      currentTime: 0,
      setCurrentStyle: (style) => set({ currentStyle: style }),
      setReciter: (reciter) => set({ currentReciter: reciter }),
      setSurah: (surah) => set({ currentSurah: surah }),
      setAyah: (ayah) => set({ currentAyah: ayah }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setSelectedReciter: (reciter) => set({ selectedReciter: reciter }),
      setCurrentAyah: (ayah) => set({ currentAyah: parseInt(ayah, 10) }),
      setDuration: (duration) => set({ duration }),
      setCurrentTime: (time) => set({ currentTime: time }),
    }),
    {
      name: "recitation-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
