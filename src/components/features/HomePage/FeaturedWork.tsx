import React from "react";
import Link from "next/link";
import GalleryCard from "@/components/GalleryCard";

class Work {
  constructor(
    public title: string,
    public image: string,
    public description: string,
    public link: string,
  ) {}
}

interface FeaturedWorkProps {
  works: Work[];
}

function FeaturedWork({ works }: FeaturedWorkProps) {
  return (
    <section className="dark:bg-neutral-950 w-full flex flex-col items-center content-center text-center justify-center py-10">
      <h2 className="text-3xl font-bold">Featured Work</h2>
      <h3 className="text-sm text-center mb-8">Hover/click for more info</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {works.map((work) => (
          <GalleryCard key={work.title} work={work} />
        ))}
      </div>
      <Link
        href="/gallery"
        className="inline-block dark:bg-black bg-white dark:text-white py-2 px-4 rounded-full mt-8 hover:bg-opacity-80 transition-colors duration-300"
      >
        View All Collections
      </Link>
    </section>
  );
}

export default FeaturedWork;
