"use client";
import { Button } from "@/src/components/ui/button";
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

export const QuranFilters = (
  { filter, order, sort }: { filter: string | undefined; order: string | undefined; sort: string | undefined },
) => {
  const router = useRouter();
  const updateQueryParams = (key: string, value: string) => {
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

  const handleSortOrderChange = (order: string) => {
    updateQueryParams("order", order);
  };

  return (
    <div className="w-full flex justify-between items-center mb-4">
      <div className="flex items-center space-x-4">
        <Button
          size="sm"
          variant={filter === "surah" ? "default" : "outline"}
          onClick={() => handleFilterClick("surah")}
        >
          <ListIcon className="w-4 h-4 mr-2" />
          List by Surahs
        </Button>
        <Button
          size="sm"
          variant={filter === "juz" ? "default" : "outline"}
          onClick={() => handleFilterClick("juz")}
        >
          <ListIcon className="w-4 h-4 mr-2" />
          List by Juz
        </Button>
        <Button
          size="sm"
          variant={filter === "mecca" ? "default" : "outline"}
          onClick={() => handleFilterClick("mecca")}
        >
          <ListIcon className="w-4 h-4 mr-2" />
          List by Mecca
        </Button>
        <Button
          size="sm"
          variant={filter === "medina" ? "default" : "outline"}
          onClick={() => handleFilterClick("medina")}
        >
          <ListIcon className="w-4 h-4 mr-2" />
          List by Medina
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
            value={sort}
            onValueChange={handleSortChange}
          >
            <DropdownMenuRadioItem value="surah" disabled={filter === "surah"}>
              Number
            </DropdownMenuRadioItem>

            <DropdownMenuRadioItem value="name" disabled={filter === "juz"}>
              Name
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="last-read">
              Last Read
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bookmarked">
              Bookmarked
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Sort Order</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={order}
            onValueChange={handleSortOrderChange}
          >
            <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
