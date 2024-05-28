import { AyahAPI } from "@/src/features/quran/types";
import editions from "@features/quran/data/editions.json";

async function isLocalhostReachable(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:50000/health");
    if (response.status === 200) {
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}

export default async function Page({
  searchParams,
  params,
}: {
  searchParams?: { edition?: string; start?: string; end?: string };
  params?: { number: string };
}): Promise<JSX.Element> {
  console.log({ searchParams, params });

  const edition = editions.find((edition) => edition.id === (Number.parseInt(searchParams?.edition ?? "") ?? 120));

  const isLocalReachable = await isLocalhostReachable();

  const url = isLocalReachable
    ? `http://localhost:50000/surah/${params!.number}/${edition?.name}`
    : `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${edition?.name}/${params?.number}.min.json`;

  const ayahs = await fetch(url);
  const data = await ayahs.json();
  const ayahList = isLocalReachable ? data : data.chapter;

  return (
    <main className="mt-20">
      {JSON.stringify(params)}
      {ayahList.map((ayah: AyahAPI) => (
        <div key={ayah.id}>
          <p className="font-indopak text-8xl leading-loose">
            {ayah.text}
          </p>
        </div>
      ))}
    </main>
  );
}
