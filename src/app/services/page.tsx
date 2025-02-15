"use client";

import React, { useEffect, useState } from "react";
import ServiceHero from "@/components/features/ServicesPage/ServiceHero";
import ServiceSection from "@/components/features/ServicesPage/ServiceSection";
import CallToAction from "@/components/features/CallToAction";

const defaultServices = [
  {
    title: "Photography Services",
    description: "Professional photography for all occasions and purposes",
    items: [
      { name: "Portrait Photography", description: "Individual, family, and group portraits in studio or on location." },
      { name: "Wedding Photography", description: "Comprehensive coverage of your special day, from preparation to reception." },
      { name: "Event Photography", description: "Capture the essence of corporate events, parties, and celebrations." },
      { name: "Product Photography", description: "High-quality images to showcase your products for e-commerce or advertising." },
      { name: "Real Estate Photography", description: "Highlight properties with professional interior and exterior shots." },
      { name: "Commercial Photography", description: "Tailored photography solutions for businesses and marketing needs." },
    ],
  },
  {
    title: "Lab Services",
    description: "State-of-the-art processing and printing services",
    items: [
      { name: "Film Development", description: "Processing for 35mm films, both color and black & white. We do not process 120 film, but we can scan it. Currently unavailable due to technical issues." },
      { name: "Photo Printing", description: "High-quality prints in various sizes, from standard to large format." },
      { name: "Photo Restoration", description: "Restore and repair old or damaged photographs." },
      { name: "Digital Scanning", description: "Convert your physical photos and negatives to digital format." },
      { name: "Photo Books", description: "Design and print custom photo books and albums." },
      { name: "Reel-to-digital", description: "Convert your old film reels to digital format." },
      { name: "VHS-to-digital", description: "Convert your old VHS tapes to digital format." },
    ],
  },
  {
    title: "Digital Services",
    description: "Modern solutions for the digital age",
    items: [
      { name: "Digital Retouching", description: "Professional editing and enhancement of digital images." },
      { name: "Online Galleries", description: "Secure online galleries for viewing and sharing your photos." },
      { name: "Digital File Delivery", description: "High-resolution digital files of your photos for personal use." },
      { name: "Social Media Packages", description: "Optimized images perfect for sharing on social platforms." },
      { name: "Virtual Photography Sessions", description: "Remote photography sessions and consultations." },
      { name: "Digital Asset Management", description: "Organize and archive your digital photo collection." },
    ],
  },
  {
    title: "Specialty Services",
    description: "Unique offerings to meet specific needs",
    items: [
      { name: "Passport Photos", description: "Precise passport and visa photos that meet official requirements." },
      { name: "Large Format Printing", description: "Oversized prints for exhibitions, signage, and decor." },
      { name: "Video Services", description: "Video editing for events and promotions." },
      { name: "Custom Projects", description: "Tailored photography and printing solutions for unique requests." },
    ],
  },
  {
    title: "Commercial Services",
    description: "Large orders for businesses and organizations",
    items: [
      { name: "Bulk Printing", description: "High-volume printing for marketing materials and promotions." },
      { name: "Product Photography", description: "Professional images for e-commerce, catalogs, and advertising." },
      { name: "Brand Photography", description: "Custom photography to showcase your brand and products." },
      { name: "Event Coverage", description: "Photography for corporate events and functions." },
    ],
  },
];

export default function Services() {
  const [services, setServices] = useState(defaultServices);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch("https://api.thephotostore.com/services");
        if (response.ok) {
          const data = await response.json();
          const formattedData = data.map(([section, items]: [{ title: string; description: string; }, { name: string; description: string; }[]]) => ({
            title: section.title,
            description: section.description,
            items: items.map(item => ({
              name: item.name,
              description: item.description,
            })),
          }));
          setServices(formattedData);
        }
      } catch (error) {
        console.error("Failed to fetch services from API, using default data.", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <main className="bg-white dark:bg-neutral-900">
      <ServiceHero
        title="Our Services"
        description="Comprehensive photography and lab services to meet all your needs"
      />
      {services.map((service, index) => (
        <ServiceSection
          key={index}
          title={service.title}
          description={service.description}
          services={service.items}
        />
      ))}
      <CallToAction
        title="Ready to Get Started?"
        description="Contact us to discuss your photography and lab service needs."
        buttonText="Contact Us"
        buttonLink="/contact"
      />
    </main>
  );
}
