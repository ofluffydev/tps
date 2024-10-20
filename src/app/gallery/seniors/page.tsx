"use client";

import Image from "next/image";
import { FC, useState, useEffect } from "react";
import ImageModal from "@/components/ui/ImageModal";

interface ImageType {
  src: string;
  alt: string;
}

const Seniors: FC = () => {
  const [images, setImages] = useState<ImageType[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/images?gallery=seniors")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (Array.isArray(data.images)) {
          setImages(data.images);
        } else {
          throw new Error("Received data is not in the expected format");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching images:", err);
        setError("Failed to load images. Please try again later.");
        setLoading(false);
      });
  }, []);

  const openModal = (image: ImageType) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return <div className="mt-20 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="mt-20 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <main className="mt-20 px-4">
      <h1 className="text-4xl font-bold text-center mb-3">
        Senior Photo Collection
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative overflow-hidden cursor-pointer ${
              index % 6 === 0 || index % 6 === 3 ? "row-span-2" : ""
            }`}
            onClick={() => openModal(image)}
          >
            <Image
              src={image.src}
              alt={image.alt}
              layout="fill"
              objectFit="cover"
              className="hover:scale-110 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
      {selectedImage && (
        <ImageModal image={selectedImage} onClose={closeModal} />
      )}
    </main>
  );
};

export default Seniors;
