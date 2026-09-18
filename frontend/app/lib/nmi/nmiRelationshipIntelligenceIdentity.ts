/**
 * NPA-T NMI:3 — Management Relationship Intelligence identity.
 * Read interpretation over NMI:1 relationships / NMI:2 map. Not a causal engine or Decision Roadmap.
 */

export const nmiRelationshipIntelligenceIdentity =
  "NPA-T NMI:3/ManagementRelationshipIntelligence" as const;
export const nmiRelationshipIntelligenceVersion = "1.0.0" as const;
export const nmiRelationshipIntelligenceNamespace = "nexora.nmi.relationship-intelligence" as const;
export const nmiRelationshipIntelligencePhase = "NMI:3" as const;
export const nmiRelationshipIntelligenceArchitecturalRole = "ManagementRelationshipReadInterpretation" as const;

export type NmiRelationshipIntelligenceIdentity = {
  readonly id: typeof nmiRelationshipIntelligenceIdentity;
  readonly version: typeof nmiRelationshipIntelligenceVersion;
  readonly namespace: typeof nmiRelationshipIntelligenceNamespace;
  readonly phase: typeof nmiRelationshipIntelligencePhase;
  readonly architecturalRole: typeof nmiRelationshipIntelligenceArchitecturalRole;
};

const IDENTITY: NmiRelationshipIntelligenceIdentity = Object.freeze({
  id: nmiRelationshipIntelligenceIdentity,
  version: nmiRelationshipIntelligenceVersion,
  namespace: nmiRelationshipIntelligenceNamespace,
  phase: nmiRelationshipIntelligencePhase,
  architecturalRole: nmiRelationshipIntelligenceArchitecturalRole,
});

export function getNmiRelationshipIntelligenceIdentity(): NmiRelationshipIntelligenceIdentity {
  return IDENTITY;
}
