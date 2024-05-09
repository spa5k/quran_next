"use client";
import { cn } from "@/src/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";
import { ArrowLeft, Home, LineChart, Moon, Package, Settings, ShoppingCart, Users2 } from "lucide-react";
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
        status && "duration-500",
        isOpen ? "w-72" : "w-[78px]",
      )}
    >
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <ArrowLeft
          className={cn(
            "absolute -right-3 top-60 cursor-pointer rounded-full border bg-background text-3xl text-foreground",
            !isOpen && "rotate-180",
          )}
          onClick={handleToggle}
        />
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-items-start gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:text-base"
        >
          <Moon className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className={"sr-only"}>Acme Inc</span>
        </Link>
        <div className="pt-20 flex flex-col items-center gap-4 px-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-full items-center justify-items-start rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8"
              >
                <Home className="h-5 w-5" />
                <span className={isOpen ? "pl-4" : "sr-only"}>Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-full items-center justify-items-start rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className={isOpen ? "pl-4" : "sr-only"}>Orders</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Orders</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-full items-center justify-items-start rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8"
              >
                <Package className="h-5 w-5" />
                <span className={isOpen ? "pl-4" : "sr-only"}>Products</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Products</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 items-center justify-items-start rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8"
              >
                <Users2 className="h-5 w-5" />
                <span className={isOpen ? "pl-4" : "sr-only"}>Customers</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Customers</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-full items-center justify-items-start rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8"
              >
                <LineChart className="h-5 w-5" />
                <span className={isOpen ? "pl-4" : "sr-only"}>Analytics</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Analytics</TooltipContent>
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
    </div>
  );
};
