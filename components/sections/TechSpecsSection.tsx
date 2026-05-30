"use client";

import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { HoverRevealText } from "@/components/ui/hover-reveal-text";
import { useLenisDocumentScroll } from "@/components/SmoothScroll";
import type { TechSpecsSectionProps } from "@/lib/tech-specs-section-types";

gsap.registerPlugin(ScrollTrigger);

/** Fixed runway height so progress travel exceeds the viewport. */
const SCROLL_RUNWAY_CLASS = "h-[240dvh] min-h-[240dvh] w-full shrink-0";

function parseStatValue(raw: string): { target: number; decimals: number } | null {
  const t = raw.trim().replace(/,/g, "");
  if (!/^-?\d*\.?\d+$/.test(t)) return null;
  const n = Number(t);
  if (!Number.isFinite(n)) return null;
  const decimals = t.includes(".") ? (t.split(".")[1]?.length ?? 0) : 0;
  return { target: n, decimals };
}

function formatStatDisplay(n: number, decimals: number): string {
  if (decimals > 0) return n.toFixed(decimals);
  return String(Math.round(n));
}

function initialStatDisplay(value: string): string {
  const p = parseStatValue(value);
  return p ? formatStatDisplay(0, p.decimals) : value;
}

function segmentLocalProgress(globalP: number, index: number, count: number): number {
  if (count <= 0) return 0;
  const start = index / count;
  const end = (index + 1) / count;
  if (globalP <= start) return 0;
  if (globalP >= end) return 1;
  return (globalP - start) / (end - start);
}

export function TechSpecsSection(props: TechSpecsSectionProps) {
  const { stats, cta } = props;
  const pathname = usePathname();
  const scrollDocumentToY = useLenisDocumentScroll();
  const scrollRootRef = useRef<HTMLDivElement>(null);
  const verticalFillRef = useRef<HTMLDivElement>(null);
  const horizontalFillRef = useRef<HTMLDivElement>(null);
  const statValueRefs = useRef<(HTMLHeadingElement | null)[]>([]);

  useLayoutEffect(() => {
    const resetScrollToTop = () => {
      scrollDocumentToY(0);
    };
    resetScrollToTop();
    queueMicrotask(() => {
      resetScrollToTop();
      ScrollTrigger.refresh();
    });

    const root = scrollRootRef.current;
    const vFill = verticalFillRef.current;
    const hFill = horizontalFillRef.current;
    if (!root || !vFill || !hFill) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const parsedStats = stats.map((s) => parseStatValue(s.value));

    if (reduceMotion.matches) {
      gsap.set(vFill, { scaleY: 1 });
      gsap.set(hFill, { scaleX: 1 });
      queueMicrotask(() => {
        stats.forEach((s, i) => {
          const el = statValueRefs.current[i];
          if (el) el.textContent = s.value;
        });
      });
      return;
    }

    const updateProgress = () => {
      const r = scrollRootRef.current;
      const vf = verticalFillRef.current;
      const hf = horizontalFillRef.current;
      if (!r || !vf || !hf) return;
      const rect = r.getBoundingClientRect();
      const vh = window.innerHeight;
      const runwayH = Math.max(r.offsetHeight, Math.round(rect.height));
      const travel = runwayH - vh;
      const progress =
        travel <= 0
          ? 0
          : gsap.utils.clamp(0, 1, -rect.top / Math.max(travel, 1));

      gsap.set(vf, {
        scaleY: progress,
        transformOrigin: "50% 0",
        force3D: true,
      });
      gsap.set(hf, {
        scaleX: progress,
        transformOrigin: "0 50%",
        force3D: true,
      });

      const n = stats.length;
      for (let i = 0; i < n; i++) {
        const el = statValueRefs.current[i];
        const parsed = parsedStats[i];
        if (!el) continue;
        if (!parsed) {
          el.textContent = stats[i].value;
          continue;
        }
        const t = segmentLocalProgress(progress, i, n);
        el.textContent = formatStatDisplay(t * parsed.target, parsed.decimals);
      }
    };

    gsap.ticker.add(updateProgress);
    updateProgress();

    const timeoutIds: number[] = [];
    const burstStRefresh = () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
      timeoutIds.length = 0;
      ScrollTrigger.refresh();
      queueMicrotask(() => ScrollTrigger.refresh());
      for (const ms of [0, 32, 96, 200] as const) {
        timeoutIds.push(window.setTimeout(() => ScrollTrigger.refresh(), ms));
      }
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(burstStRefresh);
    });

    const onLoad = () => {
      resetScrollToTop();
      burstStRefresh();
      updateProgress();
    };

    const onPageShow = () => {
      resetScrollToTop();
      burstStRefresh();
      updateProgress();
    };

    window.addEventListener("load", onLoad);
    window.addEventListener("pageshow", onPageShow);

    const ro =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            updateProgress();
          })
        : null;
    ro?.observe(root);

    const onResize = () => updateProgress();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("load", onLoad);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("resize", onResize);
      ro?.disconnect();
      timeoutIds.forEach((id) => window.clearTimeout(id));
      gsap.ticker.remove(updateProgress);
      gsap.set([vFill, hFill], { clearProps: "transform" });
    };
  }, [pathname, scrollDocumentToY, stats]);

  return (
    <section aria-labelledby="tech-specs-heading" className="relative w-full">
      <div ref={scrollRootRef} className={SCROLL_RUNWAY_CLASS}>
        <div className="sticky top-0 z-10 flex min-h-dvh w-full min-w-0 flex-col bg-[color:var(--color-black)] px-[length:var(--space-4)] py-0 md:px-[length:var(--space-6)] min-[1025px]:px-[120px]">
          <h2 id="tech-specs-heading" className="sr-only">
            OMO X technical specifications
          </h2>

          <div className="mx-auto flex min-h-0 w-full max-w-[90rem] min-w-0 flex-1 flex-col gap-[var(--space-12)] min-[1025px]:flex-row min-[1025px]:items-stretch min-[1025px]:gap-0">
            <div
              className="relative flex min-h-[min(40vh,20rem)] w-full min-w-0 flex-1 items-center justify-center bg-[url('/assets/techSpec.png')] bg-cover bg-center bg-no-repeat py-[length:var(--space-10)] text-[color:var(--color-white)] min-[1025px]:min-h-0 min-[1025px]:justify-start min-[1025px]:bg-contain min-[1025px]:pr-[var(--grid-gutter-desktop)]"
              aria-hidden
            />

            <div
              className="relative hidden w-[4px] shrink-0 self-stretch overflow-hidden rounded-full min-[1025px]:block"
              aria-hidden
            >
              <div
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.22)_100%)]"
                aria-hidden
              />
              <div
                ref={verticalFillRef}
                className="absolute left-0 top-0 h-full w-full bg-[color:var(--color-primary-default)]"
                aria-hidden
              />
            </div>

            <div
              className="relative h-1 w-full shrink-0 overflow-hidden rounded-full min-[1025px]:hidden"
              aria-hidden
            >
              <div
                className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.22)_0%,rgba(255,255,255,0.22)_100%)]"
                aria-hidden
              />
              <div
                ref={horizontalFillRef}
                className="absolute left-0 top-0 h-full w-full bg-[color:var(--color-primary-default)]"
                aria-hidden
              />
            </div>

            <div className="grid h-fit w-full min-h-0 min-w-0 shrink-0 grid-cols-2 items-start auto-rows-auto gap-[var(--space-6)] px-[length:var(--space-4)] md:px-[length:var(--space-6)] min-[1025px]:pl-[80px] min-[1025px]:pr-[48px] py-[var(--space-8)] sm:gap-[var(--space-8)] md:py-[var(--space-12)] md:gap-[var(--space-10)] min-[1025px]:flex min-[1025px]:h-dvh min-[1025px]:max-h-dvh min-[1025px]:w-fit min-[1025px]:max-w-full min-[1025px]:flex-none min-[1025px]:flex-col min-[1025px]:items-stretch min-[1025px]:justify-between min-[1025px]:gap-0 min-[1025px]:self-start min-[1025px]:py-[100px]">
              <div className="contents">
                {stats.map((s, statIdx) => (
                  <div key={s.id} className="h-fit min-h-0 min-w-0 w-full max-w-full shrink-0 min-[1025px]:h-fit">
                    <div
                      className="min-w-0 w-full max-w-full font-heading text-[length:var(--text-exp-label)] font-semibold uppercase tracking-[length:var(--tracking-body)] text-[color:var(--color-white)]"
                    >
                      {s.label}
                    </div>
                    <div className="mt-[var(--space-3)] min-w-0 w-full max-w-full">
                      <div className="flex min-w-0 w-full max-w-full flex-col items-start gap-[var(--space-2)]">
                        <h2
                          ref={(el) => {
                            statValueRefs.current[statIdx] = el;
                          }}
                          className="m-0 font-heading text-[length:var(--text-h2)] font-semibold leading-[var(--leading-heading)] tracking-[length:var(--tracking-heading)] text-[color:var(--color-white)] tabular-nums"
                        >
                          {initialStatDisplay(s.value)}
                        </h2>
                        <span className="min-w-0 w-full max-w-full font-body text-[length:var(--text-body)] font-normal leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-text-secondary)]">
                          {s.unit}
                        </span>
                      </div>
                      {s.sublabel ? (
                        <p
                          className="mt-[var(--space-2)] min-w-0 w-full max-w-full font-body text-[length:var(--text-body)] font-normal leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-text-secondary)]"
                        >
                          {s.sublabel}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
                <Button
                  nativeButton={false}
                  render={(buttonProps) => (
                    <Link {...buttonProps} href={cta.href}>
                      {buttonProps.children}
                    </Link>
                  )}
                  className="mt-0 flex h-fit w-fit max-w-full shrink-0 justify-self-start justify-start rounded-none border-0 border-b border-b-[color:var(--color-white)] bg-transparent px-0 py-0 pb-[var(--space-3)] font-heading text-[length:var(--text-exp-label)] font-semibold uppercase tracking-[length:var(--tracking-body)] text-[color:var(--color-white)] shadow-none ring-offset-[color:var(--color-black)] transition-colors duration-200 hover:bg-transparent hover:border-b-[color:var(--color-primary-default)] hover:text-[color:var(--color-primary-default)] active:translate-y-0 focus-visible:border-b-[color:var(--color-primary-default)] focus-visible:text-[color:var(--color-primary-default)] min-[1025px]:mt-[var(--space-12)] gap-[var(--space-3)] min-[1025px]:justify-self-auto"
                >
                  <HoverRevealText className="whitespace-nowrap">
                    {cta.label}
                  </HoverRevealText>
                  <ArrowRight
                    className="size-4 shrink-0"
                    strokeWidth={2}
                    aria-hidden
                  />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
