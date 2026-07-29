/**
 * EX-BOOTSTRAP-1 — Executive Shell.
 *
 * Lightweight root shell for the Executive Experience route.
 * Stage is active; Journal and Timeline remain placeholders.
 */

import { ExecutiveStageHost } from "./ExecutiveStageHost";

function PlaceholderRegion({
  name,
  testId,
}: {
  readonly name: string;
  readonly testId: string;
}) {
  return (
    <aside
      data-testid={testId}
      data-placeholder="true"
      aria-label={`${name} placeholder`}
      style={{
        minHeight: "4rem",
        padding: "1rem 1.5rem",
        borderTop: "1px solid rgba(143, 163, 173, 0.22)",
        color: "#6f8792",
        fontSize: "0.8rem",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {name} Placeholder
    </aside>
  );
}

/**
 * Executive Shell — Stage container with Journal and Timeline placeholders.
 */
export function ExecutiveShell() {
  return (
    <div
      data-testid="executive-shell"
      style={{
        flex: "1 1 auto",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        width: "100%",
        maxWidth: "56rem",
        margin: "0 auto",
      }}
    >
      <div
        data-testid="executive-stage-container"
        style={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          minHeight: "50vh",
        }}
      >
        <ExecutiveStageHost />
      </div>
      <PlaceholderRegion name="Journal" testId="journal-placeholder" />
      <PlaceholderRegion name="Timeline" testId="timeline-placeholder" />
    </div>
  );
}
