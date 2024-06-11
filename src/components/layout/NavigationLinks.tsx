"use client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { ArrowLeft, ArrowRight, Book, Clock, Home, LineChart, Moon, Settings } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const NavigationLinks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    setIsOpen(!isOpen);
    setTimeout(() => setStatus(false), 500);
  };

  return (
    <div
      className={cn(
        `relative hidden h-screen border-r md:block`,
        status && "duration-200",
        isOpen ? "w-72" : "w-[78px]",
      )}
    >
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:text-base"
          >
            <Moon className="h-4 w-4 transition-all hover:scale-110" />
            <span className={"sr-only"}>Acme Inc</span>
          </Link>
          <div className="pt-20 flex flex-col items-center gap-4 px-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className="flex h-9 w-full px-4 items-center justify-items-start rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8"
                >
                  <Home className="h-5 w-5" />
                  <span className={isOpen ? "pl-4" : "sr-only"}>Home</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Home</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/quran"
                  className="flex h-9 w-full px-4 items-center justify-items-start rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8"
                >
                  <Book className="h-5 w-5" />
                  <span className={isOpen ? "pl-4" : "sr-only"}>Quran</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Quran</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-full px-4 items-center justify-items-start rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8"
                >
                  <Clock className="h-5 w-5" />
                  <span className={isOpen ? "pl-4" : "sr-only"}>Salah</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Salah</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="#"
                  className="flex h-9 w-full items-center px-4 justify-items-start rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8"
                >
                  <LineChart className="h-5 w-5" />
                  <span className={isOpen ? "pl-4" : "sr-only"}>Analytics</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Analytics</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={"#"}
                  onClick={handleToggle}
                  className="flex h-9 w-full items-center px-4 justify-items-start rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8"
                  // variant="ghost"
                >
                  {isOpen ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5 " />}
                  <span className={isOpen ? "pl-4" : "sr-only"}>
                    {isOpen ? "Collapse" : "Open"}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                {isOpen ? "Collapse" : "Open"}
              </TooltipContent>
            </Tooltip>
          </div>
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-full items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8"
              >
                <Settings className="h-5 w-5" />
                <span className={isOpen ? "pl-4" : "sr-only"}>Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </div>
  );
};
