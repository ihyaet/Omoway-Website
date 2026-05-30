"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef, type ReactNode } from "react";

import { HERO_BG_INTRO_DURATION_SEC } from "@/lib/hero-bg-intro";

type HeroSupportingFadeProps = {
  children: ReactNode;
};

export function HeroSupportingFade({ children }: HeroSupportingFadeProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fadeItems = root.querySelectorAll<HTMLElement>("[data-hero-fade]");
    const slideItems = root.querySelectorAll<HTMLElement>("[data-hero-slide]");

    if (fadeItems.length === 0 && slideItems.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      gsap.set([...fadeItems, ...slideItems], {
        opacity: 1,
        y: 0,
        clearProps: "opacity,transform",
      });
      return;
    }

    const ctx = gsap.context(() => {
      if (fadeItems.length > 0) {
        gsap.fromTo(
          fadeItems,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power2.out",
            delay: HERO_BG_INTRO_DURATION_SEC,
          },
        );
      }
      if (slideItems.length > 0) {
        gsap.fromTo(
          slideItems,
          { y: "100%" },
          {
            y: 0,
            duration: 1,
            ease: "expo.out",
            delay: HERO_BG_INTRO_DURATION_SEC + 0.03,
          },
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="contents">
      {children}
    </div>
  );
}
