"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { FastForwardIcon, PauseIcon, PlayIcon, RewindIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ayahCount } from "../data/ayahCount";
import { reciters } from "../data/reciters";
import { useRecitationStore } from "../store/recitationStore";
import type { Timings, VerseTiming } from "../types/timingTypes";
import { getHowlInstance, stopCurrentHowl } from "../utils/howl";

export function QuranRecitationBar() {
  const { currentReciter, currentAyah, isPlaying, setIsPlaying, currentSurah, setSurah, setAyah, currentStyle } =
    useRecitationStore();
  const [howl, setHowl] = useState<Howl | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [timings, setTimings] = useState<VerseTiming[]>([]);
  const [audioUrl, setAudioUrl] = useState<string>("");

  const params = useParams() as { number: string };

  useEffect(() => {
    if (!currentSurah) {
      setSurah(parseInt(params.number));
    }
  }, [currentSurah, params.number, setSurah]);

  useEffect(() => {
    if (!(currentReciter && currentSurah)) {
      return;
    }

    const reciter = reciters.find((reciter) => reciter.slug.toString() === currentReciter)!;
    if (!reciter) {
      return;
    }

    const { slug, style } = reciter;

    fetch(
      `https://raw.githubusercontent.com/spa5k/quran_timings_api/master/data/${style}/${slug}/${currentSurah}.json`,
    )
      .then((response) => response.json())
      .then((data: Timings) => {
        const audioFile = data.audio_files[0];
        setAudioUrl(audioFile.audio_url);
        const verseTimings = audioFile.verse_timings;
        setTimings(verseTimings);
      })
      .catch((error) => console.error("Error fetching timings:", error));
  }, [currentReciter, currentSurah]);

  const playAyah = useCallback((ayah = currentAyah, surah = currentSurah) => {
    stopCurrentHowl();

    const newHowl = getHowlInstance(audioUrl);

    setHowl(newHowl);
    setIsPlaying(true);

    const verseTiming = timings.find(timing => timing.verse_key === `${surah}:${ayah}`);
    if (verseTiming) {
      newHowl.seek(verseTiming.timestamp_from / 1000);
    }

    newHowl.play();
  }, [audioUrl, currentAyah, currentSurah, setIsPlaying, timings]);

  useEffect(() => {
    if (!howl) {
      return;
    }
    howl.on("end", () => {
      setIsPlaying(false);
    });

    howl.on("play", () => {
      const duration = howl.duration() as number;
      setDuration(duration);
    });

    const interval = setInterval(() => {
      if (!howl.playing()) {
        return;
      }
      const newTime = howl.seek() as number;
      setCurrentTime(newTime);
    }, 10);

    return () => clearInterval(interval);
  }, [howl, setIsPlaying, timings, currentAyah]);

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

  if (!currentSurah || !currentAyah) {
    return null;
  }

  const reciter = reciters.find((reciter) => reciter.slug.toString() === currentReciter)!;

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
          <div className="text-sm font-medium">{reciter.name}</div>
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
              console.log({ value });
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
