"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type GalleryPhoto = { src: string; alt: string };
type Tween = { from: number; to: number; elapsed: number; duration: number };
type Drag = { pointerId: number; startX: number; startPosition: number };

const SCROLL_SPEED = 26;
const RESUME_DELAY = 1200;
const NAVIGATION_DURATION = 500;

export function StoryGallery({ photos }: { photos: readonly GalleryPhoto[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const animationFrameRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const positionRef = useRef(0);
  const groupWidthRef = useRef(0);
  const slideStrideRef = useRef(0);
  const dragRef = useRef<Drag | null>(null);
  const tweenRef = useRef<Tween | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isInteractionPaused, setIsInteractionPaused] = useState(false);
  const [isTweening, setIsTweening] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const applyPosition = useCallback((position: number) => {
    const groupWidth = groupWidthRef.current;
    const stride = slideStrideRef.current;
    if (groupWidth <= 0) return;

    const normalizedPosition = ((position - groupWidth) % groupWidth + groupWidth) % groupWidth + groupWidth;
    positionRef.current = normalizedPosition;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${-normalizedPosition}px, 0, 0)`;
    }

    if (stride > 0 && photos.length > 0) {
      const slideProgress = (normalizedPosition - groupWidth) / stride;
      const nextIndex = Math.round(slideProgress) % photos.length;
      setActiveIndex((currentIndex) => currentIndex === nextIndex ? currentIndex : nextIndex);
    }
  }, [photos.length]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);
    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const measure = () => {
      const viewport = viewportRef.current;
      const track = trackRef.current;
      const firstSlide = slideRefs.current[0];
      const secondSlide = slideRefs.current[1];
      const firstRepeat = slideRefs.current[photos.length];
      if (!viewport || !track || !firstSlide || !secondSlide || !firstRepeat) return;

      const viewportStyle = window.getComputedStyle(viewport);
      const contentWidth = viewport.clientWidth
        - Number.parseFloat(viewportStyle.paddingLeft)
        - Number.parseFloat(viewportStyle.paddingRight);
      const slideRatio = window.innerWidth >= 1024 ? 0.64 : window.innerWidth >= 640 ? 0.72 : 0.84;
      track.style.setProperty("--story-slide-width", `${contentWidth * slideRatio}px`);

      const oldGroupWidth = groupWidthRef.current;
      const oldStride = slideStrideRef.current;
      const oldProgress = oldGroupWidth > 0 && oldStride > 0
        ? (positionRef.current - oldGroupWidth) / oldStride
        : 0;
      const groupWidth = firstRepeat.offsetLeft - firstSlide.offsetLeft;
      const stride = secondSlide.offsetLeft - firstSlide.offsetLeft;
      if (groupWidth <= 0 || stride <= 0) return;

      groupWidthRef.current = groupWidth;
      slideStrideRef.current = stride;
      applyPosition(groupWidth + oldProgress * stride);
    };

    measure();
    const observer = new ResizeObserver(measure);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (slideRefs.current[0]) observer.observe(slideRefs.current[0]!);
    return () => observer.disconnect();
  }, [applyPosition, photos.length]);

  useEffect(() => {
    if (prefersReducedMotion || isDragging || ((isHovered || isInteractionPaused) && !isTweening)) return;

    let previousTime: number | null = null;
    const animate = (time: number) => {
      const delta = previousTime === null ? 0 : Math.min(time - previousTime, 32);
      previousTime = time;

      const tween = tweenRef.current;
      if (tween) {
        tween.elapsed += delta;
        const progress = Math.min(tween.elapsed / tween.duration, 1);
        const easedProgress = 1 - (1 - progress) ** 3;
        applyPosition(tween.from + (tween.to - tween.from) * easedProgress);
        if (progress >= 1) {
          tweenRef.current = null;
          setIsTweening(false);
        }
      } else if (!isInteractionPaused && !isHovered && !isDragging) {
        applyPosition(positionRef.current + delta * SCROLL_SPEED / 1000);
      } else {
        animationFrameRef.current = null;
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    };
  }, [applyPosition, isDragging, isHovered, isInteractionPaused, isTweening, prefersReducedMotion]);

  useEffect(() => () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    if (animationFrameRef.current !== null) cancelAnimationFrame(animationFrameRef.current);
  }, []);

  function pauseAfterInteraction() {
    setIsInteractionPaused(true);
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsInteractionPaused(false);
      resumeTimeoutRef.current = null;
    }, RESUME_DELAY);
  }

  function getPositionForIndex(index: number) {
    const groupWidth = groupWidthRef.current;
    const stride = slideStrideRef.current;
    const basePosition = groupWidth + index * stride;
    const candidates = [basePosition - groupWidth, basePosition, basePosition + groupWidth];
    return candidates.reduce((closest, candidate) =>
      Math.abs(candidate - positionRef.current) < Math.abs(closest - positionRef.current)
        ? candidate
        : closest,
    );
  }

  function goToSlide(index: number) {
    pauseAfterInteraction();
    const targetPosition = getPositionForIndex(index);
    if (prefersReducedMotion) {
      tweenRef.current = null;
      setIsTweening(false);
      applyPosition(targetPosition);
      return;
    }

    tweenRef.current = {
      from: positionRef.current,
      to: targetPosition,
      elapsed: 0,
      duration: NAVIGATION_DURATION,
    };
    setIsTweening(true);
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    pauseAfterInteraction();
    tweenRef.current = null;
    setIsTweening(false);
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startPosition: positionRef.current,
    };
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    applyPosition(drag.startPosition - (event.clientX - drag.startX));
  }

  function finishPointerDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    setIsDragging(false);
    pauseAfterInteraction();
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

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    if (Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
    event.preventDefault();
    pauseAfterInteraction();
    applyPosition(positionRef.current + event.deltaX);
  }

  return (
    <div className="story-gallery relative mx-auto mt-9 w-full max-w-5xl sm:mt-10">
      <div
        ref={viewportRef}
        className={`story-gallery-viewport overflow-hidden px-1 pb-2 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={finishPointerDrag}
        onPointerCancel={finishPointerDrag}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") setIsHovered(true);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") setIsHovered(false);
        }}
        onWheel={handleWheel}
      >
        <div
          ref={trackRef}
          className="story-gallery-track flex w-max gap-4"
          role="region"
          aria-label="Galeri foto Sepenggal Kisah"
          aria-roledescription="carousel"
          tabIndex={0}
          onKeyDown={handleKeyDown}
        >
          {[0, 1, 2].flatMap((copy) => photos.map((photo, index) => {
            const isDuplicate = copy !== 1;
            return (
              <div
                key={`${copy}-${photo.src}`}
                ref={(element) => { slideRefs.current[copy * photos.length + index] = element; }}
                className="story-gallery-slide relative aspect-[4/3] max-w-[42rem] shrink-0 overflow-hidden rounded-2xl bg-[#e8f5f2] shadow-lg shadow-[#315c55]/10"
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} dari ${photos.length}`}
                aria-hidden={isDuplicate}
              >
                <Image
                  src={photo.src}
                  alt={isDuplicate ? "" : photo.alt}
                  fill
                  sizes="(max-width: 640px) 84vw, (max-width: 1024px) 72vw, 64vw"
                  className="pointer-events-none object-cover"
                  draggable={false}
                />
              </div>
            );
          }))}
        </div>
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Foto sebelumnya"
            onClick={() => goToSlide((activeIndex - 1 + photos.length) % photos.length)}
            className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#315c55] shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#319c91] sm:grid"
          >
            <span aria-hidden="true" className="text-2xl leading-none">&#8249;</span>
          </button>
          <button
            type="button"
            aria-label="Foto berikutnya"
            onClick={() => goToSlide((activeIndex + 1) % photos.length)}
            className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-[#315c55] shadow-md transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#319c91] sm:grid"
          >
            <span aria-hidden="true" className="text-2xl leading-none">&#8250;</span>
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
