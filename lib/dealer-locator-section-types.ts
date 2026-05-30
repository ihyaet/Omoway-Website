export type DealerLocation = {
  id: string;
  city: string;
  /** Optional region label for search (e.g. province). */
  region?: string;
  phone: string;
  lat: number;
  lng: number;
};

export type DealerLocatorSectionProps = {
  heading: string;
  subheading: string;
  searchPlaceholder: string;
  dealers: DealerLocation[];
  defaultDealerId: string;
  cta: { label: string; href: string };
  disclaimer: string;
};
