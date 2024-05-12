/* eslint-disable @next/next/no-img-element */
import { BellIcon, Book, CalendarIcon, Compass, FileTextIcon, FormInputIcon, GlobeIcon, Settings } from "lucide-react";
import { BentoCard, BentoGrid } from "../ui/bento-grid";
import DotPattern from "../ui/dot-pattern";
import Globe from "../ui/globe";
const features = [
  {
    Icon: FileTextIcon,
    name: "Quran Recitation",
    description: "Listen to the recitation of the Quran and read it.",
    href: "/",
    cta: "Learn more",
    background: (
      <DotPattern className="top-0 h-[600px] w-[600px] transition-all duration-300 ease-out [mask-image:linear-gradient(to_top,transparent_30%,#000_100%)] group-hover:scale-105" />
    ),
    className: "lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3",
  },
  {
    Icon: FormInputIcon,
    name: "Search Quran",
    description: "Search for specific verses or keywords in the Quran.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
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
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
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
    className: "lg:col-start-3 lg:col-end-4 lg:row-start-4 lg:row-end-4",
  },
  // User settings
  {
    Icon: Settings,
    name: "User Settings",
    description: "Customize your app preferences and settings.",
    href: "/",
    cta: "Learn more",
    background: <img className="absolute -right-20 -top-20 opacity-60" />,
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
