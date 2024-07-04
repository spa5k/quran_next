"use client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import type { Ayah, AyahQFC } from "../quran/api/ayah";
import { AyahText } from "./AyahText";
import { TranslationText } from "./TranslationText";

type AyahListProps = {
  ayahs: Ayah[];
  quranEditionsFetched: { id: number; ayahs: (Ayah | AyahQFC)[] }[];
  translationEditionsFetched: { id: number; ayahs: { text: string }[] }[];
  fallbackAyahs: Ayah[];
};

export const AyahList = (
  { ayahs, quranEditionsFetched, translationEditionsFetched, fallbackAyahs }: AyahListProps,
) => {
  const edition = quranEditionsFetched[0];
  return (
    <>
      {ayahs.map((ayah, index) => (
        <div key={index} className="flex flex-col gap-6 justify-center">
          <p className="-m-2">{ayah.ayah}</p>
          <div key={edition.id}>
            <AyahText
              text={(edition.ayahs[index] as Ayah).text}
              editionId={edition.id}
              className="text-6xl"
              number={ayah.ayah}
              fallbackText={fallbackAyahs[index].text}
            />
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
    </>
  );
};
