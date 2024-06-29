"use client";
import { useEffect } from "react";
import { loadFont } from "./utils/fontLoader";

export const MushafText = ({ page, text, type = "mushaf" }: {
  page: string;
  text: string;
  type?: "mushaf" | "mushaf2";
}) => {
  useEffect(() => {
    loadFont(page, type);
  }, [page, type]);

  const fontFamily = `${type === "mushaf" ? "Mushaf Page" : "Mushaf2 Page"} ${page}`;

  // if text contains "number,", or any number with comma then delete it
  text = text.replace(/(\d+),/g, "");

  return (
    <p style={{ fontFamily: `'${fontFamily}', sans-serif` }} className="text-2xl">
      {text}
    </p>
  );
};
