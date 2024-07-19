"use client";

import Image from "next/image";
import {useState} from "react";
import ImageModal from "@/components/ui/ImageModal";

const images = [{
    src: '/images/gallery/family/family1.jpg', alt: 'Family 1'
}, {
    src: '/images/gallery/family/family2.jpg', alt: 'Family 2'
}, {
    src: '/images/gallery/family/family3.jpg', alt: 'Family 3'
}, {
    src: '/images/gallery/family/family4.jpg', alt: 'Family 4'
}, {
    src: '/images/gallery/family/family5.jpg', alt: 'Family 5'
}, {
    src: '/images/gallery/family/family6.jpg', alt: 'Family 6'
},]

interface ImageType {
    src: string;
    alt: string;
}

const Family: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

    const openModal = (image: ImageType) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    return (<main className="mt-20 px-4">
        <h1 className="text-4xl font-bold text-center mb-3">Family Photo Collection</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
            {images.map((image, index) => (<div
                key={index}
                className={`relative overflow-hidden cursor-pointer ${index % 6 === 0 || index % 6 === 3 ? 'row-span-2' : ''}`}
                onClick={() => openModal(image)}
            >
                <Image
                    src={image.src}
                    alt={image.alt}
                    layout="fill"
                    objectFit="cover"
                    className="hover:scale-110 transition-transform duration-300"
                />
            </div>))}
        </div>
        {selectedImage && <ImageModal image={selectedImage} onClose={closeModal}/>}
    </main>);
}

export default Family;