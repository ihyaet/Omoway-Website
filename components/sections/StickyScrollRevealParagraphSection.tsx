"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { CSSProperties } from "react";
import { useLayoutEffect, useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

type RevealParagraphStyle = CSSProperties & { "--reveal"?: string };

export type StickyScrollRevealParagraphSectionProps = {
  /** Plain text rendered in one paragraph (scroll reveal is vertical; line breaks follow normal wrapping). */
  text: string;
  /** Eyebrow line above the paragraph; optional for accessibility/layout. */
  eyebrow?: string;
  /** Min height of the scroll track in viewport heights — more = slower reveal. Default 260. */
  scrollVh?: number;
  /** Smoothed scrub amount passed to GSAP ScrollTrigger (0 = none, higher = lazier). Default 0.65. */
  scrub?: boolean | number;
  id?: string;
  className?: string;
};

/**
 * Tall scroll track + sticky copy: GSAP ScrollTrigger scrubs `--reveal` on the paragraph so
 * the fill (foreground) climbs from muted to full contrast while the user scrolls.
 */
export function StickyScrollRevealParagraphSection({
  text,
  eyebrow,
  scrollVh = 260,
  scrub = 0.65,
  id = "sticky-scroll-reveal-copy",
  className,
}: StickyScrollRevealParagraphSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const paragraph = paragraphRef.current;
    if (!track || !paragraph) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reduceMotion.matches) {
      gsap.set(paragraph, { "--reveal": "100%", clearProps: "transform" });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        paragraph,
        { "--reveal": "0%" },
        {
          "--reveal": "100%",
          ease: "none",
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub,
            invalidateOnRefresh: true,
          },
        },
      );
    }, track);

    return () => ctx.revert();
  }, [scrub]);

  const rootClass =
    className ??
    "w-full bg-[color:var(--color-white)] px-[length:var(--space-4)] md:px-[length:var(--space-6)] xl:px-[length:var(--page-margin-inline-desktop)]";

  const paragraphStyle: RevealParagraphStyle = {
    "--reveal": "0%",
    fontSize: "var(--text-exp-body-lg)",
    lineHeight: "var(--leading-body)",
    letterSpacing: "var(--tracking-body-xxl)",
  };

  return (
    <section
      aria-labelledby={eyebrow ? `${id}-eyebrow` : id}
      className={rootClass}
    >
      <div ref={trackRef} className="w-full" style={{ minHeight: `${scrollVh}vh` }}>
        <div className="sticky top-0 flex min-h-screen w-full max-w-none flex-col justify-center py-[var(--space-16)] lg:py-[var(--space-24)]">
          {eyebrow ? (
            <p
              className="mb-[var(--space-5)] font-heading text-[length:var(--text-exp-label)] font-semibold uppercase tracking-[length:var(--tracking-body)] text-[color:var(--color-primary-dark)]"
              id={`${id}-eyebrow`}
            >
              {eyebrow}
            </p>
          ) : null}
          <p
            ref={paragraphRef}
            id={id}
            className="revealing-paragraph-scroll max-w-[min(100%,42rem)] font-body font-semibold"
            style={paragraphStyle}
          >
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}
