# NPA-T STAGE-COMPOSITION:2 — Report Activation & Object-First Stage

Identity: `NPA-T STAGE-COMPOSITION:2/ReportActivationObjectFirst`

## Activation repair

Previous: `showReportSurface: showReportSurface || showOperationSurface` in `deriveNexoraMVPPresentationViewModel`.

Current: `showReportSurface` is Details/`report` only. Operation no longer opens Report.

VIEW: Focus=`minimum`, Details=`report`, Actions=`operation`. No new state.

## Gates

- Focused presentation + selector + Stage + RIGHT-OBJECT + layout + DTH: 107/107
- ACTIONS lifecycle cases remain green inside that set
- Stage host 24/24
- L4 omnibus 1790/1790
- Typecheck 0, lint PASS, build PASS, diff-check PASS, live smoke PASS
- Live `/executive` object-first / Actions / Investigate / Details / transitions / camera PASS

CLOSED: Report forced open by Actions

NPA-T STAGE-COMPOSITION:2 — CERTIFIED + SEALED
