"use client";

import {
  canonicalTopologyStatusLabel,
  topologyPresentationSelectable,
  type TopologyStructuralRole,
} from "@/app/lib/scene-org/canonicalTopologyPresentation";
import type {
  CanonicalTopologyAnalysis,
  CanonicalTopologyType,
} from "@/app/lib/scene-org/canonicalTopologyEngine";

type Props = Readonly<{
  analysis: CanonicalTopologyAnalysis | null;
  selectedType: CanonicalTopologyType | null;
  selectedHierarchy: boolean;
  revalidation: "match" | "fallback" | "none";
  onSelect: (topologyType: CanonicalTopologyType, hierarchy: boolean) => void;
  onClear: () => void;
}>;

function candidateKey(type: CanonicalTopologyType, hierarchy: boolean): string {
  return `${type}-${hierarchy ? "hierarchy" : "structural"}`;
}

/** Inspection of derived topology candidates. It does not create relationships. */
export function NexoraTopologyInspection({
  analysis,
  selectedType,
  selectedHierarchy,
  revalidation,
  onSelect,
  onClear,
}: Props) {
  if (analysis == null) return null;
  const selected = analysis.candidates.find((candidate) =>
    candidate.topologyType === selectedType && candidate.hierarchy === selectedHierarchy);
  return (
    <section
      data-testid="nexora-topology-panel"
      data-topology-revalidation={revalidation}
      style={{ display: "grid", gap: "0.25rem", maxWidth: "18rem", fontSize: "0.62rem" }}
    >
      <strong>Detected structure</strong>
      <span data-testid="nexora-topology-bus" data-topology-bus={analysis.busStatus}>
        Bus — Unsupported: no authoritative backbone identity.
      </span>
      {analysis.candidates.filter((candidate) => candidate.topologyType !== "BUS").map((candidate) => {
        const key = candidateKey(candidate.topologyType, candidate.hierarchy);
        const label = candidate.hierarchy ? "Organizational hierarchy" : candidate.topologyType;
        const selectable = topologyPresentationSelectable(candidate.topologyType, candidate.structuralStatus);
        return (
          <span
            key={key}
            data-testid={`nexora-topology-candidate-${key}`}
            data-topology-status={candidate.structuralStatus}
            data-topology-label={canonicalTopologyStatusLabel(candidate.structuralStatus)}
            data-topology-selectable={selectable ? "true" : "false"}
            data-topology-relationships={candidate.relationshipIds.join(",") || "none"}
            data-topology-center={candidate.centerNodeId ?? "none"}
            data-topology-roots={candidate.rootNodeIds.join(",") || "none"}
            data-topology-explanation={candidate.explanation}
          >
            {label}: {canonicalTopologyStatusLabel(candidate.structuralStatus)}
            <span style={{ display: "block", color: "inherit", opacity: 0.8 }}>{candidate.explanation}</span>
            {selectable ? (
              <button
                type="button"
                data-testid={`nexora-topology-select-${key}`}
                onClick={() => onSelect(candidate.topologyType, candidate.hierarchy)}
              >
                Use presentation
              </button>
            ) : null}
          </span>
        );
      })}
      <span data-testid="nexora-topology-selected" data-topology-selected={selectedType ?? "none"} data-topology-selected-hierarchy={selectedHierarchy ? "true" : "false"}>
        Selected presentation: {selectedType ?? "none"}
        {selected ? ` — ${selected.explanation}` : ""}
      </span>
      {revalidation === "fallback" ? (
        <span data-testid="nexora-topology-fallback">The saved topology no longer matches the current graph.</span>
      ) : null}
      <button type="button" data-testid="nexora-topology-clear" onClick={onClear}>Stage</button>
    </section>
  );
}

export type { TopologyStructuralRole };
