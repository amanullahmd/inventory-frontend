'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

const SLIDES = [
    {
        id: 1,
        content: '/images/image (1).jpg',
    },
    {
        id: 2,
        content: '/images/image (2).jpg',
    },
    {
        id: 3,
        content: '/images/image (3).jpg',
    },
    {
        id: 4,
        content: '/images/image (4).jpg',
    },
    {
        id: 5,
        content: '/images/image (5).jpg',
    },
    {
        id: 6,
        content: '/images/image (6).jpg',
    },
    {
        id: 7,
        content: '/images/DPE_cover.webp',
    }
];

export default function AuthSlider() {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
        }, 4500); // 4.5 seconds per slide
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full aspect-4/3 max-h-[500px] rounded-3xl overflow-hidden shadow-2xl border-8 border-white/20 backdrop-blur-sm bg-white/10">
            {SLIDES.map((slide, index) => {
                const isActive = currentSlide === index;
                return (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        <div className="w-full h-full relative">
                            {/* Adding a subtle white glow behind the image for better contrast if it's transparent */}
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
                            <Image
                                src={slide.content}
                                alt={`Slide ${index + 1}`}
                                fill
                                className="object-cover relative z-10"
                                quality={100}
                                priority={index === 0}
                            />
                        </div>
                    </div>
                );
            })}

            {/* Progress Indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-500 ease-out focus:outline-none ${currentSlide === index ? 'w-6 bg-primary shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'w-1.5 bg-white/60 hover:bg-white/90'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

