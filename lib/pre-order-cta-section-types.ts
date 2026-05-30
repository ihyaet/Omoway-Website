export type PreOrderCtaWarrantyIcon = "shield" | "battery" | "cog";

export type PreOrderCtaWarrantyItem = {
  id: string;
  label: string;
  icon: PreOrderCtaWarrantyIcon;
};

export type PreOrderCtaSectionProps = {
  image: { src: string; alt: string };
  headline: string;
  body: string;
  cta: { label: string; href: string };
  warrantiesEyebrow: string;
  warranties: PreOrderCtaWarrantyItem[];
};
