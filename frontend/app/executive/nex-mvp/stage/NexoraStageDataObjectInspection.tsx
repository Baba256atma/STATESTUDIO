"use client";

import type { NexoraDecisionTheatreDataObject } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDataObjectProjection";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

type Props = Readonly<{
  dataObject: NexoraDecisionTheatreDataObject;
  onRemoveFromStage: (dataObjectId: string) => void;
  onOpenDataRail: () => void;
  onAskNexora: (question: string) => void;
}>;

/** Accessible progressive disclosure for the selected native Stage Data Object. */
export function NexoraStageDataObjectInspection({
  dataObject,
  onRemoveFromStage,
  onOpenDataRail,
  onAskNexora,
}: Props) {
  const unresolved = dataObject.unresolvedFieldCount > 0;
  const actionStyle = {
    border: `1px solid ${cockpit.border}`,
    borderRadius: cockpit.radius.sm,
    background: "transparent",
    color: cockpit.textSoft,
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "0.56rem",
    fontWeight: 650,
    padding: "0.34rem 0.44rem",
  } as const;
  return (
    <aside
      data-testid="nexora-stage-data-object-inspection"
      data-data-object-id={dataObject.id}
      data-source-id={dataObject.sourceId}
      data-remove-from-stage-deletes-source="false"
      aria-label={`Data source ${dataObject.label}`}
      style={{
        position: "absolute",
        left: "0.85rem",
        bottom: "3.45rem",
        zIndex: 12,
        width: "min(18rem, calc(100% - 1.7rem))",
        display: "grid",
        gap: "0.48rem",
        padding: "0.7rem 0.78rem",
        border: `1px solid ${cockpit.borderStrong}`,
        borderRadius: cockpit.radius.md,
        background: "rgba(9, 15, 23, 0.94)",
        boxShadow: "0 16px 44px rgba(0,0,0,0.34)",
        backdropFilter: "blur(10px)",
        color: cockpit.text,
      }}
    >
      <header style={{ display: "flex", justifyContent: "space-between", gap: "0.7rem", alignItems: "start" }}>
        <span style={{ display: "grid", gap: "0.16rem", minWidth: 0 }}>
          <span style={{ color: cockpit.lowMuted, fontSize: "0.52rem", letterSpacing: "0.13em", textTransform: "uppercase" }}>Data source · CSV</span>
          <strong style={{ fontSize: "0.76rem", overflowWrap: "anywhere" }}>{dataObject.label}</strong>
        </span>
        <span style={{ color: unresolved ? cockpit.warning : cockpit.success, fontSize: "0.56rem", textTransform: "uppercase" }}>
          {unresolved ? "Needs clarification" : "Ready"}
        </span>
      </header>
      <span style={{ color: cockpit.muted, fontSize: "0.6rem" }}>
        {dataObject.recordCount} rows · {dataObject.columnCount} fields · {dataObject.confirmedFieldCount} understood
      </span>
      <span style={{ color: cockpit.textSoft, fontSize: "0.61rem", lineHeight: 1.42 }}>
        {dataObject.relationships.length > 0
          ? `Supplies mapped data to ${dataObject.relationships.length} visible executive ${dataObject.relationships.length === 1 ? "object" : "objects"}. These links are provenance, not causality.`
          : "No supported executive relationship is claimed for this source."}
      </span>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
        <button type="button" style={actionStyle} onClick={onOpenDataRail}>Open Data</button>
        <button type="button" style={actionStyle} onClick={() => onAskNexora("Explain this data source.")}>Ask Nexora</button>
        <button
          type="button"
          data-testid="nexora-stage-data-object-remove-from-stage"
          aria-label="Remove from Stage. This does not delete the data source."
          style={actionStyle}
          onClick={() => onRemoveFromStage(dataObject.id)}
        >
          Remove from Stage
        </button>
      </div>
    </aside>
  );
}
