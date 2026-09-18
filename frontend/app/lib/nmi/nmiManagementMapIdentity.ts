/**
 * NPA-T NMI:2 — Business/Project Management Map identity.
 * Read projection over NMI:1 UnifiedManagementModel. Not a store, Queue, or Decision Roadmap.
 */

export const nmiManagementMapIdentity = "NPA-T NMI:2/BusinessProjectManagementMap" as const;
export const nmiManagementMapVersion = "1.0.0" as const;
export const nmiManagementMapNamespace = "nexora.nmi.management-map" as const;
export const nmiManagementMapPhase = "NMI:2" as const;
export const nmiManagementMapArchitecturalRole = "ManagementMapReadProjection" as const;

export type NmiManagementMapIdentity = {
  readonly id: typeof nmiManagementMapIdentity;
  readonly version: typeof nmiManagementMapVersion;
  readonly namespace: typeof nmiManagementMapNamespace;
  readonly phase: typeof nmiManagementMapPhase;
  readonly architecturalRole: typeof nmiManagementMapArchitecturalRole;
};

const IDENTITY: NmiManagementMapIdentity = Object.freeze({
  id: nmiManagementMapIdentity,
  version: nmiManagementMapVersion,
  namespace: nmiManagementMapNamespace,
  phase: nmiManagementMapPhase,
  architecturalRole: nmiManagementMapArchitecturalRole,
});

export function getNmiManagementMapIdentity(): NmiManagementMapIdentity {
  return IDENTITY;
}
