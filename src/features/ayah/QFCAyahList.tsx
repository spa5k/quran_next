"use client";

import { Separator } from "@/components/ui/separator";
import { Virtuoso } from "react-virtuoso";
import { type AyahQFC } from "../quran/api/ayah";
import { MushafText } from "./MushafText";
import { TranslationText } from "./TranslationText";

interface QFCAyahListProps {
  ayahs: AyahQFC[];
  version: "v1" | "v2";
  translationEditionsFetched: any;
}

export function QFCAyahList({ ayahs, version, translationEditionsFetched }: QFCAyahListProps) {
  return (
    <div style={{ height: `800px`, overflow: "auto", position: "relative" }}>
      <Virtuoso
        style={{ height: "100%" }}
        totalCount={ayahs.length}
        itemContent={(index) => {
          const ayah = ayahs[index];
          return (
            <div className="flex flex-col gap-4" style={{ padding: "10px 0" }}>
              <MushafText page={ayah.page.toString()} text={ayah.text} type={version} />
              {translationEditionsFetched.map((edition: any) => (
                <div key={edition.id}>
                  {edition.ayahs[index]?.text && (
                    <TranslationText text={edition.ayahs[index]!.text} editionId={edition.id} />
                  )}
                </div>
              ))}
              <Separator />
            </div>
          );
        }}
      />
    </div>
  );
}
