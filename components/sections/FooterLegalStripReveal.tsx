"use client";

import Link from "next/link";
import { useRef, type CSSProperties, type Ref, type RefObject } from "react";

import { useGsapStaggeredLineReveal } from "@/hooks/useGsapStaggeredLineReveal";
import type { SiteFooterNavLink } from "@/lib/site-footer-section-types";

const footerLegalBarTypeClass =
  "font-body text-[12px] font-normal uppercase leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-white)]";

const LEGAL_STRIP_LINE_COUNT = 2;

const stripClipPath: CSSProperties = {
  clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)",
};

type FooterLegalStripBodyProps = {
  copyright: string;
  legalLinks: SiteFooterNavLink[];
  interactive: boolean;
  wrapperClassName: string;
  rootRef?: Ref<HTMLDivElement>;
  setRevealRef?: (index: number) => (el: HTMLElement | null) => void;
};

function FooterLegalStripBody(props: FooterLegalStripBodyProps) {
  const {
    copyright,
    legalLinks,
    interactive,
    wrapperClassName,
    rootRef,
    setRevealRef,
  } = props;

  return (
    <div ref={rootRef} className={wrapperClassName} style={stripClipPath}>
      <div className="flex w-full min-w-0 flex-col items-center gap-[24px] text-center lg:flex-row lg:items-center lg:justify-between lg:gap-[var(--space-12)] lg:text-left">
        <p
          className={`m-0 w-full max-w-4xl min-w-0 lg:w-auto lg:max-w-none ${footerLegalBarTypeClass}`}
        >
          <span className="block overflow-hidden">
            <span
              ref={setRevealRef?.(0)}
              className="block"
              {...(setRevealRef ? { "data-sf-reveal": true } : {})}
            >
              {copyright}
            </span>
          </span>
        </p>
        <nav
          aria-label={interactive ? "Legal" : undefined}
          className="flex w-full min-w-0 justify-center overflow-hidden lg:w-auto lg:justify-end"
        >
          <span
            ref={setRevealRef?.(1)}
            className="block w-full min-w-0 max-w-5xl lg:max-w-none"
            {...(setRevealRef ? { "data-sf-reveal": true } : {})}
          >
            <span className="flex w-full min-w-0 flex-row flex-wrap items-center justify-center gap-x-[12px] gap-y-[12px] lg:justify-between lg:gap-x-[var(--space-8)] lg:gap-y-[var(--space-3)]">
              {legalLinks.map((link) =>
                interactive ? (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`shrink-0 text-center lg:text-left ${footerLegalBarTypeClass} transition-colors hover:text-[color:var(--color-primary-default)]`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <span
                    key={link.href}
                    className={`shrink-0 text-center lg:text-left ${footerLegalBarTypeClass}`}
                  >
                    {link.label}
                  </span>
                ),
              )}
            </span>
          </span>
        </nav>
      </div>
    </div>
  );
}

export type FooterLegalStripRevealProps = {
  copyright: string;
  legalLinks: SiteFooterNavLink[];
  /** In-flow element (e.g. spacer after main footer) that gates the viewport reveal. */
  viewportTriggerRef?: RefObject<HTMLElement | null>;
};

export function FooterLegalStripReveal(props: FooterLegalStripRevealProps) {
  const { copyright, legalLinks, viewportTriggerRef } = props;

  const localTriggerRef = useRef<HTMLDivElement>(null);
  const triggerRef = viewportTriggerRef ?? localTriggerRef;
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  useGsapStaggeredLineReveal(
    triggerRef,
    revealRefs,
    LEGAL_STRIP_LINE_COUNT,
    [],
  );

  const setRevealRef =
    (index: number) => (el: HTMLElement | null) => {
      revealRefs.current[index] = el;
    };

  return (
    <FooterLegalStripBody
      interactive
      copyright={copyright}
      legalLinks={legalLinks}
      rootRef={viewportTriggerRef ? undefined : localTriggerRef}
      wrapperClassName="pointer-events-auto w-full min-w-0 px-[12px] py-[12px] lg:px-[length:var(--space-4)] lg:py-[var(--space-10)] xl:px-[length:var(--page-margin-inline-desktop)]"
      setRevealRef={setRevealRef}
    />
  );
}

/** In-flow spacer: matches fixed legal bar layout at all breakpoints; invisible and inert. */
export function FooterLegalStripLayoutSpacer(props: {
  copyright: string;
  legalLinks: SiteFooterNavLink[];
}) {
  const { copyright, legalLinks } = props;

  return (
    <FooterLegalStripBody
      interactive={false}
      copyright={copyright}
      legalLinks={legalLinks}
      wrapperClassName="invisible pointer-events-none w-full min-w-0 select-none px-[12px] py-[12px] lg:px-[length:var(--space-4)] lg:py-[var(--space-10)] xl:px-[length:var(--page-margin-inline-desktop)]"
    />
  );
}
