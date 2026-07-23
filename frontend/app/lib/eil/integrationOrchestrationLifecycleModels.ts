/**
 * EIL-4:3 — Integration Orchestration Lifecycle Models.
 *
 * Immutable lifecycle mapping declarations for orchestration metadata.
 * Metadata only — no state machines or transition execution.
 * Lifecycle states are referenced through the Registry aggregate.
 *
 * Ownership: owned exclusively by EIL-4:3.
 */

import { IntegrationOrchestrationRegistryPlatform } from "./integrationOrchestrationRegistry.ts";
import type {
  IntegrationOrchestrationLifecycleModel,
  OrchestrationModelLifecycleState,
  OrchestrationRegistryReference,
} from "./integrationOrchestrationModelTypes.ts";

const registry = IntegrationOrchestrationRegistryPlatform;
const registryIdentity = registry.identity;

const registryRef = (
  entryKey: string,
): OrchestrationRegistryReference =>
  Object.freeze({
    registryId: registryIdentity.canonicalId,
    registryNamespace: registryIdentity.namespace,
    entryPoint: "integrationOrchestrationRegistry.ts" as const,
    collection: "lifecycleCoverage" as const,
    entryKey,
    preservesCanonicalReference: true as const,
    duplicatesRegistryValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const lifecycleModel = (
  state: OrchestrationModelLifecycleState,
  description: string,
  ordinal: number,
): IntegrationOrchestrationLifecycleModel =>
  Object.freeze({
    lifecycleModelId: `EIL-4:3/Lifecycle/${state}` as const,
    canonicalKey: state,
    canonicalName: state,
    description,
    ownership: "EIL-4:3" as const,
    lifecycle: state,
    sourceRegistryReference: registryRef(state),
    sourceReference:
      `EIL-4:2/IntegrationOrchestrationRegistry/lifecycleCoverage/${state}`,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze(["lifecycle", "mapping", state.toLowerCase()]),
    executesTransitions: false as const,
    runtimeStateMachine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const LIFECYCLE_DESCRIPTIONS = Object.freeze({
  Declared: "Lifecycle mapping for declared orchestration metadata.",
  Designed: "Lifecycle mapping for designed orchestration metadata.",
  Verified: "Lifecycle mapping for verified orchestration metadata.",
  Certified: "Lifecycle mapping for certified orchestration metadata.",
  Frozen: "Lifecycle mapping for frozen orchestration metadata.",
  Released: "Lifecycle mapping for released orchestration metadata.",
  Deprecated: "Lifecycle mapping for deprecated orchestration metadata.",
  Retired: "Lifecycle mapping for retired orchestration metadata.",
} as const satisfies Record<OrchestrationModelLifecycleState, string>);

const LIFECYCLE_PREFIX = "EIL-4:2/Reference/Lifecycle/" as const;

/**
 * Exactly eight immutable lifecycle mappings preserving Registry order.
 * States are derived from Registry lifecycleCoverage references.
 * Metadata only — no transition execution.
 */
export const IntegrationOrchestrationLifecycleModels: readonly IntegrationOrchestrationLifecycleModel[] =
  Object.freeze(
    registry.lifecycleCoverage.map((item, index) => {
      const state = item.referenceId.slice(
        LIFECYCLE_PREFIX.length,
      ) as OrchestrationModelLifecycleState;
      return lifecycleModel(
        state,
        LIFECYCLE_DESCRIPTIONS[state],
        index + 1,
      );
    }),
  );
