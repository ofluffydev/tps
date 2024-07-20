import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BetaWarning from "@/components/features/BetaWarning";

const inter = Inter({subsets: ["latin"]});
const isBeta = process.env.IS_BETA === "true";

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
    <Header isBeta={isBeta}/>
    <main className="sm:container md:mx-auto md:px-6 py-8">
        <BetaWarning isBeta={isBeta}/>
        {children}
    </main>
    <Footer/>
    </body>
    </html>);
}
