/**
 * NPA-T NMI:8 — live Management Intelligence host identity.
 * Composer/adapter over certified NMI:1–7. Not a new management store.
 */

export const nmiLiveIdentity = "NPA-T NMI:8/LiveManagementIntelligenceHost" as const;
export const nmiLiveVersion = "1.0.0" as const;
export const nmiLiveNamespace = "nexora.nmi.live-host" as const;
export const nmiLivePhase = "NMI:8" as const;
export const nmiLiveArchitecturalRole = "LiveUnifiedManagementModelComposer" as const;

export function getNmiLiveIdentity() {
  return Object.freeze({
    id: nmiLiveIdentity,
    version: nmiLiveVersion,
    namespace: nmiLiveNamespace,
    phase: nmiLivePhase,
    architecturalRole: nmiLiveArchitecturalRole,
  });
}
