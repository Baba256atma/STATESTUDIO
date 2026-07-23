/**
 * EIL-5:3 — Integration Policy & Governance Lifecycle Models.
 *
 * Immutable lifecycle mapping declarations for governance metadata.
 * Metadata only — no state machines or transition execution.
 * Lifecycle states are referenced through the Registry aggregate.
 *
 * Ownership: owned exclusively by EIL-5:3.
 */

import { IntegrationPolicyGovernanceRegistryPlatform } from "./integrationPolicyGovernanceRegistry.ts";
import type {
  IntegrationPolicyGovernanceLifecycleModel,
  PolicyGovernanceModelLifecycleState,
  PolicyGovernanceRegistryReference,
} from "./integrationPolicyGovernanceModelTypes.ts";

const registry = IntegrationPolicyGovernanceRegistryPlatform;
const registryIdentity = registry.identity;

const registryRef = (
  entryKey: string,
): PolicyGovernanceRegistryReference =>
  Object.freeze({
    registryId: registryIdentity.canonicalId,
    registryNamespace: registryIdentity.namespace,
    entryPoint: "integrationPolicyGovernanceRegistry.ts" as const,
    collection: "lifecycleCoverage" as const,
    entryKey,
    preservesCanonicalReference: true as const,
    duplicatesRegistryValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const lifecycleModel = (
  state: PolicyGovernanceModelLifecycleState,
  description: string,
  ordinal: number,
): IntegrationPolicyGovernanceLifecycleModel =>
  Object.freeze({
    lifecycleModelId: `EIL-5:3/Lifecycle/${state}` as const,
    canonicalKey: state,
    canonicalName: state,
    description,
    ownership: "EIL-5:3" as const,
    lifecycle: state,
    sourceRegistryReference: registryRef(state),
    sourceReference: `EIL-5:2/IntegrationPolicyGovernanceRegistry/lifecycleCoverage/${state}`,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze(["lifecycle", "mapping", state.toLowerCase()]),
    executesTransitions: false as const,
    runtimeStateMachine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const LIFECYCLE_DESCRIPTIONS = Object.freeze({
  Declared: "Lifecycle mapping for declared governance metadata.",
  Designed: "Lifecycle mapping for designed governance metadata.",
  Verified: "Lifecycle mapping for verified governance metadata.",
  Certified: "Lifecycle mapping for certified governance metadata.",
  Frozen: "Lifecycle mapping for frozen governance metadata.",
  Released: "Lifecycle mapping for released governance metadata.",
  Deprecated: "Lifecycle mapping for deprecated governance metadata.",
  Retired: "Lifecycle mapping for retired governance metadata.",
} as const satisfies Record<PolicyGovernanceModelLifecycleState, string>);

const LIFECYCLE_PREFIX = "EIL-5:2/Reference/Lifecycle/" as const;

/**
 * Exactly eight immutable lifecycle mappings preserving Registry order.
 * States are derived from Registry lifecycleCoverage references.
 * Metadata only — no transition execution.
 */
export const IntegrationPolicyGovernanceLifecycleModels: readonly IntegrationPolicyGovernanceLifecycleModel[] =
  Object.freeze(
    registry.lifecycleCoverage.map((item, index) => {
      const state = item.referenceId.slice(
        LIFECYCLE_PREFIX.length,
      ) as PolicyGovernanceModelLifecycleState;
      return lifecycleModel(state, LIFECYCLE_DESCRIPTIONS[state], index + 1);
    }),
  );
