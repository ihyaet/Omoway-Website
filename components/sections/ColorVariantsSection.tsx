"use client";

import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useId, useLayoutEffect, useMemo, useRef, useState } from "react";

import { useGsapStaggeredLineReveal } from "@/hooks/useGsapStaggeredLineReveal";
import { HoverRevealText } from "@/components/ui/hover-reveal-text";
import type { ColorVariantsSectionProps } from "@/lib/color-variants-section-types";
import { colorVariantImageRevealEase } from "@/lib/damped-spring-ease";

export function ColorVariantsSection(props: ColorVariantsSectionProps) {
  const { eyebrow, variants } = props;
  const baseId = useId();

  /** Stable alphabetical order for tabs; lookups still use ids so labels stay tied to images. */
  const sortedVariants = useMemo(() => {
    return [...variants].sort((a, b) => {
      const cmp = a.label.localeCompare(b.label, undefined, {
        sensitivity: "base",
      });
      return cmp !== 0 ? cmp : a.id.localeCompare(b.id);
    });
  }, [variants]);

  const initialId = useMemo(() => {
    if (!sortedVariants.length) return "";
    return sortedVariants[0].id;
  }, [sortedVariants]);

  const [activeId, setActiveId] = useState(initialId);
  /** Last image committed to the base layer (stays visible under the incoming clip). */
  const [baseImageId, setBaseImageId] = useState(initialId);
  const active =
    sortedVariants.find((v) => v.id === activeId) ?? sortedVariants[0];
  const baseVariant =
    sortedVariants.find((v) => v.id === baseImageId) ?? sortedVariants[0];

  const tabListTriggerRef = useRef<HTMLDivElement>(null);
  const tabRevealRefs = useRef<(HTMLElement | null)[]>([]);
  const imagePanelRef = useRef<HTMLDivElement>(null);
  const baseImageLayerRef = useRef<HTMLDivElement>(null);
  const incomingLayerRef = useRef<HTMLDivElement>(null);
  const transitionGenRef = useRef(0);
  const activeIdRef = useRef(activeId);
  activeIdRef.current = activeId;

  const isImageTransitioning = activeId !== baseImageId;

  const setTabRevealRef =
    (index: number) => (el: HTMLElement | null) => {
      tabRevealRefs.current[index] = el;
    };

  useGsapStaggeredLineReveal(
    tabListTriggerRef,
    tabRevealRefs,
    variants.length,
    [variants.length],
  );

  useLayoutEffect(() => {
    if (typeof window === "undefined" || sortedVariants.length === 0) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      setBaseImageId(activeId);
      return;
    }

    if (!isImageTransitioning) return;

    const layer = incomingLayerRef.current;
    const baseLayer = baseImageLayerRef.current;
    const panel = imagePanelRef.current;
    if (!layer || !panel) return;

    transitionGenRef.current += 1;
    const gen = transitionGenRef.current;

    /** 300ms total; easing from spring curve (stiffness 320, damping 40, mass 1). */
    const tweenDuration = 1;
    const tweenEase = colorVariantImageRevealEase;
    /** Horizontal drift as xPercent of layer width; incoming settles at 0 on rest. */
    const drift = 10;

    const baseIndex = sortedVariants.findIndex((v) => v.id === baseImageId);
    const activeIndex = sortedVariants.findIndex((v) => v.id === activeId);
    const goingNext =
      baseIndex !== -1 &&
      activeIndex !== -1 &&
      activeIndex > baseIndex;

    const clipHidden = goingNext
      ? "inset(0% 0% 0% 100%)"
      : "inset(0% 100% 0% 0%)";
    const clipFull = "inset(0% 0% 0% 0%)";

    const baseXTo = goingNext ? -drift : drift;
    const incomingXFrom = goingNext ? -drift : drift;
    const incomingXTo = 0;

    const ctx = gsap.context(() => {
      gsap.killTweensOf(layer);
      if (baseLayer) gsap.killTweensOf(baseLayer);

      if (baseLayer) {
        gsap.fromTo(
          baseLayer,
          { xPercent: 0 },
          {
            xPercent: baseXTo,
            duration: tweenDuration,
            ease: tweenEase,
          },
        );
      }

      gsap.fromTo(
        layer,
        {
          scale: 1.7,
          xPercent: incomingXFrom,
          clipPath: clipHidden,
          transformOrigin: "50% 50%",
        },
        {
          scale: 1,
          xPercent: incomingXTo,
          clipPath: clipFull,
          duration: tweenDuration,
          ease: tweenEase,
          onComplete: () => {
            if (gen !== transitionGenRef.current) return;
            setBaseImageId(activeIdRef.current);
          },
        },
      );
    }, panel);

    return () => ctx.revert();
  }, [activeId, baseImageId, isImageTransitioning, sortedVariants]);

  if (!active) return null;

  return (
    <section
      aria-labelledby={`${baseId}-heading`}
      className="flex min-h-dvh w-full min-w-0 flex-col-reverse bg-[color:var(--color-bg-white)] min-[1025px]:grid min-[1025px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] min-[1025px]:grid-rows-1 min-[1025px]:items-stretch"
    >
      <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col justify-between px-[length:var(--space-4)] py-[var(--space-16)] md:px-[length:var(--space-6)] min-[1025px]:h-full min-[1025px]:min-h-0 min-[1025px]:flex-none xl:px-[length:var(--page-margin-inline-desktop)] min-[1025px]:py-[var(--space-20)]">
        <div>
          <h2 id={`${baseId}-heading`} className="sr-only">
            OMO X color finishes
          </h2>

          <p className="font-heading text-[length:clamp(var(--text-exp-label),calc(0.45vw+0.76rem),var(--text-exp-body-xs))] font-semibold uppercase leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-primary-dark)]">
            {eyebrow}
          </p>
        </div>

        <div
          ref={tabListTriggerRef}
          role="tablist"
          aria-label="OMO X color finishes"
          className="mt-[var(--space-8)] flex w-full min-w-0 shrink-0 flex-col md:mt-[var(--space-10)] min-[1025px]:mt-0"
        >
          {sortedVariants.map((variant, index) => {
            const selected = variant.id === active.id;
            return (
              <div
                key={variant.id}
                role="tab"
                id={`${baseId}-tab-${variant.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(variant.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setActiveId(variant.id);
                  }
                }}
                className={`cursor-pointer outline-none ring-offset-2 ring-offset-[color:var(--color-bg-white)] transition-[padding-left,border-width,border-color] duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-black)] motion-reduce:transition-none ${
                  selected
                    ? "border-b-2 border-[color:var(--color-black)] pl-[length:var(--space-4)] md:pl-[length:var(--space-6)]"
                    : "border-b border-[color:var(--color-border-light)] hover:[&_h4]:text-[color:var(--color-text-primary-light)]"
                }`}
              >
                <span className="block w-full overflow-hidden">
                  <span
                    ref={setTabRevealRef(index)}
                    className="block"
                    data-sf-reveal
                  >
                    <div className="group flex w-full min-w-0 items-center gap-[var(--space-3)] py-[var(--space-4)] text-left transition-colors duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] md:gap-[var(--space-4)] md:py-[var(--space-5)]">
                      <h4
                        className={`m-0 min-w-0 flex-1 [overflow-wrap:anywhere] font-heading text-[length:var(--text-exp-body-md)] font-semibold leading-[var(--leading-heading)] tracking-[length:var(--tracking-heading)] transition-colors duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] min-[1025px]:text-[length:clamp(1.25rem,3.125vw+0.375rem,var(--text-h4))] ${
                          selected
                            ? "text-[color:var(--color-black)]"
                            : "text-[color:var(--color-text-muted-light)]"
                        }`}
                      >
                        {selected ? (
                          variant.label
                        ) : (
                          <HoverRevealText className="min-w-0 max-w-full">
                            {variant.label}
                          </HoverRevealText>
                        )}
                      </h4>
                      {selected ? (
                        <ArrowRight
                          className="size-4 shrink-0 text-[color:var(--color-black)] md:size-5 motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:animate-none"
                          strokeWidth={2}
                          aria-hidden
                        />
                      ) : null}
                    </div>
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div
        ref={imagePanelRef}
        id={`${baseId}-panel`}
        role="tabpanel"
        aria-labelledby={`${baseId}-tab-${active.id}`}
        className="relative isolate min-h-[min(52svh,28rem)] w-full shrink-0 min-w-0 max-w-full overflow-hidden min-[1025px]:min-h-0 min-[1025px]:h-full"
      >
        {isImageTransitioning && baseVariant && active ? (
          <>
            <div className="static z-0 h-full w-full min-h-0">
              <div ref={baseImageLayerRef} className="relative h-full w-full">
                <Image
                  key={baseVariant.id}
                  src={baseVariant.image.src}
                  alt={baseVariant.image.alt}
                  width={3840}
                  height={2160}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-full w-full object-cover object-center"
                  priority={false}
                />
              </div>
            </div>

            <div
              className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
              aria-hidden
            >
              <div
                ref={incomingLayerRef}
                className="relative h-full w-full"
              >
                <Image
                  key={active.id}
                  src={active.image.src}
                  alt=""
                  width={3840}
                  height={2160}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="h-full w-full object-cover object-center"
                  priority={false}
                />
              </div>
            </div>
          </>
        ) : active ? (
          <div className="static z-0 h-full w-full min-h-0">
            <div className="relative h-full w-full">
              <Image
                key={active.id}
                src={active.image.src}
                alt={active.image.alt}
                width={3840}
                height={2160}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="h-full w-full object-cover object-center"
                priority={false}
              />
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
