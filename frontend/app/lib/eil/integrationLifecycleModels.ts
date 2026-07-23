/**
 * EIL-1:3 — Integration Lifecycle Models.
 *
 * Lifecycle mappings derived from Registry lifecycle coverage
 * (Foundation Declared → Retired vocabulary).
 * Metadata only — no runtime state machine.
 *
 * Ownership: owned exclusively by EIL-1:3.
 */

import {
  IntegrationRegistryIdentity,
  IntegrationRegistryPlatform,
} from "./integrationRegistry.ts";
import type {
  IntegrationLifecycleModel,
  IntegrationModelLifecycleState,
} from "./integrationModelTypes.ts";

const registry = IntegrationRegistryPlatform;

/**
 * Exactly eight lifecycle models preserving Foundation/Registry order.
 */
export const IntegrationLifecycleModels: readonly IntegrationLifecycleModel[] =
  Object.freeze(
    registry.lifecycleCoverage.map((item, index) => {
      const state = item.state as IntegrationModelLifecycleState;
      return Object.freeze({
        lifecycleModelId: `EIL-1:3/Lifecycle/${state}` as const,
        state,
        canonicalKey: `Lifecycle.${state}`,
        canonicalName: state,
        description: `Lifecycle mapping for state ${state}.`,
        sourceRegistryReference: Object.freeze({
          registryId: IntegrationRegistryIdentity.canonicalId,
          registryNamespace: IntegrationRegistryIdentity.namespace,
          entryPoint: "integrationRegistry.ts" as const,
          collection: "lifecycleCoverage" as const,
          entryKey: state,
          preservesCanonicalReference: true as const,
          duplicatesRegistryValue: false as const,
          metadataOnly: true as const,
          immutable: true as const,
        }),
        ownership: "EIL-1:3" as const,
        version: "1.0.0" as const,
        ordinal: index + 1,
        tags: Object.freeze(["lifecycle", state.toLowerCase()]),
        executesTransitions: false as const,
        runtimeStateMachine: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      });
    }),
  );
