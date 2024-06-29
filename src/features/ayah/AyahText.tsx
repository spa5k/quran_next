import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Define font classes based on edition IDs using Tailwind CSS
const fontClasses: { [key: number]: string } = {
  120: "font-uthmanic", // Tailwind class for Uthmanic font
  145: "font-indopak", // Tailwind class for IndoPak font
  146: "font-arabic_noto", // Tailwind class for default font
  62: "font-indopak", // Tailwind class for primary font
};

export const AyahText = (
  { text, editionId, className, number, ...props }: {
    text: string;
    editionId: number;
    className?: string;
    number: number;
    [x: string]: any;
  },
) => {
  const fontClass = fontClasses[editionId] || "font-primary";

  const combinedClassName = twMerge(clsx(fontClass, className, "ayah_text", "text-pretty", "leading-loose"));

  return (
    <p className={combinedClassName} dir="rtl" {...props}>
      {text}
    </p>
  );
};
