"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import AyahPlayer from "@/features/ayah/AyahPlayer";
import { useQuery } from "@tanstack/react-query";
import { FastForwardIcon, PauseIcon, PlayIcon, RewindIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ayahCount } from "../data/ayahCount";
import { reciters } from "../data/reciters";
import { useRecitationStore } from "../store/recitationStore";
import type { Timings } from "../types/timingTypes";
import { timeFormatter } from "../utils/timeFormatter";

const fetchTimings = async (reciterSlug: string, surah: number, style: string) => {
  const response = await fetch(
    `https://raw.githubusercontent.com/spa5k/quran_timings_api/master/data/${style}/${reciterSlug}/${surah}.json`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<Timings>;
};

export function QuranRecitationBar() {
  const { currentReciter, currentAyah, currentSurah, setSurah, isPlaying, setIsPlaying, step, setStep } =
    useRecitationStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [verseTimings, setVerseTimings] = useState<any[]>([]);

  const params = useParams() as { number: string };

  const reciter = reciters.find((reciter) => reciter.slug === currentReciter);

  const { data: timings, error } = useQuery({
    queryKey: ["timings", currentReciter, currentSurah, reciter?.slug],
    queryFn: () => fetchTimings(reciter!.slug, currentSurah!, reciter!.style),
    enabled: !!currentReciter && !!currentSurah,
  });

  useEffect(() => {
    if (!currentSurah) {
      setSurah(parseInt(params.number));
    }
  }, [currentSurah, params.number, setSurah]);

  useEffect(() => {
    if (timings) {
      setVerseTimings(timings.audio_files);
    }
  }, [timings]);

  useEffect(() => {
    if (audioRef.current && verseTimings.length > 0) {
      const handleTimeUpdate = () => {
        const currentTime = audioRef.current!.currentTime * 1000; // Convert to milliseconds
        const currentAyahIndex = verseTimings.findIndex(
          (timing) => timing.timestamp_from <= currentTime && timing.timestamp_to >= currentTime,
        );
        if (currentAyahIndex !== -1 && currentAyahIndex + 1 !== currentAyah) {
          setStep(currentAyahIndex + 1);
        }
      };

      audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
      return () => {
        audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
      };
    }
  }, [verseTimings, currentAyah, setStep]);

  const handleSliderChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value; // Convert to seconds
    }
  };

  const handleSliderCommit = (value: number) => {
    setIsSeeking(false);
    if (audioRef.current) {
      audioRef.current.currentTime = value; // Convert to seconds
    }
  };

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const moveForward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime += 10;
    }
  };

  const moveBackward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime -= 10;
    }
  };

  if (!currentSurah || !currentAyah) {
    return null;
  }

  if (error) {
    return <div>Error loading timings data</div>;
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
              <AvatarFallback>{currentReciter}</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-sm font-medium">{reciter?.name}</div>
        </div>
        <Slider
          value={[audioRef.current ? audioRef.current.currentTime : 0]}
          max={audioRef.current?.duration ? audioRef.current.duration : 0}
          onValueCommit={(value) => handleSliderCommit(value[0])}
          onValueChange={(value) => {
            setIsSeeking(true);
            handleSliderChange(value[0]);
          }}
        />
        <p>{timeFormatter(audioRef.current?.currentTime || 0)}</p>
        <p>{timeFormatter(audioRef.current?.duration || 0)}</p>
        <div className="flex flex-row items-center gap-2">
          <Button onClick={moveBackward} aria-label="Move Backward">
            <RewindIcon className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button onClick={togglePlayPause} aria-label="Play/Pause">
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </Button>
          <Button onClick={moveForward} aria-label="Move Forward">
            <FastForwardIcon className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
      <AyahPlayer audioRef={audioRef} />
    </div>
  );
}
