/**
 * NPA-T VAI:2 — Object–Variable Role Resolution identity.
 * Role resolution only. Does not own causality, Objects, or VAI:1 Variables.
 */

export const vaiObjectRoleResolutionIdentity =
  "NPA-T VAI:2/ObjectVariableRoleResolution" as const;
export const vaiObjectRoleResolutionVersion = "1.0.0" as const;
export const vaiObjectRoleResolutionNamespace = "nexora.vai.object-role-resolution" as const;
export const vaiObjectRoleResolutionPhase = "VAI:2" as const;

export function getVaiObjectRoleResolutionIdentity() {
  return Object.freeze({
    id: vaiObjectRoleResolutionIdentity,
    version: vaiObjectRoleResolutionVersion,
    namespace: vaiObjectRoleResolutionNamespace,
    phase: vaiObjectRoleResolutionPhase,
  });
}
