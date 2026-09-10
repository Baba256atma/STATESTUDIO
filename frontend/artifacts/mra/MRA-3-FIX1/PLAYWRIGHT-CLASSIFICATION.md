# MRA:3-FIX1 — Playwright Overview Classification

**Classification: duplicate/inactive-looking DOM control relative to the painted workspace dial; harness issue if Playwright waits for visibility. Not a manager-readiness S1. Product behavior was not changed to satisfy Playwright.**

`data-testid="nexora-workspace-option-overview"` is a real workspace chip in `NexoraWorkspaceDial.tsx` (listbox option, `aria-selected` when Overview is active). Chips are small (`0.58rem`) in a `maxWidth: 10.5rem` wrap. Playwright’s visible click can wait ~45s if the chip is considered not painted (clip/stacking/size).

The manager-visible path is the dial (chevrons + `nexora-workspace-dial-active-label`). Live simulation already uses a DOM `clickTestId` evaluate click, which is the correct harness for this control.

If chips are fully occluded in some cockpit layouts, that is UX debt (accessibility of workspace options), not a reason to invent a second Overview button.
