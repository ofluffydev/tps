import React from "react";
import Link from "next/link";
import Image from "next/image";

class Work {
    constructor(
        public title: string,
        public image: string,
        public description: string,
        public link: string
    ) {}
}

interface FeaturedWorkProps {
    works: Work[];
}

function FeaturedWork({ works }: FeaturedWorkProps) {
    return (
        <section className="w-full flex flex-col items-center content-center text-center justify-center py-10">
            <h2 className="text-3xl font-bold">Featured Work</h2>
            <h3 className="text-sm text-center mb-8">Hover/click for more info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {works.map(work => (
                    <article key={work.title} className="relative group overflow-hidden rounded-lg shadow-lg">
                        <Image
                            src={work.image}
                            height={550}
                            width={550}
                            alt={work.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 dark:text-white text-black opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <h3 className="text-2xl font-bold mb-2">{work.title}</h3>
                            <p className="mb-4">{work.description}</p>
                            <Link href={work.link} className="inline-block bg-white text-black py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300">
                                View Collection
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export default FeaturedWork;