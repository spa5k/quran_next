import { BookmarkIcon } from "lucide-react";
import React from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../ui/card";
import { Chapter } from "./types";

const QuranCard = ({ chapter }: { chapter: Chapter }) => {
  return (
    <Card className="h-48 flex flex-col justify-between">
      <CardHeader className="flex flex-row">
        <div>
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
