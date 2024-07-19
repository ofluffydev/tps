import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import Header from "@/components/layout/Header";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
    title: "The Photo Store",
    description: "Your premier full-service portrait studio. Our master-trained photographers specialize in capturing timeless moments for families, children, infants, seniors, and weddings. Experience professional, personalized photography that tells your unique story.",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (<html lang="en">
    <body className={inter.className + " dark:bg-neutral-950"}>
    <Header/>
    <main className="container md:mx-auto md:px-6 py-8">
        {children}
    </main>
    </body>
    </html>);
}
