# NPA-T UI-VISUAL-AUDIT:0 — CERTIFIED

**Phase:** Day/Night Theme & Visual Consistency Authority Audit  
**Mode:** AUDIT ONLY  
**Production changes:** 0  
**Timeline:** remains CERTIFIED + SEALED (presentation styling findings only)

## Result

NPA-T UI-VISUAL-AUDIT:0 — CERTIFIED

## Decisions

- Theme authority: `THEME_AUTHORITY_HEALTHY_WITH_BYPASSERS`
- Token authority: `TOKEN_AUTHORITY_HEALTHY_WITH_LOCAL_BYPASSERS`

## Proofs (A–Q)

### A — Live Day (`localhost:3009` `/executive`)

`html[data-theme=day]` applied. Measured:

| Surface | Computed | Source |
|---|---|---|
| `--nx-bg-app` | `#e8edf4` | `globals.css` day |
| `--nx-text` | `#0f172a` | `globals.css` day |
| Advisor color | `rgb(15, 23, 42)` | `cockpit.text` → `--nx-text` |
| Timeline Dock | `rgba(241, 245, 249, 0.92)` | `var(--nx-bg-deep)` |
| View disclosure | `rgba(10, 16, 26, 0.62)` | inline HARDCODED_COLOR |
| Scenes menu | `color-mix(#0a0e14 92%, transparent)` | inline HARDCODED_COLOR |
| Fact cards | `linear-gradient(165deg, rgba(26, 31, 42, 0.9), rgba(15, 19, 28, 0.95))` | inline HARDCODED_COLOR |
| Actions overlay | not mounted in Overview | same hardcoded family when mounted |

Card titles on Day: `Capacity observed at 87% / 25% / 2.22…%` — dark gradient + Day primary text.

### B — Live Night

Document attribute + tokens switched to night. Measured:

| Surface | Computed |
|---|---|
| `--nx-bg-app` | `#050a14` |
| `--nx-text` | `#e2e8f0` |
| Advisor color | `rgb(226, 232, 240)` |
| Timeline Dock | `rgba(2, 6, 23, 0.52)` |
| View disclosure | `rgba(10, 16, 26, 0.62)` (unchanged) |
| Fact cards | same night-first gradient (unchanged) |
| Scenes menu | same `#0a0e14` mix (unchanged) |

Bypassers are night-only literals leaking into Day, not a broken Day/Night state machine.

### C — Theme-state owner

- File: `frontend/app/lib/ui/nexoraUiTheme.tsx`
- Symbols: `ThemeMode`, `ResolvedUiTheme`, `DEFAULT_THEME_MODE`, `NEXORA_THEME_MODE_STORAGE_KEY`, `resolveThemeMode`, `persistThemeMode`, `applyResolvedUiThemeToDocument`
- Preference shape: `"night" | "day" | "auto"`
- Resolved shape: `"night" | "day"`
- Default preference: `"night"`
- Persistence: `localStorage["nx-theme-mode"]` (legacy key `nexora.ui_theme` migrated)
- `/executive` runtime holder: `NexoraExecutiveShell` `theme` / `setTheme` (`ExecutiveThemeMode` alias in `executiveCockpitTypes.ts`)

One document authority. `NexoraUiThemeProvider` is the same helpers for non-executive shells, not a second palette. `sceneThemeStore` re-exports the same store.

### D — Propagation path

```
NexoraExecutiveShell.theme (night|day|auto)
  → persistThemeMode
  → resolveThemeMode(+ prefers-color-scheme if auto)
  → applyResolvedUiThemeToDocument
  → document.documentElement[data-theme]
  → html[data-theme=night|day] --nx-* in globals.css
  → cockpit.* color fields = var(--nx-*)
  → consumers that read cockpit / CSS vars
```

Also `data-resolved-ui-theme` on the shell for diagnostics. Not a second palette.

### E — Token owner

`frontend/app/globals.css` `html[data-theme=night|day]` `--nx-*`.

Compatibility layer: `frontend/app/executive/exs1/shell/executiveCockpitTheme.ts` (colors wired to `--nx-*`; elevation remains raw dark-first rgba).

`exs1Theme.ts` aliases `cockpit` — not a second registry.

Home/`nx`/`dashboardVisualTheme` exist but are not `/executive` authorities.

### F — Actions panel

`NexoraSubjectOperation` — `background: "rgba(8, 14, 24, 0.86)"`.  
Title/text use `cockpit.text` / `cockpit.muted`.  
Classification: HARDCODED_COLOR / DISCONNECTED surface, theme-aware text.  
Same family: `NexoraSubjectReport`.

Visible “View / ACTIONS” chrome on Stage is `NexoraPresentationStateSelector` (`rgba(10, 16, 26, 0.62)`).

### G — Timeline cards

`ExecutiveTimelineDock` pack buttons:  
`background: "linear-gradient(165deg, rgba(26,31,42,0.9), rgba(15,19,28,0.95))"`  
`color: cockpit.text`  
`boxShadow: cockpit.elevation.raised`  
Not portal, not missing Day override, not variable-scope loss.

### H — Stage controls

View/Focus/Details/Actions radios: hardcoded night surfaces + `cockpit` borders/text.  
Period lenses: CORRECT (`cockpit.accentSoft` / transparent).  
Camera / breadcrumb / satellites: same hardcoded night family.

### I — Right Advisor

`NexoraAdvisorInsightRegion` `background: linear-gradient(cockpit.panel, cockpit.navy)` → `--nx-bg-panel` / `--nx-bg-hud`. Day light, Night dark. Comparison surface, not a separate theme system.

### J — Hardcoded inventory (live `/executive` path)

See report section 20.

### K — Duplicate theme search

`theme` / `appearance` / `ThemeMode` resolve to one store.  
`colorMode` = scanner/OVS object policy, not UI theme.  
`sceneThemeStore` = alias.  
No competing Day/Night state.

### L — Duplicate token search

Executive: one `--nx-*` + cockpit alias.  
Home `nx` / `dashboardVisualTheme` = other product surface.  
Do not consolidate in this phase.

### M — Portal scope

Actions, View, Timeline cards, Scenes menu render in-tree (no `createPortal` on this path). Not RC-portal.

### N — Object-material boundary

OVS materials / `RISK_COLOR` / `directorLanguage` remain separate from panel theme. INTENTIONAL_EXCEPTION.

### O — Root-cause clusters

- RC-1 — leftover night-first inline surfaces on Stage overlays
- RC-2 — Timeline fact-card night gradient (same class as RC-1)
- RC-3 — `cockpit.elevation` night-first shadows (token gap inside compatibility layer)
- RC-4 — `/executive` page wrapper `#0a0e14` / `#e8eef6`
- RC-5 — not found on `/executive`
- RC-6 — OVS / status / director colors

### P — Severity

- V1: Day fact cards (dark surface + Day `--nx-text`); Day Actions/Report overlays when mounted
- V2: View chrome, Scenes popover, camera, breadcrumb, queue, page wrapper
- V3: elevation.raised, dock inset highlight

### Q — Repair boundary

Existing Theme Authority → existing `--nx-*` / `cockpit` → reconnect bypassing consumers.  
No new design system. Timeline semantics sealed.

## Entry gate

READY FOR  
NPA-T UI-THEME-CONSISTENCY:1 — Day/Night Consumer Reconciliation
