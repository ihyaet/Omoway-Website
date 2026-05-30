"use client";

import { ArrowRight, List, ShoppingBag, User, X } from "@phosphor-icons/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { useLenisInstance } from "@/components/SmoothScroll";
import { HoverRevealText } from "@/components/ui/hover-reveal-text";
import { cn } from "@/lib/utils";
import { HERO_BG_INTRO_DURATION_SEC } from "@/lib/hero-bg-intro";
import type { HeroNavItem } from "@/lib/hero-section-types";

type NavBarProps = {
  navBrandAriaLabel: string;
  navItems: readonly HeroNavItem[];
  bookingCta: { label: string; href: string };
};

const iconBtnBase =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-none transition-[color,opacity] duration-300 hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-border-accent)]";

const menuBorderedBtnClass =
  "inline-flex size-11 shrink-0 items-center justify-center rounded-none border border-[color:var(--color-border-light)] bg-[color:var(--color-white)] text-[color:var(--color-black)] transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-border-accent)]";

const SCROLL_SOLID_PX = 40;
const SCROLL_HIDE_AFTER_PX = 72;

export function HeroNavBar(props: NavBarProps) {
  const { navBrandAriaLabel, navItems, bookingCta } = props;
  const rowRef = useRef<HTMLDivElement>(null);
  /** Expanding column — height morph (no scale/fade on shell). */
  const mobileExpandRef = useRef<HTMLDivElement>(null);
  const navLinkInnerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const footerBlockRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lenis = useLenisInstance();
  const lastNativeScroll = useRef(0);

  const setNavLinkRef = useCallback((index: number) => (el: HTMLSpanElement | null) => {
    navLinkInnerRefs.current[index] = el;
  }, []);

  const requestClose = useCallback(() => {
    const shell = mobileExpandRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!shell || reduceMotion) {
      setMobileOpen(false);
      return;
    }

    const linkEls = navLinkInnerRefs.current.filter(Boolean);
    const footerBlock = footerBlockRef.current;
    const footerEls = footerBlock ? [footerBlock] : [];

    gsap.killTweensOf([shell, ...linkEls, ...footerEls]);

    const tl = gsap.timeline({
      defaults: { ease: "power2.in" },
      onComplete: () => setMobileOpen(false),
    });
    tl.to(linkEls, {
      yPercent: 100,
      opacity: 0,
      duration: 0.2,
      stagger: { each: 0.022, from: "end" },
    })
      .to(
        footerEls,
        {
          yPercent: 100,
          opacity: 0,
          duration: 0.2,
        },
        "<",
      )
      .to(shell, {
        height: 0,
        borderBottomLeftRadius: "1.25rem",
        borderBottomRightRadius: "1.25rem",
        duration: 0.22,
        ease: "power3.in",
      });
  }, []);

  const openMenu = useCallback(() => setMobileOpen(true), []);

  const toggleMenu = useCallback(() => {
    if (mobileOpen) requestClose();
    else openMenu();
  }, [mobileOpen, requestClose, openMenu]);

  useEffect(() => {
    if (mobileOpen) setNavHidden(false);
  }, [mobileOpen]);

  useEffect(() => {
    const apply = (y: number, direction: 1 | -1 | 0) => {
      setScrolled(y > SCROLL_SOLID_PX);
      if (mobileOpen) {
        setNavHidden(false);
        return;
      }
      if (y < 20) {
        setNavHidden(false);
        return;
      }
      if (direction === 1 && y > SCROLL_HIDE_AFTER_PX) {
        setNavHidden(true);
      }
      if (direction === -1) {
        setNavHidden(false);
      }
    };

    if (lenis) {
      const onLenisScroll = (l: { scroll: number; direction: 1 | -1 | 0 }) => {
        apply(l.scroll, l.direction);
      };
      lenis.on("scroll", onLenisScroll);
      apply(lenis.scroll, lenis.direction);
      return () => {
        lenis.off("scroll", onLenisScroll);
      };
    }

    const onNativeScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      const prev = lastNativeScroll.current;
      const direction: 1 | -1 | 0 =
        y > prev ? 1 : y < prev ? -1 : 0;
      lastNativeScroll.current = y;
      apply(y, direction);
    };

    window.addEventListener("scroll", onNativeScroll, { passive: true });
    onNativeScroll();
    return () => {
      window.removeEventListener("scroll", onNativeScroll);
    };
  }, [lenis, mobileOpen]);

  useLayoutEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: "-100%" },
        {
          y: 0,
          delay: HERO_BG_INTRO_DURATION_SEC,
          duration: 1,
          ease: "expo.out",
        },
      );
    }, el);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    if (!mobileOpen || !mobileExpandRef.current) return;

    const shell = mobileExpandRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const linkEls = navLinkInnerRefs.current.filter(Boolean);
    const footerBlock = footerBlockRef.current;
    const footerEls = footerBlock ? [footerBlock] : [];

    if (reduceMotion) {
      gsap.set(shell, { clearProps: "height,borderRadius" });
      gsap.set(shell, { height: "100%" });
      gsap.set(linkEls, { clearProps: "all" });
      gsap.set(footerEls, { clearProps: "all" });
      return;
    }

    gsap.killTweensOf([shell, ...linkEls, ...footerEls]);

    gsap.set(shell, {
      height: 0,
      overflow: "hidden",
      borderBottomLeftRadius: "1.25rem",
      borderBottomRightRadius: "1.25rem",
    });
    gsap.set(linkEls, { yPercent: 110, opacity: 0 });
    gsap.set(footerEls, { yPercent: 110, opacity: 0 });

    const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
    tl.to(shell, {
      height: "100%",
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      duration: 0.58,
      ease: "power3.inOut",
    })
      .to(
        linkEls,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.078,
          ease: "expo.out",
        },
        ">",
      )
      .to(
        footerEls,
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.5,
          ease: "expo.out",
        },
        "<",
      );

    return () => {
      tl.kill();
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen, requestClose]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[100] transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)] motion-reduce:transition-none",
        navHidden && !mobileOpen && "-translate-y-full",
      )}
    >
        <div
          ref={rowRef}
          className={cn(
            "mx-auto flex h-fit w-full min-w-0 max-w-full items-center justify-between gap-[var(--space-3)] px-[var(--section-hero-nav-pad-inline-mobile)] transition-[background-color,box-shadow,border-color] duration-300 md:px-[var(--section-hero-nav-pad-inline-tablet)] lg:gap-[var(--space-4)] lg:px-[length:var(--space-4)] xl:px-[var(--section-hero-nav-pad-inline-desktop)]",
            scrolled &&
              "bg-[color:var(--color-white)] shadow-[0_1px_0_0_rgba(16,16,16,0.08)]",
          )}
        >
          <Link
            href="/"
            className="flex h-12 shrink-0 items-center py-[length:var(--space-3)] xl:ml-[var(--space-6)] rounded-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-border-accent)]"
            aria-label={navBrandAriaLabel}
          >
            <Image
              src="/assets/logo_full.svg"
              alt=""
              width={166}
              height={24}
              className={cn("h-6 w-auto transition-[filter] duration-300", scrolled && "brightness-0")}
              priority
            />
          </Link>

          <nav
            aria-label="Main"
            className="mx-auto hidden min-w-0 w-full flex-1 items-center justify-center gap-0 xl:flex"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group inline-flex items-center justify-center whitespace-nowrap py-[var(--nav-link-padding-y)] font-heading text-[length:var(--text-exp-label)] font-normal leading-[var(--leading-body)] uppercase tracking-[length:var(--tracking-body)] transition-colors duration-300 ease-[cubic-bezier(0.42,0,0.58,1)] hover:text-[color:var(--color-accent)] xl:px-[length:var(--space-2)] 2xl:px-[length:var(--nav-link-padding-x)]",
                  scrolled
                    ? "text-[color:var(--color-black)]"
                    : "text-[color:var(--color-text-primary)]",
                )}
              >
                <HoverRevealText>{item.label}</HoverRevealText>
              </Link>
            ))}
          </nav>

          <div className="flex h-fit shrink-0 items-center gap-[2px] sm:gap-1">
            <nav
              aria-label="Account and cart"
              className="flex items-center gap-0"
            >
              <Link
                href="/account"
                className={cn(
                  iconBtnBase,
                  scrolled
                    ? "text-[color:var(--color-black)]"
                    : "text-[color:var(--color-text-primary)]",
                )}
                aria-label="Account"
              >
                <User className="size-5" weight="regular" aria-hidden />
              </Link>
              <Link
                href="/cart"
                className={cn(
                  iconBtnBase,
                  scrolled
                    ? "text-[color:var(--color-black)]"
                    : "text-[color:var(--color-text-primary)]",
                )}
                aria-label="Shopping bag"
              >
                <ShoppingBag className="size-5" weight="regular" aria-hidden />
              </Link>
            </nav>

            <button
              type="button"
              className={cn(
                iconBtnBase,
                "xl:hidden",
                scrolled
                  ? "text-[color:var(--color-black)]"
                  : "text-[color:var(--color-text-primary)]",
              )}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="hero-mobile-menu"
              onClick={toggleMenu}
            >
              {mobileOpen ? (
                <X className="size-5" weight="bold" aria-hidden />
              ) : (
                <List className="size-5" weight="regular" aria-hidden />
              )}
            </button>

            <Link
              href={bookingCta.href}
              className={cn(
                "group hidden h-12 items-center gap-[var(--space-2)] border border-transparent px-[var(--space-6)] py-3 font-heading text-[length:var(--text-exp-label)] font-semibold uppercase leading-none tracking-[length:var(--tracking-body)] transition-colors duration-300 xl:inline-flex",
                scrolled
                  ? "bg-[color:var(--color-primary-default)] text-[color:var(--color-black)] hover:bg-[color:var(--color-primary-dark)] hover:text-[color:var(--color-white)]"
                  : "bg-[color:var(--color-white)] text-[color:var(--color-black)] hover:bg-[color:var(--color-primary-light)]",
              )}
            >
              <HoverRevealText>{bookingCta.label}</HoverRevealText>
              <ArrowRight className="size-[1.125rem] shrink-0" weight="bold" aria-hidden />
            </Link>
          </div>
        </div>

        {mobileOpen ? (
          <div
            id="hero-mobile-menu"
            className="fixed inset-0 z-[200] flex min-h-0 flex-col overflow-hidden xl:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Main navigation"
          >
            <div
              ref={mobileExpandRef}
              className="flex h-0 min-h-0 w-full max-w-none flex-col overflow-hidden bg-[color:var(--color-white)] text-[color:var(--color-text-primary-light)] motion-reduce:h-full motion-reduce:min-h-0 will-change-[height]"
            >
              <div className="flex shrink-0 items-center justify-between px-[var(--section-hero-nav-pad-inline-mobile)] py-4 md:px-[var(--section-hero-nav-pad-inline-tablet)]">
                <Link
                  href="/"
                  className="flex h-12 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-border-accent)]"
                  aria-label={navBrandAriaLabel}
                  onClick={requestClose}
                >
                  <Image
                    src="/assets/logo_full.svg"
                    alt=""
                    width={166}
                    height={24}
                    className="h-6 w-auto brightness-0"
                    priority
                  />
                </Link>
                <button
                  type="button"
                  className={menuBorderedBtnClass}
                  aria-label="Close menu"
                  onClick={requestClose}
                >
                  <X className="size-5" weight="bold" aria-hidden />
                </button>
              </div>

              <div className="flex min-h-0 flex-1 flex-col px-[var(--section-hero-nav-pad-inline-mobile)] pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 md:px-[var(--section-hero-nav-pad-inline-tablet)]">
                <nav
                  aria-label="Main"
                  className="flex min-h-0 flex-1 flex-col justify-start items-start gap-[32px] overflow-y-auto py-6"
                >
                  {navItems.map((item, i) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block overflow-hidden py-1 font-heading text-[clamp(1.75rem,8.5vw,3rem)] font-semibold uppercase leading-[var(--leading-heading)] tracking-[length:var(--tracking-heading)] text-[color:var(--color-black)] transition-colors duration-200 hover:text-[color:var(--color-accent)]"
                      onClick={requestClose}
                    >
                      <span
                        ref={setNavLinkRef(i)}
                        className="block will-change-[transform,opacity]"
                      >
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </nav>

                <div
                  ref={footerBlockRef}
                  className="mt-auto flex shrink-0 flex-col gap-[var(--space-4)] pt-[var(--space-8)] will-change-[transform,opacity]"
                >
                  <div className="grid w-full grid-cols-2 gap-[var(--space-3)]">
                    <Link
                      href="/account"
                      className="inline-flex min-h-12 items-center justify-center gap-[var(--space-2)] border border-[color:var(--color-border-light)] bg-[color:var(--color-white)] px-[var(--space-4)] py-3 font-heading text-[length:var(--text-exp-label)] font-semibold uppercase leading-none tracking-[length:var(--tracking-body)] text-[color:var(--color-black)] transition-colors hover:bg-[color:var(--color-primary-light)]"
                      onClick={requestClose}
                    >
                      <User className="size-5 shrink-0" weight="regular" aria-hidden />
                      Sign in
                    </Link>
                    <Link
                      href="/cart"
                      className="inline-flex min-h-12 items-center justify-center gap-[var(--space-2)] border border-[color:var(--color-border-light)] bg-[color:var(--color-white)] px-[var(--space-4)] py-3 font-heading text-[length:var(--text-exp-label)] font-semibold uppercase leading-none tracking-[length:var(--tracking-body)] text-[color:var(--color-black)] transition-colors hover:bg-[color:var(--color-primary-light)]"
                      onClick={requestClose}
                    >
                      <ShoppingBag className="size-5 shrink-0" weight="regular" aria-hidden />
                      Cart
                    </Link>
                  </div>

                  <Link
                    href={bookingCta.href}
                    className="inline-flex h-14 w-full min-w-0 shrink-0 items-center justify-center gap-[var(--space-2)] bg-[color:var(--color-primary-default)] px-[var(--space-6)] py-4 font-heading text-[length:var(--text-exp-label)] font-semibold uppercase leading-none tracking-[length:var(--tracking-body)] text-[color:var(--color-black)] transition-colors hover:bg-[color:var(--color-primary-dark)] hover:text-[color:var(--color-white)]"
                    onClick={requestClose}
                  >
                    {bookingCta.label}
                    <ArrowRight className="size-[1.125rem] shrink-0" weight="bold" aria-hidden />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </header>
  );
}
