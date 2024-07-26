import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { reciters } from "../recitation/data/reciters";
import { useRecitationStore } from "../recitation/store/recitationStore";
import type { Timings } from "../recitation/types/timingTypes";

let currentPlayingInstance: HTMLAudioElement | null = null;

export const fetchTimings = async (reciterSlug: string, surah: number, style: string) => {
  const response = await fetch(
    `https://raw.githubusercontent.com/spa5k/quran_timings_api/master/data/${style}/${reciterSlug}/${surah}.json`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json() as Promise<Timings>;
};

const AyahPlayer = (
  { audioRef }: {
    audioRef: React.RefObject<HTMLAudioElement>;
  } = { audioRef: React.createRef<HTMLAudioElement>() },
) => {
  const {
    currentReciter,
    currentSurah,
    currentAyah,
    isPlaying,
    setIsPlaying,
    setDuration,
    setCurrentTime,
  } = useRecitationStore();

  const reciter = reciters.find((reciter) => reciter.slug === currentReciter);

  const { data: timings, error } = useQuery({
    queryKey: ["timings", currentReciter, currentSurah, reciter?.slug],
    queryFn: () => fetchTimings(reciter!.slug, currentSurah!, reciter!.style),
    enabled: !!currentReciter && !!currentSurah,
  });

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    const handleEnded = () => {
      setIsPlaying(false);
    };
    audioRef.current.addEventListener("ended", handleEnded);
    return () => {
      audioRef.current?.removeEventListener("ended", handleEnded);
    };
  }, [setIsPlaying]);

  useEffect(() => {
    if (!(isPlaying && timings && audioRef.current)) {
      return;
    }
    const audioUrl = timings.audio_files[0].audio_url;
    const verseTiming = timings.audio_files[0].verse_timings.find(
      (timing) => timing.verse_key === `${currentSurah}:${currentAyah}`,
    );
    if (!verseTiming) {
      return;
    }
    if (currentPlayingInstance && currentPlayingInstance !== audioRef.current) {
      currentPlayingInstance.pause();
    }
    currentPlayingInstance = audioRef.current;
    audioRef.current.src = audioUrl;
    audioRef.current.currentTime = verseTiming.timestamp_from / 1000;
    audioRef.current.play();
  }, [isPlaying, timings, currentAyah, currentSurah, audioRef]);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    const handlePlay = () => {
      setDuration(audioRef.current!.duration);
    };
    audioRef.current.addEventListener("play", handlePlay);

    const interval = setInterval(() => {
      if (!audioRef.current?.paused) {
        setCurrentTime(audioRef.current!.currentTime);
      }
    }, 1000);

    return () => {
      audioRef.current?.removeEventListener("play", handlePlay);
      clearInterval(interval);
    };
  }, []);

  if (error) {
    console.error("Error fetching timings:", error);
  }

  return <audio ref={audioRef} />;
};

export default AyahPlayer;
