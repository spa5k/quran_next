import { EditionMultiSelectForm } from "@/src/features/edition/components/EditionMultiSelect";
import editions from "@features/quran/data/editions.json";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams?: { edition?: string; start?: string; end?: string };
  params?: { number: string };
}): Promise<JSX.Element> {
  console.log({ searchParams, params });

  // const editionId = Number.parseInt(searchParams?.edition ?? "") || 120;
  // console.log({ editionId });

  // const edition = editions.find((edition) => edition.id === editionId);

  // const ayahAPI = await fetchAyahs(
  //   editionId,
  //   Number.parseInt(params!.number),
  //   edition?.name ?? "",
  // );

  const quranEditions = editions.filter(
    (edition) => edition.type === "QURAN",
  );

  const translationEditions = editions.filter(
    (edition) => edition.type === "TRANSLATION",
  );

  const transliterationEditions = editions.filter(
    (edition) => edition.type === "TRANSLITERATION",
  );

  return (
    <main className="mt-20">
      <EditionMultiSelectForm edition={quranEditions} queryParam="q" />
      <EditionMultiSelectForm edition={translationEditions} queryParam="t" />
      <EditionMultiSelectForm
        edition={transliterationEditions}
        queryParam="tl"
      />

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
