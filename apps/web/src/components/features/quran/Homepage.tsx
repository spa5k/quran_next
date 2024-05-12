/**
 * v0 by Vercel.
 * @see https://v0.dev/t/RlTQBBhin3z
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { BookmarkIcon, FilterIcon, ListIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Input } from "../../ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../ui/pagination";

export function QuranHomepage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <div className="container max-w-5xl px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 font-cursive">
            Explore the Quranic Surahs
          </h1>
          <div className="w-full max-w-xl">
            <Input
              className="w-full px-4 py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-gray-100"
              placeholder="Search for a surah..."
              type="search"
            />
          </div>
          <div className="w-full flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <Button size="sm" variant="outline">
                <ListIcon className="w-4 h-4 mr-2" />
                List by Surahs
              </Button>
              <Button size="sm" variant="outline">
                <ListIcon className="w-4 h-4 mr-2" />
                List by Juz
              </Button>
              <Button size="sm" variant="outline">
                <ListIcon className="w-4 h-4 mr-2" />
                List by Revelation
              </Button>
              <Button size="sm" variant="outline">
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
                <DropdownMenuRadioGroup defaultValue="surah">
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
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Al-Fatihah</CardTitle>
                <CardDescription>Juz 1, Surah 1</CardDescription>
                <Button className="ml-auto" size="sm" variant="ghost">
                  <BookmarkIcon className="w-4 h-4" />
                  <span className="sr-only">Bookmark</span>
                </Button>
              </CardHeader>
              <CardContent>
                <p>The Opening, The Exordium</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Al-Baqarah</CardTitle>
                <CardDescription>Juz 1-3, Surah 2</CardDescription>
                <Button className="ml-auto" size="sm" variant="ghost">
                  <BookmarkIcon className="w-4 h-4" />
                  <span className="sr-only">Bookmark</span>
                </Button>
              </CardHeader>
              <CardContent>
                <p>The Cow</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Aal-i-Imran</CardTitle>
                <CardDescription>Juz 3-4, Surah 3</CardDescription>
                <Button className="ml-auto" size="sm" variant="ghost">
                  <BookmarkIcon className="w-4 h-4" />
                  <span className="sr-only">Bookmark</span>
                </Button>
              </CardHeader>
              <CardContent>
                <p>The Family of Imran</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>An-Nisa</CardTitle>
                <CardDescription>Juz 4-5, Surah 4</CardDescription>
                <Button className="ml-auto" size="sm" variant="ghost">
                  <BookmarkIcon className="w-4 h-4" />
                  <span className="sr-only">Bookmark</span>
                </Button>
              </CardHeader>
              <CardContent>
                <p>The Women</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Al-Ma'idah</CardTitle>
                <CardDescription>Juz 6-7, Surah 5</CardDescription>
                <Button className="ml-auto" size="sm" variant="ghost">
                  <BookmarkIcon className="w-4 h-4" />
                  <span className="sr-only">Bookmark</span>
                </Button>
              </CardHeader>
              <CardContent>
                <p>The Table Spread</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Al-An'am</CardTitle>
                <CardDescription>Juz 7-8, Surah 6</CardDescription>
                <Button className="ml-auto" size="sm" variant="ghost">
                  <BookmarkIcon className="w-4 h-4" />
                  <span className="sr-only">Bookmark</span>
                </Button>
              </CardHeader>
              <CardContent>
                <p>The Cattle</p>
              </CardContent>
            </Card>
          </div>
          <div className="flex justify-center w-full">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </main>
  );
}
