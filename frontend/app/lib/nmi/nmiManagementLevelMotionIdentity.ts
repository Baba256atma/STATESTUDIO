/**
 * NPA-T MLEVEL:4 — Management Level spatial transition identity.
 * Presentation interpolation only. Does not own hierarchy or selection.
 */

export const nmiManagementLevelMotionIdentity =
  "NPA-T MLEVEL:4/ManagementLevelSpatialTransition" as const;
export const nmiManagementLevelMotionVersion = "1.0.0" as const;
export const nmiManagementLevelMotionNamespace =
  "nexora.nmi.management-level-motion" as const;
export const nmiManagementLevelMotionPhase = "MLEVEL:4" as const;
export const nmiManagementLevelMotionArchitecturalRole =
  "ManagementLevelSpatialTransitionPresentation" as const;

export function getNmiManagementLevelMotionIdentity() {
  return Object.freeze({
    id: nmiManagementLevelMotionIdentity,
    version: nmiManagementLevelMotionVersion,
    namespace: nmiManagementLevelMotionNamespace,
    phase: nmiManagementLevelMotionPhase,
    architecturalRole: nmiManagementLevelMotionArchitecturalRole,
  });
}
