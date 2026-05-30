import type { HeroNavItem } from "@/lib/hero-section-types";

/** Nav + booking CTA — shared by `SiteHeader` (layout) and kept in one place. */
export const siteHeaderNavBrandAriaLabel = "Omoway — home";

export const siteHeaderNavItems: readonly HeroNavItem[] = [
  { label: "Models", href: "/models" },
  { label: "Technology", href: "/technology" },
  { label: "Experience", href: "/experience" },
  { label: "News", href: "/news" },
  { label: "About", href: "/about" },
];

export const siteHeaderBookingCta = {
  label: "Book for a test",
  href: "/test-ride",
} as const;
