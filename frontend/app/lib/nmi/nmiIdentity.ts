/**
 * NPA-T NMI:1 — Nexora Management Intelligence Foundation identity.
 *
 * Read-oriented unified Business/Project management model.
 * Does not own Objects, Data Reality, Stage, Advisor, Decision, Execution,
 * causality, simulation, or Queue.
 */

export const nmiFoundationIdentity = "NPA-T NMI:1/ManagementIntelligenceFoundation" as const;
export const nmiFoundationVersion = "1.0.0" as const;
export const nmiFoundationNamespace = "nexora.nmi.foundation" as const;
export const nmiFoundationPhase = "NMI:1" as const;
export const nmiFoundationArchitecturalRole = "ManagementIntelligenceContractAuthority" as const;

export type NmiFoundationIdentity = {
  readonly id: typeof nmiFoundationIdentity;
  readonly version: typeof nmiFoundationVersion;
  readonly namespace: typeof nmiFoundationNamespace;
  readonly phase: typeof nmiFoundationPhase;
  readonly architecturalRole: typeof nmiFoundationArchitecturalRole;
};

const IDENTITY: NmiFoundationIdentity = Object.freeze({
  id: nmiFoundationIdentity,
  version: nmiFoundationVersion,
  namespace: nmiFoundationNamespace,
  phase: nmiFoundationPhase,
  architecturalRole: nmiFoundationArchitecturalRole,
});

export function getNmiFoundationIdentity(): NmiFoundationIdentity {
  return IDENTITY;
}
