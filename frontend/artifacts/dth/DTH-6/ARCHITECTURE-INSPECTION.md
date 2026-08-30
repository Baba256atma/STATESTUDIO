# DTH:6 — Object Investigation Experience

## Smallest extension point

Project `ObjectInvestigationContext` from the existing Theatre foundation after DIR:1 + DTH:1–5.

Do **not** create a second Stage, object store, Scene, Advisor, investigation store, relationship engine, or evidence model.

Canonical flow:

Select Theatre Object (NEX-MVP:4 click/focus) → Theatre projection → DTH:6 investigation context (read-only) → compact HUD overlay + Advisor-readable investigation summary.

Closing investigation dismisses the overlay only. Scene Intent, Scene Script, focus, collection, and comparison stay with existing Stage authorities.

## Reused authorities

| Concern | Authority |
|---|---|
| Scene meaning | DTH:5 Scene Intent / Scene Script |
| Actors and Iconics | DTH:1–2 |
| Relationships | Existing Stage connections; DTH:3 visual encoding |
| Atmosphere | DTH:4 |
| Click / focus / selection | NEX-MVP:4 |
| Explain / evidence language | MO:2 Explain Engine (consumed, not replaced) |
| HUD width | Existing HUD panel contract (`OBJECT_PANEL_WIDTH`) |
| Advisor dialogue | Existing CC/MO/NCA path; current subject remains focused/selected object |

## Capability

Supported: `object-investigation`.

Still reserved (7): `object-investigation-cards-and-charts`, `nexo-lens-library`, `nexo-select-scenario-theatre`, `nexo-compare-decision-arena`, `nexo-time-and-theatre-replay`, `theatre-aware-advisor-suggestions`, `visual-behavior-engine`.

Investigation suggestions live on the investigation contract. They are not a DTH:11 Advisor-suggestion engine.

DTH:7 is not started.
