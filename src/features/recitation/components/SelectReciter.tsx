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
import { useCallback, useEffect } from "react";
import { useRecitationStore } from "../store/recitationStore";

export function SelectReciter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    setReciter,
    setAyah,
    setSelectedReciter,
    setSelectedQuality,
    setCurrentAyah,
    selectedReciter,
    selectedQuality,
  } = useRecitationStore();

  const parsedReciters = reciters.map((reciter) => ({
    label: reciter.style ? `${reciter.reciter_name} (${reciter.style})` : reciter.reciter_name,
    value: `${reciter.folder_name}`,
    qualities: reciter.quality,
    folder: `${reciter.folder_name}_${selectedQuality}kbps`,
  }));

  const updateQueryParams = useCallback((params: Record<string, string>) => {
    const currentParams = new URLSearchParams(window.location.search);
    Object.keys(params).forEach((key) => {
      if (params[key]) {
        currentParams.set(key, params[key]);
      } else {
        currentParams.delete(key);
      }
    });
    const newQueryString = currentParams.toString().replace(/%2C/g, ",");
    router.push(`?${newQueryString}`);
  }, [router]);

  useEffect(() => {
    const reciterParam = searchParams.get("reciter");
    const qualityParam = searchParams.get("quality");
    const initialReciter = reciterParam || selectedReciter;
    const initialQuality = qualityParam ? parseInt(qualityParam, 10) : 64;
    const initialAyah = "1";
    setSelectedReciter(initialReciter ?? "Abdul_Basit_Murattal");
    setSelectedQuality(initialQuality);
    setCurrentAyah(initialAyah);
    setReciter(initialReciter ?? "Abdul_Basit_Murattal");
    setAyah(parseInt(initialAyah, 10));
  }, [searchParams, setReciter, setAyah, setSelectedReciter, setSelectedQuality, setCurrentAyah, selectedReciter]);

  useEffect(() => {
    const reciter = parsedReciters.find(r => r.value === selectedReciter);
    if (reciter) {
      const lowestQuality = Math.min(...reciter.qualities);
      if (!reciter.qualities.includes(selectedQuality)) {
        setSelectedQuality(lowestQuality);
        updateQueryParams({ reciter: selectedReciter, quality: lowestQuality.toString() });
      }
    }
  }, [selectedReciter, parsedReciters, selectedQuality, setSelectedQuality, updateQueryParams]);

  const handleReciterChange = (value: string) => {
    setSelectedReciter(value);
    setReciter(value);
    const reciter = parsedReciters.find(r => r.value === value);

    if (!reciter) {
      return;
    }
    const lowestQuality = Math.min(...reciter.qualities);
    setSelectedQuality(lowestQuality);
    updateQueryParams({ reciter: value, quality: lowestQuality.toString() });
  };

  const handleQualityChange = (quality: number) => {
    setSelectedQuality(quality);
    const reciter = parsedReciters.find(r => r.value === selectedReciter);
    updateQueryParams({ reciter: reciter?.value ?? selectedReciter, quality: quality.toString() });
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
