"use client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { useVirtualizer } from "@tanstack/react-virtual";
import React from "react";
import { type AyahQFC } from "../quran/api/ayah";
import { MushafText } from "./MushafText";
import { TranslationText } from "./TranslationText";

interface QFCAyahListProps {
  ayahs: AyahQFC[];
  version: "v1" | "v2";
  translationEditionsFetched: any;
}

export function QFCAyahList({ ayahs, version, translationEditionsFetched }: QFCAyahListProps) {
  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: ayahs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100, // Adjust based on your item height
  });

  return (
    <div ref={parentRef} style={{ height: `500px`, overflow: "auto" }}>
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => {
          const ayah = ayahs[virtualItem.index];
          return (
            <div
              key={virtualItem.key}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <MushafText page={ayah.page.toString()} text={ayah.text} type={version} />
              {translationEditionsFetched.map((edition: any) => (
                <div key={edition.id}>
                  {edition.ayahs[virtualItem.index]?.text && (
                    <TranslationText text={edition.ayahs[virtualItem.index]!.text} editionId={edition.id} />
                  )}
                </div>
              ))}
              <Separator />
            </div>
          );
        })}
      </div>
    </div>
  );
}
