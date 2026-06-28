/**
 * PHASE-2 / DS1:5 — Manage Wizard Integration diagnostics.
 * Wizard lifecycle events only — no UI or runtime logic.
 */

import {
  MANAGE_WIZARD_INTEGRATION_SOURCE,
  NEXORA_MANAGE_WIZARD_LOG_PREFIX,
} from "./manageWizardIntegrationContract.ts";
import type {
  ManageWizardDiagnosticEntry,
  ManageWizardEvent,
  ManageWizardEventType,
  ManageWizardWorkspaceId,
} from "./manageWizardIntegrationTypes.ts";

const eventLog: ManageWizardEvent[] = [];
const diagnosticLog: ManageWizardDiagnosticEntry[] = [];

function nowIso(): string {
  return new Date().toISOString();
}

export function recordManageWizardEvent(input: {
  type: ManageWizardEventType;
  wizardSessionId?: string | null;
  workspaceId?: ManageWizardWorkspaceId | null;
}): ManageWizardEvent {
  const event = Object.freeze({
    type: input.type,
    wizardSessionId: input.wizardSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    timestamp: nowIso(),
  });
  eventLog.push(event);
  return event;
}

export function recordManageWizardDiagnostic(input: {
  type: ManageWizardEventType;
  wizardSessionId?: string | null;
  workspaceId?: ManageWizardWorkspaceId | null;
  message: string;
}): ManageWizardDiagnosticEntry {
  const entry = Object.freeze({
    wizardSessionId: input.wizardSessionId?.trim() || null,
    workspaceId: input.workspaceId?.trim() || null,
    event: input.type,
    message: input.message.trim(),
    generatedAt: nowIso(),
  });
  diagnosticLog.push(entry);
  if (process.env.NODE_ENV !== "production") {
    console.debug(NEXORA_MANAGE_WIZARD_LOG_PREFIX, {
      source: MANAGE_WIZARD_INTEGRATION_SOURCE,
      ...entry,
    });
  }
  return entry;
}

export function getManageWizardEvents(): readonly ManageWizardEvent[] {
  return Object.freeze([...eventLog]);
}

export function getManageWizardDiagnosticsLog(): readonly ManageWizardDiagnosticEntry[] {
  return Object.freeze([...diagnosticLog]);
}

export function resetManageWizardDiagnosticsForTests(): void {
  eventLog.length = 0;
  diagnosticLog.length = 0;
}

export const ManageWizardIntegrationDiagnostics = Object.freeze({
  recordManageWizardEvent,
  recordManageWizardDiagnostic,
  getManageWizardEvents,
  getManageWizardDiagnosticsLog,
  resetManageWizardDiagnosticsForTests,
});
