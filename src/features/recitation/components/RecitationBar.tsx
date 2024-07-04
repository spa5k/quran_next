"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { FastForwardIcon, PauseIcon, PlayIcon, RewindIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ayahCount } from "../data/ayahCount";
import { useRecitationStore } from "../store/recitationStore";
import { getHowlInstance, stopCurrentHowl } from "../utils/howl";

export function QuranRecitationBar() {
  const { currentReciter, currentAyah, isPlaying, setIsPlaying, currentSurah, setSurah, setAyah } =
    useRecitationStore();
  const [howl, setHowl] = useState<Howl | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const params = useParams() as { number: string };

  useEffect(() => {
    if (!currentSurah) {
      setSurah(parseInt(params.number));
    }
  }, [currentSurah, params.number, setSurah]);

  useEffect(() => {
    if (!howl) {
      return;
    }
    howl.on("end", () => {
      setIsPlaying(false);
      setCurrentTime(0);
      moveToNextAyah();
    });

    howl.on("play", () => {
      setDuration(howl.duration());
    });

    const interval = setInterval(() => {
      if (howl.playing()) {
        setCurrentTime(howl.seek() as number);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [howl, setIsPlaying]);

  const moveToNextAyah = () => {
    if (currentAyah && currentSurah) {
      const totalAyahs = ayahCount[currentSurah - 1];
      if (currentAyah < totalAyahs) {
        setAyah(currentAyah + 1);
        playAyah(currentAyah + 1);
      } else if (currentSurah < ayahCount.length) {
        setSurah(currentSurah + 1);
        setAyah(1);
        playAyah(1, currentSurah + 1);
      }
    }
  };

  const playAyah = (ayah = currentAyah, surah = currentSurah) => {
    stopCurrentHowl();

    const surahNumber = String(surah).padStart(3, "0");
    const ayahNumber = String(ayah).padStart(3, "0");
    const url = `https://everyayah.com/data/${currentReciter}/${surahNumber}${ayahNumber}.mp3`;

    const newHowl = getHowlInstance(url);

    setHowl(newHowl);
    setIsPlaying(true);
    newHowl.play();
  };

  const togglePlayPause = () => {
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
  };

  const handleRewind = () => {
    if (howl) {
      const newTime = Math.max(0, (howl.seek() as number) - 10);
      howl.seek(newTime);
      setCurrentTime(newTime);
    }
  };

  const handleFastForward = () => {
    if (howl) {
      const newTime = Math.min(duration, (howl.seek() as number) + 10);
      howl.seek(newTime);
      setCurrentTime(newTime);
    }
  };

  if (!currentSurah || !currentAyah) {
    return null;
  }
  // also remove 64 kbps, 128 ewt etc
  const cleanedReciter = currentReciter?.replace(/_/g, " ");

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
            className="w-full [&>span:first-child]:h-1 [&>span:first-child]:bg-primary [&_[role=slider]]:bg-primary [&_[role=slider]]:w-3 [&_[role=slider]]:h-3 [&_[role=slider]]:border-0 [&>span:first-child_span]:bg-primary [&_[role=slider]:focus-visible]:ring-0 [&_[role=slider]:focus-visible]:ring-offset-0 [&_[role=slider]:focus-visible]:scale-105 [&_[role=slider]:focus-visible]:transition-transform"
            value={[currentTime]}
            max={duration}
            onValueChange={(value) => {
              if (howl) {
                howl.seek(value[0]);
                setCurrentTime(value[0]);
              }
            }}
          />
          <div className="flex flex-row items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {new Date(currentTime * 1000).toISOString().substr(14, 5)}
            </div>
            <div className="text-sm text-muted-foreground">{new Date(duration * 1000).toISOString().substr(14, 5)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
