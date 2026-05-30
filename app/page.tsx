import { ColorVariantsSection } from "@/components/sections/ColorVariantsSection";
import { DealerLocatorSection } from "@/components/sections/DealerLocatorSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { OmoXIntroSection } from "@/components/sections/OmoXIntroSection";
import { ProductModesSection } from "@/components/sections/ProductModesSection";
import { RedefiningMobilitySection } from "@/components/sections/RedefiningMobilitySection";
import { SiteFooterSection } from "@/components/sections/SiteFooterSection";
import { SmartFeaturesSection } from "@/components/sections/SmartFeaturesSection";
import { PreOrderCtaSection } from "@/components/sections/PreOrderCtaSection";
import { TechSpecsSection } from "@/components/sections/TechSpecsSection";
import type { ColorVariantsSectionProps } from "@/lib/color-variants-section-types";
import type { DealerLocatorSectionProps } from "@/lib/dealer-locator-section-types";
import type { HeroSectionProps } from "@/lib/hero-section-types";
import type { ProductModesSectionProps } from "@/lib/product-modes-section-types";
import type { SmartFeaturesSectionProps } from "@/lib/smart-features-section-types";
import type { PreOrderCtaSectionProps } from "@/lib/pre-order-cta-section-types";
import type { TechSpecsSectionProps } from "@/lib/tech-specs-section-types";
import type { SiteFooterSectionProps } from "@/lib/site-footer-section-types";

const heroContent: HeroSectionProps = {
  promoBadge: "Get special promo on OMO‑X",
  headlineLines: ["Ride smarter.", "Go further."],
  intro:
    "An AI-native electric scooter built for urban riders who expect more from every commute.",
  primaryCta: { label: "Join pre‑order now", href: "/pre-order" },
  secondaryCta: { label: "Explore specs", href: "/omo-x/specs" },
  contacts: [
    { label: "Phone Number", value: "+62 812-3456-7890" },
    { label: "Email", value: "customerservice@omoway.com" },
    {
      label: "Address",
      value:
        "CBC Cengkareng Business City, Jalan Atang Sanjaya Nomor 21 Tower K",
    },
  ],
  footerCtaHref: "/contact",
  footerCtaAriaLabel: "Contact Omoway",
};

const productModesContent: ProductModesSectionProps = {
  defaultModeId: "scooter",
  modes: [
    {
      id: "scooter",
      label: "01 - Scooter mode",
      description:
        "Ultra-compact ergonomics tuned for alleyways and last-mile hops. Sensors keep you balanced without the bulk of a touring frame—built for errands, quick pickups, and daily urban rhythm.",
      features: [
        { id: "s1", label: "Tight-turn geometry" },
        { id: "s2", label: "AI posture assist" },
        { id: "s3", label: "Regenerative braking" },
        { id: "s4", label: "One-touch fold cockpit" },
        { id: "s5", label: "Route-aware throttle" },
      ],
      moreLabel: "More",
      backdropLabel: "Scooter mode",
      image: {
        src: "/assets/scooter_mode.png",
        alt: "OMO X in scooter configuration.",
      },
    },
    {
      id: "street",
      label: "02 - Street mode",
      description:
        "Through the middle box module expansion, OMO X can instantly switch to a sporty street motor form, not only meeting storage needs but also unleashing personality tension, becoming the highlight on urban streets.",
      features: [
        { id: "st1", label: "Self-balancing" },
        { id: "st2", label: "Adaptive cruise control" },
        { id: "st3", label: "Wireless charging pad" },
        { id: "st4", label: "Digital key" },
        { id: "st5", label: "Vehicle-to-vehicle (V2V)" },
      ],
      moreLabel: "More",
      backdropLabel: "Street mode",
      image: {
        src: "/assets/street_mode.png",
        alt: "OMO X in street configuration.",
      },
    },
    {
      id: "gt",
      label: "03 - GT mode",
      description:
        "Extended-wheelbase stance, tuned dampers, and higher thermal headroom for sustained pace. Dial in assertive motorway stability while Embodied AI keeps traction and braking confident in unpredictable weather.",
      features: [
        { id: "g1", label: "Dual-phase cooling" },
        { id: "g2", label: "Track-assist damping" },
        { id: "g3", label: "High-output motor map" },
        { id: "g4", label: "Aero fairing preset" },
        { id: "g5", label: "Launch calibration" },
      ],
      moreLabel: "More",
      backdropLabel: "GT mode",
      image: {
        src: "/assets/gt_mode.png",
        alt: "OMO X in GT configuration.",
      },
    },
  ],
};

const smartFeaturesContent: SmartFeaturesSectionProps = {
  headline: [
    "Your scooter works, even",
    "when you're not on it.",
  ] as const,
  defaultFeatureId: "self-parking",
  image: {
    src: "/assets/section6bg.png",
    alt: "OMO X electric scooter — default scene.",
  },
  features: [
    {
      id: "self-parking",
      index: "01",
      title: "Self parking",
      description:
        "Ride up, step off. The OMO X finds its spot, maneuvers in, and parks itself—no reversing, no balancing act, no stress.",
      image: {
        src: "/assets/self-parking.png",
        alt: "OMO X self-parking in a residential driveway at dusk.",
      },
    },
    {
      id: "wireless-charging",
      index: "02",
      title: "Wireless charging",
      description:
        "Set it on the pad when you're done—smart thermal pacing tops up the pack without cables cluttering your entryway.",
      image: {
        src: "/assets/wireless-charging.png",
        alt: "OMO X on a wireless charging pad indoors.",
      },
    },
    {
      id: "self-balance",
      index: "03",
      title: "Self-balance",
      description:
        "Embodied AI and gyro stabilization keep OMO X poised at walking speeds so tight garages and plazas feel effortless.",
      image: {
        src: "/assets/self-balance.png",
        alt: "OMO X balanced upright in a plaza setting.",
      },
    },
    {
      id: "auto-side-stand",
      index: "04",
      title: "Auto side stand",
      description:
        "The stand deploys and retracts on its own when you're stationary—no foot juggling or pavement scrapes.",
      image: {
        src: "/assets/auto-side-stand.png",
        alt: "OMO X with side stand deployed on city pavement.",
      },
    },
  ],
};

const colorVariantsContent: ColorVariantsSectionProps = {
  eyebrow: "Every shade tells a story",
  variants: [
    {
      id: "turquoise-green",
      label: "Turquoise green",
      image: {
        src: "/assets/turqoise_green.png",
        alt: "OMO X electric scooter preview for Turquoise green finish.",
      },
    },
    {
      id: "morning-gold-sun",
      label: "Morning gold sun",
      image: {
        src: "/assets/morning_gold_sun.png",
        alt: "OMO X electric scooter preview for Morning gold sun finish.",
      },
    },
    {
      id: "aurora-green",
      label: "Aurora green",
      image: {
        src: "/assets/aurora_green.png",
        alt: "OMO X electric scooter preview for Aurora green finish.",
      },
    },
    {
      id: "meteorite-gray",
      label: "Meteorite gray",
      image: {
        src: "/assets/meteorite_gray.png",
        alt: "OMO X electric scooter preview for Meteorite gray finish.",
      },
    },
    {
      id: "matte-silver",
      label: "Matte silver",
      image: {
        src: "/assets/matte_silver.png",
        alt: "OMO X electric scooter in matte silver, outdoors at golden hour.",
      },
    },
    {
      id: "lunar-white",
      label: "Lunar white",
      image: {
        src: "/assets/lunar_white.png",
        alt: "OMO X electric scooter preview for Lunar white finish.",
      },
    },
  ],
};

const dealerLocatorContent: DealerLocatorSectionProps = {
  heading: "Ride one near you.",
  subheading:
    "Find your nearest showroom, book a test ride, or place your order directly with a dealer.",
  searchPlaceholder: "Search by city or region…",
  defaultDealerId: "jakarta",
  dealers: [
    {
      id: "bali",
      city: "Bali",
      region: "Bali",
      phone: "+62 812-3456-7890",
      lat: -8.6500,
      lng: 115.2164,
    },
    {
      id: "jakarta",
      city: "Jakarta",
      region: "DKI Jakarta",
      phone: "+62 812-3456-7891",
      lat: -6.2088,
      lng: 106.8456,
    },
    {
      id: "surabaya",
      city: "Surabaya",
      region: "East Java",
      phone: "+62 812-3456-7892",
      lat: -7.2575,
      lng: 112.7521,
    },
    {
      id: "yogyakarta",
      city: "Yogyakarta",
      region: "Special Region of Yogyakarta",
      phone: "+62 812-3456-7893",
      lat: -7.7956,
      lng: 110.3695,
    },
    {
      id: "bandung",
      city: "Bandung",
      region: "West Java",
      phone: "+62 812-3456-7894",
      lat: -6.9175,
      lng: 107.6191,
    },
    {
      id: "karangasem",
      city: "Karang asem",
      region: "Bali",
      phone: "+62 812-3871-3040",
      lat: -8.4542,
      lng: 115.6083,
    },
    {
      id: "klungkung",
      city: "Klungkung",
      region: "Bali",
      phone: "+62 813-2219-761",
      lat: -8.6667,
      lng: 115.405,
    },
    {
      id: "madiun",
      city: "Madiun",
      region: "East Java",
      phone: "+62 821-1000-5758",
      lat: -7.6298,
      lng: 111.5239,
    },
    {
      id: "magetan",
      city: "Magetan",
      region: "East Java",
      phone: "+62 812-2700-7200",
      lat: -7.6537,
      lng: 111.3315,
    },
    {
      id: "mojokerto",
      city: "Mojokerto",
      region: "East Java",
      phone: "+62 858-1507-1327",
      lat: -7.4706,
      lng: 112.4401,
    },
    {
      id: "jombang",
      city: "Jombang",
      region: "East Java",
      phone: "+62 878-9103-7745",
      lat: -7.5469,
      lng: 112.226,
    },
  ],
  cta: { label: "Join pre‑order now", href: "/pre-order" },
  disclaimer:
    "We do not use any contact channels other than the phone numbers listed above. Please remain vigilant and beware of potential fraud.",
};

const techSpecsContent: TechSpecsSectionProps = {
  stats: [
    {
      id: "top-speed",
      label: "Top speed",
      value: "110",
      unit: "km/hour",
    },
    {
      id: "wmtc-range",
      label: "WMTC range",
      value: "200",
      unit: "km",
    },
    {
      id: "efficiency",
      label: "Efficiency gain",
      value: "0.498",
      unit: "",
      sublabel: "drag coefficient",
    },
  ],
  cta: { label: "Learn more", href: "/omo-x/specs" },
};

const preOrderCtaContent: PreOrderCtaSectionProps = {
  image: {
    src: "/assets/ctaBg.png",
    alt: "Three OMO X electric scooters in studio lighting on a dark textured floor.",
  },
  headline: "Pre order are opening now!",
  body: "We believe the next leap in mobility isn't faster engines or bigger batteries — it's a vehicle that thinks, balances, and adapts on its own.",
  cta: { label: "Join pre‑order now", href: "/pre-order" },
  warrantiesEyebrow: "Our warranties:",
  warranties: [
    {
      id: "side-motor",
      icon: "shield",
      label: "6 years warranty for side motor",
    },
    {
      id: "batteries",
      icon: "battery",
      label: "7 years warranty for batteries",
    },
    {
      id: "components",
      icon: "cog",
      label: "Warranties on all vehicle components",
    },
  ],
};

const siteFooterContent: SiteFooterSectionProps = {
  navColumns: [
    {
      id: "omo-x",
      title: "OMO‑X",
      titleVariant: "product",
      arrowLinks: true,
      links: [
        { label: "Scooter Mode", href: "/#product-modes" },
        { label: "Street Mode", href: "/#product-modes" },
        { label: "GT Mode", href: "/#product-modes" },
      ],
    },
    {
      id: "menus",
      title: "Menus",
      links: [
        { label: "Models", href: "/models" },
        { label: "Technology", href: "/technology" },
        { label: "Experience", href: "/experience" },
        { label: "News", href: "/news" },
      ],
    },
    {
      id: "company",
      title: "Company",
      links: [
        { label: "Join Us", href: "/join-us" },
        { label: "Where To Buy", href: "/#dealer-locator" },
        { label: "About", href: "/about" },
      ],
    },
    {
      id: "social",
      title: "Follow us",
      links: [
        { label: "Facebook", href: "https://www.facebook.com/" },
        { label: "Instagram", href: "https://www.instagram.com/" },
        { label: "LinkedIn", href: "https://www.linkedin.com/" },
      ],
    },
  ],
  newsletter: {
    headline: "Be the first to know.",
    description:
      "New models, software updates, and launch events straight to your inbox. No noise, just what matters.",
    emailPlaceholder: "YOUR EMAIL HERE",
    submitLabel: "Subscribe",
    disclaimer:
      "By signing up, I agree with the data protection policy of Omoway.",
  },
  visual: {
    imageSrc: "/assets/footerBg.png",
    imageAlt:
      "Front view of OMO X electric scooter with lime green fairing and Omoway logo on a black background.",
  },
  copyright:
    "Copyright © 2026 PT Omoway Digital Indonesia. All rights reserved.",
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-of-service" },
    { label: "Cookies Policy", href: "/cookies-policy" },
    { label: "Sustainability Policy", href: "/sustainability-policy" },
  ],
};

export default function Home() {
  return (
    <>
      <div className="relative z-10">
        <HeroSection {...heroContent} />
        <OmoXIntroSection />
        <ProductModesSection {...productModesContent} />
        <RedefiningMobilitySection />
        <TechSpecsSection {...techSpecsContent} />
        <SmartFeaturesSection {...smartFeaturesContent} />
        <ColorVariantsSection {...colorVariantsContent} />
        <DealerLocatorSection {...dealerLocatorContent} />
        <PreOrderCtaSection {...preOrderCtaContent} />
      </div>
      <SiteFooterSection {...siteFooterContent} />
    </>
  );
}
