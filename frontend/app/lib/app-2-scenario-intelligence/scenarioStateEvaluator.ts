/**
 * APP-2:2 — Scenario State Evaluator.
 * Pure deterministic state resolution — no side effects or global state.
 */

import { validateScenarioIdentityShape, isScenarioStatus } from "./scenarioIntelligenceContract.ts";
import { createScenarioDiagnostic } from "./scenarioIntelligenceDiagnostics.ts";
import {
  getScenarioLifecycleStageDefinition,
  isScenarioLifecycleTerminalStage,
} from "./scenarioIntelligenceLifecycle.ts";
import { validateScenarioMetadataShape } from "./scenarioIntelligenceMetadata.ts";
import { SCENARIO_DEFAULT_HEALTH_STATE } from "./scenarioIntelligenceStates.ts";
import type {
  ScenarioDiagnostic,
  ScenarioHealthState,
  ScenarioStatus,
} from "./scenarioIntelligenceTypes.ts";
import type {
  ScenarioOperationalState,
  ScenarioStateEvaluationInput,
  ScenarioStateResult,
} from "./scenarioStateResult.ts";
import {
  SCENARIO_STATE_CONFIDENCE_BY_HEALTH,
  createScenarioStateResult,
} from "./scenarioStateResult.ts";

export type ScenarioStateEvaluationContext = Readonly<{
  input: ScenarioStateEvaluationInput;
  diagnostics: readonly ScenarioDiagnostic[];
  lifecycle: ScenarioStatus;
  healthState: ScenarioHealthState;
  operationalState: ScenarioOperationalState;
  completeness: number;
  monitoringEligible: boolean;
  isArchived: boolean;
  isInactive: boolean;
  isBlocked: boolean;
}>;

const COMPLETENESS_CHECKS = 5;

function pushDiagnostic(
  diagnostics: ScenarioDiagnostic[],
  code: Parameters<typeof createScenarioDiagnostic>[0],
  message: string,
  metadata: Readonly<Record<string, unknown>> = Object.freeze({})
): void {
  diagnostics.push(createScenarioDiagnostic(code, message, metadata));
}

function hasValidExecutiveTimeReference(
  identity: NonNullable<ScenarioStateEvaluationInput["identity"]>
): boolean {
  const reference = identity.executiveTimeReference;
  return (
    reference !== null &&
    reference.readOnly === true &&
    reference.contextKey.trim().length > 0 &&
    reference.timestamp.trim().length > 0
  );
}

function hasValidTimelineReference(
  identity: NonNullable<ScenarioStateEvaluationInput["identity"]>
): boolean {
  const reference = identity.timelineReference;
  return (
    reference !== null &&
    reference.readOnly === true &&
    reference.timelineId.trim().length > 0 &&
    reference.anchorTimestamp.trim().length > 0
  );
}

function countCompleteness(input: ScenarioStateEvaluationInput): number {
  if (!input.identity || !input.metadata) return 0;
  let passed = 0;
  if (input.identity.scenarioId.trim()) passed += 1;
  if (input.identity.workspaceId.trim()) passed += 1;
  if (validateScenarioMetadataShape(input.metadata).valid) passed += 1;
  if (hasValidExecutiveTimeReference(input.identity) || hasValidTimelineReference(input.identity)) {
    passed += 1;
  }
  if (isScenarioStatus(input.identity.status)) passed += 1;
  return passed / COMPLETENESS_CHECKS;
}

function resolveOperationalState(
  lifecycle: ScenarioStatus,
  isBlocked: boolean,
  isArchived: boolean
): ScenarioOperationalState {
  if (isArchived) return "archived";
  if (isBlocked || lifecycle === "waiting") return "blocked";
  if (lifecycle === "monitoring" || lifecycle === "analyzing") return "monitoring";
  if (lifecycle === "active") return "active";
  if (lifecycle === "created" || lifecycle === "draft" || lifecycle === "completed") {
    return "inactive";
  }
  return "unknown";
}

function resolveMonitoringEligibility(
  lifecycle: ScenarioStatus,
  completeness: number,
  diagnostics: readonly ScenarioDiagnostic[]
): boolean {
  if (lifecycle !== "active" && lifecycle !== "monitoring" && lifecycle !== "analyzing") {
    return false;
  }
  if (completeness < 0.8) return false;
  return !diagnostics.some((entry) => entry.severity === "error");
}

export function evaluateScenarioStateContext(
  input: ScenarioStateEvaluationInput
): ScenarioStateEvaluationContext {
  const diagnostics: ScenarioDiagnostic[] = [];
  const evaluatedAt = input.evaluatedAt;

  if (!input.scenarioId.trim()) {
    pushDiagnostic(diagnostics, "missing_scenario", "Scenario ID is required.", { evaluatedAt });
  }

  if (!input.workspaceId.trim()) {
    pushDiagnostic(diagnostics, "invalid_workspace", "Workspace ID is required.", { evaluatedAt });
  }

  if (!input.identity) {
    pushDiagnostic(diagnostics, "missing_scenario", "Scenario identity is unavailable.", {
      scenarioId: input.scenarioId,
      evaluatedAt,
    });
    return Object.freeze({
      input,
      diagnostics: Object.freeze(diagnostics),
      lifecycle: "created",
      healthState: SCENARIO_DEFAULT_HEALTH_STATE,
      operationalState: "unknown",
      completeness: 0,
      monitoringEligible: false,
      isArchived: false,
      isInactive: true,
      isBlocked: false,
    });
  }

  if (input.identity.scenarioId !== input.scenarioId) {
    pushDiagnostic(diagnostics, "contract_violation", "Scenario ID mismatch.", {
      requestedScenarioId: input.scenarioId,
      identityScenarioId: input.identity.scenarioId,
    });
  }

  if (input.identity.workspaceId !== input.workspaceId) {
    pushDiagnostic(diagnostics, "invalid_workspace", "Workspace isolation violation.", {
      requestedWorkspaceId: input.workspaceId,
      identityWorkspaceId: input.identity.workspaceId,
    });
  }

  const identityValidation = validateScenarioIdentityShape(input.identity);
  if (!identityValidation.valid) {
    pushDiagnostic(diagnostics, "contract_violation", "Scenario identity violates APP-2 contract.", {
      issues: identityValidation.issues,
    });
  }

  if (!input.metadata) {
    pushDiagnostic(diagnostics, "missing_context", "Scenario metadata is unavailable.", {
      scenarioId: input.scenarioId,
    });
  } else {
    const metadataValidation = validateScenarioMetadataShape(input.metadata);
    if (!metadataValidation.valid) {
      pushDiagnostic(diagnostics, "contract_violation", "Scenario metadata is invalid.", {
        missing: metadataValidation.missing,
      });
    }
  }

  const lifecycle = input.identity.status;
  if (!isScenarioStatus(lifecycle)) {
    pushDiagnostic(diagnostics, "lifecycle_error", "Scenario lifecycle stage is invalid.", {
      lifecycle,
    });
  } else if (!getScenarioLifecycleStageDefinition(lifecycle)) {
    pushDiagnostic(diagnostics, "lifecycle_error", "Scenario lifecycle stage is unknown.", {
      lifecycle,
    });
  }

  const executiveTimeValid = hasValidExecutiveTimeReference(input.identity);
  const timelineValid = hasValidTimelineReference(input.identity);

  if (input.identity.executiveTimeReference && !executiveTimeValid) {
    pushDiagnostic(diagnostics, "dependency_error", "Executive Time reference is invalid.", {
      reference: input.identity.executiveTimeReference,
    });
  }

  if (input.identity.timelineReference && !timelineValid) {
    pushDiagnostic(diagnostics, "invalid_timeline", "Timeline reference is invalid.", {
      reference: input.identity.timelineReference,
    });
  }

  if (!executiveTimeValid && !timelineValid) {
    pushDiagnostic(diagnostics, "missing_context", "Required executive references are unavailable.", {
      requires: "executive_time_or_timeline",
    });
  }

  const completeness = countCompleteness(input);
  const isArchived = lifecycle === "archived";
  const hasWorkspaceViolation = diagnostics.some((entry) => entry.code === "invalid_workspace");
  const hasMissingScenario = diagnostics.some((entry) => entry.code === "missing_scenario");
  const hasLifecycleError = diagnostics.some((entry) => entry.code === "lifecycle_error");
  const hasContractViolation = diagnostics.some((entry) => entry.code === "contract_violation");
  const hasDependencyError = diagnostics.some((entry) => entry.code === "dependency_error");
  const isBlocked = lifecycle === "waiting" || hasWorkspaceViolation;

  let healthState: ScenarioHealthState = SCENARIO_DEFAULT_HEALTH_STATE;

  if (hasMissingScenario || hasLifecycleError) {
    healthState = "unknown";
  } else if (isBlocked) {
    healthState = "blocked";
  } else if (hasContractViolation) {
    healthState = "critical";
  } else if (isArchived) {
    healthState = completeness >= 0.8 ? "healthy" : "attention";
  } else if (hasDependencyError || diagnostics.some((entry) => entry.code === "invalid_timeline")) {
    healthState = "warning";
  } else if (lifecycle === "draft" || lifecycle === "created") {
    healthState = completeness >= 0.8 ? "attention" : "warning";
  } else if (lifecycle === "completed") {
    healthState = "healthy";
  } else if (lifecycle === "active" || lifecycle === "monitoring") {
    healthState = completeness >= 0.8 ? "healthy" : "attention";
  } else if (lifecycle === "analyzing") {
    healthState = completeness >= 0.6 ? "attention" : "warning";
  } else if (completeness >= 0.8) {
    healthState = "healthy";
  }

  const operationalState = resolveOperationalState(lifecycle, isBlocked, isArchived);
  const isInactive =
    operationalState === "inactive" || operationalState === "archived" || operationalState === "unknown";

  return Object.freeze({
    input,
    diagnostics: Object.freeze(diagnostics),
    lifecycle,
    healthState,
    operationalState,
    completeness,
    monitoringEligible: resolveMonitoringEligibility(lifecycle, completeness, diagnostics),
    isArchived,
    isInactive,
    isBlocked,
  });
}

export function buildScenarioStateResult(context: ScenarioStateEvaluationContext): ScenarioStateResult {
  const { input, diagnostics, lifecycle, healthState, operationalState } = context;
  return createScenarioStateResult({
    scenarioId: input.scenarioId,
    workspaceId: input.workspaceId,
    currentState: healthState,
    lifecycle,
    operationalState,
    confidence: SCENARIO_STATE_CONFIDENCE_BY_HEALTH[healthState],
    completeness: context.completeness,
    monitoringEligible: context.monitoringEligible,
    isArchived: context.isArchived,
    isInactive: context.isInactive,
    isBlocked: context.isBlocked,
    diagnostics,
    timestamp: input.evaluatedAt,
  });
}

export function evaluateScenarioState(input: ScenarioStateEvaluationInput): ScenarioStateResult {
  return buildScenarioStateResult(evaluateScenarioStateContext(input));
}
