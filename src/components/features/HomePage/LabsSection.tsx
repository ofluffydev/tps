import Image from "next/image";
import Link from "next/link";
import React from "react";

const labs = [
  {
    title: "Film Processing",
    description: "We process and scan various types of photo film.",
    image: "/images/glenn-carstens-peters-_beva4GjGzk-unsplash.jpg",
    link: "/services",
  },
  {
    title: "Reel Transfers",
    description: "We transfer audio reels to digital formats like MP3 and WAV.",
    image: "/images/reel.webp",
    link: "/services",
  },
  {
    title: "Tapes",
    description: "We transfer audio and video tapes to digital media.",
    image: "/images/tapes.avif",
    link: "/services",
  },
  {
    title: "Photo Scanning",
    description: "Send us your photos to have them scanned!",
    image: "/images/scanning.avif",
    link: "/services",
  },
];

function LabsSection() {
  return (
    <section className="w-full h-fit flex flex-col items-center text-left dark:bg-neutral-900 bg-white py-10 p-4">
      <h2 className="text-3xl font-bold">Lab Services</h2>
      <h3 className="text-sm mb-8">More than a photography studio!</h3>
      <div className="flex flex-col w-full gap-10 text-white">
        {labs.map((lab: any, index: React.Key | null | undefined) => (
          <article
            key={index}
            className="relative w-full h-64 hover:scale-105 transition-transform duration-300"
          >
            <div className="absolute inset-0">
              <Image
                src={lab.image}
                fill={true}
                alt={lab.title}
                unoptimized={lab.image === "/images/reel.webp"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div className="relative z-10 h-full flex flex-col items-center text-center justify-center">
              <h4 className="md:text-4xl text-3xl font-bold text-white tracking-wider uppercase">
                {lab.title}
              </h4>
              <p className="mb-3">{lab.description}</p>
              <Link
                href={lab.link}
                className="text-black inline-block bg-white dark:bg-black dark:text-white py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300"
              >
                Learn More
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default LabsSection;
