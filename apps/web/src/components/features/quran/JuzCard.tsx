import { BookmarkIcon } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { JuzsReference } from "./types";

export const JuzCard = ({ juz }: { juz: JuzsReference }) => {
  return (
    <Card className="h-48 flex flex-col justify-between">
      <CardHeader className="flex flex-row">
        <div>
          <CardTitle>{juz.juz}. {juz.name}</CardTitle>
          <CardDescription>{juz.arabic_name}</CardDescription>
        </div>
        <Button className="ml-auto" size="sm" variant="ghost">
          <BookmarkIcon />
          <span className="sr-only">Bookmark</span>
        </Button>
      </CardHeader>
      <CardContent>
        <p>{juz.translation}</p>
      </CardContent>
    </Card>
  );
};
