"use client";

import Image from "next/image";
import { useRef } from "react";

import {
  FooterLegalStripLayoutSpacer,
  FooterLegalStripReveal,
} from "@/components/sections/FooterLegalStripReveal";
import type { SiteFooterNavLink } from "@/lib/site-footer-section-types";

type SiteFooterFixedBottomProps = {
  visual: {
    imageSrc: string;
    imageAlt: string;
  };
  copyright: string;
  legalLinks: SiteFooterNavLink[];
};

/**
 * Fixed bottom image + legal strip (z-0, behind main z-10 page content).
 * Scroll height reserved by transparent spacer; sentinel ref reveals legal copy after main footer.
 */
export function SiteFooterFixedBottom(props: SiteFooterFixedBottomProps) {
  const { visual, copyright, legalLinks } = props;
  const scrollSentinelRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Reserve scroll height; sentinel triggers legal line reveal when user reaches end of page. */}
      <div
        className="w-full min-w-0 shrink-0 pointer-events-none select-none"
        aria-hidden
      >
        <div
          ref={scrollSentinelRef}
          className="aspect-[2/1] min-h-[min(41.6vw,14.4rem)] w-full sm:min-h-[min(38.4vw,17.6rem)] lg:aspect-[35/12] lg:min-h-[min(28.8vw,22.4rem)]"
        />
        <FooterLegalStripLayoutSpacer
          copyright={copyright}
          legalLinks={legalLinks}
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-0 w-full min-w-0 pointer-events-none bg-[rgb(16_16_16)] text-[rgb(16_16_16)]">
        <div className="relative h-fit aspect-[2/1] min-h-[min(41.6vw,14.4rem)] w-full overflow-hidden sm:min-h-[min(38.4vw,17.6rem)] lg:aspect-[35/12] lg:min-h-[min(28.8vw,22.4rem)]">
          <Image
            src={visual.imageSrc}
            alt={visual.imageAlt}
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(16,16,16,0.2)_0%,rgba(16,16,16,0.35)_55%,var(--color-black)_100%)]"
            aria-hidden
          />
        </div>
        <FooterLegalStripReveal
          copyright={copyright}
          legalLinks={legalLinks}
          viewportTriggerRef={scrollSentinelRef}
        />
      </div>
    </>
  );
}
