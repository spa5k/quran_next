import { EditionMultiSelectForm } from "@/src/features/edition/components/EditionMultiSelect";
import { fetchAyahs } from "@/src/features/quran/api/ayah";
import editions from "@features/quran/data/editions.json";

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

  // const editionId = Number.parseInt(searchParams?.edition ?? "") || 120;
  // console.log({ editionId });

  // const edition = editions.find((edition) => edition.id === editionId);

  // const ayahAPI = await fetchAyahs(
  //   editionId,
  //   Number.parseInt(params!.number),
  //   edition?.name ?? "",
  // );

  const quranEditions = editions.filter((edition) => edition.type === "QURAN");

  const translationEditions = editions.filter(
    (edition) => edition.type === "TRANSLATION",
  );

  const transliterationEditions = editions.filter(
    (edition) => edition.type === "TRANSLITERATION",
  );

  function parseEditions(editions: string): string[] {
    return editions.split(",").map((edition) => edition.trim());
  }

  const quranEditionsSelected = parseEditions(searchParams?.q ?? "");
  const translationEditionsSelected = parseEditions(searchParams?.t ?? "");
  const transliterationEditionsSelected = parseEditions(searchParams?.tl ?? "");

  const quranEditionsSelectedData = quranEditionsSelected.map((edition) => {
    return quranEditions.find(
      (quranEdition) => quranEdition.id === Number.parseInt(edition),
    );
  });

  const translationEditionsSelectedData = translationEditionsSelected.map(
    (edition) => {
      return translationEditions.find(
        (translationEdition) =>
          translationEdition.id === Number.parseInt(edition),
      );
    },
  );

  const transliterationEditionsSelectedData =
    transliterationEditionsSelected.map((edition) => {
      return transliterationEditions.find(
        (transliterationEdition) =>
          transliterationEdition.id === Number.parseInt(edition),
      );
    });

  console.log({
    quranEditionsSelectedData,
    translationEditionsSelectedData,
    transliterationEditionsSelectedData,
  });

  const quranEditionsFetched = await Promise.all(
    quranEditionsSelectedData.map(async (edition) => {
      return await fetchAyahs(
        edition!.id,
        Number.parseInt(params!.number),
        edition!.name,
      );
    }),
  );
  console.log({ quranEditionsFetched });

  console.log({
    quranEditionsSelected,
    translationEditionsSelected,
    transliterationEditionsSelected,
  });
  console.log({ quranEditions });
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
        <EditionMultiSelectForm
          edition={transliterationEditions}
          queryParam="tl"
          placeholder="Select Transliteration Edition"
          formName="Transliteration Editions"
          description="Select the transliteration edition you want to view"
        />
      </div>
      {quranEditionsFetched.map((ayahAPI) => {
        return ayahAPI.map((ayah) => {
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

      {/* <div className="mt-20">
        {ayahAPI.map((ayah: Ayah) => {
          return (
            <p className="font-indopak text-8xl leading-loose" key={ayah.id}>
              {ayah.text}
            </p>
          );
        })}
      </div> */}
    </main>
  );
}
