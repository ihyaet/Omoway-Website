# Spacing — Omoway Design System

## Base unit
4px — all spacing values are multiples of 4

## Scale

| Token      | Value   | px    |
|------------|---------|-------|
| --space-1  | 0.25rem | 4px   |
| --space-2  | 0.5rem  | 8px   |
| --space-3  | 0.75rem | 12px  |
| --space-4  | 1rem    | 16px  |
| --space-5  | 1.25rem | 20px  |
| --space-6  | 1.5rem  | 24px  |
| --space-8  | 2rem    | 32px  |
| --space-10 | 2.5rem  | 40px  |
| --space-12 | 3rem    | 48px  |
| --space-16 | 4rem    | 64px  |
| --space-20 | 5rem    | 80px  |
| --space-24 | 6rem    | 96px  |
| --space-32 | 8rem    | 128px |

## Section padding

| Context         | Desktop    | Mobile    |
|-----------------|------------|-----------|
| Full section    | 96px 64px  | 64px 24px |
| Compact section | 64px 64px  | 48px 24px |
| Hero section    | 0          | 0         |
| Footer          | 64px       | 48px 24px |

## Component spacing

| Context                  | Value |
|--------------------------|-------|
| Eyebrow → Heading        | 20px  |
| Heading → Subtext        | 24px  |
| Subtext → CTA            | 40px  |
| Card internal padding    | 32px  |
| Nav height               | 64px  |
| Between section elements | 16px  |
| Between cards in a grid  | 24px  |
| Input → helper text      | 8px   |
| Button icon → label      | 8px   |

## Grid

| Context | Columns | Gutter | Margin |
|---------|---------|--------|--------|
| Desktop | 12      | 20px   | 120px  |
| Tablet  | 8       | 16px   | 24px   |
| Mobile  | 4       | 16px   | 16px   |

## Rules

- Never use arbitrary spacing values — always pick the nearest scale token
- Vertical rhythm between sections: minimum --space-24 (96px)
- Never use margin on section components — use padding only
- Spacing between eyebrow, heading, subtext, and CTA is fixed —
  never adjust per section
- On mobile all horizontal margins reduce to 16px
- Grid gutters never collapse below 16px
