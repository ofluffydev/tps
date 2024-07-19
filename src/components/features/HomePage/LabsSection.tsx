import Image from "next/image";
import Link from "next/link";
import React from "react";

function LabsSection() {
    return (<section className="w-full h-fit flex flex-col items-center text-left dark:bg-neutral-900 bg-white py-10 p-4">
        <h2 className="text-3xl font-bold">Lab Services</h2>
        <h3 className="text-sm mb-8">More than a photography studio!</h3>
        <div className="flex flex-col w-full gap-10 text-white">
            <article className="relative w-full h-64">
                <div className="absolute inset-0">
                    <Image
                        src="/images/glenn-carstens-peters-_beva4GjGzk-unsplash.jpg"
                        fill={true}
                        alt="Film Canister"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                <div className="relative z-10 h-full flex flex-col items-center text-center justify-center">
                    <h4 className="md:text-4xl text-3xl font-bold text-white tracking-wider uppercase">
                        Film Processing
                    </h4>
                    <p className="mb-3">We process and scan various types of photo film.</p>
                    <Link href="/services"
                          className="text-black inline-block bg-white dark:bg-black dark:text-white py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300">
                        Learn More
                    </Link>
                </div>
            </article>
            <article className="relative w-full h-64">
                <div className="absolute inset-0">
                    <Image
                        src="/images/reel.webp"
                        fill={true}
                        unoptimized={true}
                        alt="Reel Transfer Process"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                <div className="relative z-10 h-full flex flex-col items-center text-center justify-center">
                    <h4 className="md:text-4xl text-3xl font-bold text-white tracking-wider uppercase">
                        Reel Transfers
                    </h4>
                    <p className="mb-3">We transfer audio reels to digital formats like MP3 and WAV.</p>
                    <Link href="/services"
                          className="text-black inline-block bg-white dark:bg-black dark:text-white py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300">
                        Learn More
                    </Link>
                </div>
            </article>
            <article className="relative w-full h-64">
                <div className="absolute inset-0">
                    <Image
                        src="/images/tapes.avif"
                        fill={true}
                        alt="VHS Tapes"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                <div className="relative z-10 h-full flex flex-col items-center text-center justify-center">
                    <h4 className="md:text-4xl text-3xl font-bold text-white tracking-wider uppercase">
                        Tapes
                    </h4>
                    <p className="mb-3">We transfer audio and vide tapes to digital media.</p>
                    <Link href="/services"
                          className="text-black inline-block bg-white dark:bg-black dark:text-white py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300">
                        Learn More
                    </Link>
                </div>
            </article>
            <article className="relative w-full h-64">
                <div className="absolute inset-0">
                    <Image
                        src="/images/scanning.avif"
                        fill={true}
                        alt="VHS Tapes"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>
                <div className="relative z-10 h-full flex flex-col items-center text-center justify-center">
                    <h4 className="md:text-4xl text-3xl font-bold text-white tracking-wider uppercase">
                        Photo Scanning
                    </h4>
                    <p className="mb-3">Send us your photos to have them scanned!</p>
                    <Link href="/services"
                          className="text-black inline-block bg-white dark:bg-black dark:text-white py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300">
                        Learn More
                    </Link>
                </div>
            </article>
        </div>
    </section>)
}

export default LabsSection;