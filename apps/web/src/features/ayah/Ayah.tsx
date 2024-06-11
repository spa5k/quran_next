import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Define font classes based on edition IDs using Tailwind CSS
const fontClasses: { [key: number]: string } = {
  120: "font-uthmanic", // Tailwind class for Uthmanic font
  145: "font-indopak", // Tailwind class for IndoPak font
  62: "font-indopak", // Tailwind class for IndoPak font
};

export const Ayah = (
  { text, editionId, className, ...props }: { text: string; editionId: number; className?: string; [x: string]: any },
) => {
  // Determine the font class based on the edition ID
  const fontClass = fontClasses[editionId] || "font-primary"; // Default Tailwind class

  // Combine additional classes as needed using clsx and twMerge
  const combinedClassName = twMerge(clsx(fontClass, className));

  return <p className={combinedClassName} {...props}>{text}</p>;
};
