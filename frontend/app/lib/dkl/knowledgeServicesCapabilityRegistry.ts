/**
 * DKL-7:2 — Knowledge Services Capability Registry.
 *
 * Registers approved DKL-7:1 capabilities by canonical reference.
 * Declarations only — no capability execution.
 *
 * Ownership: owned exclusively by DKL-7:2.
 */

import {
  KnowledgeServicesFoundation,
  KnowledgeServicesFoundationId,
} from "./knowledgeServicesFoundation.ts";
import { KnowledgeServiceRegistrations } from "./knowledgeServicesRegistryEntries.ts";
import type { KnowledgeServiceCapabilityRegistration } from "./knowledgeServicesRegistryTypes.ts";

const servicesForCapability = (
  capabilityId: string,
): readonly string[] =>
  Object.freeze(
    KnowledgeServiceRegistrations.filter(
      (service) => service.capabilityId === capabilityId,
    ).map((service) => service.id),
  );

/** Foundation capabilities registered by canonical reference. */
export const KnowledgeServiceCapabilityRegistrations: readonly KnowledgeServiceCapabilityRegistration[] =
  Object.freeze(
    KnowledgeServicesFoundation.capabilities.capabilities.map(
      (capability, index) =>
        Object.freeze({
          id: `DKL-7:2/Capability/${capability.capabilityId}`,
          name: capability.name,
          category: "capability" as const,
          description: capability.description,
          owner: "DKL-7" as const,
          status: "Registered" as const,
          runtimeBehavior: "None" as const,
          metadataOnly: true as const,
          deterministicOrder: index + 1,
          capabilityId: capability.capabilityId,
          foundationReference: `${KnowledgeServicesFoundationId}#${capability.capabilityId}`,
          readOnly: true as const,
          declaredOnly: true as const,
          implemented: false as const,
          lifecycleAvailability: "Declared" as const,
          supportedServiceIds: servicesForCapability(capability.capabilityId),
        }),
    ),
  );

/** Canonical immutable capability registry. */
export const KnowledgeServicesCapabilityRegistry = Object.freeze({
  registryId: "DKL-7:2/KnowledgeServicesCapabilityRegistry",
  sourcePhase: "DKL-7:2" as const,
  foundationId: KnowledgeServicesFoundationId,
  capabilities: KnowledgeServiceCapabilityRegistrations,
  capabilityCount: KnowledgeServiceCapabilityRegistrations.length,
  notes: Object.freeze({
    metadataOnly: true,
    declarationsOnly: true,
    noRedefinedMeaning: true,
    noRuntimeBehavior: true,
    referencedFromFoundation: true,
  }),
  metadataOnly: true,
  immutable: true,
  deterministic: true,
});
