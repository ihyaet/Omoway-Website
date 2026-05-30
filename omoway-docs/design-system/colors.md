# Colors — Omoway Design System

## Brand Palette

| Token                   | Hex     | Name            |
|-------------------------|---------|-----------------|
| --color-primary-light   | #F3F5EE | Primary Light   |
| --color-primary-default | #BAD969 | Primary Default |
| --color-primary-dark    | #537400 | Primary Dark    |
| --color-black           | #101010 | Black           |
| --color-white           | #FFFFFF | White           |

---

## Semantic Tokens

### Background
| Token                | Value   | Usage                        |
|----------------------|---------|------------------------------|
| --color-bg-dark      | #101010 | Hero, dark sections          |
| --color-bg-light     | #F3F5EE | Light body sections          |
| --color-bg-white     | #FFFFFF | Cards, elevated surfaces     |

### Text on dark surface
| Token                  | Value                  | Usage                 |
|------------------------|------------------------|-----------------------|
| --color-text-primary   | #FFFFFF                | Primary text          |
| --color-text-secondary | rgba(255,255,255,0.5)  | Subtext, descriptions |
| --color-text-muted     | rgba(255,255,255,0.25) | Eyebrow, captions     |
| --color-text-disabled  | rgba(255,255,255,0.15) | Disabled states       |

### Text on light surface
| Token                        | Value                 | Usage                 |
|------------------------------|-----------------------|-----------------------|
| --color-text-primary-light   | #101010               | Primary text          |
| --color-text-secondary-light | rgba(16,16,16,0.5)    | Subtext, descriptions |
| --color-text-muted-light     | rgba(16,16,16,0.25)   | Eyebrow, captions     |
| --color-text-disabled-light  | rgba(16,16,16,0.15)   | Disabled states       |

### Accent
| Token                 | Value   | Usage                           |
|-----------------------|---------|---------------------------------|
| --color-accent        | #BAD969 | CTA buttons, highlights, badges |
| --color-accent-hover  | #537400 | Accent hover state              |
| --color-accent-subtle | #F3F5EE | Accent background tint          |

### Border
| Token                 | Value                  | Usage                  |
|-----------------------|------------------------|------------------------|
| --color-border-dark   | rgba(255,255,255,0.08) | Borders on dark bg     |
| --color-border-light  | rgba(16,16,16,0.1)     | Borders on light bg    |
| --color-border-accent | #BAD969                | Focused inputs, active |

---

## Dark Gradations

| Scale | Hex     |
|-------|---------|
| 50    | #F0F0F0 |
| 100   | #D9D9D9 |
| 200   | #B3B3B3 |
| 300   | #8C8C8C |
| 400   | #666666 |
| 500   | #404040 |
| 600   | #2E2E2E |
| 700   | #1A1A1A |
| 800   | #101010 |
| 900   | #0A0A0A |

---

## CSS Tokens

```css
:root {
  /* Brand */
  --color-primary-light:   #F3F5EE;
  --color-primary-default: #BAD969;
  --color-primary-dark:    #537400;
  --color-black:           #101010;
  --color-white:           #FFFFFF;

  /* Background */
  --color-bg-dark:         #101010;
  --color-bg-light:        #F3F5EE;
  --color-bg-white:        #FFFFFF;

  /* Text — dark surface */
  --color-text-primary:    #FFFFFF;
  --color-text-secondary:  rgba(255,255,255,0.5);
  --color-text-muted:      rgba(255,255,255,0.25);
  --color-text-disabled:   rgba(255,255,255,0.15);

  /* Text — light surface */
  --color-text-primary-light:    #101010;
  --color-text-secondary-light:  rgba(16,16,16,0.5);
  --color-text-muted-light:      rgba(16,16,16,0.25);
  --color-text-disabled-light:   rgba(16,16,16,0.15);

  /* Accent */
  --color-accent:          #BAD969;
  --color-accent-hover:    #537400;
  --color-accent-subtle:   #F3F5EE;

  /* Border */
  --color-border-dark:     rgba(255,255,255,0.08);
  --color-border-light:    rgba(16,16,16,0.1);
  --color-border-accent:   #BAD969;
}
```

---

## Usage Rules

- --color-accent (#BAD969) is the only brand color — use intentionally,
  not decoratively. Reserve for primary CTAs, active states, key highlights
- Never use #BAD969 as text color on white — contrast is too low
- #BAD969 on #101010 is the hero accent combination
- --color-primary-dark (#537400) for hover states and text on light
  backgrounds when accent color is needed
- --color-bg-light (#F3F5EE) is the off-white — never use pure #FFFFFF
  as a section background, only for elevated cards
- Black is #101010 — never pure #000000
- Never use more than 2 accent touches per section
- Borders are always hairline (0.5px) — never 1px or thicker
  except bottom-border on inputs and ghost buttons
