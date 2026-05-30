"use client";

import gsap from "gsap";
import Image from "next/image";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

const REVEAL_DELAY_MS = 200;
const LINE_STAGGER_MS = 90;

const REVEAL_DURATION = 1;
const REVEAL_EASE = "expo.out" as const;

const IMAGE_CLIP_REVEAL_DURATION = 0.95;
/** Separate from copy stagger easing — symmetrical in/out for synced clip wipes */
const IMAGE_CLIP_REVEAL_EASE = "power3.inOut" as const;

const CLIP_HIDDEN_TOP = "inset(100% 0% 0% 0%)";
/** Outgoing fades by clipping from bottom up (matched to incoming reveal direction) */
const CLIP_HIDDEN_BOTTOM = "inset(0% 0% 100% 0%)";
const CLIP_FULL = "inset(0% 0% 0% 0%)";

const COPY_SLOT_COUNT = 2;

const LABEL_TYPOGRAPHY =
  "w-max max-w-none whitespace-nowrap text-center font-heading font-semibold uppercase leading-none tracking-[length:var(--tracking-heading)] text-black/10 text-[clamp(1.5rem,9.2cqw,83px)] max-[1024px]:text-[clamp(1.95rem,12cqw,108px)] sm:text-[clamp(1.6rem,10cqw,99px)] max-[1024px]:sm:text-[clamp(2.08rem,13cqw,129px)] md:text-[clamp(1.7rem,11.2cqw,134px)] max-[1024px]:md:text-[clamp(2.21rem,14.56cqw,174px)] lg:text-[clamp(2rem,14cqw,176px)] max-[1024px]:lg:text-[clamp(2.6rem,18.2cqw,229px)] xl:text-[clamp(2.2rem,16cqw,208px)] min-[1440px]:max-[1599px]:text-[clamp(1.694rem,12.32cqw,160px)] min-[1600px]:text-[clamp(2.42rem,17.6cqw,229px)]";

type Feature = { id: string; label: string };

type Props = {
  modeId: string;
  description: string;
  features: Feature[];
  backgroundLabel: string;
  image: { src: string; alt: string } | null;
  copyRowClassName?: string;
  visualClassName?: string;
};

/**
 * Staggered Y reveal (same pattern as RedefiningMobilityContentReveal): overflow-hidden +
 * inner block y:100% → 0. Copy row plus one masked line for the typographic backdrop label.
 */
export function ProductModesStaggerReveal({
  modeId,
  description,
  features,
  backgroundLabel,
  image,
  copyRowClassName,
  visualClassName,
}: Props) {
  const triggerRef = useRef<HTMLDivElement>(null);
  const revealRefs = useRef<(HTMLElement | null)[]>([]);
  /** Underlying mode snapshot during image crossfade — completes when clips finish */
  const [committed, setCommitted] = useState<{
    modeId: string;
    image: { src: string; alt: string };
    backdropLabel: string;
  } | null>(() =>
    image
      ? {
          modeId,
          image,
          backdropLabel: backgroundLabel.trim(),
        }
      : null,
  );
  const incomingClipRef = useRef<HTMLDivElement>(null);
  const outgoingClipRef = useRef<HTMLDivElement>(null);
  const backdropOutgoingRef = useRef<HTMLDivElement>(null);
  const backdropIncomingRef = useRef<HTMLDivElement>(null);
  const clipTransitionGenRef = useRef(0);
  const sequenceStartedRef = useRef(false);
  const timeoutIdsRef = useRef<number[]>([]);

  const featureKey = useMemo(
    () => features.map((f) => f.id).join("|"),
    [features],
  );

  const isModeTransitioning = Boolean(
    image && committed && committed.modeId !== modeId,
  );

  const imageFillClass =
    "pointer-events-none object-contain object-bottom max-[1024px]:origin-bottom max-[1024px]:scale-150";
  const imageSizes =
    "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, min(90rem, 100vw)";

  const setRevealRef = (index: number) => (el: HTMLElement | null) => {
    revealRefs.current[index] = el;
  };

  useLayoutEffect(() => {
    const h = triggerRef.current;
    if (!h) return;

    const trimmedLabel = backgroundLabel.trim();
    const backdropSlotCount = trimmedLabel.length > 0 ? 1 : 0;
    const totalSlots = COPY_SLOT_COUNT + backdropSlotCount;

    const clearTimeouts = () => {
      for (const tid of timeoutIdsRef.current) {
        window.clearTimeout(tid);
      }
      timeoutIdsRef.current = [];
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
        { y: 0, duration: REVEAL_DURATION, ease: REVEAL_EASE },
      );
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      resetTransformsVisible();
      return;
    }

    sequenceStartedRef.current = false;
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
      // eslint-disable-next-line react-hooks/exhaustive-deps -- read .current once at teardown
      const nodes = revealRefs.current;
      for (let i = 0; i < totalSlots; i++) {
        const el = nodes[i];
        if (el) gsap.killTweensOf(el);
      }
    };
  }, [modeId, description, featureKey, backgroundLabel]);

  useLayoutEffect(() => {
    if (!image?.src) {
      setCommitted(null);
      return;
    }

    if (!committed) {
      setCommitted({
        modeId,
        image,
        backdropLabel: backgroundLabel.trim(),
      });
      return;
    }

    if (committed.modeId === modeId) {
      const nextLabel = backgroundLabel.trim();
      if (
        committed.image.src !== image.src ||
        committed.image.alt !== image.alt ||
        committed.backdropLabel !== nextLabel
      ) {
        setCommitted({
          modeId,
          image,
          backdropLabel: nextLabel,
        });
      }
      return;
    }

    const incoming = incomingClipRef.current;
    const outgoing = outgoingClipRef.current;
    const bdOut = backdropOutgoingRef.current;
    const bdIn = backdropIncomingRef.current;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !incoming || !outgoing) {
      setCommitted({
        modeId,
        image,
        backdropLabel: backgroundLabel.trim(),
      });
      return;
    }

    clipTransitionGenRef.current += 1;
    const gen = clipTransitionGenRef.current;

    const clipTargets = [incoming, outgoing];
    const hasBackdropSwap = !!(bdOut && bdIn);

    gsap.killTweensOf(clipTargets.concat(hasBackdropSwap ? [bdOut!, bdIn!] : []));

    const tl = gsap.timeline({
      onComplete: () => {
        if (gen !== clipTransitionGenRef.current) return;
        setCommitted({
          modeId,
          image,
          backdropLabel: backgroundLabel.trim(),
        });
      },
    });
    tl.fromTo(
      outgoing,
      { clipPath: CLIP_FULL },
      {
        clipPath: CLIP_HIDDEN_BOTTOM,
        duration: IMAGE_CLIP_REVEAL_DURATION,
        ease: IMAGE_CLIP_REVEAL_EASE,
      },
      0,
    ).fromTo(
      incoming,
      { clipPath: CLIP_HIDDEN_TOP },
      {
        clipPath: CLIP_FULL,
        duration: IMAGE_CLIP_REVEAL_DURATION,
        ease: IMAGE_CLIP_REVEAL_EASE,
      },
      0,
    );

    if (hasBackdropSwap && bdOut && bdIn) {
      gsap.set(bdOut, { yPercent: 0 });
      gsap.set(bdIn, { yPercent: 100 });

      tl.fromTo(
        bdOut,
        { yPercent: 0 },
        {
          yPercent: -100,
          duration: IMAGE_CLIP_REVEAL_DURATION,
          ease: IMAGE_CLIP_REVEAL_EASE,
        },
        0,
      ).fromTo(
        bdIn,
        { yPercent: 100 },
        {
          yPercent: 0,
          duration: IMAGE_CLIP_REVEAL_DURATION,
          ease: IMAGE_CLIP_REVEAL_EASE,
        },
        0,
      );
    }

    return () => {
      tl.kill();
      gsap.killTweensOf(clipTargets.concat(hasBackdropSwap ? [bdOut!, bdIn!] : []));
    };
  }, [committed, modeId, image?.src, image?.alt, backgroundLabel]);

  const backdropTrimmed = backgroundLabel.trim();

  return (
    <div
      ref={triggerRef}
      className="flex w-full min-h-[min(72dvh,48rem)] flex-1 flex-col gap-[32px] overflow-visible lg:gap-[44px]"
    >
      <div
        className={cn(
          "flex w-full max-w-full min-w-0 shrink-0 flex-col gap-[var(--space-3)] lg:flex-row lg:items-start lg:justify-between xl:gap-[var(--space-6)]",
          copyRowClassName,
        )}
      >
        <div className="w-full min-w-0 overflow-hidden lg:w-auto lg:max-w-[min(100%,40rem)]">
          <p
            ref={setRevealRef(0)}
            className="w-full font-body text-[length:var(--text-body)] font-medium leading-[var(--leading-body)] tracking-[length:var(--tracking-body)] text-[color:var(--color-text-primary-light)]"
            data-pm-reveal
          >
            {description}
          </p>
        </div>

        <div className="w-full min-w-0 overflow-hidden lg:w-max lg:max-w-full lg:shrink-0">
          <div
            ref={setRevealRef(1)}
            className="flex w-full min-w-0 flex-wrap gap-[12px] lg:grid lg:grid-flow-col lg:grid-rows-[repeat(2,auto)] lg:auto-rows-min lg:justify-items-start lg:gap-[12px]"
            data-pm-reveal
          >
            {features.map((f) => (
              <span
                key={f.id}
                className="inline-flex h-fit w-fit shrink-0 bg-[color:var(--color-white)] px-[length:var(--space-3)] py-[length:0.375rem] font-body text-[length:var(--text-body-xs)] font-medium leading-none tracking-[length:var(--tracking-body)] text-[color:var(--color-text-primary-light)]"
              >
                {f.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={cn("@container relative mx-auto min-h-[min(38vh,360px)] w-full max-w-full min-w-0 flex-1 basis-0 overflow-visible bg-[color:var(--color-bg-light)] sm:min-h-[min(40vh,408px)] md:min-h-[min(42vh,448px)] xl:min-h-[min(44vh,496px)]", visualClassName)}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-start items-center overflow-hidden relative"
        >
          {isModeTransitioning && committed ? (
            committed.backdropLabel || backdropTrimmed ? (
              <div className="flex w-full flex-col justify-start items-center pt-[30%] min-[1025px]:pt-0">
                <div className="relative mx-auto w-max max-w-full overflow-hidden px-1">
                  <span
                    className={cn(
                      LABEL_TYPOGRAPHY,
                      "invisible block whitespace-nowrap",
                    )}
                    aria-hidden
                  >
                    {backdropTrimmed.length >= committed.backdropLabel.length
                      ? backdropTrimmed || "\u00a0"
                      : committed.backdropLabel || "\u00a0"}
                  </span>
                  <div
                    ref={backdropOutgoingRef}
                    className="absolute inset-0 flex items-center justify-center will-change-transform"
                  >
                    <span
                      className={cn(LABEL_TYPOGRAPHY, "block text-center")}
                    >
                      {committed.backdropLabel || "\u00a0"}
                    </span>
                  </div>
                  <div
                    ref={backdropIncomingRef}
                    className="absolute inset-0 flex items-center justify-center will-change-transform"
                  >
                    <span
                      className={cn(LABEL_TYPOGRAPHY, "block text-center")}
                    >
                      {backdropTrimmed || "\u00a0"}
                    </span>
                  </div>
                </div>
              </div>
            ) : null
          ) : backdropTrimmed ? (
            <div className="flex w-full flex-col justify-start items-center pt-[30%] min-[1025px]:pt-0">
              <span className="block overflow-hidden">
                <span
                  ref={setRevealRef(COPY_SLOT_COUNT)}
                  className={cn(LABEL_TYPOGRAPHY, "block")}
                  data-pm-reveal
                >
                  {backdropTrimmed}
                </span>
              </span>
            </div>
          ) : null}
        </div>

          <div className="absolute inset-0 z-[1]">
            {image ? (
              isModeTransitioning && committed ? (
                <>
                  <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                    <div
                      ref={outgoingClipRef}
                      className="absolute inset-0 will-change-[clip-path]"
                    >
                      <div className="relative h-full w-full">
                        <Image
                          key={committed.modeId}
                          src={committed.image.src}
                          alt={committed.image.alt}
                          fill
                          sizes={imageSizes}
                          className={imageFillClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div
                    className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
                    aria-hidden
                  >
                    <div
                      ref={incomingClipRef}
                      className="absolute inset-0 will-change-[clip-path]"
                    >
                      <Image
                        key={modeId}
                        src={image.src}
                        alt=""
                        fill
                        sizes={imageSizes}
                        className={imageFillClass}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative h-full w-full">
                  <Image
                    key={modeId}
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes={imageSizes}
                    className={imageFillClass}
                  />
                </div>
              )
            ) : (
              <div
                aria-hidden
                className="absolute inset-0 z-0 bg-[color:var(--color-primary-light)]"
              />
            )}
          </div>
      </div>
    </div>
  );
}
