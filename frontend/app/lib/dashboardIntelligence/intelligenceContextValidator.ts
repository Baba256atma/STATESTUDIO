/**
 * INT-1.2 — Intelligence Context validator.
 * Validates workspace, selection consistency, and consumer identity — no calculations.
 */

import { getWorkspaceById } from "../workspace/workspaceRegistryStore.ts";
import type { WorkspaceId } from "../workspace/workspaceRegistryContract.ts";
import { getIntelligenceConsumer } from "./intelligenceConsumerRegistry.ts";
import type {
  BuildIntelligenceContextInput,
  IntelligenceContextValidationIssue,
  IntelligenceContextValidationResult,
  UnifiedIntelligenceContext,
} from "./intelligenceContextContract.ts";
import { INTELLIGENCE_CONTEXT_VERSION } from "./intelligenceContextContract.ts";
import {
  validateExecutiveTimeContext,
  validateExecutiveTimeContextInput,
} from "./executiveTimeContextValidator.ts";

function issue(code: string, message: string): IntelligenceContextValidationIssue {
  return Object.freeze({ code, message });
}

function result(
  issues: readonly IntelligenceContextValidationIssue[]
): IntelligenceContextValidationResult {
  return Object.freeze({
    valid: issues.length === 0,
    issues: Object.freeze(issues),
  });
}

export function validateIntelligenceContextInput(
  input: BuildIntelligenceContextInput
): IntelligenceContextValidationResult {
  const issues: IntelligenceContextValidationIssue[] = [];

  if (!getIntelligenceConsumer(input.consumer)) {
    issues.push(issue("unregistered_consumer", `Consumer "${input.consumer}" is not registered.`));
  }

  const workspace = input.workspace?.trim() || null;
  if (workspace && !getWorkspaceById(workspace)) {
    issues.push(issue("workspace_not_found", `Workspace "${workspace}" does not exist.`));
  }

  const hasSelection =
    Boolean(input.selectedObject?.trim()) ||
    Boolean(input.selectedRelationship?.trim()) ||
    Boolean(input.selectedKpi?.trim()) ||
    Boolean(input.selectedRisk?.trim()) ||
    Boolean(input.selectedScenario?.trim()) ||
    Boolean(input.selectedDataSource?.trim());

  if (hasSelection && !workspace) {
    issues.push(
      issue(
        "selection_without_workspace",
        "Selection fields require a workspace context."
      )
    );
  }

  if (input.selectedRelationship?.trim() && !input.selectedObject?.trim()) {
    issues.push(
      issue(
        "relationship_without_object",
        "Relationship selection should include an object selection path."
      )
    );
  }

  if (input.timelinePosition?.index != null && input.timelinePosition.index < 0) {
    issues.push(issue("invalid_timeline_position", "Timeline position index cannot be negative."));
  }

  if (input.dashboardMode === "timeline" && input.panel && input.panel !== "timeline") {
    issues.push(
      issue(
        "panel_timeline_mismatch",
        "Timeline dashboard mode requires timeline panel."
      )
    );
  }

  if (input.executiveTime) {
    const timeValidation = validateExecutiveTimeContextInput(input.executiveTime);
    if (!timeValidation.valid) {
      issues.push(...timeValidation.issues);
    }
  }

  if (input.panel && input.dashboardMode) {
    const registration = getIntelligenceConsumer(input.consumer);
    if (registration && !registration.allowedPanels.includes(input.panel)) {
      issues.push(
        issue(
          "panel_not_allowed",
          `Panel "${input.panel}" is not allowed for consumer "${input.consumer}".`
        )
      );
    }
    if (registration && !registration.allowedModes.includes(input.dashboardMode)) {
      issues.push(
        issue(
          "mode_not_allowed",
          `Dashboard mode "${input.dashboardMode}" is not allowed for consumer "${input.consumer}".`
        )
      );
    }
  }

  return result(issues);
}

export function validateUnifiedIntelligenceContext(
  context: UnifiedIntelligenceContext
): IntelligenceContextValidationResult {
  const issues: IntelligenceContextValidationIssue[] = [];

  if (context.contractVersion !== INTELLIGENCE_CONTEXT_VERSION) {
    issues.push(
      issue(
        "version_mismatch",
        `Context version "${context.contractVersion}" is incompatible with "${INTELLIGENCE_CONTEXT_VERSION}".`
      )
    );
  }

  if (context.workspace && !getWorkspaceById(context.workspace)) {
    issues.push(issue("workspace_not_found", `Workspace "${context.workspace}" does not exist.`));
  }

  if (!getIntelligenceConsumer(context.consumer)) {
    issues.push(issue("unregistered_consumer", `Consumer "${context.consumer}" is not registered.`));
  }

  if (context.selectedRelationship && !context.workspace) {
    issues.push(issue("relationship_without_workspace", "Relationship selection requires workspace."));
  }

  if (context.timelinePosition.index != null && context.timelinePosition.index < 0) {
    issues.push(issue("invalid_timeline_position", "Timeline position index cannot be negative."));
  }

  if (context.dashboardMode === "timeline" && context.panel !== "timeline") {
    issues.push(issue("panel_timeline_mismatch", "Timeline mode requires timeline panel."));
  }

  const timeValidation = validateExecutiveTimeContext(context.executiveTimeContext);
  if (!timeValidation.valid) {
    issues.push(...timeValidation.issues);
  }

  return result(issues);
}

export function isIntelligenceContextVersionCompatible(
  version: string | null | undefined
): boolean {
  return version === INTELLIGENCE_CONTEXT_VERSION;
}
