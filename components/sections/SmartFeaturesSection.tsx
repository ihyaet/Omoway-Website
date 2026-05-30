"use client";

import gsap from "gsap";
import Image from "next/image";
import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";

import type { SmartFeaturesSectionProps } from "@/lib/smart-features-section-types";

const REVEAL_DELAY_MS = 200;
const LINE_STAGGER_MS = 90;
const REVEAL_DURATION = 1;
const REVEAL_EASE = "expo.out" as const;

const TAB_AUTO_ADVANCE_S = 10;

const LG_MEDIA = "(min-width: 1024px)";

/** Active tab description: slide up inside overflow clip (synced feel with headline reveal). */
const TAB_DESC_REVEAL_S = 1;
/** Soft deceleration — eases more gently into the rest position than expo.out */
const TAB_DESC_REVEAL_EASE = "power3.out" as const;

/** Backdrop: scale down from 110% + fade in when the active feature (image) changes */
const BG_APPEAR_S = 1;
const BG_APPEAR_EASE = "power2.out" as const;

export function SmartFeaturesSection(props: SmartFeaturesSectionProps) {
  const { headline, features, defaultFeatureId, image } = props;
  const baseId = useId();
  const headlineTriggerRef = useRef<HTMLHeadingElement>(null);
  const headlineRevealRefs = useRef<(HTMLElement | null)[]>([]);
  const headlineSequenceStartedRef = useRef(false);
  const headlineTimeoutIdsRef = useRef<number[]>([]);

  const headlineLineCount = Array.isArray(headline) ? 2 : 0;

  const setHeadlineRevealRef =
    (index: number) => (el: HTMLElement | null) => {
      headlineRevealRefs.current[index] = el;
    };

  useLayoutEffect(() => {
    if (headlineLineCount === 0) return;

    const h = headlineTriggerRef.current;
    if (!h) return;

    const totalSlots = headlineLineCount;

    const clearTimeouts = () => {
      for (const tid of headlineTimeoutIdsRef.current) {
        window.clearTimeout(tid);
      }
      headlineTimeoutIdsRef.current = [];
    };

    const resetTransformsVisible = () => {
      for (let i = 0; i < totalSlots; i++) {
        const el = headlineRevealRefs.current[i];
        if (el) {
          gsap.killTweensOf(el);
          el.style.transform = "";
        }
      }
    };

    const hideAll = () => {
      for (let i = 0; i < totalSlots; i++) {
        const el = headlineRevealRefs.current[i];
        if (el) {
          gsap.killTweensOf(el);
          gsap.set(el, { y: "100%" });
        }
      }
    };

    const animateSlot = (slotIndex: number) => {
      const el = headlineRevealRefs.current[slotIndex];
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
      const node = headlineTriggerRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const vh = window.innerHeight;
      const inRange = rect.bottom > 0 && rect.top < vh;

      if (!inRange || headlineSequenceStartedRef.current) {
        return;
      }

      headlineSequenceStartedRef.current = true;
      hideAll();

      for (let s = 0; s < totalSlots; s++) {
        const slot = s;
        const t = window.setTimeout(() => {
          animateSlot(slot);
        }, REVEAL_DELAY_MS + slot * LINE_STAGGER_MS);
        headlineTimeoutIdsRef.current.push(t);
      }
    };

    update();
    gsap.ticker.add(update);

    return () => {
      clearTimeouts();
      headlineSequenceStartedRef.current = false;
      gsap.ticker.remove(update);
      // eslint-disable-next-line react-hooks/exhaustive-deps -- read .current once at teardown
      const nodes = headlineRevealRefs.current;
      for (let i = 0; i < totalSlots; i++) {
        const el = nodes[i];
        if (el) gsap.killTweensOf(el);
      }
    };
  }, [headlineLineCount]);

  const initialId = useMemo(() => {
    if (!features.length) return "";
    if (defaultFeatureId && features.some((f) => f.id === defaultFeatureId)) {
      return defaultFeatureId;
    }
    return features[0].id;
  }, [features, defaultFeatureId]);

  const [activeId, setActiveId] = useState(initialId);
  const active = features.find((f) => f.id === activeId) ?? features[0];

  const desktopProgressBarRef = useRef<HTMLDivElement>(null);
  const mobileProgressBarRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef(features);
  featuresRef.current = features;

  const featureIdsKey = useMemo(
    () => features.map((f) => f.id).join("\0"),
    [features],
  );

  const tabDescriptionRevealRef = useRef<HTMLSpanElement>(null);
  const tabDescriptionRevealRefMobile = useRef<HTMLSpanElement>(null);

  const bgImageRevealRef = useRef<HTMLDivElement>(null);

  const [lgUp, setLgUp] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    const mq = window.matchMedia(LG_MEDIA);
    const sync = () => setLgUp(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (lgUp === null) return;
    const revealEl = lgUp
      ? tabDescriptionRevealRef.current
      : tabDescriptionRevealRefMobile.current;
    if (!revealEl || !activeId) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.killTweensOf(revealEl);
      revealEl.style.transform = "";
      return;
    }

    gsap.killTweensOf(revealEl);
    gsap.fromTo(
      revealEl,
      { y: "100%" },
      {
        y: 0,
        duration: TAB_DESC_REVEAL_S,
        ease: TAB_DESC_REVEAL_EASE,
      },
    );

    return () => {
      gsap.killTweensOf(revealEl);
    };
  }, [activeId, lgUp]);

  useLayoutEffect(() => {
    const el = bgImageRevealRef.current;
    if (!el || !activeId) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.killTweensOf(el);
      gsap.set(el, { clearProps: "opacity,scale" });
      return;
    }

    gsap.killTweensOf(el);
    gsap.fromTo(
      el,
      { scale: 1.1, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: BG_APPEAR_S,
        ease: BG_APPEAR_EASE,
        transformOrigin: "50% 50%",
      },
    );

    return () => {
      gsap.killTweensOf(el);
    };
  }, [activeId]);

  useLayoutEffect(() => {
    if (lgUp === null) return;
    const list = featuresRef.current;
    if (list.length <= 1) return;

    const el = lgUp ? desktopProgressBarRef.current : mobileProgressBarRef.current;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const fromId = activeId;

    const goNext = () => {
      const cur = featuresRef.current;
      const idx = cur.findIndex((f) => f.id === fromId);
      if (idx === -1) return;
      const next = cur[(idx + 1) % cur.length];
      setActiveId(next.id);
    };

    if (reduceMotion) {
      const timeoutId = window.setTimeout(goNext, TAB_AUTO_ADVANCE_S * 1000);
      return () => window.clearTimeout(timeoutId);
    }

    if (!el) {
      const timeoutId = window.setTimeout(goNext, TAB_AUTO_ADVANCE_S * 1000);
      return () => window.clearTimeout(timeoutId);
    }

    gsap.killTweensOf(el);
    gsap.set(el, { scaleX: 0, transformOrigin: "0% 50%" });
    const tween = gsap.to(el, {
      scaleX: 1,
      duration: TAB_AUTO_ADVANCE_S,
      ease: "none",
      onComplete: goNext,
    });

    return () => {
      tween.kill();
    };
  }, [activeId, featureIdsKey, lgUp]);

  if (!active) return null;

  const activeBackdrop = active.image ?? image;

  return (
    <section
      aria-labelledby={`${baseId}-heading`}
      className="relative isolate min-h-dvh w-full min-w-0 overflow-hidden bg-[color:var(--color-black)]"
    >
      <div
        ref={bgImageRevealRef}
        className="absolute inset-0 overflow-hidden will-change-[transform,opacity]"
      >
        <Image
          src={activeBackdrop.src}
          alt={activeBackdrop.alt}
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority={false}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(16,16,16,0.55)_0%,rgba(16,16,16,0.15)_38%,rgba(16,16,16,0.45)_100%)]"
        aria-hidden
      />

      <div className="relative z-10 flex min-h-dvh w-full min-w-0 flex-col px-[length:var(--space-4)] pb-[80px] pt-[var(--space-16)] md:px-[length:var(--space-6)] md:pt-[var(--space-20)] xl:px-[length:var(--page-margin-inline-desktop)] lg:pt-[length:var(--space-20)]">
        <h2
          ref={headlineLineCount ? headlineTriggerRef : undefined}
          id={`${baseId}-heading`}
          className="max-w-[min(100%,calc(52rem*1.2))] text-balance font-heading text-[length:44px] font-semibold leading-[1.08] tracking-[length:var(--tracking-heading)] text-[color:var(--color-white)] lg:text-[clamp(2rem,4vw+1rem,4rem)]"
        >
          {Array.isArray(headline) ? (
            <>
              <span className="block overflow-hidden">
                <span
                  ref={setHeadlineRevealRef(0)}
                  className="block"
                  data-sf-reveal
                >
                  {headline[0]}
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  ref={setHeadlineRevealRef(1)}
                  className="block"
                  data-sf-reveal
                >
                  {headline[1]}
                </span>
              </span>
            </>
          ) : (
            headline
          )}
        </h2>

        <div className="flex min-h-0 flex-1 flex-col justify-end">
          <div className="mt-[var(--space-16)] min-w-0 lg:mt-[var(--space-20)]">
            {/* Mobile: stacked hero copy + shared segmented progress (mockup). */}
            <div
              className="flex w-full min-w-0 flex-col lg:hidden"
              aria-hidden={lgUp === true ? true : undefined}
            >
              <div className="flex flex-col gap-0 pb-[12px]">
                <div className="flex min-w-0 flex-col gap-[12px] text-left">
                  <p className="m-0 font-heading text-[length:32px] font-semibold tabular-nums leading-none tracking-[length:var(--tracking-heading)] text-[color:var(--color-white)]">
                    {active.index}
                  </p>
                  <p className="m-0 font-heading text-[length:var(--text-exp-body-xs)] uppercase leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-white)] [font-weight:var(--font-weight-heading)]">
                    {active.title}
                  </p>

                  <div
                    id={`${baseId}-panel-mobile`}
                    role="tabpanel"
                    aria-labelledby={`${baseId}-mobile-tab-${active.id}`}
                    className="min-w-0"
                  >
                    <p className="m-0 overflow-hidden font-body text-[length:var(--text-body)] font-normal leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-text-secondary)]">
                      <span
                        ref={tabDescriptionRevealRefMobile}
                        className="block"
                        data-sf-tab-desc-reveal
                      >
                        {active.description}
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  role="tablist"
                  aria-label="OMO X smart features"
                  className="mt-[var(--space-6)] flex h-fit w-full gap-2"
                >
                  {features.map((feature) => {
                    const selected = feature.id === active.id;
                    return (
                      <button
                        key={feature.id}
                        type="button"
                        role="tab"
                        id={`${baseId}-mobile-tab-${feature.id}`}
                        aria-selected={selected}
                        aria-controls={`${baseId}-panel-mobile`}
                        tabIndex={selected ? 0 : -1}
                        onClick={() => setActiveId(feature.id)}
                        className="flex h-[24px] min-h-[24px] min-w-0 flex-1 flex-col justify-end border-0 bg-transparent p-0 pb-px text-left outline-none ring-offset-2 ring-offset-[color:var(--color-black)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-white)]"
                      >
                        <span className="sr-only">
                          {feature.index} {feature.title}
                        </span>
                        <span
                          className="block h-1 w-full overflow-hidden rounded-none bg-[rgba(255,255,255,0.25)]"
                          aria-hidden
                        >
                          {selected && features.length <= 1 ? (
                            <span className="block h-full w-full bg-[color:var(--color-white)]" />
                          ) : null}
                          {selected && features.length > 1 ? (
                            <span
                              ref={mobileProgressBarRef}
                              className="block h-full w-full origin-left bg-[color:var(--color-white)] will-change-transform"
                            />
                          ) : null}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Desktop: horizontal feature columns */}
            <div
              role="tablist"
              aria-label="OMO X smart features"
              className="hidden min-w-0 lg:flex lg:w-full lg:flex-row lg:items-end lg:justify-start lg:gap-y-0"
              aria-hidden={lgUp === false ? true : undefined}
            >
              {features.map((feature) => {
                const selected = feature.id === active.id;
                return (
                  <div
                    key={feature.id}
                    role="presentation"
                    className={`flex w-full flex-col gap-[var(--space-3)] px-[length:var(--space-3)] transition-[width,flex-grow,flex-shrink] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] lg:min-w-0 ${
                      selected
                        ? "border-b-0 lg:w-[35%] lg:max-w-[35%] lg:shrink-0 lg:grow-0"
                        : "border-b border-solid border-white/20 lg:flex-1"
                    }`}
                  >
                    <button
                      type="button"
                      role="tab"
                      id={`${baseId}-tab-${feature.id}`}
                      aria-selected={selected}
                      aria-controls={`${baseId}-panel-${feature.id}`}
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActiveId(feature.id)}
                      className="flex w-fit max-w-full cursor-pointer flex-col items-start border-0 bg-transparent p-0 text-left outline-none ring-offset-2 ring-offset-[color:var(--color-black)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-white)]"
                    >
                      <span className="font-heading text-[length:var(--text-exp-label)] font-semibold tabular-nums tracking-[length:var(--tracking-body)] text-[color:var(--color-white)]">
                        {feature.index}
                      </span>
                      <span className="mt-[var(--space-2)] font-heading text-[length:var(--text-exp-body-xs)] uppercase leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-white)] [font-weight:var(--font-weight-heading)]">
                        {feature.title}
                      </span>
                    </button>

                    <div
                      id={`${baseId}-panel-${feature.id}`}
                      role="tabpanel"
                      aria-labelledby={`${baseId}-tab-${feature.id}`}
                      hidden={!selected}
                      className="min-w-0 overflow-hidden"
                    >
                      <p className="m-0 overflow-hidden font-body text-[length:var(--text-body)] font-normal leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-text-secondary)]">
                        <span
                          ref={
                            selected ? tabDescriptionRevealRef : undefined
                          }
                          className="block"
                          data-sf-tab-desc-reveal
                        >
                          {feature.description}
                        </span>
                      </p>
                    </div>

                    <div
                      className={`h-1 w-full shrink-0 overflow-hidden ${
                        selected
                          ? "bg-[rgba(255,255,255,0.2)]"
                          : "bg-transparent"
                      }`}
                      aria-hidden
                    >
                      {selected ? (
                        features.length <= 1 ? (
                          <div className="h-full w-full bg-[color:var(--color-white)]" />
                        ) : (
                          <div
                            ref={desktopProgressBarRef}
                            className="h-full w-full origin-left bg-[color:var(--color-white)] will-change-transform"
                          />
                        )
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
