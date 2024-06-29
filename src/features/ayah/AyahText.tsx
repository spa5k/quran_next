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
  // Determine the font class based on the edition ID
  const fontClass = fontClasses[editionId] || "font-primary"; // Default Tailwind class

  // Combine additional classes as needed using clsx and twMerge
  const combinedClassName = twMerge(clsx(fontClass, className, "ayah_text", "text-pretty", "leading-loose"));

  return (
    <p className={combinedClassName} dir="rtl" {...props}>
      {text}
      {/* {convertToArabicNumerals(number)} */}
    </p>
  );
};

// function convertToArabicNumerals(num: number): string {
//   // Mapping of normal digits to Arabic numerals
//   const arabicNumerals: { [key: number]: string } = {
//     0: "٠",
//     1: "١",
//     2: "٢",
//     3: "٣",
//     4: "٤",
//     5: "٥",
//     6: "٦",
//     7: "٧",
//     8: "٨",
//     9: "٩",
//   };

//   // Convert the number to a string
//   const numStr = num.toString();

//   // Replace each digit with the corresponding Arabic numeral
//   let arabicNumStr = "";
//   for (const digit of numStr) {
//     arabicNumStr += arabicNumerals[parseInt(digit)];
//   }

//   return arabicNumStr;
// }
