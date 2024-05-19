export default async function Page({
  searchParams,
  params,
}: {
  searchParams?: { sort?: string; filter?: string };
  params?: { number: string };
}): Promise<JSX.Element> {
  return (
    <main className="mt-20">
      {JSON.stringify(params)}
      {/* <QuranHomepage searchParams={searchParams} /> */}
    </main>
  );
}
