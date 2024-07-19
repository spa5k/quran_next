import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RecitationState {
  currentReciter: string | null;
  currentSurah: number | null;
  currentAyah: number | null;
  isPlaying: boolean;
  selectedReciter: string;
  selectedQuality: number;
  setReciter: (reciter: string) => void;
  setSurah: (surah: number) => void;
  setAyah: (ayah: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setSelectedReciter: (reciter: string) => void;
  setSelectedQuality: (quality: number) => void;
  setCurrentAyah: (ayah: string) => void;
}

const DEFAULT_RECITER = "Abdul_Basit_Murattal";

export const useRecitationStore = create<RecitationState>()(
  persist(
    (set, get) => ({
      currentReciter: DEFAULT_RECITER,
      currentSurah: null,
      currentAyah: null,
      isPlaying: false,
      selectedReciter: DEFAULT_RECITER,
      selectedQuality: 64,
      setReciter: (reciter) => set({ currentReciter: reciter }),
      setSurah: (surah) => set({ currentSurah: surah }),
      setAyah: (ayah) => set({ currentAyah: ayah }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
      setSelectedReciter: (reciter) => set({ selectedReciter: reciter }),
      setSelectedQuality: (quality) => set({ selectedQuality: quality }),
      setCurrentAyah: (ayah) => set({ currentAyah: parseInt(ayah, 10) }),
    }),
    {
      name: "recitation-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
