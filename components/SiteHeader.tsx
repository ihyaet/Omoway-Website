"use client";

import { HeroNavBar } from "@/components/sections/HeroNavBar";
import {
  siteHeaderBookingCta,
  siteHeaderNavBrandAriaLabel,
  siteHeaderNavItems,
} from "@/lib/site-header-config";

/** Global fixed nav — mounts in root layout so it stays above every section on scroll. */
export function SiteHeader() {
  return (
    <HeroNavBar
      navBrandAriaLabel={siteHeaderNavBrandAriaLabel}
      navItems={siteHeaderNavItems}
      bookingCta={siteHeaderBookingCta}
    />
  );
}
