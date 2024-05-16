import { QuranHomepage } from "@/src/components/features/quran/Homepage";
import { cormorant_garamond, taviraj } from "@/src/lib/fonts";
import "./quran.css";

const data = async () => {
  const honoport = process.env.HONO_PORT;
  console.log("hono port", process.env.HONO_PORT);
  // const response = await fetch("http://localhost:3000/");
  // const json = await response.json();
  return honoport;
};

export default async function Page({
  searchParams,
}: {
  searchParams?: { sort?: string; filter?: string };
}): Promise<JSX.Element> {
  console.log("searchParams", searchParams);
  return (
    <main className="mt-20">
      <QuranHomepage searchParams={searchParams} />
    </main>
  );
}
