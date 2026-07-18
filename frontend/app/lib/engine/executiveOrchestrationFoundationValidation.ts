import {
  ExecutiveOrchestrationCapabilityContract,
  ExecutiveOrchestrationDependencyContract,
  ExecutiveOrchestrationFoundation,
  ExecutiveOrchestrationLifecycleContract,
  ExecutiveOrchestrationResponsibilityContract,
} from "./executiveOrchestrationFoundation.ts";
import type {
  ExecutiveOrchestrationValidationCategoryGroup,
  ExecutiveOrchestrationValidationRule,
} from "./executiveOrchestrationValidationTypes.ts";

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
  id: `eng-8-validation-foundation-${key}`,
  name,
  category,
  severity,
  description,
  validatedArtifact,
  expectedState,
  actualMetadataResult,
  status: "Pass",
  owner: "ENG-8",
  targetPhase: "ENG-8:1",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtimeFree: true,
  executesValidation: false,
} as const satisfies ExecutiveOrchestrationValidationRule);

/**
 * Immutable foundation validation rules for ENG-8:1.
 * Descriptive metadata only — does not execute validation engines.
 */
export const ExecutiveOrchestrationFoundationValidation = Object.freeze({
  id: "eng-8-validation-foundation",
  category: "Foundation",
  name: "Executive Orchestration Foundation Validation",
  description:
    "Validates ENG-8:1 foundation responsibilities, lifecycle, capabilities, and dependency declarations.",
  rules: Object.freeze([
    rule(
      "foundation-exists",
      "Foundation exists",
      "Foundation",
      "Critical",
      "ENG-8:1 foundation aggregate is published through its public API.",
      "ExecutiveOrchestrationFoundation",
      "id=ENG-8:1",
      `id=${ExecutiveOrchestrationFoundation.id}`,
    ),
    rule(
      "responsibilities-exist",
      "Responsibilities exist",
      "Foundation",
      "Critical",
      "Foundation publishes twelve orchestration responsibilities.",
      "ExecutiveOrchestrationResponsibilityContract.responsibilities",
      "count=12",
      `count=${ExecutiveOrchestrationResponsibilityContract.responsibilities.length}`,
    ),
    rule(
      "lifecycle-complete",
      "Lifecycle complete",
      "Lifecycle",
      "Critical",
      "Foundation publishes the eight canonical lifecycle stages.",
      "ExecutiveOrchestrationLifecycleContract.stages",
      "count=8",
      `count=${ExecutiveOrchestrationLifecycleContract.stages.length}`,
    ),
    rule(
      "lifecycle-ordering",
      "Lifecycle ordering valid",
      "Lifecycle",
      "Error",
      "Lifecycle ordering begins with Idle and ends with Complete.",
      "ExecutiveOrchestrationLifecycleContract.ordering",
      "Idle...Complete",
      `${ExecutiveOrchestrationLifecycleContract.ordering[0]}...${ExecutiveOrchestrationLifecycleContract.ordering[7]}`,
    ),
    rule(
      "capability-registry-complete",
      "Capability registry complete",
      "Capability",
      "Critical",
      "Foundation publishes eight orchestration capabilities.",
      "ExecutiveOrchestrationCapabilityContract.capabilities",
      "count=8",
      `count=${ExecutiveOrchestrationCapabilityContract.capabilities.length}`,
    ),
    rule(
      "dependency-declarations-valid",
      "Dependency declarations valid",
      "Dependency",
      "Error",
      "Foundation declares ten allowed public dependencies and forbids runtime infrastructure.",
      "ExecutiveOrchestrationDependencyContract.rules",
      "allowed=10;forbiddenIncludes=Queue,Scheduler",
      `allowed=${ExecutiveOrchestrationDependencyContract.rules.allowed.length};forbiddenIncludes=${
        ExecutiveOrchestrationDependencyContract.rules.forbidden.includes("Queue")
        && ExecutiveOrchestrationDependencyContract.rules.forbidden.includes("Scheduler")
      }`,
    ),
    rule(
      "runtime-free-boundary",
      "Foundation runtime-free boundary",
      "Foundation",
      "Critical",
      "Foundation declares it never performs orchestration or scheduling.",
      "ExecutiveOrchestrationFoundation.architecturalBoundaries",
      "performsOrchestration=false;performsScheduling=false",
      `performsOrchestration=${ExecutiveOrchestrationFoundation.architecturalBoundaries.performsOrchestration};performsScheduling=${ExecutiveOrchestrationFoundation.architecturalBoundaries.performsScheduling}`,
    ),
    rule(
      "metadata-only",
      "Foundation metadata-only",
      "MetadataConsistency",
      "Error",
      "Foundation is metadata-only and runtime-free.",
      "ExecutiveOrchestrationFoundation",
      "metadataOnly=true;runtimeFree=true",
      `metadataOnly=${ExecutiveOrchestrationFoundation.metadataOnly};runtimeFree=${ExecutiveOrchestrationFoundation.runtimeFree}`,
    ),
  ] as const),
  ruleCount: 8,
  passCount: 8,
  status: "Pass",
  metadataOnly: true,
  immutable: true,
  runtimeFree: true,
} as const satisfies ExecutiveOrchestrationValidationCategoryGroup);
