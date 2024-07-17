import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import Link from 'next/link';

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "The Photo Store",
    description: "A store for photos 💀",
};

const Header = () => {
    return (
        <header className="bg-gray-800 text-white">
            <nav className="container mx-auto px-6 py-3">
                <div className="flex items-center justify-between">
                    <div className="text-xl font-semibold">
                        <Link href="/">
                            The Photo Store
                        </Link>
                    </div>
                    <div className="flex space-x-4">
                        <Link href="/" className="hover:text-gray-300">Home</Link>
                        <Link href="/gallery" className="hover:text-gray-300">Gallery</Link>
                        <Link href="/about" className="hover:text-gray-300">About Us</Link>
                        <Link href="/services" className="hover:text-gray-300">Services</Link>
                        <Link href="/contact" className="hover:text-gray-300">Contact</Link>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <React.StrictMode>
            <html lang="en">
            <body className={inter.className}>
            <Header/>
            <main className="container mx-auto px-6 py-8">
                {children}
            </main>
            </body>
            </html>
        </React.StrictMode>
    );
}