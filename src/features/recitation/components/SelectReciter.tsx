"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { reciters } from "@/features/recitation/data/reciters";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecitationStore } from "../store/recitationStore";

export function SelectReciter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setReciter, setAyah } = useRecitationStore();
  const DEFAULT_RECITER = useRecitationStore((state) => state.currentReciter);
  const [selectedReciter, setSelectedReciter] = useState<string>(DEFAULT_RECITER ?? "Abdul_Basit_Murattal_64kbps");
  const [selectedQuality, setSelectedQuality] = useState<number>(64);
  const [, setCurrentAyah] = useState<string>("1");

  const parsedReciters = reciters.map((reciter) => ({
    label: reciter.style ? `${reciter.reciter_name} (${reciter.style})` : reciter.reciter_name,
    value: `${reciter.folder_name}_${selectedQuality}kbps`,
    qualities: reciter.quality,
  }));

  const updateQueryParam = (param: string, value: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    if (value) {
      currentParams.set(param, value);
    } else {
      currentParams.delete(param);
    }
    const newQueryString = currentParams.toString().replace(/%2C/g, ",");
    router.push(`?${newQueryString}`);
  };

  useEffect(() => {
    const reciterParam = searchParams.get("r");
    const qualityParam = searchParams.get("ql");
    const initialReciter = reciterParam || DEFAULT_RECITER;
    const initialQuality = qualityParam ? parseInt(qualityParam, 10) : 64;
    const initialAyah = "1";
    setSelectedReciter(initialReciter ?? "Abdul_Basit_Murattal_64kbps");
    setSelectedQuality(initialQuality);
    setCurrentAyah(initialAyah);
    setReciter(initialReciter ?? "Abdul_Basit_Murattal_64kbps");
    setAyah(parseInt(initialAyah, 10));
  }, [searchParams, setReciter, setAyah, DEFAULT_RECITER]);

  useEffect(() => {
    const reciter = parsedReciters.find(r => r.value === selectedReciter);
    if (reciter) {
      const lowestQuality = Math.min(...reciter.qualities);
      if (selectedQuality !== lowestQuality) {
        setSelectedQuality(lowestQuality);
        updateQueryParam("ql", lowestQuality.toString());
      }
    }
  }, [selectedReciter, parsedReciters, selectedQuality]);

  const handleReciterChange = (value: string) => {
    setSelectedReciter(value);
    setReciter(value);
    updateQueryParam("r", value);
  };

  const handleQualityChange = (quality: number) => {
    setSelectedQuality(quality);
    updateQueryParam("ql", quality.toString());
  };

  return (
    <div className="space-y-8">
      <div>
        <Select
          value={selectedReciter}
          onValueChange={handleReciterChange}
        >
          <Label className="mb-10">Select Reciter</Label>
          <SelectTrigger className="w-full md:w-[310px]">
            <SelectValue placeholder="Select a reciter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Reciter</SelectLabel>
              {parsedReciters.map((reciter) => (
                <SelectItem key={reciter.value + reciter.qualities.join("")} value={reciter.value}>
                  {reciter.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex items-center justify-between w-full mx-auto mt-4">
          <Label>
            Select Quality
          </Label>
          <ToggleGroup
            type="single"
            value={selectedQuality.toString()}
            onValueChange={(value) => handleQualityChange(parseInt(value, 10))}
          >
            {parsedReciters.find(reciter => reciter.value === selectedReciter)?.qualities.map((quality) => (
              <ToggleGroupItem key={quality} value={quality.toString()} aria-label={`Toggle ${quality} kbps`}>
                {quality} kbps
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
      </div>
    </div>
  );
}
