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
            className={`transition-opacity duration-1000 ${
                inView ? 'opacity-100' : 'opacity-0'
            } ${className}`}
        >
            {children}
        </div>
    );
};

export default FadeInView;