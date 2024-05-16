"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { FilterIcon, ListIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";

export const QuranFilters = () => {
  const router = useRouter();

  const updateQueryParams = (key, value) => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`${url.pathname}?${params.toString()}`);
  };

  const handleFilterClick = (filterType: string) => {
    updateQueryParams("filter", filterType);
  };

  const handleSortChange = (sortType: any) => {
    updateQueryParams("sort", sortType);
  };

  return (
    <div className="w-full flex justify-between items-center mb-4">
      <div className="flex items-center space-x-4">
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFilterClick("surah")}
        >
          <ListIcon className="w-4 h-4 mr-2" />
          List by Surahs
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFilterClick("juz")}
        >
          <ListIcon className="w-4 h-4 mr-2" />
          List by Juz
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFilterClick("revelation")}
        >
          <ListIcon className="w-4 h-4 mr-2" />
          List by Revelation
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleFilterClick("makkah-madinah")}
        >
          <ListIcon className="w-4 h-4 mr-2" />
          List by Makkah/Madinah
        </Button>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <FilterIcon className="w-4 h-4 mr-2" />
            Sort by
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            defaultValue="surah"
            onValueChange={handleSortChange}
          >
            <DropdownMenuRadioItem value="surah">
              Surah Number
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="juz">Juz</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="name">
              Surah Name
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="last-read">
              Last Read
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bookmarked">
              Bookmarked
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
