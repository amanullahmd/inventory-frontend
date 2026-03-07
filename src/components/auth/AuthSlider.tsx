'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Building2, Shield, Laptop, ClipboardCheck } from 'lucide-react';

const SLIDES = [
    {
        id: 1,
        type: 'image',
        content: '/DPE_cover.webp',
    },
    {
        id: 2,
        type: 'gradient',
        title: 'স্মার্ট ইনভেন্টরি',
        description: 'রিয়েল-টাইমে সকল স্কুলের সামগ্রী ট্র্যাক করুন',
        icon: Laptop,
        gradient: 'from-cyan-500 to-blue-600',
    },
    {
        id: 3,
        type: 'gradient',
        title: 'নিরাপদ অ্যাক্সেস',
        description: 'পদক্রম ব্যবস্থাপনার জন্য ভূমিকা-ভিত্তিক নিয়ন্ত্রণ',
        icon: Shield,
        gradient: 'from-emerald-500 to-teal-400',
    },
    {
        id: 4,
        type: 'gradient',
        title: 'কেন্দ্রীভূত ট্র্যাকিং',
        description: 'অধিদপ্তরের সাথে প্রতিটি জেলা ও উপজেলার সংযোগ',
        icon: Building2,
        gradient: 'from-indigo-500 to-purple-600',
    },
    {
        id: 5,
        type: 'gradient',
        title: 'সহজ চাহিদাপত্র',
        description: 'সামগ্রীর চাহিদাপত্রের জন্য সহজ ও দ্রুত প্রক্রিয়া',
        icon: ClipboardCheck,
        gradient: 'from-orange-400 to-pink-500',
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
        <div className="relative w-80 h-64 rounded-3xl overflow-hidden shadow-2xl border-8 border-white/20 backdrop-blur-sm bg-white/10">
            {SLIDES.map((slide, index) => {
                const isActive = currentSlide === index;
                return (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                    >
                        {slide.type === 'image' ? (
                            <div className="w-full h-full relative">
                                {/* Adding a subtle white glow behind the image for better contrast if it's transparent */}
                                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm"></div>
                                <Image
                                    src={slide.content as string}
                                    alt="DPE Cover"
                                    fill
                                    className="object-contain p-2 relative z-10"
                                    quality={100}
                                    priority={true}
                                />
                            </div>
                        ) : (
                            <div className={`w-full h-full bg-linear-to-br ${slide.gradient} flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden`}>
                                {/* Decorative background shapes for gradient slides */}
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

                                <div className="mb-4 p-3 bg-white/20 rounded-2xl shadow-lg backdrop-blur-md transform transition-transform hover:scale-110">
                                    {slide.icon && <slide.icon size={36} className="text-white drop-shadow-md" />}
                                </div>
                                <h3 className="text-xl font-bold mb-2 tracking-wide drop-shadow-sm">{slide.title}</h3>
                                <p className="text-sm text-white/95 leading-snug font-medium drop-shadow-sm">
                                    {slide.description}
                                </p>
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Progress Indicators */}
            <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 z-20">
                {SLIDES.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-1.5 rounded-full transition-all duration-500 ease-out focus:outline-none ${currentSlide === index ? 'w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
