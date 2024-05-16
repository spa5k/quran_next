import { QuranHomepage } from "@/src/features/quran/Homepage";
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
  return (
    <main className="mt-20">
      <QuranHomepage searchParams={searchParams} />
    </main>
  );
}
