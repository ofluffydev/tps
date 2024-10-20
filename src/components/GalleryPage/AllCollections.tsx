import GalleryCard from "@/components/GalleryCard";
import { title } from "process";
import React from "react";

const collections = [
  {
    title: "Seniors Collection",
    image: "/images/senior1_550x550.jpg",
    description: "Senior portraits that capture the essence of youth.",
    link: "/gallery/seniors",
  },
  {
    title: "Family Collection",
    image: "/images/family1_550x550.jpg",
    description: "Capturing the memories of your family.",
    link: "/gallery/family",
  },
  {
    title: "Baby Collection",
    image: "/images/baby1_550x550.jpg",
    description: "Never forget your little one's first moments.",
    link: "/gallery/baby",
  },
  {
    title: "Kids Collection",
    image: "/images/gallery/kids/10x20_0.jpg",
    description: "Kids are the best models.",
    link: "/gallery/kids",
  },
];

function AllCollections() {
  return (
    <div className="mt-20">
      <div className="text-center mb-4">
        <h1 className="font-bold text-4xl text-center">
          All of our photography collections
        </h1>
        <p className="text-sm text-gray-400">(Click/hover to see more)</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((work) => (
          <GalleryCard key={work.title} work={work} />
        ))}
      </div>
    </div>
  );
}

export default AllCollections;
