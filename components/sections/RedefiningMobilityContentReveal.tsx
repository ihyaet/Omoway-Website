"use client";

import gsap from "gsap";
import { useLayoutEffect, useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const REVEAL_DELAY_MS = 200;
const LINE_STAGGER_MS = 90;

const REVEAL_DURATION = 1;
const REVEAL_EASE = "expo.out" as const;

type Props = {
  id: string;
  lines: readonly (readonly string[])[];
  headlineClassName?: string;
  bodyWrapClassName: string;
  bodyText: string;
  bodyClassName: string;
  cta: ReactNode;
  ctaWrapClassName: string;
};

/**
 * Viewport overlap on the heading (rect.bottom > 0 && rect.top < innerHeight).
 * Hero-style reveal: overflow-hidden + inner block slides from y:100% → 0 (expo.out, 1s).
 * Stagger: 200ms base + 90ms per slot (head lines, then body, then CTA).
 * Once the sequence has been started, leaving the viewport does not reset or replay.
 */
export function RedefiningMobilityContentReveal({
  id,
  lines,
  headlineClassName,
  bodyWrapClassName,
  bodyText,
  bodyClassName,
  cta,
  ctaWrapClassName,
}: Props) {
  const triggerRef = useRef<HTMLHeadingElement>(null);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  const sequenceStartedRef = useRef(false);
  const timeoutIdsRef = useRef<number[]>([]);

  const lineCount = lines.length;

  const setRevealRef = (index: number) => (el: HTMLElement | null) => {
    revealRefs.current[index] = el;
  };

  useLayoutEffect(() => {
    const h = triggerRef.current;
    if (!h) return;

    const clearTimeouts = () => {
      for (const tid of timeoutIdsRef.current) {
        window.clearTimeout(tid);
      }
      timeoutIdsRef.current = [];
    };

    const totalSlots = lines.length + 2;

    const resetTransformsVisible = () => {
      for (let i = 0; i < totalSlots; i++) {
        const el = revealRefs.current[i];
        if (el) {
          gsap.killTweensOf(el);
          el.style.transform = "";
        }
      }
    };

    const hideAll = () => {
      for (let i = 0; i < totalSlots; i++) {
        const el = revealRefs.current[i];
        if (el) {
          gsap.killTweensOf(el);
          gsap.set(el, { y: "100%" });
        }
      }
    };

    const animateSlot = (slotIndex: number) => {
      const el = revealRefs.current[slotIndex];
      if (!el) return;
      gsap.killTweensOf(el);
      gsap.fromTo(
        el,
        { y: "100%" },
        { y: 0, duration: REVEAL_DURATION, ease: REVEAL_EASE },
      );
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resetTransformsVisible();
      return;
    }

    hideAll();

    const update = () => {
      const node = triggerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const inRange = rect.bottom > 0 && rect.top < vh;

      if (!inRange || sequenceStartedRef.current) {
        return;
      }

      sequenceStartedRef.current = true;
      hideAll();

      for (let s = 0; s < totalSlots; s++) {
        const slot = s;
        const t = window.setTimeout(() => {
          animateSlot(slot);
        }, REVEAL_DELAY_MS + slot * LINE_STAGGER_MS);
        timeoutIdsRef.current.push(t);
      }
    };

    update();
    gsap.ticker.add(update);

    return () => {
      clearTimeouts();
      sequenceStartedRef.current = false;
      gsap.ticker.remove(update);
      // Latest nodes at unmount; ref bag is stable.
      // eslint-disable-next-line react-hooks/exhaustive-deps -- read .current once at teardown to kill tweens
      const nodes = revealRefs.current;
      for (let i = 0; i < totalSlots; i++) {
        const el = nodes[i];
        if (el) gsap.killTweensOf(el);
      }
    };
  }, [lines.length]);

  return (
    <>
      <h2 ref={triggerRef} id={id} className={headlineClassName}>
        {lines.map((line, lineIdx) => (
          <span key={`h-line-${lineIdx}`} className="block overflow-hidden">
            <span
              ref={setRevealRef(lineIdx)}
              className="block"
              data-rm-reveal
            >
              <span className="inline-flex flex-wrap items-baseline gap-x-[0.28em]">
                {line.map((word, i) => (
                  <span key={`h-${lineIdx}-${i}`}>{word}</span>
                ))}
              </span>
            </span>
          </span>
        ))}
      </h2>

      <div className={cn(bodyWrapClassName, "overflow-hidden")}>
        <p ref={setRevealRef(lineCount)} className={bodyClassName} data-rm-reveal>
          {bodyText}
        </p>
      </div>

      <div className={cn(ctaWrapClassName, "overflow-hidden")}>
        <div
          ref={setRevealRef(lineCount + 1)}
          className="block w-fit max-w-full"
          data-rm-reveal
        >
          {cta}
        </div>
      </div>
    </>
  );
}
