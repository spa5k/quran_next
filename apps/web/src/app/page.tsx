import { Button } from "@quran/ui/components/ui/button";
import { ElectronCheck } from "../components/generic/ElectronCheck";

export default function Page(): JSX.Element {
  return (
    <main>
      Electron + nextjs
      <ElectronCheck />
      <Button>NICer</Button>
    </main>
  );
}
