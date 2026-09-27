/**
 * NPA-T MLEVEL:1 — Management Levels Foundation identity.
 * Presentation projection of canonical hierarchical depth. Not a second NMI graph.
 */

export const nmiManagementLevelPathIdentity =
  "NPA-T MLEVEL:1/ManagementLevelPath" as const;
export const nmiManagementLevelPathVersion = "1.0.0" as const;
export const nmiManagementLevelPathNamespace = "nexora.nmi.management-level-path" as const;
export const nmiManagementLevelPathPhase = "MLEVEL:1" as const;
export const nmiManagementLevelPathArchitecturalRole =
  "ManagementHierarchicalDepthPresentationProjection" as const;

export function getNmiManagementLevelPathIdentity() {
  return Object.freeze({
    id: nmiManagementLevelPathIdentity,
    version: nmiManagementLevelPathVersion,
    namespace: nmiManagementLevelPathNamespace,
    phase: nmiManagementLevelPathPhase,
    architecturalRole: nmiManagementLevelPathArchitecturalRole,
  });
}
