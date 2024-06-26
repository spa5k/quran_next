import { AyahList } from "@/features/ayah/AyahList";
import { DynamicFontSizer } from "@/features/ayah/FontResizer";
import { quranEditions } from "@/features/data/quranEditions";
import { translationEditions } from "@/features/data/translationEditions";
import type { Edition } from "@/features/edition/api/editions";
import { EditionMultiSelectForm } from "@/features/edition/components/EditionMultiSelect";
import { EditionSingleSelect } from "@/features/edition/components/EditionSingleSelect";
import { type Ayah, type AyahQFC, fetchAyahs, fetchAyahsQFC } from "@/features/quran/api/ayah";
import {
  cormorant_garamond,
  indopak,
  lexend,
  noto_nastaliq_urdu,
  noto_sans_arabic,
  noto_sans_devanagari,
  readex_pro,
  taviraj,
  uthmanic,
} from "@/lib/fonts";
import dynamic from "next/dynamic";

const QFCAyahList = dynamic(() => import("@/features/ayah/QFCAyahList"), { ssr: false });

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
    try {
      if (quranEdition.type === "QURAN_QFC") {
        const version = quranEdition.id === 1 ? "v1" : "v2";
        const ayahs = await fetchAyahsQFC(
          version,
          parseInt(params?.number ?? "1"),
        );
        return { ...quranEdition, ayahs };
      } else {
        const ayahs = await fetchAyahs(
          quranEdition.id,
          parseInt(params?.number ?? "1"),
          quranEdition.slug,
        );
        return { ...quranEdition, ayahs };
      }
    } catch (error) {
      console.error(`Failed to fetch ayahs for edition ${quranEdition.id}:`, error);
      return { ...quranEdition, ayahs: [] };
    }
  }));

  const translationEditionsFetched = await Promise.all(
    translationEditionsSelectedData.map(async (translationEdition) => {
      try {
        const ayahs = await fetchAyahs(
          translationEdition.id,
          parseInt(params?.number ?? "1"),
          translationEdition.slug,
        );
        return { ...translationEdition, ayahs };
      } catch (error) {
        console.error(`Failed to fetch ayahs for translation edition ${translationEdition.id}:`, error);
        return { ...translationEdition, ayahs: [] };
      }
    }),
  );

  // Assuming the first Quran edition is the reference for ayah order
  const referenceAyahs = quranEditionsFetched[0]?.ayahs || [];

  const fonts =
    `${taviraj.variable} ${cormorant_garamond.variable} ${lexend.variable} ${readex_pro.variable} ${indopak.variable} font-primary ${noto_sans_devanagari.variable} ${noto_nastaliq_urdu.variable} ${uthmanic.variable} ${noto_sans_arabic.variable}`;

  function isAyahQFC(ayah: AyahQFC | Ayah): ayah is AyahQFC {
    return (ayah as AyahQFC).page !== undefined;
  }

  return (
    <main className={`mt-20 flex gap-4 flex-col ${fonts} items-center`}>
      <div className="flex gap-4">
        <EditionSingleSelect
          edition={quranEditions}
          queryParam="q"
          placeholder="Select Quran Font"
          description="Select the Quran Font you want to view"
          defaultSelected={quranEditionsSelected[0].toString()}
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

      <div className="flex flex-col gap-8 w-1/2 justify-center">
        {isAyahQFC(referenceAyahs[0])
          ? (
            <QFCAyahList
              ayahs={quranEditionsFetched[0].ayahs as AyahQFC[]}
              translationEditionsFetched={translationEditionsFetched}
              version={quranEditionsFetched[0].id === 1 ? "v1" : "v2"}
              key={quranEditionsFetched[0].id}
            />
          )
          : (
            <AyahList
              quranEditionsFetched={quranEditionsFetched}
              ayahs={referenceAyahs as Ayah[]}
              translationEditionsFetched={translationEditionsFetched}
              key={quranEditionsFetched[0].id}
            />
          )}
      </div>
    </main>
  );
}
