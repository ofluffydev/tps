"use client";

import React, { useState, useRef } from "react";
import Link from 'next/link';
import Image from "next/image";

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="bg-gray-900 text-white fixed w-full max-h-64 z-50">
            <nav className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="text-xl font-semibold flex flex-row">
                        <Link href="/">
                            <Image
                                src="/images/logo/tps-logo-black.png"
                                width={200}
                                height={100}
                                alt="The Photo Store logo"
                                style={{
                                    width: 'auto',
                                    height: 'auto',
                                }}
                                className="nav-tps-logo w-20 sm:w-24 md:w-28 lg:w-32 h-auto"
                            />
                        </Link>
                    </div>
                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-4">
                        <Link href="/" className="hover:text-gray-300">Home</Link>
                        <Link href="/gallery" className="hover:text-gray-300">Gallery</Link>
                        <Link href="/about" className="hover:text-gray-300">About Us</Link>
                        <Link href="/services" className="hover:text-gray-300">Services</Link>
                        <Link href="/contact" className="hover:text-gray-300">Contact</Link>
                    </div>
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-white focus:outline-none">
                            <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"
                                 xmlns="http://www.w3.org/2000/svg">
                                {isMenuOpen ? (
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"/>
                                ) : (
                                    <path fillRule="evenodd"
                                          d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                <div
                    ref={menuRef}
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        isMenuOpen ? 'max-h-64' : 'max-h-0'
                    }`}
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/"
                              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white">Home</Link>
                        <Link href="/gallery"
                              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white">Gallery</Link>
                        <Link href="/about"
                              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white">About Us</Link>
                        <Link href="/services"
                              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white">Services</Link>
                        <Link href="/contact"
                              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white">Contact</Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;