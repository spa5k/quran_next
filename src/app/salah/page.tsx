import { SalahDisplay } from "@/features/salah/components/SalahDisplay";
export default async function Page({
  searchParams,
}: {
  searchParams?: { open: string };
}): Promise<JSX.Element> {
  return (
    <main className="mt-20">
      <SalahDisplay />
    </main>
  );
}
