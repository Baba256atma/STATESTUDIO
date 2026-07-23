/**
 * EIL-5:5 — Integration Policy & Governance Architecture Manifest.
 *
 * Immutable architectural identity, scope, and release lineage publication.
 * Consumes only the Validation aggregate for canonical references.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-5:5.
 */

import {
  IntegrationPolicyGovernanceValidationIdentity,
  IntegrationPolicyGovernanceValidationPlatform,
} from "./integrationPolicyGovernanceValidation.ts";
import type { IntegrationPolicyGovernanceArchitectureManifest as PolicyGovernanceArchitectureManifestDescriptor } from "./integrationPolicyGovernanceManifestTypes.ts";

const validation = IntegrationPolicyGovernanceValidationPlatform;
const model = validation.modelPlatform;
const registry = model.registryPlatform;
const foundation = registry.foundationPlatform;

/**
 * Canonical immutable architecture manifesto.
 */
export const IntegrationPolicyGovernanceArchitectureManifest: PolicyGovernanceArchitectureManifestDescriptor =
  Object.freeze({
    architectureId: "EIL-5:5/Architecture",
    platformIdentity: "EIL-5",
    architectureIdentity: "EIL-5:5/IntegrationPolicyGovernanceManifest",
    namespace: "nexora.eil.integration-policy-governance.manifest",
    version: "1.0.0",
    status: "Manifest",
    readiness: "ReadyForPlatform",
    canonicalReferences: Object.freeze([
      foundation.identity.foundationId,
      registry.identity.canonicalId,
      model.identity.canonicalId,
      IntegrationPolicyGovernanceValidationIdentity.canonicalId,
    ]),
    sourcePhases: Object.freeze([
      "EIL-5:1",
      "EIL-5:2",
      "EIL-5:3",
      "EIL-5:4",
      "EIL-5:5",
    ] as const),
    ownership: "EIL-5:5",
    architecturalScope: Object.freeze([
      "governance architecture",
      "governance inventory",
      "governance dependencies",
      "governance compatibility",
      "validation summary",
      "readiness summary",
      "canonical references",
      "architectural completeness",
    ]),
    releaseLineage: Object.freeze([
      `${foundation.identity.foundationId} → ${registry.identity.canonicalId}`,
      `${registry.identity.canonicalId} → ${model.identity.canonicalId}`,
      `${model.identity.canonicalId} → ${IntegrationPolicyGovernanceValidationIdentity.canonicalId}`,
      `${IntegrationPolicyGovernanceValidationIdentity.canonicalId} → EIL-5:5/IntegrationPolicyGovernanceManifest`,
    ]),
    ordinal: 1,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
