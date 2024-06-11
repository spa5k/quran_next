import { quranEditions } from "@/src/features/data/quranEditions";
import { translationEditions } from "@/src/features/data/translationEditions";
import type { Edition } from "@/src/features/edition/api/editions";
import { EditionMultiSelectForm } from "@/src/features/edition/components/EditionMultiSelect";
import { fetchAyahs } from "@/src/features/quran/api/ayah";
import { Ayah } from "@features/ayah/Ayah";
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
  function parseEditions(editions: string): string[] {
    return editions.split(",").map((edition) => edition.trim());
  }

  const quranEditionsSelected = parseEditions(searchParams?.q ?? "");
  const translationEditionsSelected = parseEditions(searchParams?.t ?? "");

  const quranEditionsSelectedData: Edition[] = quranEditionsSelected.map(
    (edition) => {
      return quranEditions.find(
        (quranEdition) => quranEdition.id === Number.parseInt(edition),
      );
    },
  ) as unknown as Edition[];

  const translationEditionsSelectedData: Edition[] = translationEditionsSelected.map(
    (edition) => {
      return translationEditions.find(
        (translationEdition) => translationEdition.id === Number.parseInt(edition),
      );
    },
  ) as unknown as Edition[];

  const quranEditionsFetched = await Promise.all(quranEditionsSelectedData.map(async (quranEdition) => {
    const ayahs = await fetchAyahs(
      quranEdition.id,
      Number.parseInt(params!.number),
      quranEdition.slug,
    );
    return { ...quranEdition, ayahs };
  }));

  const translationEditionsFetched = await Promise.all(
    translationEditionsSelectedData.map(async (translationEdition) => {
      const ayahs = await fetchAyahs(
        translationEdition.id,
        Number.parseInt(params!.number),
        translationEdition.slug,
      );
      return { ...translationEdition, ayahs };
    }),
  );

  // Assuming the first Quran edition is the reference for ayah order
  const referenceAyahs = quranEditionsFetched[0]!.ayahs;

  return (
    <main className="mt-20 flex gap-4 flex-col">
      <div className="flex gap-4">
        <EditionMultiSelectForm
          edition={quranEditions}
          queryParam="q"
          placeholder="Select Quran Font"
          formName="Quran Editions"
          description="Select the Quran Font you want to view"
        />
        <EditionMultiSelectForm
          edition={translationEditions}
          queryParam="t"
          placeholder="Select Translation Edition"
          formName="Translation Editions"
          description="Select the translation edition you want to view"
        />
      </div>
      {referenceAyahs.map((ayah, index) => (
        <div key={index} className="flex flex-col gap-6">
          <h2>Ayah {index + 1}</h2>
          {quranEditionsFetched.map((edition) => (
            <div key={edition.id}>
              {edition.ayahs[index]?.text && (
                <Ayah text={edition.ayahs[index]!.text} editionId={edition.id} className="text-4xl" />
              )}
            </div>
          ))}
          {translationEditionsFetched.map((edition) => (
            <div key={edition.id}>
              {edition.ayahs[index]?.text && <Ayah text={edition.ayahs[index]!.text} editionId={edition.id} />}
            </div>
          ))}
        </div>
      ))}
    </main>
  );
}
