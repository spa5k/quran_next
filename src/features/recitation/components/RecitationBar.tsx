"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { FastForwardIcon, PauseIcon, PlayIcon, RewindIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ayahCount } from "../data/ayahCount";
import { reciters } from "../data/reciters";
import { useRecitationStore } from "../store/recitationStore";
import { getHowlInstance, stopCurrentHowl } from "../utils/howl";

export function QuranRecitationBar() {
  const { currentReciter, currentAyah, isPlaying, setIsPlaying, currentSurah, setSurah, setAyah, selectedQuality } =
    useRecitationStore();
  const [howl, setHowl] = useState<Howl | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [timings, setTimings] = useState<number[]>([]);

  const params = useParams() as { number: string };

  useEffect(() => {
    if (!currentSurah) {
      setSurah(parseInt(params.number));
    }
  }, [currentSurah, params.number, setSurah]);

  useEffect(() => {
    if (currentReciter && currentSurah) {
      const folder = reciters.find((reciter) => reciter.folder_name === currentReciter)?.slug;
      fetch(`https://raw.githubusercontent.com/spa5k/quran_timings_api/master/everyayah/${folder}/${currentSurah}.json`)
        .then((response) => response.json())
        .then((data: number[]) => {
          data.unshift(0);
          setTimings(data);
        })
        .catch((error) => console.error("Error fetching timings:", error));
    }
  }, [currentReciter, currentSurah]);

  const playAyah = useCallback((ayah = currentAyah, surah = currentSurah) => {
    stopCurrentHowl();

    const surahNumber = String(surah).padStart(3, "0");
    const ayahNumber = String(ayah).padStart(3, "0");
    const url = `https://everyayah.com/data/${currentReciter}_${selectedQuality}kbps/${surahNumber}${ayahNumber}.mp3`;

    const newHowl = getHowlInstance(url);

    setHowl(newHowl);
    setIsPlaying(true);
    newHowl.play();
  }, [currentReciter, selectedQuality, currentAyah, currentSurah, setIsPlaying]);

  const moveToNextAyah = useCallback(() => {
    if (currentAyah && currentSurah) {
      const totalAyahs = ayahCount[currentSurah - 1];
      if (currentAyah < totalAyahs) {
        setAyah(currentAyah + 1);
        playAyah(currentAyah + 1);
      }
    }
  }, [currentAyah, currentSurah, playAyah, setAyah]);

  useEffect(() => {
    if (!howl) {
      return;
    }
    howl.on("end", () => {
      setIsPlaying(false);
      moveToNextAyah();
    });

    howl.on("play", () => {
      const duration = howl.duration() as number + timings[currentAyah!];
      setDuration(duration);
    });

    const interval = setInterval(() => {
      if (!howl.playing()) {
        return;
      }
      const newTime = timings[currentAyah! - 1] / 1000 + (howl.seek() as number);
      setCurrentTime(newTime);
    }, 10);

    return () => clearInterval(interval);
  }, [howl, setIsPlaying, timings, currentAyah, moveToNextAyah]);

  const togglePlayPause = useCallback(() => {
    if (howl) {
      if (howl.playing()) {
        howl.pause();
        setIsPlaying(false);
      } else {
        howl.play();
        setIsPlaying(true);
      }
    } else {
      playAyah();
    }
  }, [howl, playAyah, setIsPlaying]);

  const handleRewind = useCallback(() => {
    if (!howl) {
      return;
    }
    const newTime = Math.max(0, (howl.seek() as number) - 10);
    howl.seek(newTime);
    setCurrentTime(newTime);
  }, [howl]);

  const handleFastForward = useCallback(() => {
    if (!howl) {
      return;
    }
    const newTime = Math.min(duration, (howl.seek() as number) + 10);
    howl.seek(newTime);
    setCurrentTime(newTime);
  }, [howl, duration]);

  const cleanedReciter = currentReciter?.replace(/_/g, " ");

  const finalTiming = useMemo(() => timings[timings.length - 1], [timings]);

  const formatTime = useCallback((timeInMilliseconds: number) => {
    const hours = Math.floor(timeInMilliseconds / 3_600_000);
    const minutes = Math.floor(timeInMilliseconds / 60_000);
    const seconds = Math.floor((timeInMilliseconds % 60_000) / 1000);
    return hours > 0
      ? `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      : `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, []);

  if (!currentSurah || !currentAyah) {
    return null;
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
              <AvatarImage src="https://avatar.iran.liara.run/public/boy" alt={cleanedReciter} />
              <AvatarFallback>{cleanedReciter![0]}</AvatarFallback>
            </Avatar>
          </div>
          <div className="text-sm font-medium">{cleanedReciter}</div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleRewind}>
            <RewindIcon className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={togglePlayPause}>
            {isPlaying
              ? <PauseIcon className="w-5 h-5 text-muted-foreground" />
              : <PlayIcon className="w-5 h-5 text-muted-foreground" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={handleFastForward}>
            <FastForwardIcon className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
        <div className="flex flex-col gap-2">
          <Slider
            className="w-full transition-all duration-300 ease-in-out [&>span:first-child]:h-1 [&>span:first-child]:bg-primary [&_[role=slider]]:bg-primary [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-primary [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
            value={[currentTime]}
            max={finalTiming / 1000}
            onValueChange={(value) => {
              if (howl) {
                howl.seek(value[0]);
                setCurrentTime(value[0]);
              }
            }}
          />
          <div className="flex flex-row items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {formatTime(currentTime * 1000)}
            </div>
            <div className="text-sm text-muted-foreground">{formatTime(finalTiming)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
