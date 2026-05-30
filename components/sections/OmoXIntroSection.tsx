"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

gsap.registerPlugin(ScrollTrigger);

const EYEBROW = "OMO X — 2026";

const COPY =
  "The Omo X isn't just electric, it's intelligent. Built with an AI core that learns your routes, monitors road conditions, and adapts in real time. Unlike conventional scooters, it continuously processes data from its sensor array to anticipate your needs before you even notice them. Whether it's rerouting around a sudden downpour, conserving battery on a long stretch ahead the Omo X isn't reacting. It's thinking.";

const EYEBROW_CLASS =
  "font-heading text-[length:var(--text-exp-label)] font-semibold uppercase tracking-[length:var(--tracking-body)] text-[color:var(--color-primary-dark)]";

/** Shared body typography (no margin — margin applied once on the stack) */
const BODY_BLOCK =
  "w-full font-body text-[length:var(--text-body-lg)] font-medium leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-black)] md:text-[length:var(--text-body-xl)] lg:text-[length:var(--text-body-xxl)] lg:tracking-[length:var(--tracking-body-xxl)]";

function wordsFromCopy(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function linesFromWordSpans(
  spans: HTMLElement[],
  words: string[],
): string[] | null {
  if (spans.length === 0 || spans.length !== words.length) return null;

  const groups: string[][] = [];
  let lastTop = Number.NEGATIVE_INFINITY;

  spans.forEach((span, idx) => {
    const top = span.offsetTop;
    if (groups.length === 0 || Math.abs(top - lastTop) > 0.5) {
      groups.push([]);
      lastTop = top;
    }
    groups[groups.length - 1]!.push(words[idx]!);
  });

  return groups.map((g) => g.join(" "));
}

export function OmoXIntroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const textColumnRef = useRef<HTMLDivElement>(null);
  const words = useMemo(() => wordsFromCopy(COPY), []);
  const [lines, setLines] = useState<string[] | null>(null);

  const applyLinesFromMeasure = useCallback(() => {
    const root = measureRef.current;
    if (!root) return;

    const spans = root.querySelectorAll<HTMLElement>("[data-line-word]");
    const next = linesFromWordSpans([...spans], words);
    if (!next || next.length === 0) return;

    setLines((prev) => {
      const same =
        prev !== null &&
        prev.length === next.length &&
        prev.every((l, i) => l === next[i]);
      return same ? prev : next;
    });
  }, [words]);

  useLayoutEffect(() => {
    applyLinesFromMeasure();
  }, [applyLinesFromMeasure]);

  useLayoutEffect(() => {
    const el = textColumnRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => {
      applyLinesFromMeasure();
      ScrollTrigger.refresh();
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [applyLinesFromMeasure]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section || !lines || lines.length === 0) return;

    const maskEls = section.querySelectorAll<HTMLElement>(
      "[data-omo-line-mask]",
    );
    if (maskEls.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      gsap.set(maskEls, {
        clipPath: "inset(0 0% 0 0)",
        WebkitClipPath: "inset(0 0% 0 0)",
      });
      return;
    }

    const pinScrollPx = Math.min(
      Math.round(
        window.innerHeight * (1.05 + Math.min(lines.length * 0.3, 3.85)),
      ),
      window.innerHeight * 5,
    );

    const ctx = gsap.context(() => {
      gsap.set(maskEls, {
        clipPath: "inset(0 100% 0 0)",
        WebkitClipPath: "inset(0 100% 0 0)",
        willChange: "clip-path",
      });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${pinScrollPx}`,
          pin: true,
          pinSpacing: true,
          scrub: 0.75,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      const lineSegDur = 0.38;
      const between = 0.02;
      let slot = 0;
      maskEls.forEach((mask) => {
        tl.fromTo(
          mask,
          {
            clipPath: "inset(0 100% 0 0)",
            WebkitClipPath: "inset(0 100% 0 0)",
          },
          {
            clipPath: "inset(0 0% 0 0)",
            WebkitClipPath: "inset(0 0% 0 0)",
            duration: lineSegDur,
          },
          slot,
        );
        slot += lineSegDur + between;
      });
    }, section);

    return () => ctx.revert();
  }, [lines]);

  const lineMaskStart = {
    clipPath: "inset(0 100% 0 0)",
    WebkitClipPath: "inset(0 100% 0 0)",
  } satisfies CSSProperties;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="omo-x-intro-eyebrow"
      className="box-border flex h-[100svh] min-h-[100svh] w-full flex-col overflow-hidden bg-[color:var(--color-white)] px-[length:var(--space-4)] py-[var(--space-10)] md:px-[length:var(--space-6)] md:py-[var(--space-16)] xl:px-[length:var(--page-margin-inline-desktop)] lg:py-[var(--space-24)]"
    >
      <div className="grid min-h-0 w-full min-w-0 flex-1 grid-rows-[minmax(0,1fr)_auto] gap-y-[var(--space-5)] md:gap-y-[var(--space-6)] lg:gap-y-[32px]">
        <div className="relative flex min-h-0 w-full min-w-0 flex-col items-center justify-center">
          <div className="flex h-full max-h-full min-h-0 w-[min(100%,17.5rem)] max-w-full justify-center max-sm:w-[min(100%,13.5rem)] sm:w-[min(100%,21rem)]">
            <img
              src="/assets/logo_outline_symbol.svg"
              alt=""
              width={352}
              height={281}
              decoding="async"
              className="h-auto max-h-full w-full object-contain opacity-95"
            />
          </div>
        </div>

        <div ref={textColumnRef} className="w-full min-w-0 shrink-0">
          <p id="omo-x-intro-eyebrow" className={EYEBROW_CLASS}>
            {EYEBROW}
          </p>

          <span className="sr-only">{COPY}</span>

          <div className="relative mt-[var(--space-4)] w-full md:mt-[var(--space-5)]">
            <div
              className="grid w-full min-w-0 [&>*]:col-start-1 [&>*]:row-start-1 [&>*]:col-end-2"
              aria-hidden="true"
            >
              {/* Same box + wrapping as final copy — used to detect visual lines */}
              <div
                ref={measureRef}
                className="invisible min-w-0 max-w-full [word-spacing:normal]"
              >
                <p className={`${BODY_BLOCK} [text-wrap:pretty]`}>
                  {words.map((w, i) => (
                    <span
                      key={`measure-${i}`}
                      data-line-word
                      className="inline"
                    >
                      {w}
                      {i < words.length - 1 ? " " : null}
                    </span>
                  ))}
                </p>
              </div>

              {!lines && (
                <p
                  className={`${BODY_BLOCK} relative z-10 [text-wrap:pretty] opacity-30`}
                >
                  {COPY}
                </p>
              )}

              {lines && (
                <div className="relative z-10 flex min-w-0 flex-col gap-0">
                  {lines.map((line, lineIdx) => (
                    <div
                      key={`line-${lineIdx}-${line.slice(0, 8)}`}
                      className="relative w-full min-w-0"
                    >
                      <p
                        className={`${BODY_BLOCK} [text-wrap:pretty] opacity-30`}
                      >
                        {line}
                      </p>
                      <div
                        className="pointer-events-none absolute inset-0 z-10"
                        data-omo-line-mask
                        style={lineMaskStart}
                      >
                        <p
                          className={`${BODY_BLOCK} [text-wrap:pretty] text-[color:var(--color-black)]`}
                        >
                          {line}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
