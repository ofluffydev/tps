"use client";

import GalleryCard from "@/components/GalleryCard";
import React, { useEffect, useState } from "react";

interface Collection {
  title: string;
  image: string;
  description: string;
  link: string;
}

const AllCollections = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const pingResponse = await fetch("https://api.thephotostore.com/");
        if (!pingResponse.ok || (await pingResponse.text()) !== "Pong") {
          throw new Error("External API is not online");
        }

        const response = await fetch("https://api.thephotostore.com/galleries");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const galleries = await response.json();
        const fetchedCollections = await Promise.all(
          galleries.map(async (gallery: { name: string }) => {
            const highlightResponse = await fetch(`https://api.thephotostore.com/galleries/${gallery.name}/highlight`);
            const highlightImage = highlightResponse.url; // Use the URL directly
            return {
              title: `${gallery.name.charAt(0).toUpperCase() + gallery.name.slice(1)} Collection`,
              image: highlightImage,
              description: `Collection of ${gallery.name} photos.`,
              link: `/gallery/${gallery.name}`,
            };
          })
        );

        setCollections(fetchedCollections);
      } catch (error) {
        console.error("Error fetching collections:", error);
        setError("Failed to load collections. Please try again later.");
      }
    };

    fetchCollections();
  }, []);

  if (error) {
    return <div className="mt-20 text-center text-red-500">Error: {error}</div>;
  }

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
};

export default AllCollections;
