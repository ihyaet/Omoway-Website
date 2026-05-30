import gsap from "gsap";
import {
  useLayoutEffect,
  type DependencyList,
  type MutableRefObject,
  type RefObject,
} from "react";

export const GSAP_REVEAL_DELAY_MS = 200;
export const GSAP_LINE_STAGGER_MS = 90;
export const GSAP_REVEAL_DURATION = 1.5;
export const GSAP_REVEAL_EASE = "expo.out" as const;

/**
 * Viewport-triggered staggered line reveals (y 100% → 0), matching SmartFeatures / dealer header.
 */
export function useGsapStaggeredLineReveal(
  triggerRef: RefObject<HTMLElement | null>,
  revealRefs: MutableRefObject<(HTMLElement | null)[]>,
  lineCount: number,
  effectDeps: DependencyList = [],
): void {
  useLayoutEffect(() => {
    if (lineCount <= 0) return;

    const node = triggerRef.current;
    if (!node) return;

    const totalSlots = lineCount;
    const sequenceStartedRef = { current: false };
    const timeoutIdsRef: number[] = [];

    const clearTimeouts = () => {
      for (const tid of timeoutIdsRef) {
        window.clearTimeout(tid);
      }
      timeoutIdsRef.length = 0;
    };

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
        {
          y: 0,
          duration: GSAP_REVEAL_DURATION,
          ease: GSAP_REVEAL_EASE,
        },
      );
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resetTransformsVisible();
      return;
    }

    hideAll();

    const update = () => {
      const el = triggerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
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
        }, GSAP_REVEAL_DELAY_MS + slot * GSAP_LINE_STAGGER_MS);
        timeoutIdsRef.push(t);
      }
    };

    update();
    gsap.ticker.add(update);

    return () => {
      clearTimeouts();
      gsap.ticker.remove(update);
      const nodes = revealRefs.current;
      for (let i = 0; i < totalSlots; i++) {
        const el = nodes[i];
        if (el) gsap.killTweensOf(el);
      }
    };
    // Caller must list every value in effectDeps that should re-run this effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineCount, ...effectDeps]);
}
