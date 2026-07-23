/**
 * EIL-3:3 — Integration Routing Lifecycle Models.
 *
 * Immutable lifecycle mapping declarations for routing metadata.
 * Metadata only — no state machines or transition execution.
 *
 * Ownership: owned exclusively by EIL-3:3.
 */

import { IntegrationRoutingRegistryPlatform } from "./integrationRoutingRegistry.ts";
import type {
  RoutingLifecycleModel,
  RoutingModelLifecycleState,
  RoutingRegistryReference,
} from "./integrationRoutingModelTypes.ts";

const registry = IntegrationRoutingRegistryPlatform;
const registryIdentity = registry.identity;

const registryRef = (
  entryKey: string,
): RoutingRegistryReference =>
  Object.freeze({
    registryId: registryIdentity.canonicalId,
    registryNamespace: registryIdentity.namespace,
    entryPoint: "integrationRoutingRegistry.ts" as const,
    collection: "lifecycleCoverage" as const,
    entryKey,
    preservesCanonicalReference: true as const,
    duplicatesRegistryValue: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const lifecycleModel = (
  state: RoutingModelLifecycleState,
  description: string,
  ordinal: number,
): RoutingLifecycleModel =>
  Object.freeze({
    lifecycleModelId: `EIL-3:3/Lifecycle/${state}` as const,
    canonicalKey: state,
    canonicalName: state,
    description,
    ownership: "EIL-3:3" as const,
    lifecycle: state,
    sourceRegistryReference: registryRef(state),
    sourceReference:
      `EIL-3:2/IntegrationRoutingRegistry/lifecycleCoverage/${state}`,
    version: "1.0.0" as const,
    ordinal,
    tags: Object.freeze(["lifecycle", "mapping", state.toLowerCase()]),
    executesTransitions: false as const,
    runtimeStateMachine: false as const,
    metadataOnly: true as const,
    immutable: true as const,
  });

const LIFECYCLE_DESCRIPTIONS = Object.freeze({
  Declared: "Lifecycle mapping for declared routing metadata.",
  Designed: "Lifecycle mapping for designed routing metadata.",
  Verified: "Lifecycle mapping for verified routing metadata.",
  Certified: "Lifecycle mapping for certified routing metadata.",
  Frozen: "Lifecycle mapping for frozen routing metadata.",
  Released: "Lifecycle mapping for released routing metadata.",
  Deprecated: "Lifecycle mapping for deprecated routing metadata.",
  Retired: "Lifecycle mapping for retired routing metadata.",
} as const satisfies Record<RoutingModelLifecycleState, string>);

/**
 * Exactly eight immutable lifecycle mappings preserving Registry order.
 * Metadata only — no transition execution.
 */
export const IntegrationRoutingLifecycleModels: readonly RoutingLifecycleModel[] =
  Object.freeze(
    registry.lifecycleCoverage.map((item, index) =>
      lifecycleModel(
        item.state as RoutingModelLifecycleState,
        LIFECYCLE_DESCRIPTIONS[item.state as RoutingModelLifecycleState],
        index + 1,
      ),
    ),
  );
