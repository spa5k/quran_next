import { ElectronCheck } from "../components/generic/ElectronCheck";
import { Button } from "../components/ui/button";

export default function Page(): JSX.Element {
  return (
    <main>
      Electron + nextjs
      <ElectronCheck />
      <Button>NICer</Button>
    </main>
  );
}
