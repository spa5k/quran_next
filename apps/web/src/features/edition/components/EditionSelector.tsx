"use client";

import { Button } from "@/src/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/src/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { cn } from "@/src/lib/utils";
import { Check } from "lucide-react";
import React from "react";
import type { Edition } from "../api/editions";

export function EditionsMultiSelect({ editions }: {
  editions: {
    id: number;
    name: string;
    author: string;
    language: string;
    direction: string;
    source: string;
    type: string;
    enabled: number;
  }[];
}) {
  const [open, setOpen] = React.useState(false);
  const [selectedStatus, setSelectedStatus] = React.useState<Edition | null>(
    null,
  );

  const translationEditions = editions.filter((edition) => edition.type === "TRANSLATION");
  const quranEditions = editions.filter((edition) => edition.type === "QURAN");
  const transliterationEditions = editions.filter((edition) => edition.type === "TRANSLITERATION");
  const quranTransliterationEditions = editions.filter((edition) => edition.type === "QURAN_TRANSLITERATION");

  return (
    <div className="space-y-4 z-20">
      <div className="flex items-center space-x-4">
        <p className="text-sm text-muted-foreground">Status</p>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-[150px] justify-start"
            >
              {selectedStatus
                ? (
                  <>
                    {selectedStatus.author}
                  </>
                )
                : <>+ Set status</>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" side="right" align="start">
            <Command>
              <CommandInput placeholder="Change status..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {quranEditions.map((edition) => (
                  <CommandItem
                    key={edition.id + edition.name}
                    value={edition.name}
                    onSelect={(currentValue) => {
                      setSelectedStatus(edition);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedStatus?.name === edition.name ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {edition.author}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
