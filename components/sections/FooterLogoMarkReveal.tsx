"use client";

import Image from "next/image";
import { useRef } from "react";

import { useGsapStaggeredLineReveal } from "@/hooks/useGsapStaggeredLineReveal";

export function FooterLogoMarkReveal() {
  const triggerRef = useRef<HTMLElement>(null);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useGsapStaggeredLineReveal(triggerRef, revealRefs, 1, []);

  const setRevealRef = (index: number) => (el: HTMLElement | null) => {
    revealRefs.current[index] = el;
  };

  return (
    <section
      ref={triggerRef}
      className="w-full min-w-0 px-[length:var(--space-4)] pb-[var(--space-10)] pt-[var(--space-6)] md:px-[length:var(--space-6)] md:pb-[var(--space-12)] md:pt-[var(--space-8)] xl:px-[length:var(--page-margin-inline-desktop)] lg:pb-[var(--space-10)] lg:pt-[var(--space-10)]"
      aria-hidden
    >
      <div className="overflow-hidden">
        <div
          ref={setRevealRef(0)}
          className="block w-full"
          data-sf-reveal
        >
          <Image
            src="/assets/logoMark.svg"
            alt=""
            width={391}
            height={44}
            className="block h-auto w-full opacity-10"
            sizes="100vw"
          />
        </div>
      </div>
    </section>
  );
}
