"use client";

import React, { ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

interface FadeInViewProps {
    children: ReactNode;
    threshold?: number;
    className?: string;
}

const FadeInView: React.FC<FadeInViewProps> = ({ children, threshold = 0.1, className = '' }) => {
    const { ref, inView } = useInView({
        threshold,
    });

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            } ${className}`}
        >
            {children}
        </div>
    );
};

export default FadeInView;