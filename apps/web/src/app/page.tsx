import { Dashboard } from "../components/layout/Dashboard";
import { Hero } from "../components/layout/Hero";

const data = async () => {
  const honoport = process.env.HONO_PORT;
  console.log("hono port", process.env.HONO_PORT);
  // const response = await fetch("http://localhost:3000/");
  // const json = await response.json();
  return honoport;
};

export default async function Page(): Promise<JSX.Element> {
  const d = await data();
  console.log("data", d);
  return (
    <main>
      <Hero />
      <Dashboard />
    </main>
  );
}
