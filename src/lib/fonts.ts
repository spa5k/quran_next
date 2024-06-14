import {
  Cormorant_Garamond,
  Inter,
  Lexend,
  Noto_Nastaliq_Urdu,
  Noto_Sans_Devanagari,
  Readex_Pro,
  Taviraj,
} from "next/font/google";
import localFont from "next/font/local";

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

export const noto_sans_devanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-hindi",
  weight: ["300", "400", "700"],
});

export const indopak = localFont({
  src: "./fonts/indopak.woff2",
  display: "swap",
  variable: "--font-indopak",
});

export const noto_nastaliq_urdu = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  variable: "--font-urdu",
  weight: ["400", "700"],
});

export const uthmanic = localFont({
  src: "./fonts/hafs-uthmanic-v14-full.woff2",
  display: "swap",
  variable: "--font-uthmanic",
});
