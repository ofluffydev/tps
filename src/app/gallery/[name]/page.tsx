"use client";

import Image from "next/image";
import { FC, useState, useEffect } from "react";
import ImageModal from "@/components/ui/ImageModal";

interface ImageType {
  src: string;
  alt: string;
}

interface GalleryPageProps {
  params: {
    name: string;
  };
}

const GalleryPage: FC<GalleryPageProps> = ({ params }) => {
  const { name } = params;
  const [images, setImages] = useState<ImageType[]>([]);
  const [loadedImages, setLoadedImages] = useState<ImageType[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) return;

    const fetchImages = async () => {
      try {
        const response = await fetch("https://galleries.thephotostore.com/galleries");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const gallery = data.find((gallery: { name: string }) => gallery.name === name);
        if (!gallery) {
          throw new Error(`Gallery ${name} not found`);
        }

        const images = gallery.images.map((file: string) => ({
          src: `https://galleries.thephotostore.com/galleries/${name}/${file}`,
          alt: `Image from the ${name} gallery, named ${file}`,
        }));

        setImages(images);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
        setError("Failed to load images. Please try again later.");
        setLoading(false);
      }
    };

    fetchImages();
  }, [name]);

  useEffect(() => {
    if (images.length > 0) {
      setLoadedImages(images);
    }
  }, [images]);

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
        {name.charAt(0).toUpperCase() + name.slice(1)} Photo Collection
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
        {loadedImages.map((image, index) => (
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

export default GalleryPage;
