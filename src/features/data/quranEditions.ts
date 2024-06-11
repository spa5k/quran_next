import type { Edition } from "../edition/api/editions";

export const quranEditions: Edition[] = [
  {
    id: 145,
    slug: "ara-quranindopak",
    author: "Indopak",
    direction: "rtl",
    type: "QURAN",
    name: "IndoPak",
    enabled: true,
    language: "arabic",
  },
  {
    id: 120,
    slug: "ara-quranuthmanihaf",
    author: "Quran Uthmani Hafs",
    direction: "rtl",
    type: "QURAN",
    name: "Uthmanic",
    enabled: true,
    language: "arabic",
  },
  {
    id: 62,
    slug: "ara-quransimple",
    author: "Quran Simple",
    direction: "rtl",
    type: "QURAN",
    name: "Simple",
    enabled: true,
    language: "arabic",
  },
];
