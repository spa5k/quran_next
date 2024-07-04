"use client";

import { Separator } from "@/components/ui/separator";
import { WindowVirtualizer } from "virtua";
import { type Ayah, type AyahQFC } from "../quran/api/ayah";
import MushafText from "./MushafText";
import { TranslationText } from "./TranslationText";

interface QFCAyahListProps {
  ayahs: AyahQFC[];
  version: "v1" | "v2";
  translationEditionsFetched: { id: number; ayahs: { text: string }[] }[];
  fallbackAyahs: Ayah[];
}

const AyahItem = ({ index, data, fallbackText }: { index: number; data: any; fallbackText: string }) => {
  const { ayahs, version, translationEditionsFetched } = data;
  const ayah = ayahs[index];

  return (
    <div key={index} className="m-8">
      <MushafText page={ayah.page.toString()} text={ayah.text} type={version} fallbackText={fallbackText} />
      {translationEditionsFetched.map((edition: any) => (
        <div key={edition.id}>
          {edition.ayahs[index]?.text && <TranslationText text={edition.ayahs[index]!.text} editionId={edition.id} />}
        </div>
      ))}
      <Separator />
    </div>
  );
};

function QFCAyahList({ ayahs, version, translationEditionsFetched, fallbackAyahs }: QFCAyahListProps) {
  return (
    <div className="flex flex-col gap-5">
      <WindowVirtualizer>
        {ayahs.map((ayah, index) => (
          <AyahItem
            key={index}
            index={index}
            data={{ ayahs, version, translationEditionsFetched }}
            fallbackText={fallbackAyahs[index].text}
          />
        ))}
      </WindowVirtualizer>
    </div>
  );
}

export default QFCAyahList;
