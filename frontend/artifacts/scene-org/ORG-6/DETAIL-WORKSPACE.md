# NPA-T ORG:6 — Detail Workspace

## Stop condition

Detail opens only over an existing canonical workspace/source reference, hosts the existing Data Explorer and its authority-backed actions, represents capability availability honestly, and closes without changing Stage, selection, or Advisor conversation context.

## First divergent layer

The ORG:2 Detail seam existed only as a hidden reservation. The authoritative `NexoraExecutiveDataExplorer` and its complete RDI:2/RDI:4 lifecycle were still mounted in the Left explorer drawer. No defect was found in CSV ingestion, mapping, provenance, connection, Gate, or Data Reality ownership.

## Production integration

- Data entry now opens the reserved Detail Workspace over the management layout.
- The existing Data Explorer is composed once inside Detail; no ingestion, parsing, mapping, validation, update, removal, monitoring, or connection logic was copied.
- The handoff carries only the existing canonical workspace/source reference.
- Selecting a source updates the Detail reference to that exact source ID.
- Data and Connections are shown because their existing capabilities are present. Configuration is shown only when a committed CSV source with existing mapping controls is selected.
- Closing changes only the active presentation destination back to Home. Stage interaction, canonical selection/referent, and Advisor conversation remain mounted and unchanged.

## Authority

RDI/Data Reality/Gate, RDI:2 CSV lifecycle, RDI:4 connections, canonical Object/source identity, and existing source actions retain ownership. Detail owns presentation and its local category choice only.

## Verification

- ORG:6 focused proofs: 8 passed, 0 failed, 0 skipped.
- Focused ORG:2–6 plus Data/Detail owning-seam set: 45 passed, 0 failed, 0 skipped.
- Targeted ESLint: 0 errors in changed/new files. The shell continues to report 12 pre-existing warnings outside this change.
- `git diff --check`: clean.
- Live browser entry: Data opened `Detail Workspace` with canonical workspace context `collection · overview`; the Left drawer no longer hosted deep data content.
- Live canonical handoff: selecting Engineering Source changed the target to `github:overview:vercel/next.js` with kind `data-source` and kept the existing connected-source controls.
- Live category proof: Connections selected with the existing Engineering Source capability still present.
- Live unavailable-state proof: Configuration was absent for the connected-source context because no existing configuration capability applied.
- Live exit continuity: before/after Detail, Stage and Right both retained `obj-capacity`; the two-message Advisor transcript was byte-for-byte unchanged.
- Live browser diagnostics: 0 errors and 0 warnings.
- The first combined run had one failed test assertion because it searched for a provenance property name not rendered by the existing UI. The product behavior was not implicated; the proof was corrected to the actual canonical source attribute and existing `Evidence & provenance` seam, after which the focused and combined sets passed.

## Broader checks

No production build, repository-wide typecheck, full regression, or broad NXA funnel was run. The change does not alter a shared data contract: it relocates one existing UI composition into the already-defined Detail seam, while focused Data/Detail and ORG compatibility checks exercise the affected boundary.

## Deferred

ORG:7 activity/history and natural-language workspace control, including Save/Open Scene commands, and ORG:8 focus/density/responsive/full integration remain untouched. No Advisor command was added.

## Verdict

CERTIFIED — Detail Workspace hosts existing deep-detail capabilities without duplicating Nexora data authorities
