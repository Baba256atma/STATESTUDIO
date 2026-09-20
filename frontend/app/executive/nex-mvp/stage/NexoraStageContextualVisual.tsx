"use client";

import { cockpit } from "@/app/executive/exs1/shell/executiveCockpitTheme";
import type { StageProdVisualSpec } from "@/app/lib/stage-prod/stageProdVisualSpecification.ts";
import { NexoraEvidenceVisualView } from "./NexoraEvidenceVisualView";

export function NexoraStageContextualVisual({
  spec,
  onDismiss,
}: Readonly<{
  readonly spec: StageProdVisualSpec;
  readonly onDismiss?: () => void;
}>) {
  const audit = {
    "data-testid": "nexora-stage-contextual-visual",
    "data-stage-visual-family": spec.family,
    "data-stage-visual-scene": spec.sceneScriptId,
    "data-stage-visual-object-ids": spec.canonicalObjectIds.join("|") || "none",
    "data-stage-visual-source-ids": spec.sourceIds.join("|") || "none",
    "data-stage-visual-evidence": spec.evidenceStates.join("|") || "none",
    "data-stage-visual-role": spec.sceneRole,
    "data-stage-visual-writes": "false",
  } as const;

  if ("view" in spec) {
    return (
      <section {...audit} style={{ display: "contents" }}>
        <NexoraEvidenceVisualView
          view={spec.view}
          reducedMotion
          onDismiss={onDismiss}
          inspection={Object.freeze({
            canonicalObjectIds: spec.canonicalObjectIds,
            sourceIds: spec.sourceIds,
            evidenceStates: spec.evidenceStates,
          })}
        />
      </section>
    );
  }

  return (
    <aside
      {...audit}
      aria-label={`${spec.title} status and evidence`}
      style={{
        position: "absolute",
        right: "1.25rem",
        bottom: "1.35rem",
        zIndex: 3,
        width: "min(300px, calc(100% - 2.5rem))",
        padding: "0.8rem 0.9rem",
        borderRadius: cockpit.radius.lg,
        border: `1px solid ${cockpit.border}`,
        background: cockpit.panel,
        boxShadow: cockpit.elevation.raised,
        color: cockpit.text,
        pointerEvents: "auto",
      }}
    >
      <p style={{ margin: 0, color: cockpit.muted, fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
        Scene evidence
      </p>
      <h2 style={{ margin: "0.25rem 0 0", fontSize: "0.92rem", fontWeight: 600 }}>
        {spec.title}
      </h2>
      {spec.status != null ? (
        <p data-stage-visual-status={spec.status} style={{ margin: "0.55rem 0 0", color: cockpit.accent, fontSize: "0.78rem" }}>
          {spec.status}
        </p>
      ) : null}
      {spec.evidenceSummary.length > 0 ? (
        <p style={{ margin: "0.45rem 0 0", color: cockpit.muted, fontSize: "0.7rem", lineHeight: 1.45 }}>
          {spec.evidenceSummary}
        </p>
      ) : null}
      <VisualInspection spec={spec} />
    </aside>
  );
}

function VisualInspection({ spec }: Readonly<{ spec: StageProdVisualSpec }>) {
  return (
    <details
      data-testid="nexora-stage-visual-inspection"
      data-stage-visual-inspection-writes="false"
      style={{ marginTop: "0.55rem", color: cockpit.muted, fontSize: "0.66rem" }}
    >
      <summary style={{ cursor: "pointer" }}>Inspect source</summary>
      <div data-stage-visual-inspection-object-ids={spec.canonicalObjectIds.join("|") || "none"}>
        Objects: {spec.canonicalObjectIds.join(", ") || "none"}
      </div>
      <div data-stage-visual-inspection-source-ids={spec.sourceIds.join("|") || "none"}>
        Sources: {spec.sourceIds.join(", ") || "none"}
      </div>
      <div data-stage-visual-inspection-evidence={spec.evidenceStates.join("|") || "none"}>
        Evidence: {spec.evidenceStates.join(", ") || "none"}
      </div>
    </details>
  );
}
