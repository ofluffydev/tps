import Hero from "@/components/features/HomePage/Hero";
import FillerElement from "@/components/development/FillerElement";

export default function Home() {
    return (<main>
            <Hero/>
            <FillerElement paragraphs={100}/>
        </main>);
}