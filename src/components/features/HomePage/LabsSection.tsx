import {FilmIcon} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import filmTypes from "@/components/filmTypes";

function LabsSection() {
    return (<section className="w-full h-fit flex flex-col items-center text-left bg-neutral-900 py-10 p-4">
        <h2 className="text-3xl font-bold">Lab Services</h2>
        <h3 className="text-sm mb-8">More than a photography studio!</h3>
        <article className="bg-white flex sm:flex-row flex-col dark:bg-black text-black dark:text-white md:w-full text-wrap">
            <Image src="/images/glenn-carstens-peters-_beva4GjGzk-unsplash.jpg" alt="A film canister"
                   width={600}
                   height={600}/>
            <div className="p-3 content-center">
                <div className="flex flex-row mb-4 items-center text-4xl">
                    <h4 className="font-bold">Film</h4>
                    <FilmIcon height={40} width={40}/>
                </div>
                <p className="mb-4">We process many types of picture film including:</p>
                <ul>
                    {filmTypes.map((type) => (<li key={type.type} className="mb-4">
                            <span className="font-bold">{type.name}</span> - {type.description}
                        </li>))}
                </ul>
                <Link href="/services"
                      className="inline-block bg-white text-black py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300">
                    Learn More
                </Link>
            </div>
        </article>
        <article className="relative w-full h-64">
            <div className="absolute inset-0">
                <Image
                    src="/images/reel.webp"
                    fill={true}
                    alt="Reel Transfer Process"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div className="relative z-10 h-full flex flex-col items-center text-center justify-center">
                <h4 className="text-4xl font-bold text-white tracking-wider uppercase">
                    Reel Transfers
                </h4>
                <p>We transfer audio reels to digital formats like MP3 and WAV</p>
            </div>
        </article>
    </section>)
}

export default LabsSection;