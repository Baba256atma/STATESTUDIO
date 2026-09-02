# DATA-UX:2 UX Design

## Delivered experience

The existing left Explorer is now presented as a quiet Theatre control: a narrow, dark Data Rail beside the Stage. A small Stage-level Data pill opens and closes it without navigating away from the active scene. The Stage remains central and the existing Advisor remains visible.

The source list uses compact rows rather than dashboard cards. Each CSV row exposes only authoritative information: file name, CSV type, manager-facing state, update date from `committedAt`, and `In use` when it is the active source. Detailed intelligence remains below the selected row.

`+ Add Data` remains the single restrained entry. CSV uses the native intake path. The already-supported live GitHub source remains visible as a real connected source; no unavailable Database/API/RAG controls were invented.

## Continuous CSV intake

The existing Upload → Preview → Mapping → Validation → Import state machine is unchanged, but its presentation is continuous:

- source identity and local handling appear first;
- `Nexora understands` lists only confirmed, non-ignored mappings;
- `Needs your help` lists unresolved fields;
- explicit copy states that parsed is not understood;
- mapping stays in-place under `Confirm meaning`;
- received rows remain available in the secondary `Preview received rows` disclosure;
- validation stays disabled until ambiguity is resolved;
- import results reuse existing Data Reality and executive-result output.

## Trust and control

- Selection is presentation-only and exposes stable source/Data Object diagnostics.
- `Ask Nexora` uses the existing Advisor.
- `Update source` uses canonical replace and requires the same source filename to preserve identity.
- Active-source removal remains refused; dependency-aware deletion was not simulated.
- Focus states, screen-reader labels, native file input, keyboard controls, and visible non-hover actions remain available.

## Visual quality assessment

The Rail uses existing Nexora cockpit tokens, restrained borders, compact typography, and no decorative motion or gradients. At the default viewport and 1024×768 it remains secondary to the Stage, with the Advisor still conversationally available. Multiple source rows remain scannable without becoming a file-management dashboard.

