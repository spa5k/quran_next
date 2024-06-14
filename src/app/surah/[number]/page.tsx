import { AyahText } from "@/features/ayah/AyahText";
import { DynamicFontSizer } from "@/features/ayah/FontResizer";
import { TranslationText } from "@/features/ayah/TranslationText";
import { quranEditions } from "@/features/data/quranEditions";
import { translationEditions } from "@/features/data/translationEditions";
import type { Edition } from "@/features/edition/api/editions";
import { EditionMultiSelectForm } from "@/features/edition/components/EditionMultiSelect";
import { fetchAyahs } from "@/features/quran/api/ayah";
import {
  cormorant_garamond,
  indopak,
  lexend,
  noto_nastaliq_urdu,
  noto_sans_devanagari,
  readex_pro,
  taviraj,
  uthmanic,
} from "@/lib/fonts";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams?: {
    q?: string;
    t?: string;
    tl?: string;
    start?: string;
    end?: string;
  };
  params?: { number: string };
}): Promise<JSX.Element> {
  function parseEditions(editions: string): number[] {
    return editions.split(",").map((edition) => parseInt(edition.trim())).filter(edition => !isNaN(edition));
  }

  const quranEditionsSelected = parseEditions(searchParams?.q ?? "145");
  const translationEditionsSelected = parseEditions(searchParams?.t ?? "211");

  const quranEditionsSelectedData: Edition[] = quranEditionsSelected.map(
    (edition) => quranEditions.find((quranEdition) => quranEdition.id === edition),
  ).filter((edition): edition is Edition => edition !== undefined);

  const translationEditionsSelectedData: Edition[] = translationEditionsSelected.map(
    (edition) => translationEditions.find((translationEdition) => translationEdition.id === edition),
  ).filter((edition): edition is Edition => edition !== undefined);

  const quranEditionsFetched = await Promise.all(quranEditionsSelectedData.map(async (quranEdition) => {
    const ayahs = await fetchAyahs(
      quranEdition.id,
      parseInt(params?.number ?? "1"),
      quranEdition.slug,
    );
    return { ...quranEdition, ayahs };
  }));

  const translationEditionsFetched = await Promise.all(
    translationEditionsSelectedData.map(async (translationEdition) => {
      const ayahs = await fetchAyahs(
        translationEdition.id,
        parseInt(params?.number ?? "1"),
        translationEdition.slug,
      );
      return { ...translationEdition, ayahs };
    }),
  );

  // Assuming the first Quran edition is the reference for ayah order
  const referenceAyahs = quranEditionsFetched[0]?.ayahs || [];

  const fonts =
    `${taviraj.variable} ${cormorant_garamond.variable} ${lexend.variable} ${readex_pro.variable} ${indopak.variable} font-primary ${noto_sans_devanagari.variable} ${noto_nastaliq_urdu.variable} ${uthmanic.variable}`;

  return (
    <main className={`mt-20 flex gap-4 flex-col ${fonts} items-center`}>
      <div className="flex gap-4">
        <EditionMultiSelectForm
          edition={quranEditions}
          queryParam="q"
          placeholder="Select Quran Font"
          description="Select the Quran Font you want to view"
          defaultSelected={quranEditionsSelected.map((edition) => edition.toString())}
          maxSelectable={2}
        />
        <EditionMultiSelectForm
          edition={translationEditions}
          queryParam="t"
          placeholder="Select Translation Edition"
          description="Select the translation edition you want to view"
          defaultSelected={translationEditionsSelected.map((edition) => edition.toString())}
        />
      </div>
      <DynamicFontSizer />

      {referenceAyahs.map((_, index) => (
        <div key={index} className="flex flex-col gap-6  w-1/2 justify-center">
          {quranEditionsFetched.map((edition) => (
            <div key={edition.id}>
              {edition.ayahs[index]?.text && (
                <AyahText text={edition.ayahs[index]!.text} editionId={edition.id} className="text-4xl" />
              )}
            </div>
          ))}
          {translationEditionsFetched.map((edition) => (
            <div key={edition.id}>
              {edition.ayahs[index]?.text && (
                <TranslationText text={edition.ayahs[index]!.text} editionId={edition.id} />
              )}
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
