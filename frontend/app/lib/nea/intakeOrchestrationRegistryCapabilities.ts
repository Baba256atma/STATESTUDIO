/**
 * NEA-7:2 — Intake Orchestration Registry Capabilities.
 *
 * Capability registry derived from every NEA-7:1 Foundation capability.
 * Declarations only. No runtime execution. No duplication of Foundation values.
 *
 * Ownership: owned exclusively by NEA-7:2.
 */

import {
  IntakeOrchestrationFoundationId,
  IntakeOrchestrationFoundationPlatform,
} from "./intakeOrchestrationFoundation.ts";
import type { IntakeOrchestrationRegistryEntry } from "./intakeOrchestrationRegistryTypes.ts";

const foundation = IntakeOrchestrationFoundationPlatform;

/** Capability registry — Foundation capability references preserved. */
export const IntakeOrchestrationCapabilityRegistry: readonly IntakeOrchestrationRegistryEntry[] =
  Object.freeze(
    foundation.capabilities.capabilities.map((item) =>
      Object.freeze({
        id: item.capabilityId,
        label: item.capabilityName,
        description: item.description,
        sourcePhase: "NEA-7:1" as const,
        foundationReference: `${IntakeOrchestrationFoundationId}/capabilities/${item.capabilityId}`,
        executesRuntime: false as const,
        metadataOnly: true as const,
        immutable: true as const,
        deterministicOrder: item.deterministicOrder,
      }),
    ),
  );

/** Canonical immutable capability registry catalog. */
export const IntakeOrchestrationCapabilityRegistryCatalog = Object.freeze({
  catalogId: "NEA-7:2/CapabilityRegistry",
  sourcePhase: "NEA-7:2" as const,
  capabilities: IntakeOrchestrationCapabilityRegistry,
  capabilityCount: IntakeOrchestrationCapabilityRegistry.length,
  executesRuntime: false as const,
  duplicatesFoundationValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
