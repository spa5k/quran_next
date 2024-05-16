import { Input } from "@/src/components/ui/input";
import { promises as fs } from "fs";
import { JuzCard } from "./JuzCard";
import { QuranFilters } from "./QuranFilters";
import QuranCard from "./SurahCard";
import { type Chapter, type JuzsReference, QuranData, Revelation } from "./types";

export async function QuranHomepage({
  searchParams,
}: {
  searchParams?: { sort?: string; filter?: string; order?: string };
}) {
  let file;
  if (process.env.NODE_ENV === "production") {
    const response = await fetch(
      "https://raw.githubusercontent.com/spa5k/quran_next/main/apps/web/public/data/quran.json",
    );
    file = await response.text();
  } else {
    file = await fs.readFile(process.cwd() + "/public/data/quran.json", "utf-8");
  }
  const data: QuranData = JSON.parse(file);
  if (!searchParams) {
    searchParams = {};
  }
  const { filter, sort, order } = searchParams;

  let dataToDisplay: Chapter[] | JuzsReference[] = [];

  let dataType = "surah";

  if (filter === "surah") {
    dataToDisplay = data.chapters;
    dataType = "surah";
  } else if (filter === "juz") {
    dataToDisplay = data.juzs.references;
    dataType = "juz";
  } else if (filter === "mecca") {
    dataToDisplay = data.chapters.filter((chapter) => chapter.revelation === Revelation.Mecca);
    dataType = "surah";
  } else if (filter === "medina") {
    dataToDisplay = data.chapters.filter((chapter) => chapter.revelation === Revelation.Madina);
    dataType = "surah";
  } else {
    dataToDisplay = data.chapters;
    dataType = "surah";
  }

  if (sort) {
    const sortOrder = order === "desc" ? -1 : 1;
    if (dataType === "surah") {
      dataToDisplay = (dataToDisplay as Chapter[]).sort((a, b) => {
        if (sort === "surah") {
          return (a.chapter - b.chapter) * sortOrder;
        } else if (sort === "name") {
          return a.name.localeCompare(b.name) * sortOrder;
        }
        return 0;
      });
    } else if (dataType === "juz") {
      dataToDisplay = (dataToDisplay as JuzsReference[]).sort((a, b) => {
        if (sort === "surah") {
          // Sort by the starting chapter and verse of the Juz
          if (a.start.chapter !== b.start.chapter) {
            return (a.start.chapter - b.start.chapter) * sortOrder;
          }
          return (a.start.verse - b.start.verse) * sortOrder;
        } else if (sort === "juz") {
          return (a.juz - b.juz) * sortOrder;
        }
        return 0;
      });
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="container max-w-5xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 font-cursive">
            Explore the Quranic Surahs
          </h1>
          <div className="w-full max-w-xl">
            <Input
              className="w-full px-4 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Search for a surah..."
              type="search"
            />
          </div>
          <QuranFilters filter={filter} order={order} sort={sort} />
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataType === "juz"
              ? (dataToDisplay as JuzsReference[]).map((juz, index) => <JuzCard juz={juz} key={juz.arabic_name} />)
              : (dataToDisplay as Chapter[]).map((chapter) => <QuranCard key={chapter.name} chapter={chapter} />)}
          </div>
        </div>
      </div>
    </main>
  );
}
