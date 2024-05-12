/* eslint-disable @next/next/no-img-element */
import { BellIcon, Book, CalendarIcon, Compass, FileTextIcon, FormInputIcon, GlobeIcon, Settings } from "lucide-react";
import { RecitationCard } from "../features/recitation/components/RecitationCard";
import { BentoCard, BentoGrid } from "../ui/bento-grid";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import Globe from "../ui/globe";
import { GridPatternLinearGradient } from "../ui/grid-pattern";
const features = [
  {
    Icon: FileTextIcon,
    name: "Quran Recitation",
    description: "Listen to the recitation of the Quran and read it.",
    href: "/",
    cta: "Learn more",
    background: (
      <div className="transform-gpu blur-[1px] transition-all duration-300 ease-out hover:blur-none">
        <RecitationCard />
      </div>
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: FormInputIcon,
    name: "Search Quran",
    description: "Search for specific verses or keywords in the Quran.",
    href: "/",
    cta: "Learn more",
    background: (
      <Command className="absolute right-10 top-10 w-[70%] origin-top translate-x-0 border transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_40%,#000_80%)] group-hover:-translate-x-10">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Surah Al-Fatiha</CommandItem>
            <CommandItem>Surah Al-Baqarah</CommandItem>
            <CommandItem>Surah Al-Ikhlas</CommandItem>
            <CommandItem>
              Jesus declared, “I am truly a servant of Allah. He has destined me to be given the Scripture and to be a
              prophet. (19:30)
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: GlobeIcon,
    name: "Translation",
    description: "Read the Quran in multiple languages.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
  },
  {
    Icon: CalendarIcon,
    name: "Prayer Times",
    description: "Get accurate prayer times based on your location.",
    href: "/",
    cta: "Learn more",
    background: (
      <div className="h-[200px] w-full transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_10%,#000_60%)] group-hover:scale-105 sm:left-40 p-5">
        Next prayer in <span className="text-2xl font-semibold">15 minutes</span>

        <div className="flex flex-col gap-4 mt-4">
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">Fajr</span>
            <span className="text-lg">5:30 AM</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">Sunrise</span>
            <span className="text-lg">6:30 AM</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-lg font-semibold">Dhuhr</span>
            <span className="text-lg">12:30 PM</span>
          </div>
        </div>
      </div>
    ),
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-3",
  },
  {
    Icon: BellIcon,
    name: "Reminders",
    description: "Set reminders for important Islamic events and activities.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
  // Islamic history
  {
    Icon: Compass,
    name: "Islamic History",
    description: "Explore the rich history of Islam.",
    href: "/",
    cta: "Learn more",
    background: (
      <Globe className="top-0 h-[600px] w-[600px] transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)] group-hover:scale-105 sm:left-40" />
    ),
    className: "lg:col-start-1 lg:col-end-3 lg:row-start-4 lg:row-end-6",
  },
  // Hadith browser
  {
    Icon: Book,
    name: "Hadith Browser",
    description: "Explore and search through authentic hadith.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-4 lg:row-end-5",
  },
  // User settings
  {
    Icon: Settings,
    name: "User Settings",
    description: "Customize your app preferences and settings.",
    href: "/",
    cta: "Learn more",
    background: <GridPatternLinearGradient />,
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-5 lg:row-end-6",
  },
];

export const Dashboard = () => {
  return (
    <div className="flex flex-1 flex-col mt-10">
      <BentoGrid className="lg:grid-rows-4">
        {features.map((feature) => <BentoCard key={feature.name} {...feature} />)}
      </BentoGrid>
    </div>
  );
};