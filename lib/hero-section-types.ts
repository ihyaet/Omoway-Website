export type HeroNavItem = {
  label: string;
  href: string;
};

export type HeroContactBlock = {
  label: string;
  value: string;
};

export type HeroSectionProps = {
  promoBadge: string;
  headlineLines: readonly [string, string];
  intro: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  contacts: readonly [HeroContactBlock, HeroContactBlock, HeroContactBlock];
  footerCtaHref: string;
  footerCtaAriaLabel: string;
};
