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
    <main className="mt-20 flex gap-4">
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
      <EditionMultiSelectForm
        edition={transliterationEditions}
        queryParam="tl"
        placeholder="Select Transliteration Edition"
        formName="Transliteration Editions"
        description="Select the transliteration edition you want to view"
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
