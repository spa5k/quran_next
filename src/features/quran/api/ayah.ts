import { $fetch } from "ofetch";
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
    editionName: string
  ): Promise<Ayah[]>;
}

export class LocalAyahService extends AyahService {
  public async fetchAyahs(
    editionId: number,
    surahNumber: number,
    editionName: string
  ): Promise<Ayah[]> {
    const response = await fetch(
      `http://localhost:50000/surah/${surahNumber}/${editionId}`
    );
    return await response.json();
  }
}

export class RemoteAyahService extends AyahService {
  public async fetchAyahs(
    editionId: number,
    surahNumber: number,
    editionName: string
  ): Promise<Ayah[]> {
    const response = await $fetch(
      `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${editionName}/${surahNumber}.json`,
      { cache: "force-cache" }
    );

    const chapter = response.chapter;

    // Format the data to be in the same format as the local API
    return chapter.map((ayah: AyahQuranApiAyah) => ({
      id: ayah.chapter,
      surahNumber: ayah.chapter,
      ayahNumber: ayah,
      editionId,
      text: ayah.text,
    }));
  }
}

export const fetchAyahs = async (
  editionId: number,
  surahNumber: number,
  editionName: string
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
