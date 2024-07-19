import Hero from "@/components/features/HomePage/Hero";
import FillerElement from "@/components/development/FillerElement";
import {CameraIcon, PaletteIcon, PrinterIcon, WandSparklesIcon} from "lucide-react";
import ServiceHighlights from "@/components/features/HomePage/ServiceHighlights";
import FeaturedWork from "@/components/features/HomePage/FeaturedWork";
import LabsSection from "@/components/features/HomePage/LabsSection";

export default function Home() {
    return (<main>
        <Hero/>
        <ServiceHighlights
            services={[{
                name: "Professional Photography",
                icon: CameraIcon,
                description: "Capture your special moments with our expert photographers."
            }, {
                name: "Digital Printing", icon: PrinterIcon, description: "Stunning prints from your digital photos."
            }, {
                name: "Restoration", icon: WandSparklesIcon, description: "Breathe new life into old or damaged photos."
            }, {
                name: "Editing", icon: PaletteIcon, description: "Advanced photo editing and retouching."
            }]}
        />
        <FeaturedWork
            works={[{
                title: "Seniors Collection",
                image: "/images/senior1_550x550.jpg",
                description: "Senior portraits that capture the essence of youth.",
                link: "/gallery/seniors"
            }, {
                title: "Family Collection",
                image: "/images/family1_550x550.jpg",
                description: "Capturing the memories of your family.",
                link: "/gallery/family"
            }, {
                title: "Baby Collection",
                image: "/images/baby1_550x550.jpg",
                description: "Never forget your little one's first moments.",
                link: "/gallery/baby"
            },]}
        />
        <LabsSection/>
        <FillerElement paragraphs={100}/>
    </main>);
}