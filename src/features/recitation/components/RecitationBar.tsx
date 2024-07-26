"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import AyahPlayer from "@/features/ayah/AyahPlayer";
import { FastForwardIcon, PauseIcon, PlayIcon, RewindIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ayahCount } from "../data/ayahCount";
import { reciters } from "../data/reciters";
import { useRecitationStore } from "../store/recitationStore";

export function QuranRecitationBar() {
  const { currentReciter, currentAyah, currentSurah, setSurah, isPlaying, setIsPlaying } = useRecitationStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  const params = useParams() as { number: string };

  useEffect(() => {
    if (!currentSurah) {
      setSurah(parseInt(params.number));
    }
  }, [currentSurah, params.number, setSurah]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateSlider = () => {
      setSliderValue(audio.currentTime);
    };

    const setAudioDuration = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener("timeupdate", updateSlider);
    audio.addEventListener("loadedmetadata", setAudioDuration);

    return () => {
      audio.removeEventListener("timeupdate", updateSlider);
      audio.removeEventListener("loadedmetadata", setAudioDuration);
    };
  }, [audioRef]);

  const handleSliderChange = (value: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value;
      setSliderValue(value);
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
        <Slider
          value={[sliderValue]}
          min={0}
          max={duration}
          onValueChange={(value) => handleSliderChange(value[0])}
          className="mt-4"
        />

        <div className="flex flex-row items-center gap-2">
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={moveBackward}>
            <RewindIcon className="w-5 h-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={togglePlayPause}>
            {isPlaying
              ? <PauseIcon className="w-5 h-5 text-muted-foreground" />
              : <PlayIcon className="w-5 h-5 text-muted-foreground" />}
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8" onClick={moveForward}>
            <FastForwardIcon className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </div>
      <AyahPlayer audioRef={audioRef} />
    </div>
  );
}
