import React from 'react';
import Image from 'next/image';
import Script from 'next/script';

interface ParallaxImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
}

const ParallaxImage: React.FC<ParallaxImageProps> = ({src, alt, width, height}) => {
    return (<>
            <div className="relative h-screen w-full overflow-hidden">
                <div id="parallaxContainer" className="absolute inset-0 w-[150%]">
                    <Image
                        src={src}
                        alt={alt}
                        width={width}
                        height={height}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
            <Script id="parallax-script" strategy="afterInteractive">
                {`
          const parallaxContainer = document.getElementById('parallaxContainer');
          if (parallaxContainer) {
            window.addEventListener('scroll', () => {
              const scrollPosition = window.pageYOffset;
              parallaxContainer.style.transform = \`translateX(\${-scrollPosition * 0.1}px)\`;
            });
          }
        `}
            </Script>
        </>);
};

export default ParallaxImage;