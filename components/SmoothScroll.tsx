"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

gsap.registerPlugin(ScrollTrigger);

function fallbackScrollDocumentToY(y: number) {
  if (typeof window === "undefined") return;
  window.scrollTo(0, y);
  ScrollTrigger.update();
}

const LenisDocumentScrollContext = createContext<(y: number) => void>(
  fallbackScrollDocumentToY,
);

/** Programmatic scroll compatible with Lenis + ScrollTrigger scrollerProxy (not window.scrollTo alone). */
export function useLenisDocumentScroll() {
  return useContext(LenisDocumentScrollContext);
}

const LenisInstanceContext = createContext<Lenis | null>(null);

/** Lenis instance when smooth scroll is active; `null` when reduced motion or not yet mounted. */
export function useLenisInstance() {
  return useContext(LenisInstanceContext);
}

type Props = {
  children: ReactNode;
};

/**
 * Lenis wheel/trackpad smoothing + GSAP ScrollTrigger sync (official Lenis pattern).
 * Skipped when prefers-reduced-motion is enabled.
 */
export function SmoothScroll({ children }: Props) {
  const lenisRef = useRef<Lenis | null>(null);
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  const scrollDocumentToY = useCallback((y: number) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(y, { immediate: true });
    } else {
      window.scrollTo(0, y);
    }
    ScrollTrigger.update();
  }, []);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && value !== undefined) {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
    });

    const onRefresh = () => {
      lenis.resize();
    };
    ScrollTrigger.addEventListener("refresh", onRefresh);

    const tickerCb = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.removeEventListener("refresh", onRefresh);
      gsap.ticker.remove(tickerCb);
      ScrollTrigger.scrollerProxy(document.documentElement);
      lenisRef.current = null;
      setLenisInstance(null);
      lenis.destroy();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <LenisInstanceContext.Provider value={lenisInstance}>
      <LenisDocumentScrollContext.Provider value={scrollDocumentToY}>
        {children}
      </LenisDocumentScrollContext.Provider>
    </LenisInstanceContext.Provider>
  );
}
