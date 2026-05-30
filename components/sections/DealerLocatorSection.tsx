"use client";

import { ArrowRight, Check, Copy } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { HoverRevealText } from "@/components/ui/hover-reveal-text";
import { useGsapStaggeredLineReveal } from "@/hooks/useGsapStaggeredLineReveal";
import type {
  DealerLocatorSectionProps,
} from "@/lib/dealer-locator-section-types";
import { cn } from "@/lib/utils";

const DealerLocatorMap = dynamic(
  () =>
    import("./DealerLocatorMap").then((m) => ({ default: m.DealerLocatorMap })),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex h-full min-h-0 w-full min-w-0 flex-1 items-center justify-center bg-[color:var(--color-bg-light)]"
        aria-hidden
      >
        <span className="font-body text-[length:var(--text-body-xs)] text-[color:var(--color-text-secondary-light)]">
          Loading map…
        </span>
      </div>
    ),
  },
);

const HEADER_REVEAL_LINES = 2;

function subscribeDesktopMapMq(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(min-width: 1025px)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function desktopMapMqMatches() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 1025px)").matches
  );
}

export function DealerLocatorSection(props: DealerLocatorSectionProps) {
  const {
    heading,
    subheading,
    searchPlaceholder,
    dealers,
    defaultDealerId,
    cta,
    disclaimer,
  } = props;

  const baseId = useId();
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(defaultDealerId);
  const [copiedDealerId, setCopiedDealerId] = useState<string | null>(null);
  const [copyAnnouncement, setCopyAnnouncement] = useState("");
  const copyTimeoutRef = useRef<number | undefined>(undefined);

  const showMap = useSyncExternalStore(
    subscribeDesktopMapMq,
    desktopMapMqMatches,
    () => false,
  );

  const copyPhone = useCallback(async (phone: string, dealerId: string) => {
    const text = phone.replace(/\s+/g, "").trim();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedDealerId(dealerId);
      setCopyAnnouncement(`Copied ${phone}`);
      if (copyTimeoutRef.current) window.clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedDealerId(null);
        setCopyAnnouncement("");
      }, 2000);
    } catch {
      setCopyAnnouncement("Could not copy phone number");
      window.setTimeout(() => {
        setCopyAnnouncement("");
      }, 2000);
    }
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return dealers;
    return dealers.filter((d) => {
      const hay = `${d.city} ${d.region ?? ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [dealers, query]);

  const effectiveSelectedId = useMemo(() => {
    if (filtered.some((d) => d.id === selectedId)) return selectedId;
    return filtered[0]?.id ?? "";
  }, [filtered, selectedId]);

  const headerTriggerRef = useRef<HTMLElement>(null);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);

  const setRevealRef =
    (index: number) => (el: HTMLElement | null) => {
      revealRefs.current[index] = el;
    };

  useGsapStaggeredLineReveal(
    headerTriggerRef,
    revealRefs,
    HEADER_REVEAL_LINES,
    [],
  );

  return (
    <section
      id="dealer-locator"
      aria-labelledby={`${baseId}-heading`}
      className="flex h-dvh min-h-0 w-full min-w-0 flex-col overflow-hidden bg-[color:var(--color-bg-light)] px-[length:var(--space-4)] py-[var(--space-16)] md:px-[length:var(--space-6)] md:py-[var(--space-20)] xl:px-[length:var(--page-margin-inline-desktop)] lg:py-[var(--space-20)]"
    >
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {copyAnnouncement}
      </p>
      <div className="mx-auto flex min-h-0 w-full max-w-[90rem] min-w-0 flex-1 flex-col overflow-hidden">
        <header
          ref={headerTriggerRef}
          className="mx-auto mb-[var(--space-10)] w-full min-w-0 max-w-none shrink-0 text-center md:mb-[var(--space-12)] md:max-w-3xl"
        >
          <h2
            id={`${baseId}-heading`}
            className="m-0 w-full min-w-0 font-heading text-[length:var(--text-exp-body-xl)] font-semibold leading-[var(--leading-heading)] tracking-[length:var(--tracking-heading)] text-[color:var(--color-text-primary-light)]"
          >
            <span className="block w-full min-w-0 overflow-hidden">
              <span
                ref={setRevealRef(0)}
                className="block w-full min-w-0"
                data-sf-reveal
              >
                {heading}
              </span>
            </span>
          </h2>
          <p className="mt-[var(--space-4)] w-full min-w-0 text-balance font-body text-[length:var(--text-body)] font-normal leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-text-secondary-light)]">
            <span className="block w-full min-w-0 overflow-hidden">
              <span
                ref={setRevealRef(1)}
                className="block w-full min-w-0"
                data-sf-reveal
              >
                {subheading}
              </span>
            </span>
          </p>
        </header>

        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col-reverse overflow-hidden border border-[color:var(--color-border-light)] bg-[color:var(--color-bg-white)] basis-0 lg:flex-row lg:items-stretch">
          <aside className="flex min-h-0 w-full min-w-0 flex-1 flex-col basis-0 bg-[color:var(--color-black)] lg:w-[min(32%,22rem)] lg:max-w-md lg:flex-none lg:basis-auto">
            <div className="border-b border-[color:var(--color-border-dark)] px-[length:var(--space-6)] py-[var(--space-6)]">
              <label htmlFor={`${baseId}-search`} className="sr-only">
                {searchPlaceholder}
              </label>
              <input
                id={`${baseId}-search`}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                autoComplete="off"
                className="w-full border-0 border-b border-[color:var(--color-text-muted)] bg-transparent pb-[var(--space-2)] font-heading text-[length:var(--text-label)] font-semibold uppercase tracking-[length:var(--tracking-body)] text-[color:var(--color-white)] placeholder:text-[color:var(--color-text-muted)] outline-none focus-visible:border-[color:var(--color-primary-default)]"
              />
            </div>

            <ul
              role="listbox"
              aria-label="Showroom locations"
              className="scrollbar-hide min-h-0 flex-1 overflow-y-auto px-[length:var(--space-5)] py-[var(--space-4)]"
            >
              {filtered.length === 0 ? (
                <li className="px-[length:var(--space-4)] py-[var(--space-3)] font-body text-[length:var(--text-body-xs)] text-[color:var(--color-text-secondary)]">
                  No locations match your search.
                </li>
              ) : (
                filtered.map((d) => {
                  const selected = d.id === effectiveSelectedId;
                  const copied = copiedDealerId === d.id;
                  return (
                    <li
                      key={d.id}
                      className="group/row flex list-none items-stretch border-b border-[color:var(--color-border-dark)] last:border-b-0"
                    >
                      <div
                        role="option"
                        aria-selected={selected}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setSelectedId(d.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedId(d.id);
                          }
                        }}
                        className={cn(
                          "min-w-0 flex-1 cursor-pointer px-[length:var(--space-4)] py-[var(--space-3)] text-left outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--color-primary-default)]",
                          selected
                            ? "bg-[color:rgba(255,255,255,0.12)]"
                            : "hover:bg-[color:rgba(255,255,255,0.06)]",
                        )}
                      >
                        <span className="block font-heading text-[length:var(--text-label)] font-semibold uppercase tracking-[length:var(--tracking-body)] text-[color:var(--color-white)]">
                          {d.city}
                        </span>
                        <span className="mt-[var(--space-1)] block break-all font-body text-[length:var(--text-body-xs)] font-normal text-[color:var(--color-text-secondary)]">
                          {d.phone}
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label={`Copy phone number ${d.phone}`}
                        title="Copy phone number"
                        className={cn(
                          "flex shrink-0 items-center justify-center border-l border-[color:var(--color-border-dark)] px-[length:var(--space-3)] text-[color:var(--color-text-secondary)] outline-none transition-[opacity,color,background-color] duration-200",
                          "hover:bg-[color:rgba(255,255,255,0.08)] hover:text-[color:var(--color-white)]",
                          "focus-visible:z-[1] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--color-primary-default)]",
                          "opacity-100 lg:opacity-0 lg:group-hover/row:opacity-100 lg:group-focus-within/row:opacity-100 lg:focus-visible:opacity-100 lg:active:opacity-100",
                          selected ? "bg-[color:rgba(255,255,255,0.12)]" : "",
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          void copyPhone(d.phone, d.id);
                        }}
                      >
                        {copied ? (
                          <Check
                            className="size-4"
                            strokeWidth={2}
                            aria-hidden
                          />
                        ) : (
                          <Copy className="size-4" strokeWidth={2} aria-hidden />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>

            <div className="border-t border-[color:var(--color-border-dark)] p-[length:var(--space-6)]">
              <Link
                href={cta.href}
                className="group flex w-full items-center justify-center gap-[var(--space-3)] bg-[color:var(--color-white)] px-[var(--space-4)] py-[var(--space-4)] font-heading text-[length:var(--text-label)] font-semibold uppercase tracking-[length:var(--tracking-body)] text-[color:var(--color-black)] transition-colors duration-200 hover:bg-[color:var(--color-primary-light)]"
              >
                <HoverRevealText className="whitespace-nowrap">
                  {cta.label}
                </HoverRevealText>
                <ArrowRight className="size-4 shrink-0" strokeWidth={2} aria-hidden />
              </Link>
            </div>
          </aside>

          {showMap ? (
            <div className="relative flex min-h-0 min-w-0 flex-1 basis-0 flex-col lg:min-h-0">
              <DealerLocatorMap
                dealers={filtered}
                selectedId={effectiveSelectedId}
              />
            </div>
          ) : null}
        </div>

        <p className="mx-auto mt-[var(--space-6)] w-full shrink-0 text-center font-body text-[length:var(--text-body-xs)] font-normal italic leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-text-secondary-light)]">
          {disclaimer}
        </p>
      </div>
    </section>
  );
}
