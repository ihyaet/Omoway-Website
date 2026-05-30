export type ColorVariantItem = {
  id: string;
  label: string;
  image: {
    src: string;
    alt: string;
  };
};

export type ColorVariantsSectionProps = {
  eyebrow: string;
  variants: ColorVariantItem[];
};
