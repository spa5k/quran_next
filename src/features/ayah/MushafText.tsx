import clsx from "clsx";
import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { loadFont } from "./utils/fontLoader";

const MushafText = ({ page, text, type = "v1", className, ...props }: {
  page: string;
  text: string;
  type?: "v1" | "v2";
  className?: string;
  [x: string]: any;
}) => {
  const paddedPage = page.padStart(3, "0");

  useEffect(() => {
    loadFont(paddedPage, type);
  }, [paddedPage, type]);

  const fontFamily = `${type === "v1" ? "Mushaf Page" : "Mushaf2 Page"} ${paddedPage}`;

  // if text contains "number,", or any number with comma then delete it
  text = text.replace(/(\d+),/g, "");

  const combinedClassName = twMerge(clsx(className, "ayah_text", "text-pretty", "leading-loose"));

  return (
    <p style={{ fontFamily: `'${fontFamily}', sans-serif` }} className={combinedClassName} dir="rtl" {...props}>
      {text}
    </p>
  );
};

// Memoize the component
export default React.memo(MushafText);
