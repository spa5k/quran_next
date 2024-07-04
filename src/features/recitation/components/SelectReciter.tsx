"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { reciters } from "@/features/recitation/data/reciters"; // Assuming reciters array is in reciters.ts
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecitationStore } from "../store/recitationStore";

export function SelectReciter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setReciter, setAyah } = useRecitationStore();
  const DEFAULT_RECITER = useRecitationStore((state) => state.currentReciter);
  const [selectedReciter, setSelectedReciter] = useState<string>(DEFAULT_RECITER ?? "Abdul_Basit_Murattal_64kbps");
  const [, setCurrentAyah] = useState<string>("1");

  const parsedReciters = reciters.map((reciter) => ({
    label: reciter.name,
    value: reciter.subfolder,
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
    const initialReciter = reciterParam || DEFAULT_RECITER;
    const initialAyah = "1";
    setSelectedReciter(initialReciter ?? "Abdul_Basit_Murattal_64kbps");
    setCurrentAyah(initialAyah);
    setReciter(initialReciter ?? "Abdul_Basit_Murattal_64kbps");
    setAyah(parseInt(initialAyah, 10));
  }, [searchParams, setReciter, setAyah, DEFAULT_RECITER]);

  const handleReciterChange = (value: string) => {
    setSelectedReciter(value);
    setReciter(value);
    updateQueryParam("r", value);
  };

  return (
    <div className="space-y-8">
      <div>
        <Select
          value={selectedReciter}
          onValueChange={handleReciterChange}
        >
          <SelectTrigger className="w-full md:w-[310px]">
            <SelectValue placeholder="Select a reciter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {parsedReciters.map((reciter) => (
                <SelectItem key={reciter.value} value={reciter.value}>
                  {reciter.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <div className="flex items-center justify-between w-full mx-auto">
          <label className="text-sm text-muted-foreground mt-1.5">
            Select a reciter
          </label>
        </div>
      </div>
    </div>
  );
}
