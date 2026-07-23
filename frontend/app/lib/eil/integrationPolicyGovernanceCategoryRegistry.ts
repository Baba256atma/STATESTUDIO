/**
 * EIL-5:2 — Integration Policy & Governance Category Registry.
 *
 * Canonical registry for the ten Foundation governance categories.
 * Consumes only the EIL-5:1 Integration Policy & Governance Foundation aggregate surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-5:2.
 */

import { IntegrationPolicyGovernanceFoundationPlatform } from "./integrationPolicyGovernanceFoundation.ts";
import type {
  IntegrationPolicyGovernanceCategoryRegistryEntry,
  PolicyGovernancePolicyClassification,
  PolicyGovernanceScope,
} from "./integrationPolicyGovernanceRegistryTypes.ts";

const foundation = IntegrationPolicyGovernanceFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

const POLICY_CLASSIFICATION: Readonly<
  Record<string, PolicyGovernancePolicyClassification>
> = Object.freeze({
  IdentityPolicy: "Identity",
  AccessPolicy: "Access",
  DependencyPolicy: "Dependency",
  CompatibilityPolicy: "Compatibility",
  VersionPolicy: "Version",
  LifecyclePolicy: "Lifecycle",
  InventoryPolicy: "Inventory",
  CompliancePolicy: "Compliance",
  SecurityPolicy: "Security",
  ExecutiveGovernancePolicy: "Executive",
});

const GOVERNANCE_SCOPE: Readonly<Record<string, PolicyGovernanceScope>> =
  Object.freeze({
    IdentityPolicy: "Identity",
    AccessPolicy: "Access",
    DependencyPolicy: "Dependency",
    CompatibilityPolicy: "Compatibility",
    VersionPolicy: "Version",
    LifecyclePolicy: "Lifecycle",
    InventoryPolicy: "Inventory",
    CompliancePolicy: "Compliance",
    SecurityPolicy: "Security",
    ExecutiveGovernancePolicy: "Executive",
  });

/**
 * Exactly ten category registry entries preserving Foundation order.
 */
export const IntegrationPolicyGovernanceCategoryRegistry: readonly IntegrationPolicyGovernanceCategoryRegistryEntry[] =
  Object.freeze(
    foundation.categories.map((item) =>
      Object.freeze({
        registryId: `EIL-5:2/Registry/Category/${item.categoryKey}` as const,
        canonicalKey: item.categoryKey,
        canonicalName: item.canonicalName,
        name: item.canonicalName,
        category: "Category" as const,
        description: item.description,
        policyClassification: POLICY_CLASSIFICATION[item.categoryKey]!,
        governanceScope: GOVERNANCE_SCOPE[item.categoryKey]!,
        sourcePhase:
          "EIL-5:1/IntegrationPolicyGovernanceFoundation" as const,
        sourceNamespace: foundationNamespace,
        architecturalOwner: "EIL-5:2" as const,
        ownership: "EIL-5:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        ordinal: item.deterministicOrder,
        tags: Object.freeze(["category", "foundation-reference", "policy"]),
        sourceReference: `${foundationId}/categories/${item.categoryKey}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen category-registry catalog with derived count. */
export const IntegrationPolicyGovernanceCategoryRegistryCatalog = Object.freeze(
  {
    collectionId: "EIL-5:2/Collection/Categories",
    category: "Category" as const,
    sourcePhase: "EIL-5:2" as const,
    entries: IntegrationPolicyGovernanceCategoryRegistry,
    entryCount: IntegrationPolicyGovernanceCategoryRegistry.length,
    metadataOnly: true as const,
    immutable: true as const,
    deterministic: true as const,
  },
);
