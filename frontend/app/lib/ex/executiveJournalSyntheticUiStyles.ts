/**
 * EX-2 Tier-0 Synthetic UI — canonical styling path.
 *
 * Single source of truth: CSS text with stable `ex2t0-*` class names and
 * real `@media` breakpoints. Injected by the React preview (works in
 * node:test via class names; media queries apply in real browsers).
 *
 * Authorized by EX2-UI-AUTH-T0-2026-07-27-01.
 */

/** Stable class-name map used by Preview/Harness. */
export const ex2t0 = Object.freeze({
  root: "ex2t0-root",
  marker: "ex2t0-marker",
  detailMarker: "ex2t0-detail-marker",
  header: "ex2t0-header",
  title: "ex2t0-title",
  subtitle: "ex2t0-subtitle",
  scope: "ex2t0-scope",
  filters: "ex2t0-filters",
  filterGroup: "ex2t0-filter-group",
  filterLabel: "ex2t0-filter-label",
  filterControl: "ex2t0-filter-control",
  layout: "ex2t0-layout",
  listRegion: "ex2t0-list-region",
  detailRegion: "ex2t0-detail-region",
  regionHeading: "ex2t0-region-heading",
  recordList: "ex2t0-record-list",
  recordButton: "ex2t0-record-button",
  recordButtonSelected: "ex2t0-record-button-selected",
  recordPrimary: "ex2t0-record-primary",
  recordSecondary: "ex2t0-record-secondary",
  statusRow: "ex2t0-status-row",
  statusLabel: "ex2t0-status-label",
  fieldList: "ex2t0-field-list",
  fieldName: "ex2t0-field-name",
  fieldValue: "ex2t0-field-value",
  refValue: "ex2t0-ref-value",
  statePanel: "ex2t0-state-panel",
  stateHeading: "ex2t0-state-heading",
  stateMessage: "ex2t0-state-message",
  liveRegion: "ex2t0-live-region",
  harness: "ex2t0-harness",
  harnessNote: "ex2t0-harness-note",
} as const);

/**
 * Canonical CSS. Responsive master/detail at min-width 1024px.
 * Contrast-tuned against dark Nexora defaults with light fallbacks.
 */
export const ExecutiveJournalSyntheticUiCssText = `
.${ex2t0.root}, .${ex2t0.harness} {
  --ex2-t0-bg: var(--nx-bg-panel, #1e293b);
  --ex2-t0-bg-soft: var(--nx-bg-panel-soft, #0f172a);
  --ex2-t0-border: var(--nx-border, rgba(148, 163, 184, 0.28));
  --ex2-t0-border-strong: var(--nx-border-strong, rgba(96, 165, 250, 0.55));
  --ex2-t0-text: var(--nx-text, #e2e8f0);
  --ex2-t0-text-strong: var(--nx-text-strong, #f8fafc);
  --ex2-t0-muted: var(--nx-muted, #cbd5e1);
  --ex2-t0-accent: var(--nx-accent, #60a5fa);
  --ex2-t0-focus: var(--nx-focus-ring, #93c5fd);
  --ex2-t0-selected-bg: var(
    --nx-nav-tile-active-bg,
    linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(15, 23, 42, 0.88))
  );
  --ex2-t0-selected-border: var(
    --nx-nav-tile-active-border,
    rgba(96, 165, 250, 0.55)
  );
  --ex2-t0-selected-text: var(--nx-nav-short-active, #bfdbfe);
  --ex2-t0-banner-bg: #3f3208;
  --ex2-t0-banner-text: #fff8db;
  --ex2-t0-banner-border: #e8c547;
  box-sizing: border-box;
  width: 100%;
  max-width: 72rem;
  margin: 0 auto;
  padding: 1rem 1.25rem 1.75rem;
  color: var(--ex2-t0-text);
  background: var(--ex2-t0-bg-soft);
  border: 1px solid var(--ex2-t0-border);
  border-radius: 0.5rem;
  font-family: "IBM Plex Sans", "Segoe UI", system-ui, sans-serif;
  font-size: 0.9375rem;
  line-height: 1.45;
  overflow-x: hidden;
  position: relative;
}
.${ex2t0.root} *, .${ex2t0.harness} *,
.${ex2t0.root} *::before, .${ex2t0.harness} *::before,
.${ex2t0.root} *::after, .${ex2t0.harness} *::after {
  box-sizing: border-box;
}
.${ex2t0.marker}, .${ex2t0.detailMarker} {
  display: block;
  width: 100%;
  margin: 0 0 1rem;
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--ex2-t0-banner-border);
  background: var(--ex2-t0-banner-bg);
  color: var(--ex2-t0-banner-text);
  font-size: 0.8125rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  white-space: normal;
  overflow-wrap: anywhere;
}
.${ex2t0.detailMarker} { margin-bottom: 0.75rem; }
.${ex2t0.header} { margin-bottom: 1rem; }
.${ex2t0.title} {
  margin: 0 0 0.35rem;
  color: var(--ex2-t0-text-strong);
  font-size: 1.25rem;
  font-weight: 650;
  letter-spacing: 0.01em;
}
.${ex2t0.subtitle} {
  margin: 0 0 0.5rem;
  color: var(--ex2-t0-muted);
  font-size: 0.875rem;
}
.${ex2t0.scope} {
  margin: 0;
  color: var(--ex2-t0-muted);
  font-size: 0.8125rem;
}
.${ex2t0.filters} {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1rem;
  margin: 0 0 1rem;
  padding: 0.75rem;
  border: 1px solid var(--ex2-t0-border);
  border-radius: 0.375rem;
  background: var(--ex2-t0-bg);
}
.${ex2t0.filterGroup} {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 10rem;
  flex: 1 1 10rem;
}
.${ex2t0.filterLabel} {
  color: var(--ex2-t0-muted);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.${ex2t0.filterControl} {
  min-height: 2.75rem;
  min-width: 2.75rem;
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--ex2-t0-border-strong);
  border-radius: 0.25rem;
  background: var(--ex2-t0-bg-soft);
  color: var(--ex2-t0-text);
  font: inherit;
}
.${ex2t0.filterControl}:focus-visible,
.${ex2t0.recordButton}:focus-visible,
.${ex2t0.recordButtonSelected}:focus-visible {
  outline: 3px solid var(--ex2-t0-focus);
  outline-offset: 2px;
}
.${ex2t0.layout} {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  align-items: start;
}
.${ex2t0.listRegion}, .${ex2t0.detailRegion} {
  min-width: 0;
  padding: 0.85rem;
  border: 1px solid var(--ex2-t0-border);
  border-radius: 0.375rem;
  background: var(--ex2-t0-bg);
}
.${ex2t0.regionHeading} {
  margin: 0 0 0.65rem;
  color: var(--ex2-t0-text-strong);
  font-size: 0.8125rem;
  font-weight: 650;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.${ex2t0.recordList} {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.${ex2t0.recordButton}, .${ex2t0.recordButtonSelected} {
  display: block;
  width: 100%;
  min-height: 2.75rem;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--ex2-t0-border);
  border-radius: 0.25rem;
  background: transparent;
  color: inherit;
  text-align: left;
  font: inherit;
  cursor: pointer;
}
.${ex2t0.recordButtonSelected} {
  border-color: var(--ex2-t0-selected-border);
  background: var(--ex2-t0-selected-bg);
}
.${ex2t0.recordButtonSelected} .${ex2t0.recordPrimary},
.${ex2t0.recordButtonSelected} .${ex2t0.recordSecondary} {
  color: var(--ex2-t0-selected-text);
}
.${ex2t0.recordPrimary} {
  display: block;
  color: var(--ex2-t0-text-strong);
  font-weight: 600;
}
.${ex2t0.recordSecondary} {
  display: block;
  margin-top: 0.2rem;
  color: var(--ex2-t0-muted);
  font-size: 0.8125rem;
}
.${ex2t0.statusRow} {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0.65rem 0 0;
}
.${ex2t0.statusLabel} {
  display: inline-block;
  max-width: 100%;
  padding: 0.2rem 0.45rem;
  border: 1px solid var(--ex2-t0-border);
  border-radius: 0.2rem;
  background: var(--ex2-t0-bg-soft);
  color: var(--ex2-t0-text);
  font-size: 0.75rem;
  overflow-wrap: anywhere;
}
.${ex2t0.fieldList} {
  list-style: none;
  margin: 0.75rem 0 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}
.${ex2t0.fieldName} {
  display: block;
  color: var(--ex2-t0-muted);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.${ex2t0.fieldValue}, .${ex2t0.refValue} {
  display: block;
  margin-top: 0.15rem;
  color: var(--ex2-t0-text);
  overflow-wrap: anywhere;
  word-break: break-word;
}
.${ex2t0.refValue} {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.8125rem;
}
.${ex2t0.statePanel} {
  margin: 0.5rem 0 0;
  padding: 0.85rem;
  border: 1px solid var(--ex2-t0-border);
  border-radius: 0.375rem;
  background: var(--ex2-t0-bg);
}
.${ex2t0.stateHeading} {
  margin: 0 0 0.35rem;
  color: var(--ex2-t0-text-strong);
  font-size: 1rem;
  font-weight: 650;
}
.${ex2t0.stateMessage} {
  margin: 0;
  color: var(--ex2-t0-muted);
}
.${ex2t0.liveRegion} {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
.${ex2t0.harnessNote} {
  margin: 0 0 1rem;
  padding: 0.55rem 0.75rem;
  border: 1px dashed var(--ex2-t0-border-strong);
  color: var(--ex2-t0-muted);
  font-size: 0.8125rem;
}

/* Tablet/desktop master-detail split — real viewport media query */
@media (min-width: 1024px) {
  .${ex2t0.layout} {
    grid-template-columns: minmax(16rem, 0.95fr) minmax(18rem, 1.25fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .${ex2t0.root} *, .${ex2t0.harness} * {
    transition: none;
    animation: none;
  }
}
`.trim();

/** @deprecated Use ex2t0 class map + ExecutiveJournalSyntheticUiCssText. */
export const executiveJournalSyntheticUiStyles = Object.freeze({
  cssText: ExecutiveJournalSyntheticUiCssText,
  classes: ex2t0,
});
