"use client";

import type { NexoraDecisionTheatreDataObject } from "@/app/lib/decision-theatre/nexoraDecisionTheatreDataObjectProjection";
import {
  CANONICAL_RELATIONSHIP_TYPES,
  type CanonicalRelationship,
  type CanonicalRelationshipType,
} from "@/app/lib/scene-org/canonicalRelationshipGraph";
import {
  archiveCanonicalObject,
  assignCanonicalObjectToDeck,
  deleteCanonicalObject,
  renameCanonicalObject,
  restoreCanonicalObject,
} from "@/app/lib/scene-org/canonicalObjectRegistry";
import { archiveDecisionNode } from "@/app/lib/scene-org/canonicalDecisionDomain";
import { coordinateWorkspaceMutation } from "@/app/lib/workspace/workspaceAuthorityFence";
import type { DecisionImpactAnalysis } from "@/app/lib/scene-org/decisionImpactPreview";
import { cockpit } from "../../exs1/shell/executiveCockpitTheme";

export type CanonicalRelationshipInspection = Readonly<{
  authorityStatus: "ready" | "empty" | "corrupt" | "unsupported-version";
  relationships: readonly CanonicalRelationship[];
  candidates: readonly { readonly objectId: string; readonly label: string }[];
  onCreate: (targetObjectId: string, relationshipType: CanonicalRelationshipType) => void;
  onEditType: (relationshipId: string, relationshipType: CanonicalRelationshipType) => void;
  onArchive: (relationshipId: string) => void;
  onRestore: (relationshipId: string) => void;
  onDelete: (relationshipId: string) => void;
  topologyMembership?: Readonly<{
    presentation: string | null;
    role: string;
    explanation: string;
    hierarchyClaim: boolean;
  }> | null;
}>;

type Props = Readonly<{
  dataObject: NexoraDecisionTheatreDataObject;
  onRemoveFromStage: (dataObjectId: string) => void;
  onOpenDataRail: () => void;
  onAskNexora: (question: string) => void;
  relationshipInspection?: CanonicalRelationshipInspection | null;
  impactAnalysis?: DecisionImpactAnalysis | null;
  onAnalyzeImpact?: (decisionId: string) => void;
  onIncreaseImpactDepth?: () => void;
  onInspectImpactObject?: (objectId: string) => void;
}>;

function relationshipPhrase(relationship: CanonicalRelationship, selectedId: string): string {
  const incoming = relationship.targetObjectId === selectedId && relationship.sourceObjectId !== selectedId;
  if (relationship.relationshipType === "DEPENDS_ON") return incoming ? "Depended on by" : "Depends on";
  if (relationship.relationshipType === "REPORTS_TO") return incoming ? "Receives reports from" : "Reports to";
  if (relationship.relationshipType === "SUPPLIES_TO") return incoming ? "Supplied by" : "Supplies to";
  if (relationship.relationshipType === "MONITORS") return incoming ? "Monitored by" : "Monitors";
  if (relationship.relationshipType === "CONTAINS") return incoming ? "Contained by" : "Contains";
  return "Associated with";
}

/** Accessible progressive disclosure for the selected native Stage Data Object. */
export function NexoraStageDataObjectInspection({
  dataObject,
  onRemoveFromStage,
  onOpenDataRail,
  onAskNexora,
  relationshipInspection = null,
  impactAnalysis = null,
  onAnalyzeImpact,
  onIncreaseImpactDepth,
  onInspectImpactObject,
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
      {dataObject.decisionDomain ? (
        <section
          data-testid="nexora-decision-inspection"
          data-node-kind={dataObject.decisionDomain.kind}
          data-canonical-id={dataObject.id}
          data-lifecycle={dataObject.decisionDomain.lifecycleStatus}
          data-provenance={dataObject.decisionDomain.provenance}
          data-approval={dataObject.decisionDomain.approvalStatus ?? "none"}
          data-related={dataObject.decisionDomain.related.join("|") || "none"}
        >
          <strong>{dataObject.decisionDomain.kind}</strong>
          <span style={{ display: "block" }}>{dataObject.label}</span>
          <span style={{ display: "block" }}>{dataObject.id}</span>
          <span style={{ display: "block" }}>{dataObject.decisionDomain.provenance} · {dataObject.decisionDomain.lifecycleStatus}</span>
          <span style={{ display: "block" }}>Related: {dataObject.decisionDomain.related.join(", ") || "none"}</span>
          {dataObject.decisionDomain.lifecycleStatus !== "ARCHIVED" && dataObject.decisionDomain.lifecycleStatus !== "DELETED" ? (
            <button type="button" data-testid="nexora-decision-archive" onClick={() => { void coordinateWorkspaceMutation({ workspaceId: dataObject.workspaceId }, () => { archiveDecisionNode({ workspaceId: dataObject.workspaceId, deckId: dataObject.decisionDomain!.deckId, nodeId: dataObject.id }); }); }}>Archive</button>
          ) : null}
          {dataObject.decisionDomain.kind === "DECISION" ? (
            <button type="button" data-testid="nexora-impact-analyze" onClick={() => onAnalyzeImpact?.(dataObject.id)}>Analyze Impact</button>
          ) : null}
        </section>
      ) : null}
      {impactAnalysis && (dataObject.decisionDomain?.kind === "DECISION" || dataObject.impactRole === "DIRECT_TARGET" || dataObject.impactRole === "CONNECTED_OBJECT") ? (
        <section
          data-testid="nexora-impact-preview"
          data-impact-status={impactAnalysis.status}
          data-impact-truncated={impactAnalysis.status === "ready" ? String(impactAnalysis.preview.truncated) : "blocked"}
          data-impact-decision-status={impactAnalysis.status === "ready" ? impactAnalysis.preview.decisionStatus : "none"}
          data-direct-ids={impactAnalysis.status === "ready" ? impactAnalysis.preview.directTargets.map((item) => item.objectId).join(",") || "none" : "none"}
          data-connected-ids={impactAnalysis.status === "ready" ? impactAnalysis.preview.connectedObjects.map((item) => item.objectId).join(",") || "none" : "none"}
          data-context-ids={impactAnalysis.status === "ready" ? impactAnalysis.preview.decisionContext.map((item) => item.id).join(",") || "none" : "none"}
          data-missing-count={impactAnalysis.status === "ready" ? String(impactAnalysis.preview.missingReferences.length) : "0"}
          data-evidence-count={impactAnalysis.status === "ready" ? String(impactAnalysis.preview.evidenceSources.length) : "0"}
          data-consequence="insufficient-evidence"
        >
          <strong>Impact inspection</strong>
          {impactAnalysis.status === "blocked" ? <span style={{ display: "block" }}>Analysis unavailable: {impactAnalysis.reason}</span> : null}
          {impactAnalysis.status === "ready" ? (
            <>
              <span style={{ display: "block" }}>Decision {impactAnalysis.preview.decisionId} · {impactAnalysis.preview.decisionStatus}</span>
              <span style={{ display: "block" }}>Context: {impactAnalysis.preview.decisionContext.map((item) => `${item.kind} ${item.name} ${item.lifecycleStatus}`).join(" · ") || "none"}</span>
              {impactAnalysis.preview.directTargets.map((item) => (
                <button key={item.objectId} type="button" data-testid={`nexora-impact-direct-${item.objectId}`} onClick={() => onInspectImpactObject?.(item.objectId)}>
                  Direct target {item.name} {item.objectType}. {item.explanation} Requires investigation.
                </button>
              ))}
              {impactAnalysis.preview.connectedObjects.map((item) => (
                <button key={item.objectId} type="button" data-testid={`nexora-impact-connected-${item.objectId}`} data-path-depth={item.depth} data-traversal={item.path.map((step) => `${step.relationshipType}:${step.traversal}`).join("|")} onClick={() => onInspectImpactObject?.(item.objectId)}>
                  Connected {item.name}. Potentially relevant. {item.explanation}
                </button>
              ))}
              {impactAnalysis.preview.evidenceSources.map((item) => (
                <span key={`${item.datasetId}:${item.sourceKey}`} style={{ display: "block" }} data-testid={`nexora-impact-evidence-${item.datasetId}`}>
                  Dataset {item.datasetId} · {item.sourceKey} · {item.availability} · {item.importId ?? "no import"} · conflicts {item.conflicts.map((conflict) => `${conflict.attribute} ${conflict.canonicalValue}/${conflict.sourceValue}`).join(", ") || "none"}
                </span>
              ))}
              {impactAnalysis.preview.missingReferences.map((item) => (
                <span key={`${item.reason}:${item.relationshipId}`} style={{ display: "block" }}>{item.detail}</span>
              ))}
              {impactAnalysis.preview.limitations.map((item) => <span key={item} style={{ display: "block" }}>{item}</span>)}
              <button type="button" data-testid="nexora-impact-deeper" onClick={() => onIncreaseImpactDepth?.()}>Trace one more relationship hop</button>
            </>
          ) : null}
        </section>
      ) : null}
      {dataObject.organizational ? (
        <section data-testid="nexora-org-inspection" data-canonical-object-id={dataObject.id} data-object-type={dataObject.organizational.objectType} data-object-provenance={dataObject.organizational.provenance} data-object-lifecycle={dataObject.organizational.lifecycleStatus} data-object-decks={dataObject.organizational.deckIds.join(",") || "none"}>
          <strong>{dataObject.organizational.objectType}</strong>
          <span style={{ display: "block" }}>{dataObject.id}</span>
          <span style={{ display: "block" }}>{dataObject.organizational.provenance} · {dataObject.organizational.lifecycleStatus} · {dataObject.organizational.reconciliationStatus}</span>
          <span style={{ display: "block" }}>{Object.entries(dataObject.organizational.attributes).map(([key, value]) => `${key}: ${String(value)}`).join(" · ") || "No attributes"}</span>
          <span style={{ display: "block" }} data-testid="nexora-org-source-associations">Sources: {dataObject.organizational.sourceAssociations?.join(" | ") || dataObject.organizational.sourceDatasetIds.join(", ") || "none"}</span>
          <form onSubmit={(event) => {
            event.preventDefault();
            const name = (event.currentTarget.elements.namedItem("name") as HTMLInputElement).value;
            if (name.trim()) void coordinateWorkspaceMutation({ workspaceId: dataObject.workspaceId }, () => { renameCanonicalObject({ workspaceId: dataObject.workspaceId, canonicalObjectId: dataObject.id, displayName: name }); });
          }}>
            <input name="name" data-testid="nexora-org-rename-name" defaultValue={dataObject.label} />
            <button type="submit" data-testid="nexora-org-rename">Rename</button>
          </form>
          {dataObject.organizational.lifecycleStatus === "ACTIVE" ? (
            <button type="button" data-testid="nexora-org-archive" onClick={() => { void coordinateWorkspaceMutation({ workspaceId: dataObject.workspaceId }, () => { archiveCanonicalObject({ workspaceId: dataObject.workspaceId, canonicalObjectId: dataObject.id }); }); }}>Archive</button>
          ) : (
            <button type="button" data-testid="nexora-org-restore" onClick={() => { void coordinateWorkspaceMutation({ workspaceId: dataObject.workspaceId }, () => { restoreCanonicalObject({ workspaceId: dataObject.workspaceId, canonicalObjectId: dataObject.id }); }); }}>Restore</button>
          )}
          <button type="button" data-testid="nexora-org-assign-executive" onClick={() => { void coordinateWorkspaceMutation({ workspaceId: dataObject.workspaceId }, () => { assignCanonicalObjectToDeck({ workspaceId: dataObject.workspaceId, canonicalObjectId: dataObject.id, deckId: "executive" }); }); }}>Show on Executive</button>
          <button type="button" data-testid="nexora-org-delete" onClick={() => { void coordinateWorkspaceMutation({ workspaceId: dataObject.workspaceId }, () => { deleteCanonicalObject({ workspaceId: dataObject.workspaceId, canonicalObjectId: dataObject.id }); }); }}>Delete</button>
        </section>
      ) : null}
      <header style={{ display: "flex", justifyContent: "space-between", gap: "0.7rem", alignItems: "start" }}>
        <span style={{ display: "grid", gap: "0.16rem", minWidth: 0 }}>
          <span style={{ color: cockpit.lowMuted, fontSize: "0.52rem", letterSpacing: "0.13em", textTransform: "uppercase" }}>{dataObject.organizational ? dataObject.organizational.objectType : "Data source · CSV"}</span>
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
      {relationshipInspection ? (
        <section data-testid="nexora-relationship-panel" style={{ display: "grid", gap: "0.35rem" }}>
          <strong style={{ fontSize: "0.62rem" }}>Relationships</strong>
          {relationshipInspection.authorityStatus === "corrupt" || relationshipInspection.authorityStatus === "unsupported-version" ? (
            <span data-testid="nexora-relationship-authority" data-authority-status={relationshipInspection.authorityStatus}>
              Relationship storage cannot be read. Nexora is not treating it as an empty graph.
            </span>
          ) : (
            <>
              <span data-testid="nexora-relationship-authority" data-authority-status={relationshipInspection.authorityStatus} style={{ color: cockpit.muted, fontSize: "0.58rem" }}>
                Workspace-owned. These links are not causal claims.
              </span>
              {relationshipInspection.topologyMembership ? (
                <span
                  data-testid="nexora-topology-membership"
                  data-topology-presentation={relationshipInspection.topologyMembership.presentation ?? "none"}
                  data-topology-role={relationshipInspection.topologyMembership.role}
                  data-topology-hierarchy-claim={relationshipInspection.topologyMembership.hierarchyClaim ? "true" : "false"}
                >
                  Topology: {relationshipInspection.topologyMembership.presentation ?? "none"}. Role: {relationshipInspection.topologyMembership.role}. {relationshipInspection.topologyMembership.explanation}
                  {relationshipInspection.topologyMembership.hierarchyClaim ? "" : " Organizational hierarchy is not claimed from this presentation."}
                </span>
              ) : null}
              {relationshipInspection.relationships.length === 0 ? (
                <span data-testid="nexora-relationship-empty">No canonical relationships for this object.</span>
              ) : relationshipInspection.relationships.map((relationship) => {
                const source = relationshipInspection.candidates.find((candidate) => candidate.objectId === relationship.sourceObjectId);
                const target = relationshipInspection.candidates.find((candidate) => candidate.objectId === relationship.targetObjectId);
                const otherId = relationship.sourceObjectId === dataObject.id
                  ? relationship.targetObjectId
                  : relationship.sourceObjectId;
                const other = relationshipInspection.candidates.find((candidate) => candidate.objectId === otherId);
                return (
                  <span key={relationship.relationshipId} data-testid={`nexora-relationship-row-${relationship.relationshipId}`} data-relationship-id={relationship.relationshipId} data-relationship-type={relationship.relationshipType} data-relationship-status={relationship.status} data-relationship-direction={relationship.direction} data-relationship-origin={relationship.provenance.origin} data-relationship-source={relationship.sourceObjectId} data-relationship-target={relationship.targetObjectId}>
                    {relationshipPhrase(relationship, dataObject.id)} {other?.label ?? otherId}
                    <span style={{ display: "block" }}>
                      {relationship.relationshipId} · {source?.label ?? relationship.sourceObjectId} to {target?.label ?? relationship.targetObjectId} · {relationship.direction} · {relationship.provenance.origin} · {relationship.status}
                      {relationship.relationshipType === "DEPENDS_ON" ? " · dependency, not proven causality" : ""}
                    </span>
                    <select
                      aria-label={`Relationship type ${relationship.relationshipId}`}
                      data-testid={`nexora-relationship-edit-${relationship.relationshipId}`}
                      value={relationship.relationshipType}
                      onChange={(event) => relationshipInspection.onEditType(relationship.relationshipId, event.target.value as CanonicalRelationshipType)}
                    >
                      {CANONICAL_RELATIONSHIP_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                    </select>
                    {relationship.status === "ACTIVE" ? (
                      <button type="button" data-testid={`nexora-relationship-archive-${relationship.relationshipId}`} onClick={() => relationshipInspection.onArchive(relationship.relationshipId)}>Archive</button>
                    ) : (
                      <button type="button" data-testid={`nexora-relationship-restore-${relationship.relationshipId}`} onClick={() => relationshipInspection.onRestore(relationship.relationshipId)}>Restore</button>
                    )}
                    <button type="button" data-testid={`nexora-relationship-delete-${relationship.relationshipId}`} onClick={() => relationshipInspection.onDelete(relationship.relationshipId)}>Delete</button>
                  </span>
                );
              })}
              <form
                data-testid="nexora-relationship-create-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = event.currentTarget;
                  const target = (form.elements.namedItem("target") as HTMLSelectElement).value;
                  const type = (form.elements.namedItem("type") as HTMLSelectElement).value as CanonicalRelationshipType;
                  if (target && type) relationshipInspection.onCreate(target, type);
                }}
                style={{ display: "grid", gap: "0.25rem" }}
              >
                <select name="target" data-testid="nexora-relationship-target" defaultValue="">
                  <option value="">Select object</option>
                  {relationshipInspection.candidates.filter((candidate) => candidate.objectId !== dataObject.id).map((candidate) => (
                    <option key={candidate.objectId} value={candidate.objectId}>{candidate.label}</option>
                  ))}
                </select>
                <select name="type" data-testid="nexora-relationship-type" defaultValue="DEPENDS_ON">
                  {CANONICAL_RELATIONSHIP_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
                <button type="submit" data-testid="nexora-relationship-create">Create relationship</button>
              </form>
            </>
          )}
        </section>
      ) : null}
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
