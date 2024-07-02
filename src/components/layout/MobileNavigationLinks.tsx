"use client";
import { cn } from "@/lib/utils";
import { Book, Clock, Home, LineChart, Moon, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileTooltipLink = ({ href, icon: Icon, label, isActive }: {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}) => (
  <Link
    href={href}
    className={cn(
      "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
      isActive && "text-foreground",
    )}
  >
    <Icon className="h-5 w-5" />
    {label}
  </Link>
);

export const MobileNavigationLinks = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <nav className="grid gap-6 text-lg font-medium">
      <Link
        href="/"
        className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
      >
        <Moon className="h-5 w-5 transition-all group-hover:scale-110" />
        <span className="sr-only">Quran</span>
      </Link>
      <MobileTooltipLink
        href="/"
        icon={Home}
        label="Home"
        isActive={isActive("/")}
      />
      <MobileTooltipLink
        href="/quran"
        icon={Book}
        label="Quran"
        isActive={isActive("/quran") || isActive("/surah")}
      />
      <MobileTooltipLink
        href="/salah"
        icon={Clock}
        label="Salah"
        isActive={isActive("/salah")}
      />
      <MobileTooltipLink
        href="#"
        icon={LineChart}
        label="Analytics"
        isActive={isActive("#")}
      />
      <MobileTooltipLink
        href="#"
        icon={Settings}
        label="Settings"
        isActive={isActive("#")}
      />
    </nav>
  );
};
