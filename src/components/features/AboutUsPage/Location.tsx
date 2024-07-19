import React from "react";
import {MapPin} from "lucide-react";

interface LocationProps {
    title: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
}

const Location: React.FC<LocationProps> = ({title, address, city, state, zipCode}) => {
    const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

    return (<div className="w-full max-w-2xl mx-auto bg-white dark:bg-black rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
                <iframe
                    className="w-full h-full border-0"
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/place?q=place_id:ChIJK2KfX9pPAYcRmeUt4TRRGms&key=${API_KEY}`}
                ></iframe>
            </div>
            <div className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="text-blue-500" size={24}/>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h2>
                </div>
                <div className="text-gray-600 dark:text-white">
                    <p className="font-medium">{address}</p>
                    <p>{city}, {state} {zipCode}</p>
                    <p className="text-sm">(click map for more info)</p>
                </div>
            </div>
        </div>);
};

export default Location;