/**
 * RTC-1:1 — Executive Context Runtime Contracts.
 *
 * Immutable public runtime contract declarations.
 * Declarations only. No implementation. No UI. No React. No Next.js.
 *
 * Ownership: owned exclusively by RTC-1:1.
 */

import type {
  ExecutiveContextRuntimeContractDeclaration,
  ExecutiveContextRuntimeContractName,
  ExecutiveContextSectionDeclaration,
  ExecutiveContextSectionName,
} from "./executiveContextRuntimeTypes.ts";

const contract = (
  contractName: ExecutiveContextRuntimeContractName,
  canonicalName: string,
  description: string,
  fields: readonly string[],
  order: number,
): ExecutiveContextRuntimeContractDeclaration =>
  Object.freeze({
    contractId: `RTC-1:1/Contract/${contractName}` as const,
    contractName,
    canonicalName,
    description,
    fields: Object.freeze([...fields]),
    executable: false as const,
    runtimeBehavior: "None" as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

const section = (
  sectionName: ExecutiveContextSectionName,
  description: string,
  order: number,
): ExecutiveContextSectionDeclaration =>
  Object.freeze({
    sectionId: `RTC-1:1/Section/${sectionName}` as const,
    sectionName,
    description,
    required: true as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Minimum Executive Context structural sections.
 * Additional fields may be introduced by later runtime phases.
 */
export const ExecutiveContextRuntimeSections:
  readonly ExecutiveContextSectionDeclaration[] = Object.freeze([
    section(
      "Identity",
      "Immutable runtime context identity (RTC-CTX-…).",
      1,
    ),
    section(
      "Lifecycle",
      "Current formal lifecycle state of the Executive Context.",
      2,
    ),
    section(
      "Manager",
      "Manager identity participating in the executive experience.",
      3,
    ),
    section(
      "Company",
      "Active company scope for the executive experience.",
      4,
    ),
    section(
      "Workspace",
      "Active workspace scope within the company.",
      5,
    ),
    section(
      "Pack",
      "Active pack scope within the workspace.",
      6,
    ),
    section(
      "FocusedObject",
      "Currently focused executive object, if any.",
      7,
    ),
    section(
      "Timeline",
      "Timeline projection consumed from Executive Context.",
      8,
    ),
    section(
      "Journal",
      "Journal projection consumed from Executive Context.",
      9,
    ),
    section(
      "Stage",
      "Stage projection consumed from Executive Context.",
      10,
    ),
    section(
      "Advisor",
      "Advisor projection consumed from Executive Context.",
      11,
    ),
    section(
      "Director",
      "Director projection consumed from Executive Context.",
      12,
    ),
    section(
      "Metadata",
      "Runtime metadata accompanying the Executive Context snapshot.",
      13,
    ),
  ]);

/**
 * Public runtime contracts exposed by Foundation.
 * Order is deterministic and immutable.
 */
export const ExecutiveContextRuntimeContracts:
  readonly ExecutiveContextRuntimeContractDeclaration[] = Object.freeze([
    contract(
      "ExecutiveContext",
      "Executive Context",
      "Canonical live runtime object describing what the executive is currently experiencing.",
      Object.freeze([
        "identity",
        "lifecycle",
        "manager",
        "company",
        "workspace",
        "pack",
        "focusedObject",
        "timeline",
        "journal",
        "stage",
        "advisor",
        "director",
        "metadata",
      ]),
      1,
    ),
    contract(
      "ExecutiveContextIdentity",
      "Executive Context Identity",
      "Immutable context identity contract. Identity never changes; state evolves.",
      Object.freeze([
        "contextId",
        "prefix",
        "sequence",
        "identityImmutable",
      ]),
      2,
    ),
    contract(
      "ExecutiveContextLifecycle",
      "Executive Context Lifecycle",
      "Formal lifecycle state contract for Created through Archived.",
      Object.freeze([
        "lifecycleState",
        "previousLifecycleState",
        "singleActiveContext",
        "transitionRef",
      ]),
      3,
    ),
    contract(
      "ExecutiveContextSnapshot",
      "Executive Context Snapshot",
      "Immutable snapshot contract enabling historical reconstruction.",
      Object.freeze([
        "snapshotId",
        "contextId",
        "lifecycleState",
        "capturedAtRef",
        "reproducible",
      ]),
      4,
    ),
    contract(
      "ExecutiveContextActivation",
      "Executive Context Activation",
      "Activation source contract for manager, runtime, and system actions.",
      Object.freeze([
        "activationId",
        "sourceCategory",
        "sourceAction",
        "targetContextId",
        "replacesContextId",
      ]),
      5,
    ),
    contract(
      "ExecutiveContextConsumer",
      "Executive Context Consumer",
      "Read-only consumer contract. Consumers never mutate context.",
      Object.freeze([
        "consumerId",
        "consumerName",
        "accessMode",
        "mayMutateContext",
      ]),
      6,
    ),
    contract(
      "ExecutiveContextEvent",
      "Executive Context Event",
      "Foundation-recognised runtime event contract. Business events deferred.",
      Object.freeze([
        "eventId",
        "eventName",
        "contextId",
        "lifecycleState",
        "businessEvent",
      ]),
      7,
    ),
    contract(
      "ExecutiveContextIntegrity",
      "Executive Context Integrity",
      "Integrity guarantees for deterministic, immutable, single-active context.",
      Object.freeze([
        "integrityId",
        "deterministic",
        "immutableSnapshots",
        "singleActiveContext",
        "stableIdentity",
      ]),
      8,
    ),
  ]);

export const ExecutiveContextRuntimeContractNames = Object.freeze([
  "ExecutiveContext",
  "ExecutiveContextIdentity",
  "ExecutiveContextLifecycle",
  "ExecutiveContextSnapshot",
  "ExecutiveContextActivation",
  "ExecutiveContextConsumer",
  "ExecutiveContextEvent",
  "ExecutiveContextIntegrity",
] as const satisfies readonly ExecutiveContextRuntimeContractName[]);

export const ExecutiveContextRuntimeSectionNames = Object.freeze([
  "Identity",
  "Lifecycle",
  "Manager",
  "Company",
  "Workspace",
  "Pack",
  "FocusedObject",
  "Timeline",
  "Journal",
  "Stage",
  "Advisor",
  "Director",
  "Metadata",
] as const satisfies readonly ExecutiveContextSectionName[]);
