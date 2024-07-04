// SelectReciter.tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { reciters } from "../data/reciters";
import { useRecitationStore } from "../store/recitationStore";

export function SelectReciter() {
  const setReciter = useRecitationStore((state) => state.setReciter);

  const handleSelect = (value: string) => {
    setReciter(value);
  };

  return (
    <Select onValueChange={handleSelect}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a reciter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Reciters</SelectLabel>
          {reciters.map((reciter) => (
            <SelectItem key={reciter.surah} value={reciter.subfolder}>
              {reciter.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
