"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "@/components/ui/ThemeToggle";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="dark:bg-neutral-950 bg-white dark:text-white text-black fixed w-full z-50">
      <nav className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="text-xl font-semibold flex flex-row items-center">
            <Link href="/">
              <Image
                src="/images/logo/tps-logo-black.png"
                width={200}
                height={100}
                alt="The Photo Store logo"
                className="dark:invert w-auto h-8 sm:h-10 md:h-12 lg:h-14 xl:h-16"
                priority
              />
            </Link>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <Link href="/gallery" className="hover:text-gray-300">
              Gallery
            </Link>
            <Link href="/about" className="hover:text-gray-300">
              About Us
            </Link>
            <Link href="/services" className="hover:text-gray-300">
              Services
            </Link>
            <Link href="/contact" className="hover:text-gray-300">
              Contact
            </Link>
            <ThemeToggle />
          </div>
          {/* Mobile Menu Button and Theme Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="text-black dark:text-white focus:outline-none"
            >
              <svg
                className="h-6 w-6 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isMenuOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <div
          ref={menuRef}
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-screen" : "max-h-0"}`}
        >
          <div className="py-2 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/gallery"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
            >
              Gallery
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
            >
              About Us
            </Link>
            <Link
              href="/services"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
            >
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
