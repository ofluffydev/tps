import {FilmIcon} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function LabsSection() {
    return (<section className="w-full h-screen flex flex-col items-center text-left bg-neutral-900 py-10">
        <h2 className="text-3xl font-bold">Lab Services</h2>
        <h3 className="text-sm mb-8">More than a photography studio!</h3>
        <article className="bg-white dark:bg-black text-black dark:text-white md:w-1/3 text-wrap">
            <Image src="/images/glenn-carstens-peters-_beva4GjGzk-unsplash.jpg" alt="A film canister"
                   width={500}
                   height={500}/>
            <div className="p-3">
                <div className="flex flex-row mb-4">
                    <h4 className="font-bold">Film</h4>
                    <FilmIcon/>
                </div>
                <p className="text-sm mb-8">We process many types of picture film. See services page for more
                    details</p>
                <Link href="/services"
                      className="inline-block bg-white text-black py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300">
                    Learn More
                </Link>
            </div>
        </article>
        <article className="relative h-64 overflow-hidden">
            <div className="absolute inset-0">
                <img
                    src="/gifs/"
                    alt="Reel Transfer Process"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div className="relative z-10 h-full flex items-center justify-center">
                <h4 className="text-4xl font-bold text-white tracking-wider uppercase">
                    Reel Transfers
                </h4>
            </div>
        </article>
    </section>)
}

export default LabsSection;