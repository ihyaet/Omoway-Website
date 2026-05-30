"use client";

import { Battery, Cog, Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef } from "react";

import { HoverRevealText } from "@/components/ui/hover-reveal-text";
import { useGsapStaggeredLineReveal } from "@/hooks/useGsapStaggeredLineReveal";
import type { PreOrderCtaSectionProps } from "@/lib/pre-order-cta-section-types";

const warrantyIcons = {
  shield: Shield,
  battery: Battery,
  cog: Cog,
} as const;

const LEFT_LINE_COUNT = 3;

export function PreOrderCtaSection(props: PreOrderCtaSectionProps) {
  const { image, headline, body, cta, warrantiesEyebrow, warranties } = props;

  const leftTriggerRef = useRef<HTMLDivElement>(null);
  const leftRevealRefs = useRef<(HTMLElement | null)[]>([]);
  useGsapStaggeredLineReveal(
    leftTriggerRef,
    leftRevealRefs,
    LEFT_LINE_COUNT,
    [],
  );

  const rightTriggerRef = useRef<HTMLDivElement>(null);
  const rightRevealRefs = useRef<(HTMLElement | null)[]>([]);
  const warrantiesKey = useMemo(
    () => warranties.map((w) => w.id).join("\0"),
    [warranties],
  );
  const rightLineCount = 1 + warranties.length;
  useGsapStaggeredLineReveal(
    rightTriggerRef,
    rightRevealRefs,
    rightLineCount,
    [warrantiesKey],
  );

  const setLeftRevealRef =
    (index: number) => (el: HTMLElement | null) => {
      leftRevealRefs.current[index] = el;
    };
  const setRightRevealRef =
    (index: number) => (el: HTMLElement | null) => {
      rightRevealRefs.current[index] = el;
    };

  return (
    <section
      aria-labelledby="pre-order-cta-heading"
      className="w-full min-w-0 bg-[#101010]"
    >
      <div className="relative isolate aspect-[16/9] min-h-[min(52svh,28rem)] w-full min-w-0 md:min-h-[min(60svh,36rem)] lg:aspect-[21/9] lg:min-h-[min(70svh,40rem)]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority={false}
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(180deg,transparent_0%,transparent_38%,rgba(16,16,16,0.65)_72%,#101010_100%)]"
          aria-hidden
        />
      </div>

      <div className="bg-[rgba(16,16,16,1)] px-[length:var(--space-4)] py-[var(--space-16)] text-[rgba(16,16,16,1)] md:px-[length:var(--space-6)] md:py-[var(--space-20)] xl:px-[length:var(--page-margin-inline-desktop)] lg:py-[length:var(--space-10)]">
        <div className="mx-auto grid w-full min-w-0 grid-cols-1 gap-[var(--space-12)] lg:grid-cols-[minmax(0,2.5fr)_minmax(0,2.5fr)] lg:items-center lg:gap-[var(--space-16)] xl:gap-[var(--space-20)]">
          <div ref={leftTriggerRef} className="min-w-0">
            <h2
              id="pre-order-cta-heading"
              className="m-0 font-heading text-[length:var(--text-h2)] font-semibold leading-[var(--leading-heading)] tracking-[length:var(--tracking-heading)] text-[color:var(--color-white)] md:text-[length:clamp(2.5rem,4vw,4rem)]"
            >
              <span className="block overflow-hidden">
                <span
                  ref={setLeftRevealRef(0)}
                  className="block"
                  data-sf-reveal
                >
                  {headline}
                </span>
              </span>
            </h2>
            <p className="mt-[var(--space-6)] max-w-2xl w-full font-body text-[length:var(--text-body)] font-light leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-white/70 lg:max-w-none">
              <span className="block overflow-hidden">
                <span
                  ref={setLeftRevealRef(1)}
                  className="block"
                  data-sf-reveal
                >
                  {body}
                </span>
              </span>
            </p>
            <div className="mt-[var(--space-10)] overflow-hidden">
              <span
                ref={setLeftRevealRef(2)}
                className="block w-fit"
                data-sf-reveal
              >
                <Link
                  href={cta.href}
                  className="group inline-flex h-11 w-fit shrink-0 items-center justify-center border border-transparent bg-[color:var(--color-white)] px-[var(--space-6)] py-3 font-heading text-[length:var(--text-exp-label)] font-semibold uppercase tracking-[length:var(--tracking-body)] text-[color:var(--color-black)] transition-colors duration-200 hover:bg-[color:var(--color-primary-light)] active:scale-[0.98] md:h-[2.75rem] md:px-[var(--space-8)] lg:h-[3.25rem]"
                >
                  <HoverRevealText className="whitespace-nowrap">
                    {cta.label}
                  </HoverRevealText>
                </Link>
              </span>
            </div>
          </div>

          <div
            ref={rightTriggerRef}
            className="h-fit w-fit max-w-full min-w-0 justify-self-start lg:justify-self-end lg:pt-[length:var(--space-2)]"
          >
            <p className="m-0 w-fit max-w-full font-heading text-[length:var(--text-exp-body-xs)] font-semibold uppercase leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-text-secondary)]">
              <span className="block overflow-hidden">
                <span
                  ref={setRightRevealRef(0)}
                  className="block w-fit"
                  data-sf-reveal
                >
                  {warrantiesEyebrow}
                </span>
              </span>
            </p>
            <ul className="mt-[var(--space-6)] flex w-fit max-w-full list-none flex-col gap-[var(--space-6)] p-0 m-0">
              {warranties.map((item, index) => {
                const Icon = warrantyIcons[item.icon];
                const revealIndex = 1 + index;
                return (
                  <li key={item.id} className="list-none overflow-hidden">
                    <span
                      ref={setRightRevealRef(revealIndex)}
                      className="flex w-fit max-w-full min-w-0 items-start gap-[var(--space-4)]"
                      data-sf-reveal
                    >
                      <Icon
                        className="mt-0.5 size-5 shrink-0 text-[color:var(--color-white)]"
                        strokeWidth={1.5}
                        aria-hidden
                      />
                      <span className="font-heading text-[length:var(--text-exp-label)] font-semibold uppercase leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-white)]">
                        {item.label}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
