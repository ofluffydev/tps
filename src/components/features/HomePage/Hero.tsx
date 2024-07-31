import React from "react";
import { Camera, ChevronRight, FlaskConical } from "lucide-react";
import Link from "next/link";
import ParallaxImage from "@/components/ui/ParallaxImage";
import FadeInView from "@/components/ui/FadeInView";

const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <ParallaxImage
        src="/images/banner_2560x1440.jpg"
        width={2560}
        height={1440}
        alt="Hero image"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
        <div className="flex items-center mb-4">
          <FadeInView>
            <Camera className={`h-12 w-12 mr-4`} />
          </FadeInView>
          <FadeInView>
            <FlaskConical className="h-12 w-12" />
          </FadeInView>
        </div>
        <FadeInView>
          <h1 className="mb-4 md:text-5xl text-lg font-bold text-center">
            Capture and Process Life&apos;s Moments
          </h1>
        </FadeInView>
        <FadeInView>
          <p className="mb-8 md:text-xl text-center">
            Professional photography and top-notch lab services
          </p>
        </FadeInView>
        <div className="flex flex-col sm:flex-row gap-4">
          <FadeInView>
            <Link
              href="/services"
              className="flex items-center rounded-full bg-white px-6 py-3 text-black transition-colors hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-700"
            >
              Our Services
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </FadeInView>
          <FadeInView>
            <Link
              href="/gallery"
              className="flex items-center rounded-full bg-transparent border-2 border-white px-6 py-3 text-white transition-colors hover:bg-white hover:text-black"
            >
              Explore Gallery
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </FadeInView>
        </div>
      </div>
    </div>
  );
};

export default Hero;
