import type {
  ExecutiveMinimalismAuditElement,
  ExecutiveMinimalismAuditInput,
  ExecutiveMinimalismAuditReport,
  MinimalismElementClass,
} from "./executiveMinimalismTypes";
import { buildStableAuditInputKey } from "../../audit/auditInputKey";
import { auditedResolve } from "../../audit/auditedResolve";
import { logExecutiveMinimalismAudit, logNoiseRemoved } from "./executiveMinimalismInstrumentation";
import { shouldHideDuplicateInformation } from "./executiveInformationOwnership";

type AuditRegistryEntry = {
  id: string;
  surface: string;
  classification: MinimalismElementClass;
  category?: ExecutiveMinimalismAuditElement["category"];
  visibleWhen?: (input: ExecutiveMinimalismAuditInput) => boolean;
  duplicateOf?: string;
};

const AUDIT_REGISTRY: AuditRegistryEntry[] = [
  { id: "command_bar_frsi", surface: "command_bar", classification: "CRITICAL", category: "frsi_score" },
  { id: "command_bar_scenario", surface: "command_bar", classification: "CRITICAL", category: "scenario_status" },
  { id: "command_bar_decision", surface: "command_bar", classification: "CRITICAL", category: "decision_status" },
  { id: "command_bar_readiness", surface: "command_bar", classification: "IMPORTANT", category: "readiness" },
  { id: "command_bar_mini_insight", surface: "command_bar", classification: "OPTIONAL", category: "pipeline_insight" },
  { id: "command_bar_actions", surface: "command_bar", classification: "OPTIONAL" },
  { id: "status_hud_frsi", surface: "status_hud", classification: "IMPORTANT", category: "frsi_score", duplicateOf: "command_bar_frsi" },
  { id: "status_hud_readiness", surface: "status_hud", classification: "IMPORTANT", category: "readiness", duplicateOf: "command_bar_readiness" },
  { id: "status_hud_scenario_chip", surface: "status_hud", classification: "NOISE", category: "scenario_status", duplicateOf: "command_bar_scenario" },
  { id: "status_hud_headline", surface: "status_hud", classification: "IMPORTANT", category: "pipeline_insight" },
  { id: "scene_info_frsi_breakdown", surface: "scene_info", classification: "IMPORTANT", category: "frsi_breakdown" },
  { id: "scene_info_disabled_actions", surface: "scene_info", classification: "NOISE", duplicateOf: "scene_toolbar_actions" },
  { id: "scene_info_layer_toggles", surface: "scene_info", classification: "OPTIONAL" },
  { id: "object_info_placeholder", surface: "object_info", classification: "IMPORTANT", category: "selected_object" },
  { id: "timeline_controls_text", surface: "timeline_hud", classification: "OPTIONAL" },
  { id: "scene_toolbar_mode_labels", surface: "scene_toolbar", classification: "OPTIONAL" },
];

let lastMinimalismAudit:
  | { inputKey: string; report: ExecutiveMinimalismAuditReport }
  | null = null;

function isVisible(entry: AuditRegistryEntry, input: ExecutiveMinimalismAuditInput): boolean {
  if (entry.surface === "command_bar" && input.commandBarVisible === false) return false;
  if (entry.surface === "status_hud" && input.statusHudVisible === false) return false;
  if (entry.surface === "scene_info" && input.sceneInfoVisible === false) return false;
  if (entry.surface === "object_info" && input.objectInfoVisible === false) return false;
  if (entry.surface === "timeline_hud" && input.timelineVisible === false) return false;
  if (entry.visibleWhen) return entry.visibleWhen(input);
  return true;
}

function toElement(entry: AuditRegistryEntry, reason?: string): ExecutiveMinimalismAuditElement {
  return {
    id: entry.id,
    surface: entry.surface,
    classification: entry.classification,
    category: entry.category,
    reason,
  };
}

/** Classify visible workspace elements and flag redundancy/noise for dev diagnostics. */
export function auditExecutiveMinimalism(input: ExecutiveMinimalismAuditInput = {}): ExecutiveMinimalismAuditReport {
  const auditInput = {
    commandBarVisible: input.commandBarVisible ?? true,
    statusHudVisible: input.statusHudVisible ?? true,
    sceneInfoVisible: input.sceneInfoVisible ?? true,
    objectInfoVisible: input.objectInfoVisible ?? true,
    timelineVisible: input.timelineVisible ?? true,
    quickActionsVisible: input.quickActionsVisible ?? false,
    viewportWidth: input.viewportWidth ?? 1440,
  };
  const inputKey = buildStableAuditInputKey(auditInput);
  if (lastMinimalismAudit?.inputKey === inputKey) {
    return lastMinimalismAudit.report;
  }

  const report = auditedResolve({
    auditName: "MinimalismAudit",
    inputs: auditInput,
    compute: () => buildExecutiveMinimalismReport(auditInput),
    formatLogPayload: (report) => ({
      visibleCount: report.visibleElements.length,
      redundantCount: report.redundantElements.length,
      noiseCount: report.noiseElements.length,
      duplicateCount: report.duplicateElements.length,
      report,
    }),
    log: logExecutiveMinimalismAudit,
  });
  lastMinimalismAudit = { inputKey, report };
  return report;
}

function buildExecutiveMinimalismReport(input: ExecutiveMinimalismAuditInput): ExecutiveMinimalismAuditReport {
  const visibleElements: ExecutiveMinimalismAuditElement[] = [];
  const redundantElements: ExecutiveMinimalismAuditElement[] = [];
  const noiseElements: ExecutiveMinimalismAuditElement[] = [];
  const duplicateElements: ExecutiveMinimalismAuditElement[] = [];

  for (const entry of AUDIT_REGISTRY) {
    if (!isVisible(entry, input)) continue;
    visibleElements.push(toElement(entry));

    if (entry.classification === "NOISE") {
      noiseElements.push(toElement(entry, "classified_noise"));
    }

    if (entry.duplicateOf) {
      duplicateElements.push(toElement(entry, `duplicates_${entry.duplicateOf}`));
    }

    if (entry.category && shouldHideDuplicateInformation(entry.category, {
      surface: entry.surface as Parameters<typeof shouldHideDuplicateInformation>[1]["surface"],
      commandBarVisible: input.commandBarVisible ?? true,
      statusHudVisible: input.statusHudVisible ?? true,
    })) {
      redundantElements.push(toElement(entry, "duplicate_owner"));
    }
  }

  return {
    visibleElements,
    redundantElements,
    noiseElements,
    duplicateElements,
  };
}

export function markNoiseRemoved(elementId: string, surface: string): void {
  logNoiseRemoved({ elementId, surface });
}

export function resetExecutiveMinimalismAuditForTests(): void {
  lastMinimalismAudit = null;
}
