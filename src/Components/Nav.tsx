"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  Navbar,
  NavbarLogo,
  NavBody,
  NavItems,
} from "@/Components/ui/navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { RiFacebookFill } from "react-icons/ri";
import { Button, buttonVariants } from "./ui/button";
import { ModeToggle } from "./ui/mode-toggle";

export function Nav() {
  const navItems = [
    { name: "Beranda", link: "#home" },
    { name: "Tentang Kami", link: "#about" },
    { name: "FAQ", link: "#faq" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    if (href.startsWith("#")) {
      import("../app/lib/utils").then(({ scrollToElement }) => {
        scrollToElement(href);
        setIsMobileMenuOpen(false);
      });
    } else {
      window.location.href = href;
    }
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white dark:bg-gradient-to-b dark:from-[#0f172a] dark:to-[#1e293b] shadow-md"
          : "bg-transparent"
      }`}
    >
      <Navbar>
        <NavBody>
          <NavbarLogo />
          <NavItems
            items={navItems.map((item) => ({
              ...item,
              className:
                "text-gray-800 hover:text-blue-600 dark:text-gray-100 dark:hover:text-white transition-colors duration-300",
            }))}
          />
          <div className="flex items-center gap-2">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="z-20 dark:border-gray-600 dark:text-white dark:hover:bg-[#1e293b]"
                >
                  Gabung
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="dark:bg-[#1e293b] dark:border-gray-700"
              >
                <DropdownMenuItem>
                  <Link
                    href="https://facebook.com/groups/programmerhandal"
                    className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-white"
                  >
                    <RiFacebookFill className="text-blue-600" />
                    Facebook
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link
                    href="https://discord.com"
                    className="flex items-center gap-2 text-sm font-medium text-gray-800 dark:text-white"
                  >
                    <FaDiscord className="text-indigo-500" />
                    Discord
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            className="bg-white dark:bg-gradient-to-b dark:from-[#0f172a] dark:to-[#1e293b]"
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={(e) => handleAnchorClick(e, item.link)}
                className="block py-2 text-neutral-700 dark:text-white hover:text-blue-600 dark:hover:text-gray-300 transition-colors"
              >
                {item.name}
              </a>
            ))}
            <div className="flex justify-center gap-4 mt-4">
              <Link
                href="https://facebook.com/groups/programmerhandal"
                className={
                  buttonVariants({ variant: "outline" }) +
                  " flex items-center justify-center gap-2 text-sm dark:border-gray-600 dark:text-white dark:hover:bg-[#1e293b]"
                }
              >
                <RiFacebookFill className="text-blue-600" />
                Facebook
              </Link>
              <Link
                href="https://discord.com"
                className={
                  buttonVariants({ variant: "outline" }) +
                  " flex items-center justify-center gap-2 text-sm dark:border-gray-600 dark:text-white dark:hover:bg-[#1e293b]"
                }
              >
                <FaDiscord className="text-indigo-500" />
                Discord
              </Link>
              <ModeToggle />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
