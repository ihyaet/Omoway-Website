export type ProductModeFeature = {
  id: string;
  label: string;
};

export type ProductModeSlide = {
  id: string;
  label: string;
  description: string;
  features: ProductModeFeature[];
  /** Shown after feature chips — typically “More”. */
  moreLabel: string;
  /** Large typographic backdrop label (e.g. “STREET MODE”). */
  backdropLabel: string;
  /** Vehicle / mode visual — `null` renders a tonal placeholder until assets exist. */
  image: {
    src: string;
    alt: string;
  } | null;
};

export type ProductModesSectionProps = {
  modes: ProductModeSlide[];
  /** Falls back to the first mode when missing or invalid. */
  defaultModeId?: string;
};
