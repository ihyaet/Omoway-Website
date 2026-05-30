import { ArrowRight } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";

import { RedefiningMobilityContentReveal } from "@/components/sections/RedefiningMobilityContentReveal";
import { HoverRevealText } from "@/components/ui/hover-reveal-text";

const HEADLINE_LINES = [
  ["Redefining", "two-"],
  ["wheel", "mobility."],
] as const;

const BODY =
  "Breaking the limits of traditional motorcycle. A pioneer of urban mobility and a smart terminal that evolves with your needs.";

const CTA = { label: "Discover more", href: "/omo-x" };

const bodyOnlyClassName =
  "font-body text-[length:var(--text-body)] font-normal leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-white/70 [text-wrap:pretty]";

export function RedefiningMobilitySection() {
  return (
    <section
      aria-labelledby="redefining-mobility-heading"
      className="relative isolate flex h-[80dvh] min-h-0 w-full flex-col overflow-hidden bg-[color:var(--color-bg-dark)] lg:h-dvh"
    >
      <div className="absolute inset-0 w-full">
        <Image
          src="/assets/section4bg.png"
          alt="Rider on a futuristic silver electric motorcycle in an urban tunnel, warm side lighting."
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
      </div>

      <div className="relative z-10 flex min-h-0 w-full min-w-0 flex-1 flex-col items-start justify-center px-[length:var(--space-4)] pb-[var(--space-16)] pt-[var(--space-24)] md:px-[length:var(--space-6)] md:pb-[var(--space-20)] md:pt-[var(--space-28)] xl:px-[length:var(--page-margin-inline-desktop)] lg:pb-[var(--space-24)] lg:pt-[var(--space-32)]">
        <div className="max-w-[min(100%,calc(36rem*1.331))]">
          <RedefiningMobilityContentReveal
            id="redefining-mobility-heading"
            lines={HEADLINE_LINES}
            headlineClassName="font-heading text-[clamp(2.25rem,5vw+1rem,4.5rem)] font-semibold leading-[var(--leading-heading)] tracking-[length:var(--tracking-heading)] text-[color:var(--color-white)]"
            bodyWrapClassName="mt-[var(--space-6)] max-w-[80%]"
            bodyText={BODY}
            bodyClassName={bodyOnlyClassName}
            ctaWrapClassName="mt-[var(--space-10)] inline-block max-w-full self-start sm:self-auto"
            cta={
              <Link
                href={CTA.href}
                className="group inline-flex h-11 w-fit shrink-0 items-center justify-center border border-transparent bg-[color:var(--color-white)] px-[var(--space-6)] py-3 font-heading text-[length:var(--text-exp-label)] font-semibold uppercase tracking-[length:var(--tracking-body)] text-[color:var(--color-black)] transition-colors duration-200 hover:bg-[color:var(--color-primary-light)] active:scale-[0.98] md:h-[2.75rem] md:px-[var(--space-8)] lg:h-[3.25rem] lg:px-[var(--space-4)] lg:py-4"
              >
                <span className="inline-flex items-center justify-center gap-[var(--space-3)] whitespace-nowrap">
                  <HoverRevealText className="whitespace-nowrap">{CTA.label}</HoverRevealText>
                  <ArrowRight className="size-[1.125rem] shrink-0" weight="bold" aria-hidden />
                </span>
              </Link>
            }
          />
        </div>
      </div>
    </section>
  );
}
