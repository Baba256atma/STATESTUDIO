/**
 * NPA-T NMI:3 — interpret NMI:1 relationships in management terms.
 * Direction-aware. Does not invent edges or upgrade causality.
 */

import type { ManagementMap, ManagementMapNode } from "./nmiManagementMapContract.ts";
import type { NmiCanonicalRef, NmiNodeKind } from "./nmiContract.ts";
import type { NmiManagementRelation, NmiManagementRelationship, NmiRelationEpistemicStatus } from "./nmiRelationshipContract.ts";
import {
  NMI_RELATIONSHIP_KIND_CLASS,
  type ManagementRelationshipIntelligence,
  type NmiCausalCommunication,
  type NmiManagementCertainty,
  type NmiRelationshipClass,
  type NmiRelationshipGapReason,
  type NmiVaiCausalOverlay,
} from "./nmiRelationshipIntelligenceContract.ts";
import { nmiRelationshipIntelligenceIdentity } from "./nmiRelationshipIntelligenceIdentity.ts";

function nodeById(map: ManagementMap): ReadonlyMap<string, ManagementMapNode> {
  return new Map(map.nodes.map((node) => [node.nodeId, node]));
}

function classify(kind: NmiManagementRelation, sourceKind: NmiNodeKind | null, targetKind: NmiNodeKind | null): NmiRelationshipClass {
  if (kind === "supports" && (sourceKind === "DATA_EVIDENCE" || targetKind === "DATA_EVIDENCE")) {
    return "EVIDENCE";
  }
  return NMI_RELATIONSHIP_KIND_CLASS[kind];
}

function meaning(
  kind: NmiManagementRelation,
  sourceKind: NmiNodeKind | null,
  targetKind: NmiNodeKind | null,
): string {
  const from = sourceKind ?? "source";
  const to = targetKind ?? "target";
  switch (kind) {
    case "measures":
      return `${from} measures ${to}`;
    case "evidenced_by":
      return `${from} is evidenced by ${to}`;
    case "threatens":
      return `${from} threatens ${to}`;
    case "belongs_to":
      return `${from} belongs to ${to}`;
    case "depends_on":
      return `${from} depends on ${to}`;
    case "supports":
      return `${from} supports ${to}`;
    case "affects":
      return `${from} may affect ${to}; this is not a confirmed cause`;
    case "addresses":
      return `${from} addresses ${to}`;
    case "evaluated_by":
      return `${from} is evaluated by ${to}`;
    case "selected_as":
      return `${from} is selected as / committed relative to ${to}`;
    case "executed_by":
      return `${from} implements / is the execution of ${to}`;
    case "observed_by":
      return `${from} is observed from ${to}`;
    case "reassesses":
      return `${from} reassesses ${to}`;
    default:
      return `${from} relates to ${to}`;
  }
}

function certainty(
  epistemic: NmiRelationEpistemicStatus,
  overlay: NmiVaiCausalOverlay | undefined,
): NmiManagementCertainty {
  if (overlay?.conflictingEvidence) return "AMBIGUOUS";
  if (overlay?.coreInt3CauseEstablished === true && overlay.vaiCausalStatus === "EVIDENCE_SUPPORTED") {
    return "CONFIRMED";
  }
  if (overlay?.vaiCausalStatus === "HYPOTHESIS" || overlay?.vaiLadder === "CAUSAL_HYPOTHESIS") {
    return "ASSUMED";
  }
  if (
    overlay?.vaiAssociationStatus === "SUPPORTED" ||
    overlay?.vaiAssociationStatus === "STRONG"
  ) {
    return "LIKELY";
  }
  if (epistemic === "UNKNOWN") return "UNKNOWN";
  if (epistemic === "ASSOCIATION") return "UNKNOWN";
  if (epistemic === "MANAGER_ASSERTED") return "ASSUMED";
  if (epistemic === "EVIDENCE_REFERENCED" || epistemic === "DECLARED") return "SUPPORTED";
  return "UNKNOWN";
}

function causalCommunication(
  kind: NmiManagementRelation,
  epistemic: NmiRelationEpistemicStatus,
  overlay: NmiVaiCausalOverlay | undefined,
): NmiCausalCommunication {
  if (overlay?.coreInt3CauseEstablished === true && overlay.vaiCausalStatus === "EVIDENCE_SUPPORTED") {
    return "CONFIRMED_CAUSAL_RELATIONSHIP";
  }
  if (
    overlay?.vaiCausalStatus === "HYPOTHESIS" ||
    overlay?.vaiCausalStatus === "EVIDENCE_SUPPORTED" ||
    overlay?.vaiLadder === "CAUSAL_HYPOTHESIS" ||
    overlay?.vaiLadder === "EVIDENCE_SUPPORTED_CAUSAL"
  ) {
    return "SUPPORTED_CAUSAL_HYPOTHESIS";
  }
  if (kind === "belongs_to" || kind === "depends_on") return "STRUCTURAL_RELATIONSHIP";
  if (kind === "affects") return "ANALYTICAL_INFLUENCE";
  if (epistemic === "ASSOCIATION") return "ASSOCIATION";
  return "NON_CAUSAL";
}

function unresolvedReason(
  rel: NmiManagementRelationship,
  source: ManagementMapNode | undefined,
  target: ManagementMapNode | undefined,
  overlay: NmiVaiCausalOverlay | undefined,
): NmiRelationshipGapReason | null {
  if (!source || !target) return "CANONICAL_REFERENCE_MISSING";
  if (overlay?.coreInt3CauseEstablished === true && overlay.vaiCausalStatus !== "EVIDENCE_SUPPORTED") {
    return "UNSUPPORTED_CAUSAL_LINK";
  }
  if (rel.epistemicStatus === "UNKNOWN") return "MISSING_EVIDENCE";
  return null;
}

export function interpretNmiRelationship(
  map: ManagementMap,
  rel: NmiManagementRelationship,
  overlay?: NmiVaiCausalOverlay,
): ManagementRelationshipIntelligence {
  const nodes = nodeById(map);
  const source = nodes.get(rel.fromId);
  const target = nodes.get(rel.toId);
  const sourceKind = source?.kind ?? null;
  const targetKind = target?.kind ?? null;
  const sourceRef: NmiCanonicalRef | null = source?.canonicalRef ?? null;
  const targetRef: NmiCanonicalRef | null = target?.canonicalRef ?? null;
  const communication = causalCommunication(rel.kind, rel.epistemicStatus, overlay);
  const rejectedCausal =
    overlay?.coreInt3CauseEstablished === true && overlay.vaiCausalStatus !== "EVIDENCE_SUPPORTED"
      ? "UNSUPPORTED_CAUSAL_LINK"
      : unresolvedReason(rel, source, target, overlay);
  return Object.freeze({
    identity: nmiRelationshipIntelligenceIdentity,
    relationshipId: rel.relationshipId,
    sourceRef,
    targetRef,
    sourceId: rel.fromId,
    targetId: rel.toId,
    kind: rel.kind,
    managementClass: classify(rel.kind, sourceKind, targetKind),
    managementMeaning: meaning(rel.kind, sourceKind, targetKind),
    evidenceRefs: Object.freeze(
      rel.epistemicStatus === "EVIDENCE_REFERENCED" || rel.kind === "evidenced_by"
        ? [rel.sourceRef]
        : [],
    ),
    provenance: Object.freeze([rel.sourceAuthority, rel.sourceRef, ...map.compositionProvenance]),
    epistemicStatus: rel.epistemicStatus,
    causal: false,
    causalCommunication:
      rejectedCausal === "UNSUPPORTED_CAUSAL_LINK" ? "ANALYTICAL_INFLUENCE" : communication,
    certainty: rejectedCausal === "UNSUPPORTED_CAUSAL_LINK" ? "UNKNOWN" : certainty(rel.epistemicStatus, overlay),
    numericStrength: null,
    unresolvedReason: rejectedCausal,
    directionPreserved: true,
    reversesSemanticMeaning: false,
    canonicalRelationshipAuthority: "NMI:1",
    causalAuthority: "VAI:3 / CORE-INT:3",
  });
}

export function interpretNmiRelationships(
  map: ManagementMap,
  overlays: readonly NmiVaiCausalOverlay[] = [],
): readonly ManagementRelationshipIntelligence[] {
  const byId = new Map(overlays.map((item) => [item.relationshipId, item]));
  return Object.freeze(
    [...map.relationships]
      .sort((a, b) => a.relationshipId.localeCompare(b.relationshipId))
      .map((rel) => interpretNmiRelationship(map, rel, byId.get(rel.relationshipId))),
  );
}

export function explainNmiRelationshipTrace(
  interpretations: readonly ManagementRelationshipIntelligence[],
): readonly string[] {
  const lines: string[] = [];
  for (const item of interpretations) {
    lines.push(item.sourceId);
    lines.push("   │");
    lines.push(`   ├── ${item.kind} [${item.managementClass}] [${item.causalCommunication}]`);
    lines.push("   │");
    lines.push("   ▼");
    lines.push(item.targetId);
    lines.push(`   provenance: ${item.provenance.join(" | ")}`);
    lines.push(`   epistemic: ${item.epistemicStatus}; causal: ${String(item.causal)}; certainty: ${item.certainty}`);
  }
  return Object.freeze(lines);
}

export function rejectSealedRmsRelationship(relationshipId: string): {
  readonly relationshipId: string;
  readonly known: false;
  readonly reason: NmiRelationshipGapReason;
  readonly readsSealedRmsGroundTruth: false;
} {
  return Object.freeze({
    relationshipId,
    known: false as const,
    reason: "CANONICAL_REFERENCE_MISSING" as const,
    readsSealedRmsGroundTruth: false as const,
  });
}

export function overlayByRelationshipId(
  overlays: readonly NmiVaiCausalOverlay[],
): ReadonlyMap<string, NmiVaiCausalOverlay> {
  return new Map(overlays.map((item) => [item.relationshipId, item]));
}
