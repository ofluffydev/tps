import React from 'react';
import {LucideIcon} from 'lucide-react';
import Link from "next/link";

interface Service {
    name: string;
    icon: LucideIcon;
    description: string;
}

interface ServiceHighlightsProps {
    services: Service[];
}

const ServiceHighlights: React.FC<ServiceHighlightsProps> = ({services}) => {
    return (<section className="py-12 bg-gray-100 dark:bg-gray-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8">Our Photography
                Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {services.map((service, index) => (<div key={index}
                                                        className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg">
                    <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
                        <service.icon className="w-6 h-6 text-indigo-600"/>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{service.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                </div>))}
            </div>
            <div className="w-full text-center">
                <Link href="/services"
                      className="inline-block bg-white dark:bg-neutral-900 dark:text-white text-black py-2 px-4 rounded-full hover:bg-opacity-80 transition-colors duration-300 mt-10">
                    Learn More
                </Link>
            </div>
        </div>
    </section>);
};

export default ServiceHighlights;