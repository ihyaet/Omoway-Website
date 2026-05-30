import { ArrowRight } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { HeroBackgroundMedia } from "@/components/sections/HeroBackgroundMedia";
import { HeroScrollLayer } from "@/components/sections/HeroScrollLayer";
import { HeroHeadline } from "@/components/sections/HeroHeadline";
import { HeroInfoBar } from "@/components/sections/HeroInfoBar";
import { HeroSupportingFade } from "@/components/sections/HeroSupportingFade";
import { HoverRevealText } from "@/components/ui/hover-reveal-text";
import { HERO_PRE_REVEAL } from "@/lib/hero-support-reveal-classes";
import type { HeroSectionProps } from "@/lib/hero-section-types";

export function HeroSection(props: HeroSectionProps) {
  const {
    promoBadge,
    headlineLines,
    intro,
    primaryCta,
    secondaryCta,
    contacts,
    footerCtaHref,
    footerCtaAriaLabel,
  } = props;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate -mt-16 h-[100svh] overflow-hidden text-[color:var(--color-text-primary)]"
    >
      <HeroScrollLayer>
        <HeroBackgroundMedia />

        <div className="relative flex w-full min-h-0 flex-1 flex-col">
        <div className="flex flex-1 flex-col justify-center px-[length:var(--space-4)] pb-[var(--space-16)] pt-[var(--space-12)] md:px-[length:var(--space-6)] lg:max-w-[min(54rem,calc(100%-2*var(--space-6)))] lg:pl-[length:var(--space-6)] lg:pr-0 lg:py-[var(--space-24)] xl:max-w-[min(54rem,calc(100%-2*var(--page-margin-inline-desktop)))] xl:pl-[length:var(--section-hero-pad-inline-desktop)]">
          <HeroSupportingFade>
            <span className="block max-w-full self-start overflow-hidden">
              <Link
                data-hero-slide
                href="/omo-x/promo"
                className="group inline-flex max-w-fit items-center gap-[var(--space-2)] bg-[rgba(255,255,255,0.2)] py-[4px] pl-[4px] pr-[8px] font-heading text-[length:var(--text-exp-label)] font-semibold uppercase leading-[var(--leading-heading)] tracking-[length:var(--tracking-body)] text-[color:var(--color-white)] transition-opacity duration-200 hover:opacity-90"
              >
            <span className="inline-flex shrink-0 items-center justify-center bg-[color:var(--color-primary-default)] p-[4px]">
              <HoverRevealText
                direction="horizontal"
                className="size-[16px]"
              >
                <ArrowRight
                  className="size-[16px] shrink-0 text-[color:var(--color-black)]"
                  weight="bold"
                  aria-hidden
                />
              </HoverRevealText>
            </span>
            <span className="whitespace-nowrap">{promoBadge}</span>
            </Link>
            </span>

            <HeroHeadline headlineLines={headlineLines} />

            <p
              data-hero-fade
              className={`mt-[var(--space-6)] w-full font-body text-[length:var(--text-body)] font-normal leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-text-primary)] ${HERO_PRE_REVEAL}`}
            >
              {intro}
            </p>

            <div
              data-hero-fade
              className={`mt-[var(--space-10)] flex flex-col gap-[var(--space-6)] sm:flex-row sm:flex-wrap sm:items-center ${HERO_PRE_REVEAL}`}
            >
            <Link
              href={primaryCta.href}
              className="group inline-flex h-11 w-fit shrink-0 self-start items-center justify-center border border-transparent bg-[color:var(--color-white)] px-[var(--space-6)] py-3 font-heading text-[length:var(--text-exp-label)] font-semibold uppercase tracking-[length:var(--tracking-body)] text-[color:var(--color-black)] transition-colors duration-200 hover:bg-[color:var(--color-primary-light)] active:scale-[0.98] sm:self-auto md:h-[2.75rem] md:px-[var(--space-8)] lg:h-[3.25rem] lg:px-[var(--space-4)] lg:py-4"
            >
              <HoverRevealText className="whitespace-nowrap">{primaryCta.label}</HoverRevealText>
            </Link>

            <Link
              href={secondaryCta.href}
              className="group inline-flex w-fit shrink-0 items-center justify-center gap-[var(--space-2)] border-0 border-b border-solid border-b-[color:var(--color-white)] bg-transparent pb-[var(--space-2)] pt-3 font-heading text-[length:var(--text-exp-label)] font-semibold uppercase tracking-[length:var(--tracking-body)] text-[color:var(--color-text-primary)] transition-colors duration-200 hover:border-b-[color:var(--color-accent)] hover:text-[color:var(--color-accent)] active:border-b-[color:var(--color-accent-hover)] active:text-[color:var(--color-accent-hover)] lg:h-[3.25rem]"
            >
              <HoverRevealText className="whitespace-nowrap">{secondaryCta.label}</HoverRevealText>
              <ArrowRight className="size-[1.125rem] shrink-0" weight="bold" aria-hidden />
            </Link>
            </div>
          </HeroSupportingFade>
        </div>
      </div>

        <HeroInfoBar
          contacts={contacts}
          footerCtaHref={footerCtaHref}
          footerCtaAriaLabel={footerCtaAriaLabel}
        />
      </HeroScrollLayer>
    </section>
  );
}
