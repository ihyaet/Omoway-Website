"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import { HERO_BG_INTRO_DURATION_SEC } from "@/lib/hero-bg-intro";
import type { HeroSectionProps } from "@/lib/hero-section-types";

type HeroHeadlineProps = {
  headlineLines: HeroSectionProps["headlineLines"];
};

export function HeroHeadline({ headlineLines }: HeroHeadlineProps) {
  const rootRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const targets = root.querySelectorAll<HTMLElement>("[data-headline-reveal]");
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { y: "100%" },
        {
          y: 0,
          duration: 1,
          stagger: 0.06,
          ease: "expo.out",
          delay: HERO_BG_INTRO_DURATION_SEC + 0.03,
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <h1
      ref={rootRef}
      id="hero-heading"
      className="mt-[var(--space-5)] max-w-[20ch] font-heading text-[length:var(--text-h1)] leading-[var(--leading-heading)] tracking-[length:var(--tracking-heading)] lg:max-w-none"
    >
      {headlineLines.map((line, idx) => (
        <span key={idx} className="block overflow-hidden">
          <span className="block" data-headline-reveal>
            {line}
          </span>
        </span>
      ))}
    </h1>
  );
}
