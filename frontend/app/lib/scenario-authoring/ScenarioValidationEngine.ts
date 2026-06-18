import { SCENARIO_SUPPORTED_TYPES } from "../scenario-intelligence/scenarioGenerationContract.ts";
import { getKpiIntelligenceRegistry } from "../kpi-intelligence/KpiIntelligenceRuntime.ts";
import { getObjectIntelligenceRegistry } from "../object-intelligence/ObjectIntelligenceRuntime.ts";
import { getRelationshipIntelligenceRegistry } from "../relationship-intelligence/RelationshipIntelligenceRuntime.ts";
import { getRiskIntelligenceRegistry } from "../risk-intelligence/RiskIntelligenceRuntime.ts";
import type { ScenarioDraft } from "./scenarioAuthoringContract.ts";
import type { ScenarioInputModel } from "./scenarioInputModelContract.ts";
import {
  EMPTY_SCENARIO_VALIDATION_REFERENCE_CATALOG,
  EMPTY_SCENARIO_VALIDATION_RESULT,
  SCENARIO_VALIDATION_ENGINE_DIAGNOSTICS,
  SCENARIO_VALIDATION_ENGINE_VERSION,
  type ScenarioValidationEngineBuildInput,
  type ScenarioValidationIssue,
  type ScenarioValidationReferenceCatalog,
  type ScenarioValidationResult,
} from "./scenarioValidationEngineContract.ts";

let latestScenarioValidationResult: ScenarioValidationResult = EMPTY_SCENARIO_VALIDATION_RESULT;

function readString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function uniqueIds(values: readonly string[]): readonly string[] {
  return Object.freeze([...new Set(values.map((entry) => readString(entry)).filter(Boolean))]);
}

function asRecord(value: unknown): Readonly<Record<string, unknown>> | null {
  return value && typeof value === "object" ? (value as Readonly<Record<string, unknown>>) : null;
}

function readSceneCollection(sceneJson: unknown, key: string): readonly unknown[] {
  const collection = (sceneJson as { scene?: Record<string, unknown> } | null)?.scene?.[key];
  return Array.isArray(collection) ? collection : [];
}

function resolveSceneObjectIds(sceneJson: unknown): readonly string[] {
  const ids: string[] = [];
  for (const [index, entry] of readSceneCollection(sceneJson, "objects").entries()) {
    const record = asRecord(entry);
    if (!record) continue;
    ids.push(
      readString(record.objectId) ||
        readString(record.id) ||
        readString(record.name) ||
        `scene:object:${index + 1}`
    );
  }
  return uniqueIds(ids);
}

function resolveSceneRelationshipIds(sceneJson: unknown): readonly string[] {
  const ids: string[] = [];
  for (const [index, entry] of readSceneCollection(sceneJson, "relationships").entries()) {
    const record = asRecord(entry);
    if (!record) continue;
    ids.push(
      readString(record.relationshipId) ||
        readString(record.id) ||
        `relationship:${readString(record.sourceId) || "source"}:${readString(record.targetId) || "target"}:${index + 1}`
    );
  }
  return uniqueIds(ids);
}

function resolveSceneKpiIds(sceneJson: unknown): readonly string[] {
  const scene = (sceneJson as { scene?: Record<string, unknown> } | null)?.scene;
  const collections = [
    readSceneCollection(sceneJson, "kpis"),
    Array.isArray(scene?.metrics) ? scene.metrics : [],
    Array.isArray(scene?.kpiBoard) ? scene.kpiBoard : [],
  ];
  const ids: string[] = [];
  for (const collection of collections) {
    for (const [index, entry] of collection.entries()) {
      const record = asRecord(entry);
      if (!record) continue;
      ids.push(readString(record.kpiId) || readString(record.id) || readString(record.label) || `kpi:${index + 1}`);
    }
  }
  return uniqueIds(ids);
}

function resolveSceneRiskIds(sceneJson: unknown): readonly string[] {
  const ids: string[] = [];
  for (const [index, entry] of readSceneCollection(sceneJson, "risks").entries()) {
    const record = asRecord(entry);
    if (!record) continue;
    ids.push(readString(record.riskId) || readString(record.id) || readString(record.label) || `risk:${index + 1}`);
  }
  return uniqueIds(ids);
}

function resolveRegistryObjectIds(): readonly string[] {
  return uniqueIds(getObjectIntelligenceRegistry().profiles.map((profile) => profile.objectId));
}

function resolveRegistryRelationshipIds(): readonly string[] {
  return uniqueIds(
    getRelationshipIntelligenceRegistry().profiles.map((profile) => profile.relationshipId)
  );
}

function resolveRegistryKpiIds(): readonly string[] {
  return uniqueIds(getKpiIntelligenceRegistry().profiles.map((profile) => profile.kpiId));
}

function resolveRegistryRiskIds(): readonly string[] {
  return uniqueIds(getRiskIntelligenceRegistry().profiles.map((profile) => profile.riskId));
}

function mergeCatalog(
  input: ScenarioValidationEngineBuildInput
): ScenarioValidationReferenceCatalog {
  const explicit = input.referenceCatalog;
  const objectIds = uniqueIds([
    ...(explicit?.objectIds ?? []),
    ...resolveSceneObjectIds(input.sceneJson),
    ...resolveRegistryObjectIds(),
  ]);
  const relationshipIds = uniqueIds([
    ...(explicit?.relationshipIds ?? []),
    ...resolveSceneRelationshipIds(input.sceneJson),
    ...resolveRegistryRelationshipIds(),
  ]);
  const kpiIds = uniqueIds([
    ...(explicit?.kpiIds ?? []),
    ...resolveSceneKpiIds(input.sceneJson),
    ...resolveRegistryKpiIds(),
  ]);
  const riskIds = uniqueIds([
    ...(explicit?.riskIds ?? []),
    ...resolveSceneRiskIds(input.sceneJson),
    ...resolveRegistryRiskIds(),
  ]);

  const catalogAvailable =
    Boolean(input.sceneJson) ||
    Boolean(explicit) ||
    objectIds.length > 0 ||
    relationshipIds.length > 0 ||
    kpiIds.length > 0 ||
    riskIds.length > 0;

  return Object.freeze({
    objectIds,
    relationshipIds,
    kpiIds,
    riskIds,
    catalogAvailable,
  });
}

function issue(
  level: ScenarioValidationIssue["level"],
  kind: ScenarioValidationIssue["kind"],
  field: string,
  targetId: string,
  message: string
): ScenarioValidationIssue {
  return Object.freeze({ level, kind, field, targetId, message });
}

function validateRequiredFields(draft: ScenarioDraft): {
  errors: ScenarioValidationIssue[];
  warnings: ScenarioValidationIssue[];
} {
  const errors: ScenarioValidationIssue[] = [];
  const warnings: ScenarioValidationIssue[] = [];

  if (!readString(draft.draftId)) {
    errors.push(issue("error", "required_field", "draftId", "", "Draft id is required."));
  }
  if (!readString(draft.metadata.draftId)) {
    errors.push(
      issue("error", "required_field", "metadata.draftId", "", "Draft metadata id is required.")
    );
  }
  if (!readString(draft.name)) {
    errors.push(issue("error", "required_field", "name", "", "Draft name is required."));
  }
  if (!SCENARIO_SUPPORTED_TYPES.includes(draft.scenarioType)) {
    errors.push(
      issue("error", "required_field", "scenarioType", draft.scenarioType, "Draft type is invalid.")
    );
  }
  if (!readString(draft.summary)) {
    errors.push(issue("error", "required_field", "summary", "", "Draft summary is required."));
  }
  if (!readString(draft.description)) {
    warnings.push(
      issue("warning", "required_field", "description", "", "Draft description is recommended.")
    );
  }
  if (draft.assumptions.length === 0) {
    warnings.push(
      issue("warning", "required_field", "assumptions", "", "Add at least one assumption.")
    );
  }
  if (draft.scenarioType !== "baseline" && draft.focusObjectIds.length === 0) {
    errors.push(
      issue(
        "error",
        "required_field",
        "focusObjectIds",
        "",
        "At least one focus object is required for non-baseline drafts."
      )
    );
  }

  return { errors, warnings };
}

function validateObjectReference(
  targetId: string,
  field: string,
  catalog: ScenarioValidationReferenceCatalog
): ScenarioValidationIssue | null {
  if (!readString(targetId)) {
    return issue("error", "object_reference", field, targetId, "Object reference id is required.");
  }
  if (!catalog.catalogAvailable) {
    return issue(
      "warning",
      "object_reference",
      field,
      targetId,
      `Object reference ${targetId} could not be verified; catalog unavailable.`
    );
  }
  if (!catalog.objectIds.includes(targetId)) {
    return issue(
      "error",
      "object_reference",
      field,
      targetId,
      `Object reference ${targetId} is not present in the intelligence catalog.`
    );
  }
  return null;
}

function validateRelationshipReference(
  targetId: string,
  field: string,
  catalog: ScenarioValidationReferenceCatalog
): ScenarioValidationIssue | null {
  if (!readString(targetId)) {
    return issue(
      "error",
      "relationship_reference",
      field,
      targetId,
      "Relationship reference id is required."
    );
  }
  if (!catalog.catalogAvailable) {
    return issue(
      "warning",
      "relationship_reference",
      field,
      targetId,
      `Relationship reference ${targetId} could not be verified; catalog unavailable.`
    );
  }
  if (!catalog.relationshipIds.includes(targetId)) {
    return issue(
      "error",
      "relationship_reference",
      field,
      targetId,
      `Relationship reference ${targetId} is not present in the intelligence catalog.`
    );
  }
  return null;
}

function validateKpiReference(
  targetId: string,
  field: string,
  catalog: ScenarioValidationReferenceCatalog
): ScenarioValidationIssue | null {
  if (!readString(targetId)) {
    return issue("error", "kpi_reference", field, targetId, "KPI reference id is required.");
  }
  if (!catalog.catalogAvailable) {
    return issue(
      "warning",
      "kpi_reference",
      field,
      targetId,
      `KPI reference ${targetId} could not be verified; catalog unavailable.`
    );
  }
  if (!catalog.kpiIds.includes(targetId)) {
    return issue(
      "error",
      "kpi_reference",
      field,
      targetId,
      `KPI reference ${targetId} is not present in the intelligence catalog.`
    );
  }
  return null;
}

function validateRiskReference(
  targetId: string,
  field: string,
  catalog: ScenarioValidationReferenceCatalog
): ScenarioValidationIssue | null {
  if (!readString(targetId)) {
    return issue("error", "risk_reference", field, targetId, "Risk reference id is required.");
  }
  if (!catalog.catalogAvailable) {
    return issue(
      "warning",
      "risk_reference",
      field,
      targetId,
      `Risk reference ${targetId} could not be verified; catalog unavailable.`
    );
  }
  if (!catalog.riskIds.includes(targetId)) {
    return issue(
      "error",
      "risk_reference",
      field,
      targetId,
      `Risk reference ${targetId} is not present in the intelligence catalog.`
    );
  }
  return null;
}

function validateReferences(
  draft: ScenarioDraft,
  inputModel: ScenarioInputModel | undefined,
  catalog: ScenarioValidationReferenceCatalog
): { errors: ScenarioValidationIssue[]; warnings: ScenarioValidationIssue[] } {
  const errors: ScenarioValidationIssue[] = [];
  const warnings: ScenarioValidationIssue[] = [];

  const pushIssue = (result: ScenarioValidationIssue | null) => {
    if (!result) return;
    if (result.level === "error") errors.push(result);
    else warnings.push(result);
  };

  for (const objectId of draft.focusObjectIds) {
    pushIssue(validateObjectReference(objectId, "focusObjectIds", catalog));
  }

  if (inputModel) {
    for (const change of inputModel.objectChanges) {
      pushIssue(validateObjectReference(change.targetId, `objectChanges.${change.field}`, catalog));
    }
    for (const change of inputModel.relationshipChanges) {
      pushIssue(
        validateRelationshipReference(change.targetId, `relationshipChanges.${change.field}`, catalog)
      );
    }
    for (const change of inputModel.kpiChanges) {
      pushIssue(validateKpiReference(change.targetId, `kpiChanges.${change.field}`, catalog));
    }
    for (const change of inputModel.riskChanges) {
      pushIssue(validateRiskReference(change.targetId, `riskChanges.${change.field}`, catalog));
    }
  }

  return { errors, warnings };
}

function resolveValidationState(
  errors: readonly ScenarioValidationIssue[],
  warnings: readonly ScenarioValidationIssue[],
  draft: ScenarioDraft
): ScenarioValidationResult["validationState"] {
  if (errors.length > 0) return "invalid";
  if (warnings.length > 0 || draft.validationState === "incomplete") return "incomplete";
  return "valid";
}

function buildValidationSummary(
  draft: ScenarioDraft,
  errors: readonly ScenarioValidationIssue[],
  warnings: readonly ScenarioValidationIssue[],
  accepted: boolean
): string {
  if (!readString(draft.draftId)) {
    return "Scenario validation rejected draft: no draft id is available.";
  }
  if (accepted) {
    return [
      `Scenario validation accepted draft ${draft.draftId}.`,
      warnings.length > 0 ? `${warnings.length} warning(s) recorded.` : "No warnings recorded.",
    ].join(" ");
  }
  return [
    `Scenario validation rejected draft ${draft.draftId}.`,
    `${errors.length} error(s) and ${warnings.length} warning(s) recorded.`,
  ].join(" ");
}

export function validateScenarioDraft(
  input: ScenarioValidationEngineBuildInput
): ScenarioValidationResult {
  const draft = input.draft;
  if (!readString(draft.draftId)) {
    latestScenarioValidationResult = EMPTY_SCENARIO_VALIDATION_RESULT;
    return latestScenarioValidationResult;
  }

  const referenceCatalog = mergeCatalog(input);
  const required = validateRequiredFields(draft);
  const references = validateReferences(draft, input.inputModel, referenceCatalog);
  const errors = Object.freeze([...required.errors, ...references.errors]);
  const warnings = Object.freeze([...required.warnings, ...references.warnings]);
  const validationState = resolveValidationState(errors, warnings, draft);
  const valid = errors.length === 0;
  const accepted = valid && validationState !== "invalid";
  const rejected = !accepted;

  const result = Object.freeze({
    version: SCENARIO_VALIDATION_ENGINE_VERSION,
    draftId: draft.draftId,
    valid,
    accepted,
    rejected,
    validationState,
    errors,
    warnings,
    errorCount: errors.length,
    warningCount: warnings.length,
    validationSummary: buildValidationSummary(draft, errors, warnings, accepted),
    referenceCatalog,
    simulationActive: false as const,
    executionActive: false as const,
    dsMutation: false as const,
    sceneMutation: false as const,
    objectMutation: false as const,
    routingMutation: false as const,
    topologyMutation: false as const,
    diagnostics: SCENARIO_VALIDATION_ENGINE_DIAGNOSTICS,
  });

  latestScenarioValidationResult = result;
  return result;
}

export function getScenarioValidationResult(): ScenarioValidationResult {
  return latestScenarioValidationResult;
}

export function resetScenarioValidationEngineForTests(): void {
  latestScenarioValidationResult = EMPTY_SCENARIO_VALIDATION_RESULT;
}

export const ScenarioValidationEngine = Object.freeze({
  validateScenarioDraft,
  getScenarioValidationResult,
  resetScenarioValidationEngineForTests,
});
