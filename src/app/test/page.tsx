import { MushafText } from "@/features/ayah/MushafText";

export default async function Page({
  searchParams,
}: {
  searchParams?: { open: string };
}): Promise<JSX.Element> {
  return (
    <main className="mt-20 flex flex-col text-balance h-full gap-4" dir="rtl">
      <MushafText page="001" text="ﱁ ﱂ ﱃ ﱄ ﱅ" type="mushaf2" />
      <MushafText page="001" text="1,ﱆ ﱇ ﱈ ﱉ ﱊ" type="mushaf2" />
      <MushafText page="001" text="1,ﱋ ﱌ ﱍ" type="mushaf2" />
      <MushafText page="001" text="1,ﱎ ﱏ ﱐ ﱑ " type="mushaf2" />
      <MushafText page="001" text="1,ﱒ ﱓ ﱔ ﱕ ﱖ" type="mushaf2" />
      <MushafText page="001" text="1,ﱗ ﱘ ﱙ ﱚ" type="mushaf2" />
      <MushafText page="001" text="1,ﱛ ﱜ ﱝ ﱞ ﱟ ﱠ ﱡ ﱢ ﱣ ﱤ " type="mushaf2" />
    </main>
  );
}
