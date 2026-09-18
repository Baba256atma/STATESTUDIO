/**
 * NPA-T NMI:5 — Management Navigation & Executive Attention identity.
 * Evolves STAGE-PROD:1 Queue presentation. Not a second Queue or Stage projection.
 */

export const nmiManagementNavigationIdentity =
  "NPA-T NMI:5/ManagementNavigationExecutiveAttention" as const;
export const nmiManagementNavigationVersion = "1.0.0" as const;
export const nmiManagementNavigationNamespace = "nexora.nmi.management-navigation" as const;
export const nmiManagementNavigationPhase = "NMI:5" as const;
export const nmiManagementNavigationArchitecturalRole = "ManagementNavigationAndAttentionReadProjection" as const;

export function getNmiManagementNavigationIdentity() {
  return Object.freeze({
    id: nmiManagementNavigationIdentity,
    version: nmiManagementNavigationVersion,
    namespace: nmiManagementNavigationNamespace,
    phase: nmiManagementNavigationPhase,
    architecturalRole: nmiManagementNavigationArchitecturalRole,
  });
}
