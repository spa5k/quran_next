"use client";

import { useAudio } from "@/components/providers/AudioProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ayahCount } from "../data/ayahCount";
import { reciters } from "../data/reciters";
import { useRecitationStore } from "../store/recitationStore";
import type { Timings } from "../types/timingTypes";

const fetchTimings = async (reciterSlug: string, surah: number, style: string): Promise<Timings> => {
  const response = await fetch(
    `https://raw.githubusercontent.com/spa5k/quran_timings_api/master/data/${style}/${reciterSlug}/${surah}.json`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch timings data");
  }
  return response.json();
};

export function QuranRecitationBar() {
  const { currentReciter, currentAyah, currentSurah, setSurah } = useRecitationStore();
  const { isPlaying, play, pause, progress, seek, error: audioError, duration } = useAudio();

  const params = useParams() as { number: string };

  const reciter = useMemo(() => reciters.find((reciter) => reciter.slug === currentReciter), [currentReciter]);

  const { data: timings, error, isLoading } = useQuery({
    queryKey: ["timings", currentReciter, currentSurah, reciter?.slug],
    queryFn: () => fetchTimings(reciter!.slug, currentSurah!, reciter!.style),
    enabled: !!currentReciter && !!currentSurah,
  });

  useEffect(() => {
    if (!currentSurah) {
      setSurah(parseInt(params.number));
    }
  }, [currentSurah, params.number, setSurah]);

  const audioUrl = timings?.audio_files[0].audio_url;

  const [sliderValue, setSliderValue] = useState(progress * 100);

  useEffect(() => {
    console.log(progress * 100);
    setSliderValue(progress * 100);
  }, [progress]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
    seek(value[0] / 100);
  };

  if (!currentSurah || !currentAyah) {
    return null;
  }

  if (error || audioError) {
    return <div>Error loading timings data: {error?.message || audioError}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-lg border p-6 w-full mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col">
            <div className="text-sm text-muted-foreground">Ayah</div>
            <div className="text-2xl font-bold">{`${currentSurah}:${currentAyah}`}</div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-sm text-muted-foreground">Total Ayahs</div>
            <div className="text-2xl font-bold">{ayahCount[currentSurah! - 1]}</div>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center">
            <Avatar>
              <AvatarImage src="https://avatar.iran.liara.run/public/boy" alt={currentReciter!} />
              <AvatarFallback>{currentReciter?.[0]?.toUpperCase() + (currentReciter?.slice(1) ?? "")}</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-sm font-medium">{reciter?.name}</div>
        </div>
        <div className="flex flex-row items-center gap-4">
          <button onClick={isPlaying ? () => pause() : () => play(audioUrl!)} className="p-2 bg-primary rounded">
            {isPlaying ? "Pause" : "Play"}
          </button>

          <Slider
            value={[sliderValue]}
            onValueChange={handleSliderChange}
            max={100}
            step={0.01}
          />
        </div>
      </div>
    </div>
  );
}
