import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/src/components/ui/tooltip";
import { BookmarkIcon } from "lucide-react";
import { Chapter } from "./types";

const QuranCard = ({ chapter, juzStart, juzEnd }: { chapter: Chapter; juzStart: number; juzEnd: number }) => {
  const juzRange = juzStart !== juzEnd && juzEnd ? `Juz ${juzStart}-${juzEnd}` : `Juz ${juzStart}`;
  return (
    <Card className="h-48 flex flex-col justify-between">
      <CardHeader className="flex flex-row">
        <div className="gap-2 flex flex-col">
          <CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>{chapter.name}</TooltipTrigger>
                <TooltipContent>
                  <p className="font-arabic">{chapter.verses.length} Verses - {chapter.revelation}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardTitle>
          <CardDescription>
            {juzRange}, Surah {chapter.chapter}
          </CardDescription>
        </div>
        <Button className="ml-auto" size="sm" variant="ghost">
          <BookmarkIcon />
          <span className="sr-only">Bookmark</span>
        </Button>
      </CardHeader>
      <CardContent className="flex justify-between w-full">
        <p className="">{chapter.englishname}</p>
        <p className="font-arabic text-right">{chapter.arabicname}</p>
      </CardContent>
    </Card>
  );
};

export default QuranCard;
