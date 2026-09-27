/**
 * NPA-T MLEVEL:3 — Management Level interaction adapter identity.
 * Routes drill intents into existing Stage/NMI selection. Not a navigation store.
 */

export const nmiManagementLevelInteractionIdentity =
  "NPA-T MLEVEL:3/ManagementLevelInteractionAdapter" as const;
export const nmiManagementLevelInteractionVersion = "1.0.0" as const;
export const nmiManagementLevelInteractionNamespace =
  "nexora.nmi.management-level-interaction" as const;
export const nmiManagementLevelInteractionPhase = "MLEVEL:3" as const;
export const nmiManagementLevelInteractionArchitecturalRole =
  "ManagementLevelCanonicalNavigationAdapter" as const;

export function getNmiManagementLevelInteractionIdentity() {
  return Object.freeze({
    id: nmiManagementLevelInteractionIdentity,
    version: nmiManagementLevelInteractionVersion,
    namespace: nmiManagementLevelInteractionNamespace,
    phase: nmiManagementLevelInteractionPhase,
    architecturalRole: nmiManagementLevelInteractionArchitecturalRole,
  });
}
