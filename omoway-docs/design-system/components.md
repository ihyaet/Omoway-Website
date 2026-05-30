# Components — Omoway Design System

## Button

### Typography
- Font family: Zalandos Sans Expanded
- Font size: 14px (--text-label)
- Font weight: Semibold 600
- Letter spacing: -0.02em
- Text transform: uppercase

### Shape
- Border radius: 0 — sharp corners, no rounding

### Sizes
| Size | Padding  | Height |
|------|----------|--------|
| sm   | 8px 16px | 36px   |
| md   | 12px 24px| 44px   |
| lg   | 16px 36px| 52px   |

### Variants

**Primary (on dark surface)**
- Default:  bg #FFFFFF, text #101010, no border
- Hover:    bg #F3F5EE, transition 200ms ease
- Active:   bg #BAD969, text #101010, scale 0.98
- Disabled: bg rgba(255,255,255,0.15),
            text rgba(255,255,255,0.3), no interaction

**Ghost (on dark surface)**
- Default:  bg transparent, text #FFFFFF,
            border-bottom 1px solid #FFFFFF only
- Hover:    text #BAD969, border-bottom-color #BAD969,
            transition 200ms ease
- Active:   text #537400, border-bottom-color #537400
- Disabled: opacity 0.3, no interaction

**Primary (on light surface)**
- Default:  bg #101010, text #FFFFFF, no border
- Hover:    bg #1A1A1A, transition 200ms ease
- Active:   bg #BAD969, text #101010, scale 0.98
- Disabled: bg rgba(0,0,0,0.15),
            text rgba(0,0,0,0.3), no interaction

**Ghost (on light surface)**
- Default:  bg transparent, text #101010,
            border-bottom 1px solid #101010 only
- Hover:    text #BAD969, border-bottom-color #BAD969
- Active:   text #537400, border-bottom-color #537400
- Disabled: opacity 0.3, no interaction

---

## Input

### Typography
- Font family: Zalandos Sans
- Font size: 16px (--text-body-xs)
- Font weight: Medium 500
- Letter spacing: -0.02em

### Shape
- Border radius: 0 — sharp corners
- Border: bottom only — 1px solid rgba(255,255,255,0.3)
- No background — fully transparent

### States
- Default:  border-bottom rgba(255,255,255,0.3)
- Focus:    border-bottom #FFFFFF, no glow, no box-shadow
- Filled:   border-bottom #FFFFFF
- Error:    border-bottom #FF4444,
            helper text 12px below in #FF4444
- Disabled: border-bottom rgba(255,255,255,0.1),
            text rgba(255,255,255,0.3)

### Placeholder
- Color: rgba(255,255,255,0.3)
- Same font and size as input text

---

## Input Group

A combined input + button in a single inline row.
Used for newsletter signup and search fields.

### Structure
[ Input field ————————————————— ] [ Button ]

### Typography
- Input: Zalandos Sans, 16px, Medium 500, -0.02em
- Button: Zalandos Sans, 14px, Semibold 600, uppercase, -0.02em

### Shape
- Input: bottom border only, transparent bg, radius 0
- Button: sharp corners, radius 0
- Both elements share the same height — always aligned

### Sizes
| Size | Height | Input padding | Button padding |
|------|--------|---------------|----------------|
| md   | 44px   | 0 16px        | 12px 24px      |
| lg   | 52px   | 0 24px        | 16px 36px      |

### Variants

**On dark surface**
- Input border-bottom: 1px solid rgba(255,255,255,0.3)
- Input focus: border-bottom #FFFFFF
- Button: bg #FFFFFF, text #101010
- Button hover: bg #F3F5EE

**On light surface**
- Input border-bottom: 1px solid rgba(16,16,16,0.3)
- Input focus: border-bottom #101010
- Button: bg #101010, text #FFFFFF
- Button hover: bg #1A1A1A

### Rules
- Input always takes full remaining width — button is fixed width
- Button never shrinks — input flex-grows to fill space
- No gap between input and button — flush together
- Input and button always the same height — never misaligned
- On mobile: stack vertically, both full width

---

## Rules (global)

- Buttons and inputs always have sharp corners — radius is always 0
- Ghost button uses bottom border only — never a full border
- Primary button active state uses accent color #BAD969
- Input has no visible border except bottom line
- Never add box-shadow or glow to any button or input state
- Button text is always uppercase
- No icons inside buttons unless explicitly specified
- Input label sits above the field, never inside as placeholder
