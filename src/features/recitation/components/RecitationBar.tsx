"use client";

import { useAudio } from "@/components/providers/AudioProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { PauseIcon, PlayIcon } from "lucide-react";
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
  const { currentReciter, currentAyah, currentSurah, setSurah, setCurrentAyah } = useRecitationStore();
  const { isPlaying, play, pause, progress, seek, error: audioError, currentTime } = useAudio();

  const [step, setStep] = useState(0);

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
    setSliderValue(progress * 100);
    if (!timings || !currentTime) {
      return;
    }
    const currentStep = timings?.audio_files[0].verse_timings.findIndex((timing) =>
      timing.timestamp_from <= currentTime * 1000 && timing.timestamp_to >= currentTime * 1000
    );
    setStep(currentStep! + 1);
  }, [progress]);

  const handleSliderChange = (value: number[]) => {
    setSliderValue(value[0]);
    seek(value[0] / 100);
  };

  useEffect(() => {
    if (!timings) {
      return;
    }
    if (audioUrl) {
      play(audioUrl);
    }

    const currentAyahTimings = timings.audio_files[0].verse_timings[currentAyah! - 1].timestamp_from;

    const seekPercentage = currentAyahTimings / timings.audio_files[0].duration;
    seek(seekPercentage);
  }, [currentAyah]);

  if (!currentSurah || !currentAyah) {
    return null;
  }

  if (error || audioError) {
    return <div>Error loading timings data: {error?.message || audioError}</div>;
  }

  if (isLoading || !timings) {
    return <div>Loading...</div>;
  }

  const verseTimings = timings.audio_files[0].verse_timings;
  const totalDuration = timings.audio_files[0].duration;

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
          <Button onClick={isPlaying ? () => pause() : () => play(audioUrl!)} disabled={!audioUrl}>
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </Button>

          <TooltipProvider>
            <div className="flex flex-col items-center w-full">
              <Slider
                value={[sliderValue]}
                onValueChange={handleSliderChange}
                max={100}
                step={10}
                disabled={!audioUrl}
                className="transition-all"
              />
              <div className="mt-1.5 flex flex-row justify-between w-full relative">
                {verseTimings.map((timing, index) => {
                  const position = (timing.timestamp_from / totalDuration) * 100;
                  const nextPosition = index < verseTimings.length - 1
                    ? (verseTimings[index + 1].timestamp_from / totalDuration) * 100
                    : 100;

                  const isCurrentStep = step === index + 1;

                  return (
                    <Tooltip key={`step-${index}`}>
                      <TooltipTrigger
                        className={clsx(
                          "absolute text-sm",
                          isCurrentStep && "text-primary",
                          !isCurrentStep && "text-muted-foreground text-10 opacity-40",
                        )}
                        style={{ left: `${position}%` }}
                        onClick={() => {
                          setCurrentAyah((index + 1).toString());
                        }}
                      >
                        <span
                          className={clsx(
                            "absolute text-sm",
                            isCurrentStep && "text-primary",
                            !isCurrentStep && "text-muted-foreground text-10 opacity-40",
                          )}
                          style={{ left: `${position}%` }}
                          role="presentation"
                        >
                          |
                        </span>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        align="center"
                        style={{ left: `${position}%` }}
                        // className="absolute"
                        role="tooltip"
                      >
                        <p>{`Ayah ${index + 1}`}</p>
                      </TooltipContent>
                      {isCurrentStep && (
                        <div
                          className="absolute bg-primary opacity-20"
                          style={{
                            left: `${position}%`,
                            width: `${nextPosition - position}%`,
                            height: "2px",
                            top: "50%",
                          }}
                        />
                      )}
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </TooltipProvider>
        </div>
      </div>
    </div>
  );
}
