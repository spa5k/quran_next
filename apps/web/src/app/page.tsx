import { Dashboard } from "../components/layout/Dashboard";
import { Hero } from "../components/layout/Hero";

export default async function Page(): Promise<JSX.Element> {
  return (
    <main>
      <Hero />
      <Dashboard />
    </main>
  );
}
