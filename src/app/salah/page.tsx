import { SalahDisplay } from "@/features/salah/components/SalahDisplay";
export default async function Page({
  searchParams,
}: {
  searchParams?: { sort?: string; filter?: string };
}): Promise<JSX.Element> {
  return (
    <main className="mt-20">
      <SalahDisplay />
    </main>
  );
}
