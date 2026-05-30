export type SmartFeatureSlide = {
  id: string;
  /** Display index, e.g. "01". */
  index: string;
  title: string;
  description: string;
  /** Section backdrop for this slide; falls back to section `image` when omitted. */
  image?: {
    src: string;
    alt: string;
  };
};

export type SmartFeaturesSectionProps = {
  /** One string or exactly two lines (displayed as stacked blocks). */
  headline: string | readonly [line1: string, line2: string];
  features: SmartFeatureSlide[];
  /** Falls back to the first feature when missing or invalid. */
  defaultFeatureId?: string;
  /** Default backdrop when a feature omits `image`. */
  image: {
    src: string;
    alt: string;
  };
};
