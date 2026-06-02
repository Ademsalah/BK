"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import show from "../../../public/homebk.png";
const images = [show, show, show];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Manual navigation
  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Image - Fixed with Next.js 'fill' and 'priority' attributes */}
      <Image
        src={images[current]}
        alt={`Slide ${current + 1}`}
        fill
        priority={current === 0} // Loads the first image instantly
        sizes="100vw"
        className="object-cover transition-all duration-700"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black px-4 py-2 rounded-full transition-colors z-10"
      >
        ◀
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black px-4 py-2 rounded-full transition-colors z-10"
      >
        ▶
      </button>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
              current === i ? "bg-white scale-125" : "bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
