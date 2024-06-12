import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Define font classes based on edition IDs using Tailwind CSS
const fontClasses: { [key: number]: string } = {
  "211": "font-primary",
  "101": "font-primary",
  "244": "font-hindi",
  "273": "font-urdu",
};

export const TranslationText = (
  { text, editionId, className, ...props }: { text: string; editionId: number; className?: string; [x: string]: any },
) => {
  // Determine the font class based on the edition ID
  const fontClass = fontClasses[editionId] || "font-primary"; // Default Tailwind class

  // Combine additional classes as needed using clsx and twMerge
  const combinedClassName = twMerge(clsx(fontClass, className, "ayah_text"));

  return <p className={combinedClassName} {...props}>{text}</p>;
};
