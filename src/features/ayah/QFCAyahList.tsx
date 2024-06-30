"use client";

import { Separator } from "@/components/ui/separator";
import { type AyahQFC } from "../quran/api/ayah";
import MushafText from "./MushafText";
import { TranslationText } from "./TranslationText";

interface QFCAyahListProps {
  ayahs: AyahQFC[];
  version: "v1" | "v2";
  translationEditionsFetched: any;
}

export function QFCAyahList({ ayahs, version, translationEditionsFetched }: QFCAyahListProps) {
  return (
    <div className="flex flex-col gap-10">
      {ayahs.map((ayah, index) => (
        <div key={index}>
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
      ))}
    </div>
  );
}
