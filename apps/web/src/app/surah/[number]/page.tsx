import type { Ayah } from "@/src/db/schema";
import { fetchAyahs } from "@/src/features/api/ayah";
import editions from "@features/quran/data/editions.json";

export default async function Page({
  searchParams,
  params,
}: {
  searchParams?: { edition?: string; start?: string; end?: string };
  params?: { number: string };
}): Promise<JSX.Element> {
  console.log({ searchParams, params });

  const editionId = Number.parseInt(searchParams?.edition ?? "") || 120;

  const edition = editions.find((edition) => edition.id === editionId);

  const ayahAPI = await fetchAyahs(
    editionId,
    Number.parseInt(params!.number),
    edition?.name ?? "",
  );

  return (
    <main className="mt-20">
      {ayahAPI.map((ayah: Ayah) => {
        return (
          <p className="font-indopak text-8xl leading-loose" key={ayah.id}>
            {ayah.text}
          </p>
        );
      })}
    </main>
  );
}
