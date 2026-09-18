/**
 * NPA-T NMI:6 — Management Context → Stage Projection identity.
 * Read-only context bundle for existing Director/Stage. Not an NMI Stage.
 */

export const nmiStageProjectionIdentity =
  "NPA-T NMI:6/ManagementContextStageProjection" as const;
export const nmiStageProjectionVersion = "1.0.0" as const;
export const nmiStageProjectionNamespace = "nexora.nmi.stage-projection" as const;
export const nmiStageProjectionPhase = "NMI:6" as const;
export const nmiStageProjectionArchitecturalRole = "ManagementContextStageProjectionHandoff" as const;

export function getNmiStageProjectionIdentity() {
  return Object.freeze({
    id: nmiStageProjectionIdentity,
    version: nmiStageProjectionVersion,
    namespace: nmiStageProjectionNamespace,
    phase: nmiStageProjectionPhase,
    architecturalRole: nmiStageProjectionArchitecturalRole,
  });
}
