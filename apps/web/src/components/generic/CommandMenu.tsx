"use client";

import { cn } from "@/src/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@components/ui/command";
import { LaptopIcon, MoonIcon, SunIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Button } from "../ui/button";

export function CommandMenu({ ...props }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  const [keyCombination, setKeyCombination] = React.useState("");

  React.useEffect(() => {
    if (navigator.userAgent.includes("Mac")) {
      setKeyCombination("⌘K");
    } else if (navigator.userAgent.includes("Linux")) {
      setKeyCombination("Super+K");
    } else {
      setKeyCombination("Ctrl+K");
    }
  }, []);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (!((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/")) {
        return;
      }
      if (
        (e.target instanceof HTMLElement && e.target.isContentEditable)
        || e.target instanceof HTMLInputElement
        || e.target instanceof HTMLTextAreaElement
        || e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      e.preventDefault();
      setOpen((open) => !open);
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <div className="transform-gpu ring-offset-current transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 group relative inline-flex h-9 w-full items-center justify-center gap-2 overflow-hidden whitespace-pre rounded-md py-2 text-base font-semibold tracking-tighter focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 md:flex">
      <Button
        variant="outline"
        className={cn(
          "relative w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64",
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">Search Quran or Hadith...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.55rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          {keyCombination}
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandSeparator />
          <CommandGroup heading="Theme">
            <CommandItem>
              <SunIcon className="mr-2 h-4 w-4" />
              Light
            </CommandItem>
            <CommandItem>
              <MoonIcon className="mr-2 h-4 w-4" />
              Dark
            </CommandItem>
            <CommandItem>
              <LaptopIcon className="mr-2 h-4 w-4" />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
