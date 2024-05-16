import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { BookmarkIcon } from "lucide-react";
import { Chapter } from "./types";

const QuranCard = ({ chapter }: { chapter: Chapter }) => {
  return (
    <Card className="h-48 flex flex-col justify-between">
      <CardHeader className="flex flex-row">
        <div className="gap-2 flex flex-col">
          <CardTitle>{chapter.name}</CardTitle>
          <CardDescription>{chapter.arabicname}</CardDescription>
        </div>
        <Button className="ml-auto" size="sm" variant="ghost">
          <BookmarkIcon />
          <span className="sr-only">Bookmark</span>
        </Button>
      </CardHeader>
      <CardContent>
        <p>{chapter.englishname}</p>
      </CardContent>
    </Card>
  );
};

export default QuranCard;
