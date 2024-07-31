import GalleryCard from "@/components/GalleryCard";
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
];

function AllCollections() {
  return (
    <div className="mt-20">
      <div className="text-center mb-4">
        <h1 className="font-bold text-4xl text-center">
          All of our photography collections
        </h1>
        <p>Our best photos hand picked out of 500k+ photos we have taken.</p>
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
