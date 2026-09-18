/**
 * NPA-T NMI:7 — Advisor + Management Intelligence identity.
 * Read context for existing CC:5 / NCA / ECA. Not a second Advisor.
 */

export const nmiAdvisorIdentity = "NPA-T NMI:7/AdvisorManagementIntelligenceIntegration" as const;
export const nmiAdvisorVersion = "1.0.0" as const;
export const nmiAdvisorNamespace = "nexora.nmi.advisor-integration" as const;
export const nmiAdvisorPhase = "NMI:7" as const;
export const nmiAdvisorArchitecturalRole = "ManagementIntelligenceAdvisorReadContext" as const;

export function getNmiAdvisorIdentity() {
  return Object.freeze({
    id: nmiAdvisorIdentity,
    version: nmiAdvisorVersion,
    namespace: nmiAdvisorNamespace,
    phase: nmiAdvisorPhase,
    architecturalRole: nmiAdvisorArchitecturalRole,
  });
}
