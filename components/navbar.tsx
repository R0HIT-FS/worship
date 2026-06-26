"use client";

import Link from "next/link";
import { Menu, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const links = [
  {
    label: "Songs",
    href: "/songs",
  },
  {
    label: "Setlists",
    href: "/",
  },
  {
    label: "Add Song",
    href: "/songs/new",
  },
  {
    label: "Add Setlist",
    href: "/setlists/new",
  },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-14 items-center justify-between px-4">
        {/* Logo */}

        <Link
          href="/"
          className="text-lg font-bold tracking-tight"
        >
          WorshipFlow
        </Link>

        {/* Desktop Navigation */}

        <nav className="hidden md:flex items-center gap-2">
          {links.map((link) => {
            const active =
              pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",

                  active
                    ? "text-black font-bold"
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu */}

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
            >
              <Button
                variant="ghost"
                size="icon"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48"
            >
              {links.map((link) => (
                <DropdownMenuItem
                  key={link.href}
                  asChild
                >
                  <Link
                    href={link.href}
                  >
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}