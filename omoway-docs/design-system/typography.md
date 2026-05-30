# Typography — Omoway Design System

## Typefaces

| Role            | Family                  | Usage                               |
|-----------------|-------------------------|-------------------------------------|
| Heading         | Zalandos Sans Expanded  | All headings, display text          |
| Body (expanded) | Zalandos Sans Expanded  | Large callouts, stat numbers, emphasis body |
| Body (default)  | Zalandos Sans           | Body copy, subtext, UI labels       |

---

## Heading Scale

Font family: Zalandos Sans Expanded
Letter spacing: -4% (-0.04em)
Line height: 120% (1.2)

| Token     | Size | Weight       | Use case                  |
|-----------|------|--------------|---------------------------|
| --text-h1 | 84px | Semibold 600 | Hero display, single line |
| --text-h2 | 72px | Semibold 600 | Section hero heading      |
| --text-h3 | 56px | Semibold 600 | Section heading           |
| --text-h4 | 48px | Semibold 600 | Sub-section heading       |

---

## Body Scale — Zalandos Sans Expanded

Font family: Zalandos Sans Expanded
Letter spacing: -2% (-0.02em)
Line height: 120% (1.2)

| Token              | Size | Weight       | Use case                        |
|--------------------|------|--------------|---------------------------------|
| --text-exp-body-xl | 44px | Bold 700     | Large callout, stat numbers     |
| --text-exp-body-lg | 32px | Semibold 600 | Lead paragraph, feature title   |
| --text-exp-body-md | 24px | Medium 500   | Subheading, card title, unit labels |
| --text-exp-body-sm | 20px | Medium 500   | Intro paragraph, emphasis body  |
| --text-exp-body    | 18px | Regular 400  | Expanded default body           |
| --text-exp-body-xs | 16px | Regular 400  | Secondary body, card body       |
| --text-exp-label   | 14px | Regular 400  | Labels, captions, helper text   |

---

## Body Scale — Zalandos Sans

Font family: Zalandos Sans
Letter spacing: -2% (-0.02em)
Line height: 120% (1.2)

| Token          | Size | Weight       | Use case                        |
|----------------|------|--------------|---------------------------------|
| --text-body-xl | 44px | Bold 700     | Large callout, stat numbers     |
| --text-body-lg | 32px | Semibold 600 | Lead paragraph, feature title   |
| --text-body-md | 24px | Medium 500   | Subheading, card title          |
| --text-body-sm | 20px | Medium 500   | Intro paragraph, body large     |
| --text-body    | 18px | Regular 400  | Default body text               |
| --text-body-xs | 16px | Regular 400  | Secondary body, card body       |
| --text-label   | 14px | Regular 400  | Labels, captions, helper text   |

---

## CSS Tokens

```css
:root {
  /* Font families */
  --font-heading:  'Zalandos Sans Expanded', sans-serif;
  --font-expanded: 'Zalandos Sans Expanded', sans-serif;
  --font-body:     'Zalandos Sans', sans-serif;

  /* Heading sizes */
  --text-h1: 84px;
  --text-h2: 72px;
  --text-h3: 56px;
  --text-h4: 48px;

  /* Body — Zalandos Sans Expanded */
  --text-exp-body-xl: 44px;
  --text-exp-body-lg: 32px;
  --text-exp-body-md: 24px;
  --text-exp-body-sm: 20px;
  --text-exp-body:    18px;
  --text-exp-body-xs: 16px;
  --text-exp-label:   14px;

  /* Body — Zalandos Sans */
  --text-body-xl: 44px;
  --text-body-lg: 32px;
  --text-body-md: 24px;
  --text-body-sm: 20px;
  --text-body:    18px;
  --text-body-xs: 16px;
  --text-label:   14px;

  /* Shared */
  --leading-heading: 1.2;
  --leading-body:    1.2;
  --tracking-heading: -0.04em;
  --tracking-body:    -0.02em;
  --font-weight-heading: 600; /* Semibold — all h1–h4 */
}
```

---

## When to use which body

| Situation                           | Use                     |
|-------------------------------------|-------------------------|
| Hero subtext, section intro         | Zalandos Sans Expanded  |
| Stat numbers, large callout figures | Zalandos Sans Expanded  |
| Feature titles, card headings       | Zalandos Sans Expanded  |
| Long-form body copy, descriptions   | Zalandos Sans           |
| UI labels, captions, helper text    | Zalandos Sans           |
| Navigation, footer links            | Zalandos Sans           |
| Form inputs, placeholders           | Zalandos Sans           |

---

## Rules

- Headings always use Zalandos Sans Expanded — never Zalandos Sans
- Expanded body is for short impactful text — never long paragraphs
- Default body (Sans) for anything longer than 2 lines of copy
- Never mix Expanded and Sans in the same text block
- Never go below 14px for any visible text
- Heading weights: Semibold 600 for all headings (h1–h4); do not use Bold for display headings
- Body weights: scale from Bold at 44px down to Regular at 14–18px
- Letter spacing and line height are fixed — never override per component
- Mobile: scale h1 → 48px, h2 → 40px using clamp()
- Italic allowed in headings only for emotional contrast — use sparingly
