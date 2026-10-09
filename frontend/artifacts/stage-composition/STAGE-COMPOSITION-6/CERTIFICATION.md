# NPA-T STAGE-COMPOSITION:6 — Chart Request & ACTIONS Lifecycle Reconciliation

Identity: `NPA-T STAGE-COMPOSITION:6/ChartRequestActionsLifecycle`

## Classification

A — STALE OPERATION PRESENTATION

CEI can accept a governed visual (`visualView.view` + renderable `visualizationRoute`) while `nextRuntimeState.presentationState` remains `operation`. ACTIONS stayed mounted from the earlier VIEW choice.

## Repair

- Success gate: `nexoraMVPAcceptedVisualPresentationChanged` — this-turn DIR:VI runtime applied a non-null view (`applyNexoraVisualViewRuntime` new object with `view`), not retained/dismissed/null.
- Completion: existing `completeNexoraMVPOperationPresentation` → `operation` to `minimum`.
- Seam: `NexoraExecutiveShell` conversation result path. Visual turns use `shouldCommitRuntime: false`; fallback completes current interaction.
- Application snapshot now copies `presentationState` from interaction.
- Inventory `supportsOperation` enabled with one existing-pattern action so the required same-subject VIEW Actions path exists.

## Rule

If `presentationState` is `operation` AND a governed visual request is successfully accepted into Stage presentation, complete the transient Operation presentation using `completeNexoraMVPOperationPresentation`. Do not do this for rejected, unsupported, pending, or clarification-only visual requests.

## Gates

Typecheck 0, build PASS, git diff --check PASS, live smoke `ok: true`, live `/executive` proofs PASS.

CLOSED: chart requests while operation remains active.

NPA-T STAGE-COMPOSITION:6 — CERTIFIED + SEALED
