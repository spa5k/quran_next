import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { BookmarkIcon } from "lucide-react";
import { JuzsReference } from "./types";

export const JuzCard = ({ juz }: { juz: JuzsReference }) => {
  return (
    <Card className="h-48 flex flex-col justify-between">
      <CardHeader className="flex flex-row">
        <div className="gap-2 flex flex-col">
          <CardTitle>{juz.name}</CardTitle>
          <CardDescription>{juz.arabic_name}</CardDescription>
        </div>
        <Button className="ml-auto" size="sm" variant="ghost">
          <BookmarkIcon />
          <span className="sr-only">Bookmark</span>
        </Button>
      </CardHeader>
      <CardContent>
        <p className="truncate">{juz.translation}</p>
      </CardContent>
    </Card>
  );
};
