"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Howl } from "howler";
import { Check, Copy, Pause, Play } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { WindowVirtualizer } from "virtua";
import { type Ayah, type AyahQFC } from "../quran/api/ayah";
import { ayahCount } from "../recitation/data/ayahCount";
import { useRecitationStore } from "../recitation/store/recitationStore";
import { getHowlInstance, stopCurrentHowl } from "../recitation/utils/howl";
import { AyahText } from "./AyahText";
import MushafText from "./MushafText";
import { TranslationText } from "./TranslationText";

type CombinedAyahListProps = {
  ayahs: (Ayah | AyahQFC)[];
  quranEditionsFetched: { id: number; ayahs: (Ayah | AyahQFC)[] }[];
  translationEditionsFetched: { id: number; ayahs: { text: string }[] }[];
  fallbackAyahs: Ayah[];
  version?: "v1" | "v2";
};

const CombinedAyahList = (
  { ayahs, quranEditionsFetched, translationEditionsFetched, fallbackAyahs, version }: CombinedAyahListProps,
) => {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { currentReciter, currentAyah, isPlaying, setIsPlaying, currentSurah, setSurah, setAyah } =
    useRecitationStore();
  const [howl, setHowl] = useState<Howl | null>(null);

  const isQFC = (ayah: Ayah | AyahQFC): ayah is AyahQFC => "page" in ayah;

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: `Ayah ${index + 1} copied`,
        description: fallbackAyahs[index].text,
      });
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000); // Reset icon after 2 seconds
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleCopyEvent = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    event.preventDefault();
    const selection = window.getSelection();
    if (!selection) return;

    const selectedText = selection.toString().replace(/(\d+),/g, "").replace(/\s+/g, " ").trim();

    const fallbackTexts = ayahs
      .map((ayah, index) => {
        const ayahText = ayah.text.replace(/(\d+),/g, "").replace(/\s+/g, " ").trim();
        if (selectedText.includes(ayahText)) {
          return fallbackAyahs[index].text;
        }
        return null;
      })
      .filter(text => text !== null)
      .join("\n");

    try {
      await navigator.clipboard.writeText(fallbackTexts);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const playAyah = (index: number) => {
    stopCurrentHowl();

    const currentAyah = ayahs[index];
    const surah = currentAyah.surah;
    const ayah = currentAyah.ayah;

    const surahNumber = String(surah).padStart(3, "0");
    const ayahNumber = String(ayah).padStart(3, "0");
    const url = `https://everyayah.com/data/${currentReciter}/${surahNumber}${ayahNumber}.mp3`;

    const newHowl = getHowlInstance(url);

    setHowl(newHowl);
    setIsPlaying(true);
    newHowl.play();
  };

  const moveToNextAyah = () => {
    if (currentAyah && currentSurah) {
      const totalAyahs = ayahCount[currentSurah - 1];
      if (currentAyah < totalAyahs) {
        setAyah(currentAyah + 1);
        playAyah(currentAyah + 1);
      } else if (currentSurah < ayahCount.length) {
        setSurah(currentSurah + 1);
        setAyah(1);
        playAyah(1);
      }
    }
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
      playAyah(0);
    }
  };

  useEffect(() => {
    if (!howl) {
      return;
    }
    howl.on("end", () => {
      setIsPlaying(false);
      moveToNextAyah();
    });
  }, [howl, moveToNextAyah, setIsPlaying]);

  return (
    <div className="flex flex-col gap-5" ref={containerRef} onCopy={handleCopyEvent}>
      <p className="font-arabic_noto">
        <Toaster />
      </p>
      <WindowVirtualizer>
        {ayahs.map((ayah, index) => (
          <div key={index} className="flex flex-col gap-6 justify-center mt-4">
            <div className="flex gap-5">
              <Badge className="w-10 flex justify-center text-xl">{ayah.ayah}</Badge>
              <Button
                onClick={() => handleCopy(fallbackAyahs[index].text, index)}
                size="icon"
              >
                {copiedIndex === index ? <Check /> : <Copy />}
              </Button>
              <Button
                onClick={() => {
                  if (isPlaying && currentAyah === index) {
                    togglePlayPause();
                  } else {
                    playAyah(index);
                  }
                }}
                size="icon"
              >
                {isPlaying && currentAyah === index + 1 ? <Pause /> : <Play />}
              </Button>
            </div>
            <div key={quranEditionsFetched[0].id}>
              {isQFC(ayah)
                ? (
                  <MushafText
                    page={ayah.page.toString()}
                    text={ayah.text}
                    type={version}
                    fallbackText={fallbackAyahs[index].text}
                  />
                )
                : (
                  <AyahText
                    text={ayah.text}
                    editionId={quranEditionsFetched[0].id}
                    className="text-6xl"
                    number={ayah.ayah}
                    fallbackText={fallbackAyahs[index].text}
                  />
                )}
            </div>
            {translationEditionsFetched.map((edition) => (
              <div key={edition.id}>
                {edition.ayahs[index]?.text && (
                  <TranslationText text={edition.ayahs[index]!.text} editionId={edition.id} />
                )}
              </div>
            ))}
            <Separator />
          </div>
        ))}
      </WindowVirtualizer>
    </div>
  );
};

export default CombinedAyahList;
