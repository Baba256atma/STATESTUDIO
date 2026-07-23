/**
 * EIL-4:2 — Integration Orchestration Category Registry.
 *
 * Canonical registry for the ten Foundation orchestration categories.
 * Consumes only the EIL-4:1 Integration Orchestration Foundation aggregate surface.
 * Metadata-only. No runtime behavior.
 *
 * Ownership: owned exclusively by EIL-4:2.
 */

import { IntegrationOrchestrationFoundationPlatform } from "./integrationOrchestrationFoundation.ts";
import type {
  OrchestrationCategoryRegistryEntry,
  OrchestrationFlowClassification,
} from "./integrationOrchestrationRegistryTypes.ts";

const foundation = IntegrationOrchestrationFoundationPlatform;
const foundationId = foundation.identity.foundationId;
const foundationNamespace = foundation.identity.foundationNamespace;

const FLOW_CLASSIFICATION: Readonly<
  Record<string, OrchestrationFlowClassification>
> = Object.freeze({
  SequentialFlow: "Sequential",
  ParallelFlow: "Parallel",
  ConditionalFlow: "Conditional",
  EventDrivenFlow: "EventDriven",
  ScheduledFlow: "Scheduled",
  ApprovalFlow: "Approval",
  RecoveryFlow: "Recovery",
  CompensationFlow: "Compensation",
  CompositeFlow: "Composite",
  ExecutiveFlow: "Executive",
});

/**
 * Exactly ten category registry entries preserving Foundation order.
 */
export const IntegrationOrchestrationCategoryRegistry: readonly OrchestrationCategoryRegistryEntry[] =
  Object.freeze(
    foundation.categories.map((item) =>
      Object.freeze({
        registryId:
          `EIL-4:2/Registry/Category/${item.categoryKey}` as const,
        canonicalKey: item.categoryKey,
        canonicalName: item.canonicalName,
        name: item.canonicalName,
        category: "Category" as const,
        description: item.description,
        flowClassification: FLOW_CLASSIFICATION[item.categoryKey]!,
        sourcePhase: "EIL-4:1/IntegrationOrchestrationFoundation" as const,
        sourceNamespace: foundationNamespace,
        architecturalOwner: "EIL-4:2" as const,
        ownership: "EIL-4:2" as const,
        status: "Registered" as const,
        lifecycleState: "Verified",
        ordinal: item.deterministicOrder,
        tags: Object.freeze(["category", "foundation-reference", "flow"]),
        sourceReference: `${foundationId}/categories/${item.categoryKey}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
      }),
    ),
  );

/** Frozen category-registry catalog with derived count. */
export const IntegrationOrchestrationCategoryRegistryCatalog = Object.freeze({
  collectionId: "EIL-4:2/Collection/Categories",
  category: "Category" as const,
  sourcePhase: "EIL-4:2" as const,
  entries: IntegrationOrchestrationCategoryRegistry,
  entryCount: IntegrationOrchestrationCategoryRegistry.length,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
