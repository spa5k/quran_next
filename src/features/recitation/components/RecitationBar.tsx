"use client";

import ErrorBoundary from "@/components/generic/ErrorBoundary";
import { useAudio } from "@/components/providers/AudioProvider";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { fetchTimings } from "../api/timings";
import { ayahCount } from "../data/ayahCount";
import { reciters } from "../data/reciters";
import { useRecitationStore } from "../store/recitationStore";
import { AvatarSection } from "./RecitationAvatar";
import { RecitationControls } from "./RecitationControls";
import { SliderSection } from "./SliderSection";

export function QuranRecitationBar() {
  const {
    currentReciter,
    currentAyah,
    currentSurah,
    setSurah,
  } = useRecitationStore();
  const {
    error: audioError,
  } = useAudio();

  const params = useParams() as { number: string };

  const reciter = useMemo(
    () => reciters.find((reciter) => reciter.slug === currentReciter),
    [currentReciter],
  );

  const {
    data: timings,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["timings", currentReciter, currentSurah, reciter?.slug],
    queryFn: () => fetchTimings(reciter!.slug, currentSurah!, reciter!.style),
    enabled: !!currentReciter && !!currentSurah,
  });

  useEffect(() => {
    if (!currentSurah) {
      setSurah(parseInt(params.number));
    }
  }, [currentSurah, params.number, setSurah]);

  const audioUrl = useMemo(() => timings?.audio_files[0].audio_url, [timings]);

  if (!currentSurah || !currentAyah) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-lg border p-6 w-full mx-auto flex flex-col gap-4">
        <div className="text-red-500">Error: Missing Surah or Ayah information.</div>
      </div>
    );
  }

  if (error || audioError) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-lg border p-6 w-full mx-auto flex flex-col gap-4">
        <div className="text-red-500">Error: {JSON.stringify(error || audioError)}</div>
        <Button onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading || !timings) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-lg border p-6 w-full mx-auto flex flex-col gap-4">
        Loading...
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-lg border p-6 w-full mx-auto flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <ErrorBoundary>
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col">
              <div className="text-sm text-muted-foreground">Ayah</div>
              <div className="text-2xl font-bold">{`${currentSurah}:${currentAyah}`}</div>
            </div>
            <div className="flex flex-col items-end">
              <div className="text-sm text-muted-foreground">Total Ayahs</div>
              <div className="text-2xl font-bold">
                {ayahCount[currentSurah! - 1]}
              </div>
            </div>
          </div>
        </ErrorBoundary>
        <AvatarSection name={reciter?.name!} currentReciter={currentReciter!} />
        <div className="flex flex-row items-center gap-4">
          <ErrorBoundary>
            <RecitationControls audioUrl={audioUrl} />
          </ErrorBoundary>
          <ErrorBoundary>
            <SliderSection
              audioUrl={audioUrl!}
              timings={timings}
            />
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}
