import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import Header from "./Header"; // We'll create this as a separate client component

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "The Photo Store", description: "A store for photos 💀",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (<html lang="en">
        <body className={inter.className}>
        <Header/>
        <main className="container mx-auto px-6 py-8">
            {children}
        </main>
        </body>
        </html>);
}
