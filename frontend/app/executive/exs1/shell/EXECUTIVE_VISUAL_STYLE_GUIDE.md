# Executive Visual Style Guide — Sprint 2

Keywords: **Minimal · Premium · Executive · Dark-first · Focused · Calm · Elegant**

Inspired by Porsche dashboards, Bloomberg clarity, Apple HIG, Linear motion, Notion cleanliness.  
Not inspired by BI dashboards.

## Color Tokens

| Token | Night | Role |
|---|---|---|
| `bg` | `#070a10` | App canvas |
| `graphite` / `charcoal` / `navy` | layered panels | Depth |
| `text` / `textSoft` / `muted` | `#e8eef6` → `#5c6778` | Hierarchy |
| `accent` | `#38bdf8` | Focus / selection |
| `success` / `warning` / `risk` | green / amber / red | Health language |
| Day / Night / Auto | supported | No extra themes |

## Director Language

One visual identity per state (via `cockpit.director`):

Selection · Focus · Alert · Health · Decision · Execution · Monitoring · Scenario · Impact

## Typography

| Level | Size | Tracking |
|---|---|---|
| Executive Title | 1.05rem | 0.02em |
| Section Title | 0.72rem | 0.14em uppercase |
| Card Title | 0.84rem | 0.02em |
| Body | 0.82rem | 0.01em |
| Caption | 0.62rem | 0.12em |
| Status | 0.58rem | 0.14em |

## Elevation

`flat` → `raised` → `panel` → `floating` → `focus` / `asset` / `assetFocus`

## Motion Guidelines

- Duration: **200–250ms**
- Easing: `cubic-bezier(0.22, 1, 0.36, 1)`
- Use for: hover, focus, selection, open/close, fade, scale, slide
- Respect `prefers-reduced-motion` (duration → 0)

## Radius

`sm 0.35` · `md 0.5` · `lg 0.65` · `xl 0.85` · `pill`

## Icons

Single executive family: geometric glyphs / line marks already used in Stage objects.  
No mixed emoji or decorative icon packs.

## Floating Panels

Shared: radius `lg`, elevation `floating`, header/body padding `1rem`, accent close control, 240ms enter.

## Empty States

Always guide: title + body + optional next action. Never “Coming Soon” or raw placeholders.
