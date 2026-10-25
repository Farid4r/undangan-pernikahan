"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type GalleryPhoto = { src: string; alt: string };

export function StoryGallery({ photos }: { photos: readonly GalleryPhoto[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const animationFrameRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (photos.length < 2 || isHovered || isInteractionPaused || prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      const nextIndex = (activeIndex + 1) % photos.length;
      const track = trackRef.current;
      const nextSlide = slideRefs.current[nextIndex];
      if (track && nextSlide) {
        track.scrollTo({ left: nextSlide.offsetLeft, behavior: "smooth" });
      }
    }, 4000);

    return () => window.clearInterval(interval);
  }, [activeIndex, isHovered, isInteractionPaused, photos.length, prefersReducedMotion]);

  useEffect(() => () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
  }, []);

  function pauseAutoplayBriefly() {
    setIsInteractionPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsInteractionPaused(false);
      resumeTimeoutRef.current = null;
    }, 1500);
  }

  function goToSlide(index: number) {
    const track = trackRef.current;
    const slide = slideRefs.current[index];
    if (!track || !slide) return;
    pauseAutoplayBriefly();
    track.scrollTo({
      left: slide.offsetLeft,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }

  function updateActiveSlide() {
    const track = trackRef.current;
    if (!track) return;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;
    slideRefs.current.forEach((slide, index) => {
      if (!slide) return;
      const distance = Math.abs(slide.offsetLeft - track.scrollLeft);
      if (distance < closestDistance) {
        closestIndex = index;
        closestDistance = distance;
      }
    });
    setActiveIndex(closestIndex);
  }

  function handleScroll() {
    if (animationFrameRef.current !== null) return;
    animationFrameRef.current = requestAnimationFrame(() => {
      animationFrameRef.current = null;
      updateActiveSlide();
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goToSlide((activeIndex + 1) % photos.length);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goToSlide((activeIndex - 1 + photos.length) % photos.length);
    }
  }

  return (
    <div className="story-gallery relative mx-auto mt-9 w-full max-w-5xl sm:mt-10">
      <div
        ref={trackRef}
        className="story-gallery-track flex gap-4 overflow-x-auto overscroll-x-contain px-1 pb-2"
        role="region"
        aria-label="Galeri foto Sepenggal Kisah"
        aria-roledescription="carousel"
        tabIndex={0}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        onPointerDown={(event) => {
          if (event.pointerType === "touch") pauseAutoplayBriefly();
        }}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setIsHovered(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setIsHovered(false);
        }}
        onWheel={(event) => {
          if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) pauseAutoplayBriefly();
        }}
      >
        {photos.map((photo, index) => (
          <div
            key={photo.src}
            ref={(element) => { slideRefs.current[index] = element; }}
            className="story-gallery-slide relative aspect-[4/3] w-[84%] shrink-0 overflow-hidden rounded-2xl bg-[#e8f5f2] shadow-lg shadow-[#315c55]/10 sm:w-[72%] lg:w-[64%]"
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} dari ${photos.length}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 640px) 84vw, (max-width: 1024px) 72vw, 64vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Foto sebelumnya"
            onClick={() => goToSlide((activeIndex - 1 + photos.length) % photos.length)}
            className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#315c55] shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#319c91] sm:grid"
          >
            <span aria-hidden="true" className="text-2xl leading-none">‹</span>
          </button>
          <button
            type="button"
            aria-label="Foto berikutnya"
            onClick={() => goToSlide((activeIndex + 1) % photos.length)}
            className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#315c55] shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#319c91] sm:grid"
          >
            <span aria-hidden="true" className="text-2xl leading-none">›</span>
          </button>
          <div className="mt-4 flex items-center justify-center" aria-label="Pilih foto">
            {photos.map((photo, index) => (
              <button
                key={photo.src}
                type="button"
                aria-label={`Tampilkan foto ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                onClick={() => goToSlide(index)}
                className="grid h-10 w-8 place-items-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-[#319c91]"
              >
                <span
                  aria-hidden="true"
                  className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index ? "w-6 bg-[#319c91]" : "w-2 bg-[#b8d8d1] hover:bg-[#78918c]"}`}
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
