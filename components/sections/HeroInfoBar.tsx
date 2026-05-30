"use client";

import { ArrowRight } from "@phosphor-icons/react";
import gsap from "gsap";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";

import { HERO_BG_INTRO_DURATION_SEC } from "@/lib/hero-bg-intro";
import type { HeroSectionProps } from "@/lib/hero-section-types";

type HeroInfoBarProps = Pick<HeroSectionProps, "contacts" | "footerCtaAriaLabel" | "footerCtaHref">;

export function HeroInfoBar(props: HeroInfoBarProps) {
  const { contacts, footerCtaAriaLabel, footerCtaHref } = props;
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: "100%" },
        {
          y: 0,
          delay: HERO_BG_INTRO_DURATION_SEC,
          duration: 1,
          ease: "expo.out",
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="shrink-0 border-b-[8px] border-t-[0.5px] border-b-[color:var(--color-primary-default)] border-t-[color:var(--color-border-dark)] px-[length:var(--space-4)] md:px-[length:var(--space-6)] xl:px-[length:var(--section-hero-pad-inline-desktop)]"
    >
      <div className="no-scrollbar mx-auto flex w-full min-w-0 max-w-full flex-nowrap items-start gap-0 overflow-x-auto overscroll-x-contain snap-x snap-mandatory [-webkit-overflow-scrolling:touch] lg:snap-none lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2.2fr)_auto] lg:justify-items-stretch lg:overflow-visible lg:overscroll-auto">
        {contacts.map((block, idx) => (
          <div
            key={block.label}
            className={`h-full min-w-0 w-full shrink-0 snap-start basis-full self-stretch px-[24px] py-[12px] md:px-[var(--space-8)] lg:max-w-none lg:basis-auto lg:justify-self-stretch ${idx > 0 ? "border-l-[0.5px] border-[color:var(--color-border-dark)]" : ""}`}
          >
            <p className="block w-full font-body text-[length:var(--text-exp-label)] font-normal uppercase tracking-[length:var(--tracking-body)] text-[color:var(--color-text-muted)]">
              {block.label}
            </p>
            <p className="mt-[var(--space-2)] block min-w-0 w-full max-w-full break-words font-heading text-[length:var(--text-exp-label)] font-medium leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-text-primary)]">
              {block.value}
            </p>
          </div>
        ))}
        <div className="flex h-full w-max shrink-0 snap-start justify-end border-l-[0.5px] border-[color:var(--color-border-dark)] px-[length:var(--space-4)] py-[var(--space-6)] md:px-[length:var(--space-6)] lg:w-auto lg:max-w-none lg:shrink-0 lg:justify-self-end lg:items-center lg:justify-center lg:px-[var(--space-6)] lg:py-0">
          <Link
            href={footerCtaHref}
            aria-label={footerCtaAriaLabel}
            className="inline-flex size-11 items-center justify-center rounded-none text-[color:var(--color-text-primary)] transition-colors duration-200 hover:text-[color:var(--color-accent)]"
          >
            <ArrowRight className="size-5" weight="bold" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
