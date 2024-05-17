import { Cormorant_Garamond, Inter, Lexend, Readex_Pro, Taviraj } from "next/font/google";

export const inter = Inter({ subsets: ["latin"] });
export const cormorant_garamond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-cormorant_garamond",
});

export const taviraj = Taviraj({
  subsets: ["latin"],
  variable: "--font-taviraj",
  weight: ["300", "400", "700", "800"],
});

export const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  weight: ["300", "400", "700"],
});

export const readex_pro = Readex_Pro({
  subsets: ["latin"],
  variable: "--font-readex_pro",
  weight: ["300", "400", "700"],
});
