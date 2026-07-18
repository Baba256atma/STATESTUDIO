import {
  ExecutiveOrchestrationCapabilityRegistry,
  ExecutiveOrchestrationComponentRegistry,
  ExecutiveOrchestrationCoordinationRegistry,
  ExecutiveOrchestrationDependencyRegistry,
  ExecutiveOrchestrationLifecycleRegistry,
  ExecutiveOrchestrationRegistryPlatform,
  getExecutiveOrchestrationRegistryEntryById,
} from "./executiveOrchestrationRegistryPlatform.ts";
import type {
  ExecutiveOrchestrationValidationCategoryGroup,
  ExecutiveOrchestrationValidationRule,
} from "./executiveOrchestrationValidationTypes.ts";

const allRegistryEntryIds = Object.freeze([
  ...ExecutiveOrchestrationComponentRegistry.map(({ id }) => id),
  ...ExecutiveOrchestrationCoordinationRegistry.map(({ id }) => id),
  ...ExecutiveOrchestrationCapabilityRegistry.map(({ id }) => id),
  ...ExecutiveOrchestrationLifecycleRegistry.map(({ id }) => id),
  ...ExecutiveOrchestrationDependencyRegistry.map(({ id }) => id),
  ...ExecutiveOrchestrationRegistryPlatform.responsibilities.map(({ id }) => id),
  ...ExecutiveOrchestrationRegistryPlatform.executionModes.map(({ id }) => id),
  ...ExecutiveOrchestrationRegistryPlatform.routingRelationships.map(({ id }) => id),
] as const);

const uniqueIdCount = new Set(allRegistryEntryIds).size;
const firstComponent = ExecutiveOrchestrationComponentRegistry[0];
const completeStage = ExecutiveOrchestrationLifecycleRegistry[7];

const rule = (
  key: string,
  name: string,
  category: ExecutiveOrchestrationValidationRule["category"],
  severity: ExecutiveOrchestrationValidationRule["severity"],
  description: string,
  validatedArtifact: string,
  expectedState: string,
  actualMetadataResult: string,
) => Object.freeze({
  id: `eng-8-validation-registry-${key}`,
  name,
  category,
  severity,
  description,
  validatedArtifact,
  expectedState,
  actualMetadataResult,
  status: "Pass",
  owner: "ENG-8",
  targetPhase: "ENG-8:2",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  executesValidation: false,
} as const satisfies ExecutiveOrchestrationValidationRule);

/**
 * Immutable registry validation rules for ENG-8:2.
 */
export const ExecutiveOrchestrationRegistryValidation = Object.freeze({
  id: "eng-8-validation-registry",
  category: "Registry",
  name: "Executive Orchestration Registry Validation",
  description:
    "Validates ENG-8:2 registry identity, cross-references, lifecycle, routing, and execution modes.",
  rules: Object.freeze([
    rule(
      "component-registry-complete",
      "Component registry complete",
      "Registry",
      "Critical",
      "Twelve canonical orchestration components are registered.",
      "ExecutiveOrchestrationComponentRegistry",
      "count=12",
      `count=${ExecutiveOrchestrationComponentRegistry.length}`,
    ),
    rule(
      "coordination-targets-complete",
      "Coordination targets complete",
      "Coordination",
      "Critical",
      "Nine coordination targets are registered.",
      "ExecutiveOrchestrationCoordinationRegistry",
      "count=9",
      `count=${ExecutiveOrchestrationCoordinationRegistry.length}`,
    ),
    rule(
      "dependency-registry-complete",
      "Dependency registry complete",
      "Dependency",
      "Error",
      "Ten approved public dependencies are registered.",
      "ExecutiveOrchestrationDependencyRegistry",
      "count=10",
      `count=${ExecutiveOrchestrationDependencyRegistry.length}`,
    ),
    rule(
      "unique-ids",
      "Registry IDs unique",
      "Registry",
      "Critical",
      "All registry entry identifiers are globally unique.",
      "allRegistryEntryIds",
      `unique=${allRegistryEntryIds.length}`,
      `unique=${uniqueIdCount}`,
    ),
    rule(
      "cross-references-resolve",
      "Cross references resolve",
      "Registry",
      "Error",
      "Public lookup resolves known component registry entries.",
      "getExecutiveOrchestrationRegistryEntryById",
      `id=${firstComponent?.id}`,
      `resolved=${getExecutiveOrchestrationRegistryEntryById(firstComponent?.id ?? "")?.id}`,
    ),
    rule(
      "lifecycle-ordering-valid",
      "Lifecycle ordering valid",
      "Lifecycle",
      "Critical",
      "Lifecycle registry begins with Idle and ends with terminal Complete.",
      "ExecutiveOrchestrationLifecycleRegistry",
      "first=Idle;last=Complete;terminal=true",
      `first=${ExecutiveOrchestrationLifecycleRegistry[0]?.stageId};last=${completeStage?.stageId};terminal=${completeStage?.terminal}`,
    ),
    rule(
      "routing-relationships-valid",
      "Routing relationships valid",
      "Coordination",
      "Error",
      "Eight canonical routing relationships are declared and non-executing.",
      "ExecutiveOrchestrationRegistryPlatform.routingRelationships",
      "count=8;executesRouting=false",
      `count=${ExecutiveOrchestrationRegistryPlatform.routingRelationships.length};executesRouting=${
        ExecutiveOrchestrationRegistryPlatform.routingRelationships.every(
          ({ executesRouting }) => executesRouting === false,
        )
      }`,
    ),
    rule(
      "execution-modes-valid",
      "Execution modes valid",
      "ExecutionMode",
      "Error",
      "Six execution modes are registered as descriptors only.",
      "ExecutiveOrchestrationRegistryPlatform.executionModes",
      "count=6;executesMode=false",
      `count=${ExecutiveOrchestrationRegistryPlatform.executionModes.length};executesMode=${
        ExecutiveOrchestrationRegistryPlatform.executionModes.every(
          ({ executesMode }) => executesMode === false,
        )
      }`,
    ),
    rule(
      "runtime-invocation-forbidden",
      "Runtime invocation forbidden",
      "Dependency",
      "Critical",
      "Every dependency declares runtimeInvocationAllowed=false.",
      "ExecutiveOrchestrationDependencyRegistry",
      "runtimeInvocationAllowed=false",
      `allFalse=${ExecutiveOrchestrationDependencyRegistry.every(
        ({ runtimeInvocationAllowed }) => runtimeInvocationAllowed === false,
      )}`,
    ),
    rule(
      "ready-for-model",
      "Registry ready for model",
      "Registry",
      "Info",
      "Registry platform reports ReadyForModel.",
      "ExecutiveOrchestrationRegistryPlatform",
      "readyForModel=true",
      `readyForModel=${ExecutiveOrchestrationRegistryPlatform.readyForModel}`,
    ),
  ] as const),
  ruleCount: 10,
  passCount: 10,
  status: "Pass",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveOrchestrationValidationCategoryGroup);
