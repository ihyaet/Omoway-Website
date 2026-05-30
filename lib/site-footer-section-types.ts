export type SiteFooterNavLink = {
  label: string;
  href: string;
};

export type SiteFooterNavColumn = {
  id: string;
  title: string;
  titleVariant?: "default" | "product";
  links: SiteFooterNavLink[];
  /** When true, prepend a small arrow-in-square affordance (OMO‑X mode links). */
  arrowLinks?: boolean;
};

export type SiteFooterNewsletterProps = {
  headline: string;
  description: string;
  emailPlaceholder: string;
  submitLabel: string;
  disclaimer: string;
};

export type SiteFooterSectionProps = {
  navColumns: SiteFooterNavColumn[];
  newsletter: SiteFooterNewsletterProps;
  visual: {
    imageSrc: string;
    imageAlt: string;
  };
  copyright: string;
  legalLinks: SiteFooterNavLink[];
};
