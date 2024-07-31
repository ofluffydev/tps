import Image from "next/image";
import Link from "next/link";
import React from "react";

export interface Work {
  title: string;
  image: string;
  description: string;
  link: string;
}

function GalleryCard({ work }: { work: Work }) {
  return (
    <article
      key={work.title}
      className="relative group overflow-hidden rounded-lg shadow-lg"
    >
      <Image
        src={work.image}
        height={550}
        width={550}
        alt={work.title}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="text-white absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-end p-6 dark:text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="md:text-2xl text-xl font-bold mb-2">{work.title}</h3>
        <p className="mb-4">{work.description}</p>
        <Link
          href={work.link}
          className="inline-block bg-white dark:bg-black text-black dark:text-white text-center py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300"
        >
          View Collection
        </Link>
      </div>
    </article>
  );
}

export default GalleryCard;
