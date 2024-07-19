import Image from "next/image";

const images = [{
    src: '/images/gallery/seniors/senior1.jpg', alt: 'Senior 1'
}, {
    src: '/images/gallery/seniors/senior2.jpg', alt: 'Senior 2'
}, {
    src: '/images/gallery/seniors/senior3.jpg', alt: 'Senior 3'
}, {
    src: '/images/gallery/seniors/senior4.jpg', alt: 'Senior 4'
}, {
    src: '/images/gallery/seniors/senior5.jpg', alt: 'Senior 5'
}, {
    src: '/images/gallery/seniors/senior6.jpg', alt: 'Senior 6'
}, {
    src: '/images/gallery/seniors/senior7.jpg', alt: 'Senior 7'
}, {
    src: '/images/gallery/seniors/senior8.jpg', alt: 'Senior 8'
},]

export default function Seniors() {
    return (<main className="mt-20">
        <div className="grid grid-cols-1 flex-grow">
        {images.map((image, index) => (<Image key={index}
                                              src={image.src}
                                              alt={image.alt}
                                              width={100}
                                              height={100}
                                              className="object-cover"/>))}
        </div>
    </main>);
}