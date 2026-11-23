---
name: PFM Pulse Design System
colors:
  surface: '#f2fded'
  surface-dim: '#d2ddce'
  surface-bright: '#f2fded'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ecf7e8'
  surface-container: '#e6f1e2'
  surface-container-high: '#e1ebdc'
  surface-container-highest: '#dbe6d7'
  on-surface: '#151e15'
  on-surface-variant: '#43493a'
  inverse-surface: '#293329'
  inverse-on-surface: '#e9f4e5'
  outline: '#737968'
  outline-variant: '#c3c9b5'
  surface-tint: '#416901'
  primary: '#416901'
  on-primary: '#ffffff'
  primary-container: '#8cba51'
  on-primary-container: '#2b4800'
  inverse-primary: '#a5d568'
  secondary: '#4e6700'
  on-secondary: '#ffffff'
  secondary-container: '#ceef7d'
  on-secondary-container: '#536d02'
  tertiary: '#785743'
  on-tertiary: '#ffffff'
  tertiary-container: '#cda48c'
  on-tertiary-container: '#573a28'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c1f281'
  primary-fixed-dim: '#a5d568'
  on-primary-fixed: '#102000'
  on-primary-fixed-variant: '#304f00'
  secondary-fixed: '#ceef7d'
  secondary-fixed-dim: '#b3d264'
  on-secondary-fixed: '#151f00'
  on-secondary-fixed-variant: '#3a4d00'
  tertiary-fixed: '#ffdbc8'
  tertiary-fixed-dim: '#e9bea5'
  on-tertiary-fixed: '#2d1607'
  on-tertiary-fixed-variant: '#5e402e'
  background: '#f2fded'
  on-background: '#151e15'
  surface-variant: '#dbe6d7'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 52px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  currency-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  currency-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system embodies the ethos of an **editorial fintech co-pilot**: calm, authoritative, radically transparent, and empowering. It removes traditional financial anxiety through humanized, conversational AI interactions while maintaining institutional rigor and computational precision.

The visual direction harmonizes modern **Warm Editorial Minimalism** with functional data density. Rather than cold corporate banking tropes, the interface feels like an intelligent, high-touch financial publication curated for the individual. Interfaces prioritize legible hierarchy, soft tactile feedback, intentional whitespace, and contextual conversational blocks designed specifically for Brazilian Portuguese (pt-BR) syntactical rhythm.

## Colors

The palette balances organic vitality with actionable governance across financial events:

- **Primary Green (`#8CBA51`):** Represents financial health, positive asset evolution, baseline affirmative states, and high-priority primary actions.
- **Lime Glow (`#DEFF8B`):** Reserved exclusively for conversational AI synthesis, predictive tips, smart budget insights, and automated savings targets. Always paired with `#141D14` (Deep Forest) text for AAA contrast.
- **Warm Peach Alert (`#FBCEB5`):** Serves non-threatening advisory triggers, transaction categorizations awaiting review, and preventative warnings. Always paired with `#3D1E10` (Warm Umber) text.
- **Coral Critical Alert (`#FF5D6C`):** High-urgency alert token applied strictly to budget overruns, recurring unauthorized debits, and direct financial leakages. Always paired with `#FFFFFF` or `#4A070D`.
- **Canvas (`#F7F9F5`) & Card Surfaces (`#FFFFFF`):** Base canvas provides an organic, low-strain paper tone, elevated by crisp white surface cards bordered by `#E2E9DC`.

## Typography

The typography relies entirely on **Plus Jakarta Sans**, marrying approachable geometric contours with structured baseline metrics. 

### Tabular Numbers & Currency Architecture
All numeric representations of currency (`R$ 1.250,50`), percentages, dates, and account figures must mandate OpenType tabular numbers via CSS `font-variant-numeric: tabular-nums;` or `font-feature-settings: "tnum" 1`. This guarantees clean vertical alignment across transactional registers and statement tables.

### Portuguese Language Nuances
Body and headline leading is calibrated to accommodate standard Brazilian Portuguese diacritics (`ã`, `ç`, `é`, `ô`) without line clashing or awkward vertical shifts. Long Portuguese words (e.g., *Compartilhamento*, *Disponibilidade*) should maintain automatic hyphenation and conservative tracking to prevent awkward breaks in constrained viewports.

## Layout & Spacing

The system applies an 8-point base rhythm using a fluid, responsive 12-column grid layout across desktop environments and a 4-column structure on mobile devices:

- **Desktop (1024px+):** 12 columns, max container width of 1280px, 24px (`1.5rem`) gutters, 32px (`2rem`) side margins. Accommodates dual-pane setups (e.g., persistent conversation co-pilot sidebar alongside analytical dashboards).
- **Tablet (768px - 1023px):** 8 columns, 20px gutters, 24px side margins. Dynamic drawer reflow for conversational threads.
- **Mobile (&lt;768px):** 4 columns, 16px (`1rem`) gutters, 16px (`1rem`) canvas margins. Floating action surfaces dock to the bottom viewport edge for thumb ergonomics.

Vertical rhythm adheres strictly to the `space-*` tokens:
- Compact groupings (e.g., currency sign to value) use `space-xs` (4px).
- Internal form elements and paired tags use `space-sm` (8px).
- Card interiors and conversational bubble padding use `space-md` (16px) or `space-lg` (24px).
- Section divisions and feed separations use `space-xl` (40px).

## Elevation & Depth

Visual hierarchy prioritizes **tonal layering and low-contrast outlines** over dramatic drop shadows, sustaining a calm, editorial feel:

1. **Base Tier (Canvas):** Tone `#F7F9F5`. Completely flat baseline for full-screen layout containers.
2. **Surface Tier (Cards & Panels):** Solid `#FFFFFF` elevated via a crisp 1px structural border `#E2E9DC`. Soft ambient shadow: `0 2px 8px -2px rgba(20, 29, 20, 0.04), 0 1px 2px -1px rgba(20, 29, 20, 0.02)`.
3. **Conversational Overlay Tier (AI Insights):** Background `#DEFF8B` with an ambient glow: `0 4px 20px -2px rgba(222, 255, 139, 0.45)`.
4. **Interactive Overlays (Modals, Popovers, Drawers):** Solid `#FFFFFF` framed with `#E2E9DC` and an ambient depth drop: `0 16px 32px -8px rgba(20, 29, 20, 0.08)`. Backdrop blur `blur(8px)` over `rgba(20, 29, 20, 0.25)`.

## Shapes

The interface leverages softened geometric radii (`rounded-2xl` for macro-containers and `rounded-lg` for micro-elements) to establish an approachable, friendly environment.

- **Primary Cards and Containers:** Fixed at 16px (`1rem` / `rounded-2xl`) border radius.
- **Action Buttons, Inputs, and Badges:** Standardized at 8px (`0.5rem` / `rounded-lg`).
- **Conversational AI Bubbles:** Tailored pill-softening with 16px radii across three corners and a 4px anchor radius at the speaking vertex.
- **Filter Tags & Transaction Category Chips:** Fully rounded pill structure (`9999px`) for touch-friendly modularity.

## Components

### Buttons
- **Primary:** Filled `#8CBA51` background with white (`#FFFFFF`) bold text. Soft hover shift to `#7CA745`. Height 44px, padding: `0 20px`, radius: 8px.
- **AI Action / Quick-Prompt:** Background `#DEFF8B`, text `#141D14`, subtle border `1px solid rgba(20, 29, 20, 0.08)`. Used exclusively for AI recommendation actions.
- **Secondary / Ghost:** Transparent background with 1px border `#E2E9DC`, text `#141D14`. Hover background `#F0F4EC`.

### Conversational AI Insight Card (Co-Pilot Card)
- **Container:** Background `#DEFF8B` with text `#141D14` and 16px border-radius.
- **Header:** Features a distinct spark icon paired with `label-md` tracking indicating "Insight do Co-piloto".
- **Action Bar:** Embedded inline quick-action buttons (e.g., *"Simular reserva"*, *"Ver detalhes"*).

### Transaction & Metric Cards
- **Container:** Pure `#FFFFFF` background, 1px border `#E2E9DC`, 16px border radius, padding 20px.
- **Typography:** `label-md` uppercase category header followed by `currency-display` with tabular numbers.
- **Indicator Strip:** Thin 4px vertical status indicator at the card edge: `#8CBA51` (Dentro da meta), `#FBCEB5` (Atenção necessária), `#FF5D6C` (Excedido).

### Chips & Filter Tags
- **Default State:** Height 32px, pill-shaped (`9999px`), background `#FFFFFF`, border `1px solid #E2E9DC`, text `#141D14`.
- **Active State:** Background `#141D14`, text `#FFFFFF`, border-color `#141D14`.

### Input Fields & Conversational Input
- **Standard Input:** Height 44px, background `#FFFFFF`, border `1px solid #E2E9DC`, text `#141D14`, radius 8px. Focus ring: `2px solid #8CBA51` with 2px offset.
- **Prompt Field (Chat Bar):** Auto-expanding textarea, 16px radius, background `#FFFFFF`, border `1px solid #E2E9DC`, subtle shadow. Houses inline microphone, attachment, and send actions.

### Checkboxes & Radio Buttons
- **Checkbox:** 20x20px square with 4px border-radius. Unchecked: `#FFFFFF` with 1.5px border `#E2E9DC`. Checked: `#8CBA51` with white checkmark.
- **Radio:** 20x20px circle with inset ring. Checked state presents a solid `#8CBA51` 6px core.