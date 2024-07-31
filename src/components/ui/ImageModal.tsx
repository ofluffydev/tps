"use client";

import React from "react";
import Image from "next/image";
import { XIcon } from "lucide-react";

interface ImageType {
  src: string;
  alt: string;
}

interface ImageModalProps {
  image: ImageType;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={handleBackgroundClick}
    >
      <div className="relative w-full h-full max-w-3xl max-h-[90vh] flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image
            src={image.src}
            alt={image.alt}
            layout="fill"
            objectFit="contain"
            className="rounded-lg"
          />
        </div>
        <button
          className="absolute top-2 right-2 text-white text-xl bg-black bg-opacity-50 rounded-full w-8 h-8 flex items-center justify-center"
          onClick={onClose}
        >
          <XIcon strokeWidth={3} />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;
