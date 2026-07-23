/**
 * EIL-5:6 — Integration Policy & Governance Platform Composition.
 *
 * Immutable composition metadata referencing upstream EIL-5 artifacts
 * without duplicating their contents.
 * Consumes only the Manifest aggregate.
 *
 * Ownership: owned exclusively by EIL-5:6.
 */

import {
  IntegrationPolicyGovernanceArchitectureManifest,
  IntegrationPolicyGovernanceManifestIdentity,
} from "./integrationPolicyGovernanceManifest.ts";
import type { IntegrationPolicyGovernancePlatformComposition as PolicyGovernancePlatformCompositionDescriptor } from "./integrationPolicyGovernancePlatformTypes.ts";

const references =
  IntegrationPolicyGovernanceArchitectureManifest.canonicalReferences;

/**
 * Canonical immutable platform composition.
 * Upstream references only — no content duplication.
 */
export const IntegrationPolicyGovernancePlatformComposition: PolicyGovernancePlatformCompositionDescriptor =
  Object.freeze({
    compositionId: "EIL-5:6/Composition",
    platformIdentity: "EIL-5:6/IntegrationPolicyGovernancePlatform",
    canonicalArchitecture: "EIL-5:5/Architecture",
    foundationReference: references[0]!,
    registryReference: references[1]!,
    modelReference: references[2]!,
    validationReference: references[3]!,
    manifestReference: IntegrationPolicyGovernanceManifestIdentity.canonicalId,
    ownership: "EIL-5:6",
    namespace: "nexora.eil.integration-policy-governance.platform",
    version: "1.0.0",
    releaseLineage: Object.freeze([
      ...IntegrationPolicyGovernanceArchitectureManifest.releaseLineage,
      `${IntegrationPolicyGovernanceManifestIdentity.canonicalId} → EIL-5:6/IntegrationPolicyGovernancePlatform`,
    ]),
    architecturalScope: Object.freeze([
      "platform identity",
      "platform composition",
      "platform inventory",
      "platform guarantees",
      "platform compatibility",
      "platform readiness",
      "platform summary",
      "canonical references",
    ]),
    duplicatesUpstreamContents: false as const,
    ordinal: 1,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  });
