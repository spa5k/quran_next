import {
  foreignKey,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const ayah = sqliteTable(
  "ayah",
  {
    id: integer("id").primaryKey().notNull(),
    surahNumber: integer("surah_number").notNull(),
    ayahNumber: integer("ayah_number").notNull(),
    editionId: integer("edition_id").notNull(),
    text: text("text").notNull(),
  },
  (ayah) => ({
    editionFk: foreignKey({
      columns: [ayah.editionId],
      foreignColumns: [edition.id],
    }),
  }),
);

// Ayah Info Table
export const ayahInfo = sqliteTable("ayah_info", {
  id: integer("id").primaryKey().notNull(),
  surahNumber: integer("surah_number").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
  ayahKey: text("ayah_key").notNull(),
  hizb: integer("hizb").notNull(),
  rubElHizb: integer("rub_el_hizb").notNull(),
  ruku: integer("ruku").notNull(),
  manzil: integer("manzil").notNull(),
  page: integer("page").notNull(),
  juz: integer("juz").notNull(),
});

// Edition Table
export const edition = sqliteTable("edition", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(),
  author: text("author"),
  language: text("language").notNull(),
  direction: text("direction").notNull(),
  source: text("source"),
  type: text("type").notNull(),
  enabled: integer("enabled").notNull(),
});

// Juz Table
export const juz = sqliteTable("juz", {
  id: integer("id").primaryKey().notNull(),
  juzNumber: integer("juz_number").notNull(),
  startSurah: integer("start_surah").notNull(),
  startAyah: integer("start_ayah").notNull(),
  endSurah: integer("end_surah").notNull(),
  endAyah: integer("end_ayah").notNull(),
});

// Sajdah Table
export const sajdah = sqliteTable("sajdah", {
  id: integer("id").primaryKey().notNull(),
  sajdahNumber: integer("sajdah_number").notNull(),
  surahNumber: integer("surah_number").notNull(),
  ayahNumber: integer("ayah_number").notNull(),
});

// Surah Table
export const surah = sqliteTable(
  "surah",
  {
    id: integer("id").primaryKey().notNull(),
    surahNumber: integer("surah_number").notNull(),
    nameSimple: text("name_simple").notNull(),
    nameComplex: text("name_complex").notNull(),
    nameArabic: text("name_arabic").notNull(),
    ayahStart: integer("ayah_start").notNull(),
    ayahEnd: integer("ayah_end").notNull(),
    revelationPlace: text("revelation_place").notNull(),
    pageStart: integer("page_start").notNull(),
    pageEnd: integer("page_end").notNull(),
  },
  (surah) => ({
    uniqueIndex: uniqueIndex("surah_surah_number_unique").on(surah.surahNumber),
  }),
);

// Translation Table
export const translation = sqliteTable(
  "translation",
  {
    id: integer("id").primaryKey().notNull(),
    surahNumber: integer("surah_number").notNull(),
    ayahNumber: integer("ayah_number").notNull(),
    editionId: integer("edition_id").notNull(),
    text: text("text").notNull(),
    juzNumber: integer("juz_number"),
  },
  (translation) => ({
    editionFk: foreignKey({
      columns: [translation.editionId],
      foreignColumns: [edition.id],
    }),
    ayahFk: foreignKey({
      columns: [translation.surahNumber, translation.ayahNumber],
      foreignColumns: [ayah.surahNumber, ayah.ayahNumber],
    }),
    uniqueIndex: uniqueIndex(
      "translation_surah_number_ayah_number_edition_id_unique",
    ).on(
      translation.surahNumber,
      translation.ayahNumber,
      translation.editionId,
    ),
  }),
);

// Tajweed Table
export const tajweed = sqliteTable(
  "tajweed",
  {
    id: integer("id").primaryKey().notNull(),
    surahNumber: integer("surah_number").notNull(),
    ayahNumber: integer("ayah_number").notNull(),
    tajweed: text("tajweed").notNull(),
  },
  (tajweed) => ({
    uniqueIndex: uniqueIndex("tajweed_surah_number_ayah_number_unique").on(
      tajweed.surahNumber,
      tajweed.ayahNumber,
    ),
  }),
);
