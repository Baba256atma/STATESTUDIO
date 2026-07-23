/**
 * EIL-7:8 — Integration Governance Freeze Identity.
 *
 * Canonical immutable identity for Integration Governance Freeze.
 * Declares exclusive upstream dependency on EIL-7:7 Certification.
 * Metadata-only. No runtime freeze enforcement.
 *
 * Ownership: owned exclusively by EIL-7:8.
 */

import { IntegrationGovernanceCertificationCanonicalId } from "./integrationGovernanceCertification.ts";

/** Canonical phase ID. */
export const IntegrationGovernanceFreezePhaseId = "EIL-7:8" as const;

/** Canonical freeze ID. */
export const IntegrationGovernanceFreezeCanonicalId =
  "EIL-7:8/IntegrationGovernanceFreeze" as const;

/** Human-readable freeze name. */
export const IntegrationGovernanceFreezeName =
  "Integration Governance Freeze" as const;

/** Semantic version. */
export const IntegrationGovernanceFreezeVersion = "1.0.0" as const;

/** Canonical namespace. */
export const IntegrationGovernanceFreezeNamespace =
  "nexora.eil.integration-governance.freeze" as const;

/** Freeze status. */
export const IntegrationGovernanceFreezeStatusValue = "Frozen" as const;

/** Immediate next-phase readiness. */
export const IntegrationGovernanceFreezeReadinessValue =
  "ReadyForPublicIndex" as const;

/** Canonical platform lock identifier. */
export const IntegrationGovernanceFreezeLockId =
  "EIL-7-INTEGRATION-GOVERNANCE-LOCKED" as const;

/**
 * Immutable identity for EIL-7:8 Integration Governance Freeze.
 */
export const IntegrationGovernanceFreezeIdentity = Object.freeze({
  phaseId: IntegrationGovernanceFreezePhaseId,
  canonicalId: IntegrationGovernanceFreezeCanonicalId,
  name: IntegrationGovernanceFreezeName,
  version: IntegrationGovernanceFreezeVersion,
  namespace: IntegrationGovernanceFreezeNamespace,
  layer: "EIL" as const,
  platform: "EIL-7" as const,
  phaseType: "Freeze" as const,
  status: IntegrationGovernanceFreezeStatusValue,
  readiness: IntegrationGovernanceFreezeReadinessValue,
  lockId: IntegrationGovernanceFreezeLockId,
  certificationDependency: IntegrationGovernanceCertificationCanonicalId,
  certificationEntryPoint: "integrationGovernanceCertification.ts" as const,
  description:
    "Permanent architectural freeze establishing the immutable Integration Governance release baseline for Public Index publication.",
  metadataOnly: true as const,
  immutable: true as const,
});
