"use client";

import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";

export function SearchBar() {
  const placeholders = [
    "Surah Al-Fatiha",
    "Surah Al-Baqarah",
    "Battle of Badr",
    "Sahih Al Bukhari",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="p-10 ">
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
