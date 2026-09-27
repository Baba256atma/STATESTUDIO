/**
 * NPA-T MLEVEL:2 — Stage spatial depth & level-placement identity.
 * Presentation-only. Consumes MLEVEL:1. Does not resolve hierarchy.
 */

export const nmiManagementLevelSpatialIdentity =
  "NPA-T MLEVEL:2/ManagementLevelSpatialPlacement" as const;
export const nmiManagementLevelSpatialVersion = "1.0.0" as const;
export const nmiManagementLevelSpatialNamespace = "nexora.nmi.management-level-spatial" as const;
export const nmiManagementLevelSpatialPhase = "MLEVEL:2" as const;
export const nmiManagementLevelSpatialArchitecturalRole =
  "ManagementLevelSpatialPlacementPresentationProjection" as const;

export function getNmiManagementLevelSpatialIdentity() {
  return Object.freeze({
    id: nmiManagementLevelSpatialIdentity,
    version: nmiManagementLevelSpatialVersion,
    namespace: nmiManagementLevelSpatialNamespace,
    phase: nmiManagementLevelSpatialPhase,
    architecturalRole: nmiManagementLevelSpatialArchitecturalRole,
  });
}
