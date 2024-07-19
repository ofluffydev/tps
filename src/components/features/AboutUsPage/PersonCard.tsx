import Image from "next/image";

interface PersonCardProps {
    name: string;
    about: string;
    image: string;
}

function PersonCard({name, about, image}: PersonCardProps) {
    return (<div
            className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-800 transition-transform duration-300 ease-in-out transform hover:scale-105">
            <div className="relative h-96 w-full">
                <Image
                    src={image}
                    alt={name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                />
            </div>
            <div className="px-6 py-4">
                <h4 className="font-bold text-xl mb-2 text-gray-800 dark:text-white">{name}</h4>
                <p className="text-gray-700 dark:text-gray-300 text-base">{about}</p>
            </div>
        </div>);
}

export default PersonCard;