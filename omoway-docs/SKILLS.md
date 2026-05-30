# SKILLS — Omoway Codebase Rules

## Stack
- Next.js 15 App Router
- Tailwind CSS
- shadcn/ui
- GSAP + ScrollTrigger
- TypeScript

## Design system
- All colors from colors.md — always use CSS variables, never hardcode
- All typography from typography.md — always use CSS variables
- All spacing from spacing.md — always use scale tokens
- All component patterns from components.md — buttons, inputs,
  input group, badges follow the spec exactly
- Sharp corners everywhere — border radius is always 0 on
  interactive components
- Hairline borders — always 0.5px, never 1px or thicker
  except bottom-border on inputs and ghost buttons (1px)

## Fonts
- Zalando Sans — body font, imported via next/font/google
- Zalando Sans Expanded — heading font, imported via next/font/google
- Both defined once in app/fonts.ts, never re-imported elsewhere
- CSS variables: --font-body (Sans), --font-heading (Sans Expanded)
- Tailwind classes: font-body, font-heading
- Never hardcode font family names in components — always use
  font-body or font-heading Tailwind classes

## Typography rules
- Headings: always Zalandos Sans Expanded, never Zalandos Sans
- Body default: Zalandos Sans
- Body emphasis / callouts: Zalandos Sans Expanded
- Never mix Expanded and Sans in the same text block
- Never go below 14px

## Component rules
- Buttons: always sharp corners, always uppercase, 14px Semibold
- Ghost button: bottom border only, never full border
- Input: bottom border only, transparent background
- Input Group: input flex-grows, button fixed width, flush together,
  stack vertically on mobile
- No box-shadow on any component — ever
- No border radius on any interactive component — ever

## Animation
- Use GSAP + ScrollTrigger for all animations
- No Framer Motion, no CSS keyframes
- Default entrance: opacity 0, y: 24 → opacity 1, y: 0
- Duration: 0.6s reveals, 0.2s hovers
- Ease: power2.out entrances, power2.inOut transitions
- Stagger: 0.08s between siblings
- Always wrap in prefers-reduced-motion check

## Coding rules
- TypeScript always — no plain JS files
- Mobile-first — write base styles for mobile,
  then md: and lg: breakpoints
- All section components accept content as typed props —
  no hardcoded copy inside components
- Images: always next/image with alt text and correct aspect ratio
- Sections use semantic HTML — section, nav, footer, article
- No inline styles — Tailwind classes only
- No arbitrary Tailwind values — always use design token variables
- Shared layout components in /components/shared/

## Shadcn customization
- Override shadcn tokens in globals.css to match brand
- Never modify shadcn component source directly
- Extend in Tailwind config using CSS variable references

## Naming conventions
- Components: PascalCase (HeroSection.tsx)
- CSS variables: kebab-case (--color-bg-dark)
- Tailwind config keys: camelCase
- Page routes: kebab-case (/omo-x, /where-to-buy)
