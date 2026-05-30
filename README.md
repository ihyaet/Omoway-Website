# Omoway — OMO X Homepage Redesign

A concept redesign of the [Omoway](https://omoway.com) marketing website for the **OMO X** — the world's first mass-produced self-balancing electric motorcycle. Built as a premium, animation-heavy single-page experience targeting tech-enthusiast early adopters in Southeast Asia.

> **Live route:** `/` (homepage only — see [Roadmap](#roadmap) for planned routes)

---

## Project Description

Omoway is a Singapore-based intelligent EV brand. This project reimagines their homepage as a high-fidelity, scroll-driven product story — from hero to pre-order CTA — with a design language inspired by Rivian and Tesla: dark-first, typographically bold, and always product-led.

**Goals:**
- Drive OMO X pre-order reservations
- Communicate Embodied AI and self-balancing differentiation
- Build brand credibility and desirability
- Surface dealer locations and drive test ride bookings

**Target audience:** Urban riders aged 25–40, design and tech aware, Indonesia primary market.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router, React Server Components) |
| Language | [TypeScript 5](https://www.typescriptlang.org/) (strict mode) |
| UI Library | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com/) via PostCSS |
| Animation | [GSAP 3.15](https://gsap.com/) — ScrollTrigger, timelines, tweens |
| Smooth Scroll | [Lenis 1.3.23](https://lenis.darkroom.engineering/) integrated with GSAP ScrollTrigger |
| Component Base | [shadcn/ui](https://ui.shadcn.com/) (base-nova style) + [Base UI 1.4.1](https://base-ui.com/) headless |
| Variants | [class-variance-authority (CVA)](https://cva.style/) |
| Icons | [Phosphor Icons](https://phosphoricons.com/) + [Lucide React](https://lucide.dev/) |
| Map | [Leaflet 1.9.4](https://leafletjs.com/) — dynamic import, SSR disabled |
| Typography | Zalandos Sans + Zalandos Sans Expanded |
| Deployment | [Vercel](https://vercel.com/) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (Turbopack, port 3000)
npm run dev

# Production build
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Project Structure

```
omoway-web/
├── app/
│   ├── globals.css          # Design tokens, base styles, custom animations
│   ├── layout.tsx           # Root layout — SiteHeader + SmoothScroll provider
│   └── page.tsx             # Home page — all sections + typed content constants
├── components/
│   ├── SiteHeader.tsx
│   ├── SmoothScroll.tsx     # Lenis + ScrollTrigger init + context providers
│   ├── sections/            # 23 major section components
│   └── ui/                  # button, input, label, hover-reveal-text
├── hooks/
│   └── useGsapStaggeredLineReveal.ts
├── lib/
│   ├── utils.ts             # cn() utility (clsx + tailwind-merge)
│   ├── damped-spring-ease.ts
│   ├── *-types.ts           # Prop/type definitions (one per section)
│   └── *-config.ts          # Nav items, header config
└── public/assets/           # Product images, SVGs, video files
```

---

## Design System

### Colors

| Token | Value | Usage |
|---|---|---|
| `--color-primary-default` | `#BAD969` | CTAs, active states, key highlights |
| `--color-primary-light` | `#F3F5EE` | Light section backgrounds |
| `--color-primary-dark` | `#537400` | Accent hover, text on light bg |
| `--color-black` | `#101010` | Hero + dark section backgrounds |
| `--color-white` | `#FFFFFF` | Elevated cards only |

**Rules:**
- `#BAD969` is the only brand accent — use intentionally, never decoratively
- Never use `#BAD969` as text on white (contrast too low)
- Section backgrounds alternate between `#101010` (dark) and `#F3F5EE` (light off-white)
- Black is always `#101010` — never pure `#000000`
- Borders are hairline (`0.5px`) — never thicker except bottom-border on inputs

### Typography

Two typefaces, one visual voice:

| Family | Role |
|---|---|
| **Zalandos Sans Expanded** | All headings, display text, stat numbers, callouts |
| **Zalandos Sans** | Body copy, UI labels, captions, nav, forms |

**Heading scale** (Zalandos Sans Expanded, Semibold 600, `letter-spacing: -0.04em`, `line-height: 1.2`):

| Token | Size | Mobile | Use |
|---|---|---|---|
| `--text-h1` | 84px | 48px | Hero display |
| `--text-h2` | 72px | 40px | Section hero heading |
| `--text-h3` | 56px | — | Section heading |
| `--text-h4` | 48px | — | Sub-section heading |

**Body scale** (`letter-spacing: -0.02em`, `line-height: 1.2`):

| Token | Size | Weight | Use |
|---|---|---|---|
| `--text-exp-body-xl` | 44px | Bold 700 | Large callout, stat numbers |
| `--text-exp-body-lg` | 32px | Semibold 600 | Lead paragraph, feature title |
| `--text-exp-body-md` | 24px | Medium 500 | Card title, unit labels |
| `--text-body` | 18px | Regular 400 | Default body copy |
| `--text-label` | 14px | Regular 400 | Labels, captions |

### Spacing & Layout

- **Page margin:** `--page-margin-inline-desktop: 80px`
- **Spacing scale:** `--space-1` through `--space-32` in `0.25rem` increments
- **Border radius:** `0px` everywhere — sharp edges, no curves

### Design Principles

1. **Product is always the hero** — no decorative clutter
2. **Sharp corners everywhere** — border-radius is always 0
3. **Typography drives hierarchy** — not color or decoration
4. **Dark-first** — hero and key sections on `#101010`; light sections as breathing room
5. **Accent used intentionally** — max 2 accent touches per section

---

## Key Patterns

- **Content as typed constants** — all section data defined in `page.tsx` and passed as spread props
- **Prop types in `lib/`** — one `*-types.ts` file per section (e.g. `HeroSectionProps`)
- **GSAP in custom hooks** — animation logic encapsulated (e.g. `useGsapStaggeredLineReveal`)
- **Damped spring easing** — `createDampedSpringEase()` in `lib/damped-spring-ease.ts`
- **`"use client"` only where needed** — all interactive/animated components opt in explicitly
- **SSR-safe map** — `DealerLocatorMap` lazy-loaded via `next/dynamic` with `ssr: false`
- **Accessibility** — ARIA roles/labels, `sr-only` text, `prefers-reduced-motion` support

---

## Roadmap

Currently only `/` (homepage) is implemented. Planned routes:

- `/pre-order`
- `/omo-x/specs`
- `/test-ride`
- `/models`
- `/technology`
- `/experience`
- `/news`
- `/about`
- `/contact`
- `/join-us`

---

## Disclaimer

This is an **unofficial concept redesign** and is not affiliated with, endorsed by, or connected to Omoway Pte. Ltd. in any way. All brand assets, product names, and trademarks belong to their respective owners. This project was created purely for design and development practice purposes and is not intended for commercial use.

Product images and video assets used in this project are sourced from publicly available Omoway media and remain the intellectual property of Omoway Pte. Ltd.
