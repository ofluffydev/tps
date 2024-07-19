import React from 'react';
import ServiceHero from "@/components/features/ServicesPage/ServiceHero";
import ServiceSection from "@/components/features/ServicesPage/ServiceSection";
import CallToAction from "@/components/features/CallToAction";

export default function Services() {
    return (<main className="bg-white dark:bg-neutral-900">
        <ServiceHero
            title="Our Services"
            description="Comprehensive photography and lab services to meet all your needs"
        />

        <ServiceSection
            title="Photography Services"
            description="Professional photography for all occasions and purposes"
            services={[{
                name: "Portrait Photography",
                description: "Individual, family, and group portraits in studio or on location."
            }, {
                name: "Wedding Photography",
                description: "Comprehensive coverage of your special day, from preparation to reception."
            }, {
                name: "Event Photography",
                description: "Capture the essence of corporate events, parties, and celebrations."
            }, {
                name: "Product Photography",
                description: "High-quality images to showcase your products for e-commerce or advertising."
            }, {
                name: "Real Estate Photography",
                description: "Highlight properties with professional interior and exterior shots."
            }, {
                name: "Commercial Photography",
                description: "Tailored photography solutions for businesses and marketing needs."
            }]}
        />

        <ServiceSection
            title="Lab Services"
            description="State-of-the-art processing and printing services"
            services={[{
                name: "Film Development",
                description: "Processing for 35mm, 120, and large format films, both color and black & white."
            }, {
                name: "Photo Printing",
                description: "High-quality prints in various sizes, from standard to large format."
            }, {
                name: "Photo Restoration", description: "Restore and repair old or damaged photographs."
            }, {
                name: "Digital Scanning", description: "Convert your physical photos and negatives to digital format."
            }, {
                name: "Custom Framing", description: "Choose from a wide range of framing options for your prints."
            }, {
                name: "Photo Books",
                description: "Design and print custom photo books and albums."
            }, {
                name: "Reel-to-digital",
                description: "Convert your old film reels to digital format."
            },{
                name: "VHS-to-digital",
                description: "Convert your old VHS tapes to digital format."
            }]}
        />

        <ServiceSection
            title="Digital Services"
            description="Modern solutions for the digital age"
            services={[{
                name: "Digital Retouching", description: "Professional editing and enhancement of digital images."
            }, {
                name: "Online Galleries", description: "Secure online galleries for viewing and sharing your photos."
            }, {
                name: "Digital File Delivery",
                description: "High-resolution digital files of your photos for personal use."
            }, {
                name: "Social Media Packages", description: "Optimized images perfect for sharing on social platforms."
            }, {
                name: "Virtual Photography Sessions", description: "Remote photography sessions and consultations."
            }, {
                name: "Digital Asset Management", description: "Organize and archive your digital photo collection."
            }]}
        />

        <ServiceSection
            title="Specialty Services"
            description="Unique offerings to meet specific needs"
            services={[{
                name: "Passport Photos",
                description: "Precise passport and visa photos that meet official requirements."
            }, {
                name: "Large Format Printing", description: "Oversized prints for exhibitions, signage, and decor."
            }, {
                name: "Video Services", description: "Basic video recording and editing for events and promotions."
            }, {
                name: "Custom Projects", description: "Tailored photography and printing solutions for unique requests."
            }]}
        />

        <ServiceSection
            title="Commercial Services"
            description="Large orders for businesses and organizations"
            services={[{
                name: "Bulk Printing", description: "High-volume printing for marketing materials and promotions."
            }, {
                name: "Product Photography",
                description: "Professional images for e-commerce, catalogs, and advertising."
            }, {
                name: "Brand Photography", description: "Custom photography to showcase your brand and products."
            }, {
                name: "Event Coverage", description: "Photography and videography for corporate events and functions."
            }]}
        />


        <CallToAction
            title="Ready to Get Started?"
            description="Contact us to discuss your photography and lab service needs."
            buttonText="Contact Us"
            buttonLink="/contact"
        />
    </main>);
}