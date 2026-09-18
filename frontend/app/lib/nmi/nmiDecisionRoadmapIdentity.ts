/**
 * NPA-T NMI:4 — Decision Roadmap Intelligence identity.
 * Read projection of the current executive decision journey. Not a workflow or Decision authority.
 */

export const nmiDecisionRoadmapIdentity = "NPA-T NMI:4/DecisionRoadmapIntelligence" as const;
export const nmiDecisionRoadmapVersion = "1.0.0" as const;
export const nmiDecisionRoadmapNamespace = "nexora.nmi.decision-roadmap" as const;
export const nmiDecisionRoadmapPhase = "NMI:4" as const;
export const nmiDecisionRoadmapArchitecturalRole = "DecisionRoadmapReadProjection" as const;

export type NmiDecisionRoadmapIdentity = {
  readonly id: typeof nmiDecisionRoadmapIdentity;
  readonly version: typeof nmiDecisionRoadmapVersion;
  readonly namespace: typeof nmiDecisionRoadmapNamespace;
  readonly phase: typeof nmiDecisionRoadmapPhase;
  readonly architecturalRole: typeof nmiDecisionRoadmapArchitecturalRole;
};

const IDENTITY: NmiDecisionRoadmapIdentity = Object.freeze({
  id: nmiDecisionRoadmapIdentity,
  version: nmiDecisionRoadmapVersion,
  namespace: nmiDecisionRoadmapNamespace,
  phase: nmiDecisionRoadmapPhase,
  architecturalRole: nmiDecisionRoadmapArchitecturalRole,
});

export function getNmiDecisionRoadmapIdentity(): NmiDecisionRoadmapIdentity {
  return IDENTITY;
}
