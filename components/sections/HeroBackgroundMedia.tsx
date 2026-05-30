"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import { HERO_BG_INTRO_DURATION_SEC } from "@/lib/hero-bg-intro";

export function HeroBackgroundMedia() {
  const clipRef = useRef<HTMLDivElement>(null);
  const scaleInnerRef = useRef<HTMLDivElement>(null);
  const introOverlayRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const clip = clipRef.current;
    const scaleInner = scaleInnerRef.current;
    const introOverlay = introOverlayRef.current;
    if (!clip || !scaleInner || !introOverlay) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const ctx = gsap.context(() => {
      if (reduceMotion.matches) {
        gsap.set(scaleInner, { scale: 1 });
        gsap.set(introOverlay, { opacity: 0 });
        return;
      }

      gsap.set(scaleInner, { scale: 1.1, transformOrigin: "50% 50%" });
      gsap.set(introOverlay, { opacity: 1 });

      gsap.to(scaleInner, {
        scale: 1,
        duration: HERO_BG_INTRO_DURATION_SEC,
        ease: "power2.out",
      });
      gsap.to(introOverlay, {
        opacity: 0,
        duration: HERO_BG_INTRO_DURATION_SEC,
        ease: "power1.inOut",
      });
    }, clip);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={clipRef}
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      <div
        ref={scaleInnerRef}
        className="absolute inset-0 h-full w-full origin-center scale-[1.1] will-change-transform"
      >
        <video
          className="absolute inset-0 h-full w-full scale-x-[-1] object-cover object-top"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/assets/heroImage.png"
        >
          <source src="/assets/gtMode.mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30" />
        <div
          ref={introOverlayRef}
          className="pointer-events-none absolute inset-0 bg-[color:var(--color-black)]"
        />
      </div>
    </div>
  );
}
