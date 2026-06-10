/**
 * Phase 6:5 — Consensus Registry.
 * Generic institutional framework — not organization-specific models.
 */

export const CONSENSUS_REGISTRY_VERSION = "6.5.0";

export type ConsensusDomainId =
  | "executive_consensus"
  | "operational_consensus"
  | "strategic_consensus"
  | "governance_consensus";

export type AlignmentGroupId =
  | "executive_alignment"
  | "operational_alignment"
  | "strategic_alignment"
  | "cross_functional_alignment";

export type ConflictGroupId =
  | "priority_conflict"
  | "resource_conflict"
  | "timeline_conflict"
  | "governance_conflict";

export type ConsensusSignalId =
  | "convergence_signal"
  | "divergence_signal"
  | "tension_signal"
  | "confidence_signal";

export type ConsensusDomainEntry = Readonly<{
  id: ConsensusDomainId;
  label: string;
  summary: string;
}>;

export type AlignmentGroupEntry = Readonly<{
  id: AlignmentGroupId;
  label: string;
  zone: string;
  summary: string;
}>;

export type ConflictGroupEntry = Readonly<{
  id: ConflictGroupId;
  label: string;
  zone: string;
  summary: string;
}>;

export type ConsensusSignalEntry = Readonly<{
  id: ConsensusSignalId;
  label: string;
  signalType: "convergence" | "divergence" | "tension" | "confidence";
  summary: string;
}>;

export const CONSENSUS_DOMAIN_REGISTRY: Readonly<Record<ConsensusDomainId, ConsensusDomainEntry>> =
  Object.freeze({
    executive_consensus: Object.freeze({
      id: "executive_consensus",
      label: "Executive Consensus",
      summary: "Leadership alignment around institutional decisions",
    }),
    operational_consensus: Object.freeze({
      id: "operational_consensus",
      label: "Operational Consensus",
      summary: "Execution-level agreement across operational stakeholders",
    }),
    strategic_consensus: Object.freeze({
      id: "strategic_consensus",
      label: "Strategic Consensus",
      summary: "Strategic direction agreement across objectives",
    }),
    governance_consensus: Object.freeze({
      id: "governance_consensus",
      label: "Governance Consensus",
      summary: "Institutional boundary agreement across governance context",
    }),
  });

export const ALIGNMENT_GROUP_REGISTRY: Readonly<Record<AlignmentGroupId, AlignmentGroupEntry>> =
  Object.freeze({
    executive_alignment: Object.freeze({
      id: "executive_alignment",
      label: "Executive Alignment",
      zone: "executive",
      summary: "Executive team agreement zone",
    }),
    operational_alignment: Object.freeze({
      id: "operational_alignment",
      label: "Operational Alignment",
      zone: "operational",
      summary: "Operational execution agreement zone",
    }),
    strategic_alignment: Object.freeze({
      id: "strategic_alignment",
      label: "Strategic Alignment",
      zone: "strategic",
      summary: "Strategic objective agreement zone",
    }),
    cross_functional_alignment: Object.freeze({
      id: "cross_functional_alignment",
      label: "Cross-Functional Alignment",
      zone: "cross_functional",
      summary: "Cross-team institutional agreement zone",
    }),
  });

export const CONFLICT_GROUP_REGISTRY: Readonly<Record<ConflictGroupId, ConflictGroupEntry>> =
  Object.freeze({
    priority_conflict: Object.freeze({
      id: "priority_conflict",
      label: "Priority Conflict",
      zone: "priority",
      summary: "Competing priority disagreement zone",
    }),
    resource_conflict: Object.freeze({
      id: "resource_conflict",
      label: "Resource Conflict",
      zone: "resource",
      summary: "Resource allocation disagreement zone",
    }),
    timeline_conflict: Object.freeze({
      id: "timeline_conflict",
      label: "Timeline Conflict",
      zone: "timeline",
      summary: "Timeline and scheduling disagreement zone",
    }),
    governance_conflict: Object.freeze({
      id: "governance_conflict",
      label: "Governance Conflict",
      zone: "governance",
      summary: "Governance boundary disagreement zone",
    }),
  });

export const CONSENSUS_SIGNAL_REGISTRY: Readonly<Record<ConsensusSignalId, ConsensusSignalEntry>> =
  Object.freeze({
    convergence_signal: Object.freeze({
      id: "convergence_signal",
      label: "Convergence Signal",
      signalType: "convergence",
      summary: "Movement toward institutional agreement",
    }),
    divergence_signal: Object.freeze({
      id: "divergence_signal",
      label: "Divergence Signal",
      signalType: "divergence",
      summary: "Movement away from institutional agreement",
    }),
    tension_signal: Object.freeze({
      id: "tension_signal",
      label: "Tension Signal",
      signalType: "tension",
      summary: "Institutional friction indicator",
    }),
    confidence_signal: Object.freeze({
      id: "confidence_signal",
      label: "Confidence Signal",
      signalType: "confidence",
      summary: "Consensus conclusion confidence metadata",
    }),
  });

export function listConsensusDomains(): readonly ConsensusDomainEntry[] {
  return Object.freeze(Object.values(CONSENSUS_DOMAIN_REGISTRY));
}

export function listAlignmentGroups(): readonly AlignmentGroupEntry[] {
  return Object.freeze(Object.values(ALIGNMENT_GROUP_REGISTRY));
}

export function listConflictGroups(): readonly ConflictGroupEntry[] {
  return Object.freeze(Object.values(CONFLICT_GROUP_REGISTRY));
}
