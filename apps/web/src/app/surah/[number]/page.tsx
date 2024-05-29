import { db } from "@/src/db";
import { ayah } from "@/src/db/schema";
import { AyahAPI } from "@/src/features/quran/types";
import editions from "@features/quran/data/editions.json";
import { eq, sql } from "drizzle-orm";

async function isLocalhostReachable(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:50000/health", { "cache": "no-cache" });
    console.log("🚀 ~ response", response);
    const body = await response.json();
    console.log("🚀 ~ body", body);
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

/**
 * Retrieves the Ayahs (verses) by the given Surah number and Edition ID.
 * @param surahNumber - The Surah number.
 * @param editionId - The Edition ID.
 * @returns A Promise that resolves to the Ayahs matching the given Surah number and Edition ID.
 */
export function getAyahsBySurahNumberAndEditionID(
  surahNumber: number,
  editionId: number,
) {
  return db
    .select()
    .from(ayah)
    .where(
      sql`
    ${eq(ayah.surahNumber, surahNumber)} and ${eq(ayah.editionId, editionId)}
  `,
    )
    .all();
}

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

  const data = getAyahsBySurahNumberAndEditionID(Number(params!.number), editionId);

  // console.log({ edition, editionId });

  // const isLocalReachable = await isLocalhostReachable();
  // console.log("🚀 ~ isLocalReachable:", isLocalReachable);

  // const url = isLocalReachable
  //   ? `http://localhost:50000/surah/${params!.number}/${edition?.name}`
  //   : `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${edition?.name}/${params?.number}.min.json`;

  // const ayahs = await fetch(url);
  // const data = await ayahs.json();
  // const ayahList = isLocalReachable ? data : data.chapter;

  return (
    <main className="mt-20">
      {data.map((ayah: AyahAPI) => {
        return (
          <p className="font-indopak text-8xl leading-loose" key={ayah.id}>
            {ayah.text}
          </p>
        );
      })}
    </main>
  );
}
