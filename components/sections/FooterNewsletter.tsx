"use client";

import { HoverRevealText } from "@/components/ui/hover-reveal-text";
import type { SiteFooterNewsletterProps } from "@/lib/site-footer-section-types";

export function FooterNewsletter(props: SiteFooterNewsletterProps) {
  const {
    headline,
    description,
    emailPlaceholder,
    submitLabel,
    disclaimer,
  } = props;

  return (
    <div className="flex h-full min-h-0 w-full max-w-full min-w-0 flex-col items-start justify-start text-left">
      <h3 className="m-0 font-heading text-[length:var(--text-exp-body-md)] font-semibold leading-[var(--leading-heading)] tracking-[length:var(--tracking-heading)] text-[color:var(--color-white)] md:text-[length:var(--text-exp-body-lg)]">
        {headline}
      </h3>
      <p className="mt-[var(--space-4)] font-body text-[length:var(--text-body)] font-light leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-white/70">
        {description}
      </p>
      <form
        className="mt-[var(--space-6)] flex w-full min-w-0 flex-col gap-[var(--space-4)] sm:flex-row sm:items-end sm:gap-[var(--space-4)] lg:justify-start"
        onSubmit={(e) => {
          e.preventDefault();
        }}
        noValidate
      >
        <label className="sr-only" htmlFor="footer-newsletter-email">
          Email for newsletter
        </label>
        <input
          id="footer-newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder={emailPlaceholder}
          className="min-h-[2.75rem] min-w-0 flex-1 border-0 border-b border-b-[color:var(--color-white)] bg-transparent px-0 pb-[var(--space-2)] font-heading text-[length:var(--text-exp-label)] font-semibold uppercase tracking-[length:var(--tracking-body)] text-[color:var(--color-white)] outline-none placeholder:uppercase placeholder:text-[color:var(--color-white)] placeholder:opacity-80 focus-visible:border-b-[color:var(--color-primary-default)]"
        />
        <button
          type="submit"
          className="group inline-flex h-11 shrink-0 items-center justify-center border border-transparent bg-[color:var(--color-white)] px-[var(--space-6)] font-heading text-[length:var(--text-exp-label)] font-semibold uppercase tracking-[length:var(--tracking-body)] text-[color:var(--color-black)] transition-colors duration-200 hover:bg-[color:var(--color-primary-light)] active:scale-[0.98] sm:h-[2.75rem]"
        >
          <HoverRevealText className="whitespace-nowrap">
            {submitLabel}
          </HoverRevealText>
        </button>
      </form>
      <p className="mt-[var(--space-4)] font-body text-[length:var(--text-label)] font-normal leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-text-muted)]">
        {disclaimer}
      </p>
    </div>
  );
}
