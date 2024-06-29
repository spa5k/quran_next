import { Separator } from "@radix-ui/react-dropdown-menu";
import type { Ayah, AyahQFC } from "../quran/api/ayah";
import { AyahText } from "./AyahText";
import { TranslationText } from "./TranslationText";

type AyahListProps = {
  referenceAyahs: Ayah[];
  quranEditionsFetched: { id: number; ayahs: (Ayah | AyahQFC)[] }[];
  translationEditionsFetched: { id: number; ayahs: { text: string }[] }[];
};

export const AyahList = ({ referenceAyahs, quranEditionsFetched, translationEditionsFetched }: AyahListProps) => {
  return (
    <>
      {referenceAyahs.map((ayah, index) => (
        <div key={index} className="flex flex-col gap-6 justify-center">
          <p className="-m-2">{ayah.ayah}</p>
          {quranEditionsFetched.map((edition) => (
            <div key={edition.id}>
              <AyahText
                text={(edition.ayahs[index] as Ayah).text}
                editionId={edition.id}
                className="text-6xl"
                number={ayah.ayah}
              />
            </div>
          ))}
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
