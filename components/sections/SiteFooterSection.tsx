import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FooterLogoMarkReveal } from "@/components/sections/FooterLogoMarkReveal";
import { FooterNewsletter } from "@/components/sections/FooterNewsletter";
import { SiteFooterFixedBottom } from "@/components/sections/SiteFooterFixedBottom";
import { HoverRevealText } from "@/components/ui/hover-reveal-text";
import type { SiteFooterSectionProps } from "@/lib/site-footer-section-types";

const footerNavLinkClassName =
  "group inline-flex max-w-full items-center gap-[var(--space-3)] font-heading text-[length:var(--text-exp-label)] font-semibold uppercase leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-white)] transition-colors hover:text-[color:var(--color-primary-default)]";

/** Column titles (Menus, Company, Follow us): same scale as legal bar; color stays secondary. */
const footerNavColumnHeadingSecondaryClass =
  "m-0 font-body text-[length:12px] font-normal uppercase leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-text-secondary)]";

function isExternalHref(href: string) {
  return /^https?:\/\//i.test(href);
}

export function SiteFooterSection(props: SiteFooterSectionProps) {
  const { navColumns, newsletter, visual, copyright, legalLinks } = props;

  return (
    <>
      <footer
        className="relative z-10 w-full min-w-0 bg-[color:var(--color-black)] text-[color:var(--color-white)]"
        aria-labelledby="site-footer-heading"
      >
        <h2 id="site-footer-heading" className="sr-only">
          Site footer and newsletter
        </h2>

        <div className="relative z-10 bg-[color:var(--color-black)] px-[length:var(--space-4)] py-[var(--space-16)] md:px-[length:var(--space-6)] md:py-[var(--space-20)] xl:px-[length:var(--page-margin-inline-desktop)] lg:py-[var(--space-10)]">
          <div className="@container grid w-full min-w-0 grid-cols-2 gap-x-[var(--space-8)] gap-y-[var(--space-12)] md:gap-x-[var(--space-10)] md:gap-y-[var(--space-12)] lg:grid-cols-[repeat(4,minmax(0,1fr))_minmax(0,35cqw)] lg:gap-x-[var(--space-12)] lg:gap-y-[var(--space-16)]">
            {navColumns.map((col) => (
              <nav key={col.id} aria-label={col.title} className="min-w-0 w-full">
                <p
                  className={
                    col.titleVariant === "product"
                      ? "m-0 font-heading text-[length:var(--text-exp-body-sm)] font-semibold uppercase leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-white)] md:text-[length:var(--text-exp-body-md)]"
                      : footerNavColumnHeadingSecondaryClass
                  }
                >
                  {col.title}
                </p>
                <ul className="mt-[var(--space-6)] flex list-none flex-col gap-[var(--space-4)] p-0">
                  {col.links.map((link) => {
                    const external = isExternalHref(link.href);
                    const content = (
                      <>
                        {col.arrowLinks ? (
                          <span
                            className="flex size-7 shrink-0 items-center justify-center border border-[color:var(--color-border-dark)] bg-transparent transition-colors group-hover:border-[color:var(--color-primary-default)]"
                            aria-hidden
                          >
                            <ArrowRight
                              className="size-3.5 text-[color:var(--color-white)] transition-colors group-hover:text-[color:var(--color-primary-default)]"
                              strokeWidth={2}
                            />
                          </span>
                        ) : null}
                        <HoverRevealText className="min-w-0">
                          {link.label}
                        </HoverRevealText>
                      </>
                    );
                    return (
                      <li key={`${col.id}-${link.label}`}>
                        {external ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={footerNavLinkClassName}
                          >
                            {content}
                          </a>
                        ) : (
                          <Link
                            href={link.href}
                            className={footerNavLinkClassName}
                          >
                            {content}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
            <div className="col-span-2 flex h-full min-h-0 min-w-0 w-full flex-col lg:col-span-1 lg:justify-self-stretch">
              <FooterNewsletter {...newsletter} />
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-[color:var(--color-black)]">
          <FooterLogoMarkReveal />
        </div>
      </footer>

      <SiteFooterFixedBottom
        visual={visual}
        copyright={copyright}
        legalLinks={legalLinks}
      />
    </>
  );
}
