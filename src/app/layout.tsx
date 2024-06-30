import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MiniSalahWidget } from "@/features/salah/components/MiniSalahWidget";
import { PanelLeft, Search, User } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ElectronIndicator } from "../components/generic/ElectronIndicator";
import { TailwindIndicator } from "../components/generic/TailwindIndicator";
import { MobileNavigationLinks } from "../components/layout/MobileNavigationLinks";
import { NavigationLinks } from "../components/layout/NavigationLinks";
import { cormorant_garamond, indopak, inter, lexend, readex_pro, taviraj } from "../lib/fonts";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Create Turborepo",
  description: "Generated by create turbo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body
        className={inter.className
          + " "
          + taviraj.variable
          + " "
          + cormorant_garamond.variable
          + " "
          + lexend.variable
          + " "
          + readex_pro.variable
          + " "
          + indopak.variable
          + " "
          + "font-primary"}
      >
        <TooltipProvider>
          <Providers>
            <TailwindIndicator />
            <ElectronIndicator />
            <div className="flex  border-collapse overflow-hidden">
              <aside className="inset-y-0 left-0 z-10 hidden flex-col border-r bg-background sm:flex">
                <NavigationLinks />
              </aside>
              <div className="flex-1 overflow-y-auto overflow-x-hidden bg-secondary/10 pb-1">
                <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-20">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="sm:max-w-xs">
                      <MobileNavigationLinks />
                    </SheetContent>
                  </Sheet>
                  <Breadcrumb className="hidden md:flex">
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href="#">Dashboard</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                          <Link href="#">Products</Link>
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Edit Product</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                  <div className="relative ml-auto flex-1">
                    <MiniSalahWidget />
                  </div>

                  <div className="relative ml-auto flex-1 md:grow-0">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search..."
                      className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="overflow-hidden rounded-full"
                      >
                        <User width={36} height={36} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Settings</DropdownMenuItem>
                      <DropdownMenuItem>Support</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </header>
                {/* <AuroraBackground> */}
                <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 z-10">
                  {children}
                </main>
                {/* </AuroraBackground> */}
              </div>
            </div>
          </Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}
