export async function isLocalhostReachable(): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:50000/health", {
      cache: "no-cache",
      mode: "no-cors",
    });
    const body = await response.text();
    return response.status === 200 && body === "Hono!";
  } catch (error) {
    return false;
  }
}

abstract class AyahService {
  public abstract fetchAyahs(
    editionId: number,
    surahNumber: number,
    editionName: string,
  ): Promise<Ayah[]>;
}

export class LocalAyahService extends AyahService {
  public async fetchAyahs(
    editionId: number,
    surahNumber: number,
    editionName: string,
  ): Promise<Ayah[]> {
    const response = await fetch(
      `http://localhost:50000/surah/${surahNumber}/${editionId}`,
    );
    return await response.json();
  }
}

export class RemoteAyahService extends AyahService {
  public async fetchAyahs(
    editionId: number,
    surahNumber: number,
    editionName: string,
  ): Promise<Ayah[]> {
    const urls = [
      `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${editionName}/${surahNumber}.json`,
      `https://rawcdn.githack.com/fawazahmed0/quran-api/ffd3f3a2d44f5206acf0579878e6a0e5634899fa/editions/${editionName}/${surahNumber}.json`,
      `https://cdn.statically.io/gh/fawazahmed0/quran-api/1/editions/${editionName}/${surahNumber}.json`,
      `https://raw.githubusercontent.com/fawazahmed0/quran-api/1/editions/${editionName}/${surahNumber}.json`,
      `https://gitloaf.com/cdn/fawazahmed0/quran-api/1/editions/${editionName}/${surahNumber}.json`,
    ];

    for (const url of urls) {
      try {
        const response = await fetch(url, {
          cache: "force-cache",
        });
        const data = await response.json();
        return this.formatAyahs(data.chapter, editionId);
      } catch (error) {
        console.error("Failed to fetch from URL:", url, "; Error:", error);
      }
    }

    throw new Error("All URLs failed to fetch data.");
  }

  formatAyahs(chapter: any[], editionId: number): Ayah[] {
    return chapter.map((ayah: AyahQuranApiAyah) => ({
      id: ayah.chapter,
      surahNumber: ayah.chapter,
      ayahNumber: ayah.verse,
      editionId,
      text: ayah.text,
    }));
  }
}

export const fetchAyahs = async (
  editionId: number,
  surahNumber: number,
  editionName: string,
): Promise<Ayah[]> => {
  const isLocalhost = await isLocalhostReachable();
  const service = isLocalhost
    ? new LocalAyahService()
    : new RemoteAyahService();
  return await service.fetchAyahs(editionId, surahNumber, editionName);
};

export type Ayah = {
  id: number;
  surahNumber: number;
  ayahNumber: number;
  editionId: number;
  text: string;
};

export interface AyahQuranAPI {
  chapter: AyahQuranApiAyah[];
}

export interface AyahQuranApiAyah {
  chapter: number;
  verse: number;
  text: string;
}
