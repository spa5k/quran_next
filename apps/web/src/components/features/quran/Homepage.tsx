import { promises as fs } from "fs";
import { Input } from "../../ui/input";
import { JuzCard } from "./JuzCard";
import { QuranFilters } from "./QuranFilters";
import QuranCard from "./SurahCard";
import { type Chapter, type Juzs, QuranData } from "./types";

export async function QuranHomepage({
  searchParams,
}: {
  searchParams?: { sort?: string; filter?: string };
}) {
  const file = await fs.readFile(process.cwd() + "/data/quran.json", "utf-8");
  // print cwd
  const data: QuranData = JSON.parse(file);
  if (!searchParams) {
    searchParams = {};
  }
  const { filter, sort } = searchParams;

  let dataToDisplay: Chapter[] | Juzs = [];

  let dataType = "surah";

  if (filter === "surah") {
    console.log("filter surah");
    dataToDisplay = data.chapters;
    dataType = "surah";
  } else if (filter === "juz") {
    console.log("filter juz");
    dataToDisplay = data.juzs;
    dataType = "juz";
  } else {
    console.log("no filter");
    dataToDisplay = data.chapters;
    dataType = "surah";
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
          <QuranFilters />
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dataType === "juz"
              ? (dataToDisplay as Juzs).references.map((juz, index) => <JuzCard juz={juz} />)
              : (dataToDisplay as Chapter[]).map((chapter) => <QuranCard key={chapter.name} chapter={chapter} />)}
          </div>
        </div>
      </div>
    </main>
  );
}
