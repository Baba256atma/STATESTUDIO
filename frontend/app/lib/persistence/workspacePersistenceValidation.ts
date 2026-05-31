import type { SavedWorkspace, WorkspacePersistenceValidationResult } from "./workspacePersistenceTypes";
import { isNexoraRelationship } from "../relationships/relationshipValidation";

export function validateSavedWorkspace(workspace: SavedWorkspace | null | undefined): WorkspacePersistenceValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!workspace) {
    return { valid: false, errors: ["missing_workspace"], warnings };
  }

  if (!workspace.id?.trim()) errors.push("missing_workspace_id");
  if (!workspace.name?.trim()) errors.push("missing_workspace_name");
  if (!workspace.version?.trim()) warnings.push("missing_workspace_version");
  if (!Array.isArray(workspace.objects)) errors.push("invalid_objects");
  if (!Array.isArray(workspace.relationships)) errors.push("invalid_relationships");

  const objectIds = new Set<string>();
  workspace.objects?.forEach((object, index) => {
    const id = String(object?.id ?? "").trim();
    if (!id) {
      errors.push(`invalid_object_id:${index}`);
      return;
    }
    if (objectIds.has(id)) errors.push(`duplicate_object_id:${id}`);
    objectIds.add(id);
    if (!String(object?.label ?? "").trim()) warnings.push(`missing_object_label:${id}`);
  });

  workspace.relationships?.forEach((relationship, index) => {
    if (!relationship?.id?.trim()) errors.push(`invalid_relationship_id:${index}`);
    if (!relationship?.sourceId?.trim() || !relationship?.targetId?.trim()) {
      errors.push(`invalid_relationship_endpoints:${index}`);
      return;
    }
    if (!objectIds.has(relationship.sourceId)) errors.push(`missing_relationship_source:${relationship.sourceId}`);
    if (!objectIds.has(relationship.targetId)) errors.push(`missing_relationship_target:${relationship.targetId}`);
    if (
      !isNexoraRelationship({
        id: relationship.id,
        sourceId: relationship.sourceId,
        targetId: relationship.targetId,
        type: relationship.type,
        direction: relationship.direction,
        createdAt: relationship.metadata?.createdAt
          ? String(relationship.metadata.createdAt)
          : workspace.updatedAt,
      })
    ) {
      warnings.push(`relationship_contract_soft_fail:${relationship.id}`);
    }
  });

  workspace.propagationPaths?.forEach((path, index) => {
    if (!path?.id?.trim()) errors.push(`invalid_propagation_path_id:${index}`);
    if (!path?.sourceObjectId?.trim() || !path?.targetObjectId?.trim()) {
      errors.push(`invalid_propagation_path_endpoints:${index}`);
      return;
    }
    if (path.sourceObjectId === path.targetObjectId) errors.push(`invalid_propagation_path_self_loop:${path.id}`);
    if (!objectIds.has(path.sourceObjectId)) errors.push(`missing_propagation_source:${path.sourceObjectId}`);
    if (!objectIds.has(path.targetObjectId)) errors.push(`missing_propagation_target:${path.targetObjectId}`);
  });

  if (workspace.scenarios) {
    if (!Array.isArray(workspace.scenarios.scenarios)) {
      errors.push("invalid_scenarios");
    } else {
      const scenarioIds = new Set<string>();
      workspace.scenarios.scenarios.forEach((scenario, index) => {
        const id = String(scenario?.id ?? "").trim();
        if (!id) {
          errors.push(`invalid_scenario_id:${index}`);
          return;
        }
        if (scenarioIds.has(id)) errors.push(`duplicate_scenario_id:${id}`);
        scenarioIds.add(id);
        if (!String(scenario?.name ?? "").trim()) warnings.push(`missing_scenario_name:${id}`);
        if (!scenario.snapshot || !Array.isArray(scenario.snapshot.objects)) {
          warnings.push(`missing_scenario_snapshot:${id}`);
        }
      });
      if (!scenarioIds.has("baseline")) warnings.push("missing_baseline_scenario");
      if (
        workspace.scenarios.activeScenarioId &&
        !scenarioIds.has(workspace.scenarios.activeScenarioId)
      ) {
        errors.push(`missing_active_scenario:${workspace.scenarios.activeScenarioId}`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
