import { quranEditions } from "@/src/features/data/quranEditions";
import { translationEditions } from "@/src/features/data/translationEditions";
import type { Edition } from "@/src/features/edition/api/editions";
import { EditionMultiSelectForm } from "@/src/features/edition/components/EditionMultiSelect";
import { fetchAyahs } from "@/src/features/quran/api/ayah";

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
  console.log({ searchParams, params });

  function parseEditions(editions: string): string[] {
    return editions.split(",").map((edition) => edition.trim());
  }

  const quranEditionsSelected = parseEditions(searchParams?.q ?? "");
  const translationEditionsSelected = parseEditions(searchParams?.t ?? "");
  // const transliterationEditionsSelected = parseEditions(searchParams?.tl ?? "");

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

  // const transliterationEditionsSelectedData = transliterationEditionsSelected.map((edition) => {
  //   return transliterationEditions.find(
  //     (transliterationEdition) => transliterationEdition.id === Number.parseInt(edition),
  //   );
  // });

  const quranEditionsFetched = await Promise.all(
    quranEditionsSelectedData.map(async (edition) => {
      if (edition) {
        return await fetchAyahs(
          edition.id,
          Number.parseInt(params!.number),
          edition.name,
        );
      }
      return null;
    }),
  );

  return (
    <main className="mt-20 flex gap-4 flex-col">
      <div className="flex gap-4">
        <EditionMultiSelectForm
          edition={quranEditions}
          queryParam="q"
          placeholder="Select Quran Edition"
          formName="Quran Editions"
          description="Select the Quran edition you want to view"
        />
        <EditionMultiSelectForm
          edition={translationEditions}
          queryParam="t"
          placeholder="Select Translation Edition"
          formName="Translation Editions"
          description="Select the translation edition you want to view"
        />
      </div>
      {quranEditionsFetched.map((ayahAPI) => {
        return ayahAPI?.map((ayah) => {
          return (
            <p
              className="font-indopak text-8xl leading-loose"
              key={ayah.id + ayah.editionId}
            >
              {ayah.text}
            </p>
          );
        });
      })}

      {
        /* <div className="mt-20">
        {ayahAPI.map((ayah: Ayah) => {
          return (
            <p className="font-indopak text-8xl leading-loose" key={ayah.id}>
              {ayah.text}
            </p>
          );
        })}
      </div> */
      }
    </main>
  );
}
