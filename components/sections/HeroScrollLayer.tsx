"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLayoutEffect, useRef, type ReactNode } from "react";

import { HERO_SCROLL_LAG_VH, HERO_SCROLL_SCRUB } from "@/lib/hero-bg-intro";

gsap.registerPlugin(ScrollTrigger);

type HeroScrollLayerProps = {
  children: ReactNode;
};

/**
 * Scroll-linked lag for the full hero stack (media + copy + info bar).
 * Parent `<section>` is the ScrollTrigger trigger; this inner layer is transformed.
 */
export function HeroScrollLayer({ children }: HeroScrollLayerProps) {
  const innerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const inner = innerRef.current;
    const section = inner?.parentElement;
    if (!inner || !section || section.tagName !== "SECTION") return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const lagY = () => (window.innerHeight * HERO_SCROLL_LAG_VH) / 100;

    const ctx = gsap.context(() => {
      if (reduceMotion.matches) {
        gsap.set(inner, { y: 0, clearProps: "transform" });
        return;
      }

      gsap.fromTo(
        inner,
        { y: 0 },
        {
          y: lagY,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: HERO_SCROLL_SCRUB,
            invalidateOnRefresh: true,
          },
        },
      );
    }, inner);

    ScrollTrigger.refresh();
    const rafId = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(rafId);
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={innerRef}
      className="absolute inset-0 flex min-h-0 w-full flex-col pt-16 will-change-transform"
    >
      {children}
    </div>
  );
}
