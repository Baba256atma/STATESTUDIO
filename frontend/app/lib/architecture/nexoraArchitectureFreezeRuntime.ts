/**
 * Nexora Architecture Freeze runtime validation and warning layer.
 */

import { NEXORA_ARCHITECTURE_FREEZE_REGISTRY } from "./nexoraArchitectureFreezeRegistry.ts";
import { MAIN_RIGHT_PANEL_TABS, isMainRightPanelTab } from "../ui/mainRightPanelContract.ts";
import { CANONICAL_NEXORA_LEFT_NAV_ITEMS } from "../ui/nexoraLeftNavContract.ts";
import {
  CANONICAL_OBJECT_SELECTION_OWNER,
  isDeprecatedRightRailRuntimeSurface,
} from "./nexoraArchitectureFreezeConstants.ts";
import {
  CANONICAL_DASHBOARD_RUNTIME_OWNER,
  DASHBOARD_RUNTIME_CONTRACT,
} from "../dashboard/dashboardRuntimeContract.ts";
import { listDashboardSurfaceIds } from "../dashboard/dashboardSurfaceRegistry.ts";
import {
  CANONICAL_DASHBOARD_CONTEXT_ROUTER,
  DASHBOARD_CONTEXT_ROUTER_VERSION,
} from "../dashboard/dashboardContextTypes.ts";
import {
  CANONICAL_DASHBOARD_ACCORDION_OWNER,
  DASHBOARD_ACCORDION_CONTRACT_VERSION,
} from "../dashboard/dashboardAccordionPanelContract.ts";
import { listDashboardAccordionPanelTypes } from "../dashboard/dashboardAccordionRegistry.ts";
import { DASHBOARD_PERFORMANCE_BUDGETS } from "../dashboard/dashboardPerformanceBudget.ts";
import {
  CANONICAL_DASHBOARD_VISUAL_OWNER,
  DASHBOARD_VISUAL_SIGNAL_VERSION,
} from "../dashboard/dashboardVisualSignalContract.ts";
import { listDashboardSurfaceVisualPanelTypes } from "../dashboard/dashboardSurfaceVisualRegistry.ts";
import {
  CANONICAL_EXECUTIVE_SUMMARY_OWNER,
  EXECUTIVE_SUMMARY_SURFACE_VERSION,
} from "../dashboard/executiveSummary/executiveSummaryContract.ts";
import { getDashboardSurfaceEntry } from "../dashboard/dashboardSurfaceRegistry.ts";
import {
  CANONICAL_OPERATIONAL_INTELLIGENCE_OWNER,
  OPERATIONAL_INTELLIGENCE_SURFACE_VERSION,
} from "../dashboard/operationalIntelligence/operationalIntelligenceContract.ts";
import {
  CANONICAL_RISK_INTELLIGENCE_OWNER,
  RISK_INTELLIGENCE_SURFACE_VERSION,
} from "../dashboard/riskIntelligence/riskIntelligenceContract.ts";
import {
  CANONICAL_TIMELINE_INTELLIGENCE_OWNER,
  TIMELINE_INTELLIGENCE_SURFACE_VERSION,
} from "../dashboard/timelineIntelligence/timelineIntelligenceContract.ts";
import {
  CANONICAL_SCENARIO_INTELLIGENCE_OWNER,
  SCENARIO_INTELLIGENCE_SURFACE_VERSION,
} from "../dashboard/scenarioIntelligence/scenarioIntelligenceContract.ts";
import {
  CANONICAL_WAR_ROOM_INTELLIGENCE_OWNER,
  WAR_ROOM_INTELLIGENCE_SURFACE_VERSION,
} from "../dashboard/warRoomIntelligence/warRoomIntelligenceContract.ts";
import {
  CANONICAL_EXECUTIVE_ADVISORY_OWNER,
  EXECUTIVE_ADVISORY_SURFACE_VERSION,
} from "../dashboard/executiveAdvisory/executiveAdvisoryContract.ts";
import {
  CANONICAL_ADVISORY_AGGREGATION_OWNER,
  ADVISORY_CONTEXT_AGGREGATION_VERSION,
} from "../dashboard/executiveAdvisory/aggregation/advisoryContextContract.ts";
import {
  CANONICAL_ADVISORY_CONFIDENCE_OWNER,
  ADVISORY_CONFIDENCE_FRAMEWORK_VERSION,
} from "../dashboard/executiveAdvisory/confidence/advisoryConfidenceContract.ts";
import {
  CANONICAL_ADVISORY_EXPLAINABILITY_OWNER,
  ADVISORY_EXPLAINABILITY_LAYER_VERSION,
} from "../dashboard/executiveAdvisory/explainability/advisoryExplainabilityContract.ts";
import {
  CANONICAL_DECISION_GUIDANCE_OWNER,
  DECISION_GUIDANCE_SURFACE_VERSION,
} from "../dashboard/decisionGuidance/decisionGuidanceContract.ts";
import {
  CANONICAL_ADVISORY_WAR_ROOM_INTEGRATION_OWNER,
  ADVISORY_WAR_ROOM_INTEGRATION_VERSION,
} from "../dashboard/advisoryWarRoomIntegration/advisoryWarRoomIntegrationContract.ts";
import {
  CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER,
  GOVERNANCE_INTELLIGENCE_SURFACE_VERSION,
} from "../dashboard/governanceIntelligence/governanceIntelligenceContract.ts";
import {
  CANONICAL_STRATEGIC_ALIGNMENT_OWNER,
  STRATEGIC_ALIGNMENT_SURFACE_VERSION,
} from "../dashboard/strategicAlignment/strategicAlignmentContract.ts";
import {
  CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER,
  POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_VERSION,
} from "../dashboard/policyConstraintIntelligence/policyConstraintIntelligenceContract.ts";
import {
  CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER,
  STAKEHOLDER_INTELLIGENCE_SURFACE_VERSION,
} from "../dashboard/stakeholderIntelligence/stakeholderIntelligenceContract.ts";
import {
  CANONICAL_CONSENSUS_INTELLIGENCE_OWNER,
  CONSENSUS_INTELLIGENCE_SURFACE_VERSION,
} from "../dashboard/consensusIntelligence/consensusIntelligenceContract.ts";
import {
  CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER,
  INSTITUTIONAL_ALIGNMENT_SURFACE_VERSION,
} from "../dashboard/institutionalAlignment/institutionalAlignmentContract.ts";
import type { RightPanelView } from "../ui/right-panel/rightPanelTypes.ts";

export type ArchitectureFreezeValidationResult = Readonly<{
  ok: boolean;
  contractCount: number;
  checks: readonly Readonly<{
    id: string;
    passed: boolean;
    detail?: string;
  }>[];
  coverage: typeof NEXORA_ARCHITECTURE_FREEZE_REGISTRY.coverageMatrix;
}>;

const warnedViolationKeys = new Set<string>();
let freezeInitialized = false;
let lastValidationResult: ArchitectureFreezeValidationResult | null = null;

function shouldEmit(label: string, key: string): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const dedupeKey = `${label}:${key}`;
  if (warnedViolationKeys.has(dedupeKey)) return false;
  warnedViolationKeys.add(dedupeKey);
  return true;
}

export function reportFrozenContract(contractId: string, detail: Record<string, unknown> = {}): void {
  const contract = NEXORA_ARCHITECTURE_FREEZE_REGISTRY.contracts.find((entry) => entry.id === contractId);
  if (!contract) return;
  const key = `${contractId}:${JSON.stringify(detail)}`;
  if (!shouldEmit("[Nexora][FrozenContract]", key)) return;
  globalThis.console?.info?.("[Nexora][FrozenContract]", {
    contractId,
    domain: contract.domain,
    owner: contract.owner,
    ...detail,
  });
}

export function reportDeprecatedSurface(input: {
  surface: unknown;
  contractId?: string;
  redirectedTo?: string | null;
  source?: string | null;
  detail?: Record<string, unknown>;
}): void {
  const surfaceKey = String(input.surface ?? "unknown");
  const key = `${surfaceKey}:${input.contractId ?? "unknown"}:${input.source ?? "unknown"}`;
  if (!shouldEmit("[Nexora][DeprecatedSurface]", key)) return;
  globalThis.console?.warn?.("[Nexora][DeprecatedSurface]", {
    surface: surfaceKey,
    contractId: input.contractId ?? "mrp.dashboard_assistant_only",
    redirectedTo: input.redirectedTo ?? "dashboard",
    source: input.source ?? null,
    action: "preserve_runtime_stability",
    ...(input.detail ?? {}),
  });
}

export function reportArchitectureViolation(input: {
  contractId: string;
  reason: string;
  source?: string | null;
  detail?: Record<string, unknown>;
}): void {
  const contract = NEXORA_ARCHITECTURE_FREEZE_REGISTRY.contracts.find((entry) => entry.id === input.contractId);
  const key = `${input.contractId}:${input.reason}:${input.source ?? "unknown"}`;
  if (!shouldEmit("[Nexora][ArchitectureViolation]", key)) return;
  globalThis.console?.warn?.("[Nexora][ArchitectureViolation]", {
    contractId: input.contractId,
    domain: contract?.domain ?? "unknown",
    reason: input.reason,
    source: input.source ?? null,
    action: "preserve_runtime_stability",
    ...(input.detail ?? {}),
  });
}

export function validateRightPanelActivation(view: unknown, source?: string): boolean {
  if (view == null || view === "") return true;
  if (isMainRightPanelTab(view)) return true;
  if (isDeprecatedRightRailRuntimeSurface(view)) {
    reportDeprecatedSurface({
      surface: view,
      contractId: "mrp.dashboard_assistant_only",
      redirectedTo: "dashboard",
      source: source ?? "validateRightPanelActivation",
    });
    return false;
  }
  return true;
}

export function validateSelectionOwnershipWrite(input: {
  writer: string;
  objectId?: string | null;
  source?: string | null;
}): boolean {
  const writer = input.writer.trim();
  const isCanonical =
    writer === CANONICAL_OBJECT_SELECTION_OWNER ||
    writer.startsWith("commitObjectSelection") ||
    writer.startsWith("HomeScreen.commitObjectSelection");
  if (isCanonical) {
    reportFrozenContract("selection.single_owner", {
      writer,
      objectId: input.objectId ?? null,
      source: input.source ?? null,
      status: "canonical_write",
    });
    return true;
  }
  reportArchitectureViolation({
    contractId: "selection.single_owner",
    reason: "non_canonical_selection_writer",
    source: input.source ?? writer,
    detail: {
      writer,
      objectId: input.objectId ?? null,
      canonicalOwner: CANONICAL_OBJECT_SELECTION_OWNER,
    },
  });
  return false;
}

export function validateNavigationHydrationContract(input: {
  matched: boolean;
  seedSignature: string;
  runtimeSignature: string;
  source?: string;
}): boolean {
  if (input.matched) {
    reportFrozenContract("navigation.canonical_hydration", {
      source: input.source ?? "validateNavigationHydrationContract",
      seedSignature: input.seedSignature,
      runtimeSignature: input.runtimeSignature,
      status: "aligned",
    });
    return true;
  }
  reportArchitectureViolation({
    contractId: "navigation.canonical_hydration",
    reason: "hydration_navigation_drift",
    source: input.source ?? "validateNavigationHydrationContract",
    detail: {
      seedSignature: input.seedSignature,
      runtimeSignature: input.runtimeSignature,
      action: "preserved_seed_state",
    },
  });
  return false;
}

export function validateDuplicateOwnership(input: {
  domain: string;
  canonicalOwner: string;
  competingOwners: readonly string[];
  source?: string;
}): boolean {
  const competing = input.competingOwners
    .map((owner) => owner.trim())
    .filter((owner) => owner.length > 0 && owner !== input.canonicalOwner);
  if (competing.length === 0) return true;
  reportArchitectureViolation({
    contractId:
      input.domain === "selection"
        ? "selection.single_owner"
        : input.domain === "navigation"
          ? "navigation.canonical_hydration"
          : input.domain === "scene_runtime"
            ? "scene.scene_native_interactions"
            : "routing.dashboard_context_only",
    reason: "duplicate_ownership_detected",
    source: input.source ?? "validateDuplicateOwnership",
    detail: {
      canonicalOwner: input.canonicalOwner,
      competingOwners: competing,
    },
  });
  return false;
}

export function runArchitectureFreezeValidationPass(options?: {
  force?: boolean;
}): ArchitectureFreezeValidationResult {
  if (lastValidationResult && !options?.force) {
    return lastValidationResult;
  }

  const checks: ArchitectureFreezeValidationResult["checks"][number][] = [];

  const mrpAllowedOk =
    MAIN_RIGHT_PANEL_TABS.length === 2 &&
    MAIN_RIGHT_PANEL_TABS.includes("dashboard") &&
    MAIN_RIGHT_PANEL_TABS.includes("assistant");
  checks.push({
    id: "mrp.allowed_tabs",
    passed: mrpAllowedOk,
    detail: mrpAllowedOk ? undefined : "Main Right Panel must expose dashboard and assistant only.",
  });

  const legacySamples: RightPanelView[] = ["workspace", "object", "risk", "fragility"];
  const legacyDetectionOk = legacySamples.every((view) => isDeprecatedRightRailRuntimeSurface(view));
  checks.push({
    id: "mrp.legacy_surface_detection",
    passed: legacyDetectionOk,
    detail: legacyDetectionOk ? undefined : "Legacy right-rail surfaces must be detectable.",
  });

  const selectionOwnerOk =
    NEXORA_ARCHITECTURE_FREEZE_REGISTRY.selectionAuthority === CANONICAL_OBJECT_SELECTION_OWNER;
  checks.push({
    id: "selection.single_owner",
    passed: selectionOwnerOk,
    detail: selectionOwnerOk ? undefined : "Selection authority constants are out of sync.",
  });

  const leftNavOk =
    NEXORA_ARCHITECTURE_FREEZE_REGISTRY.leftNavModeCount === 7 &&
    CANONICAL_NEXORA_LEFT_NAV_ITEMS.length === 7;
  checks.push({
    id: "navigation.canonical_modes",
    passed: leftNavOk,
    detail: leftNavOk ? undefined : "Left navigation must expose exactly seven canonical modes.",
  });

  const registryOk = NEXORA_ARCHITECTURE_FREEZE_REGISTRY.contracts.length >= 22;
  checks.push({
    id: "registry.contracts_loaded",
    passed: registryOk,
    detail: registryOk ? undefined : "Architecture freeze registry is incomplete.",
  });

  const dashboardRuntimeOk =
    DASHBOARD_RUNTIME_CONTRACT.owner === CANONICAL_DASHBOARD_RUNTIME_OWNER &&
    listDashboardSurfaceIds().length >= 7;
  checks.push({
    id: "dashboard.runtime_foundation",
    passed: dashboardRuntimeOk,
    detail: dashboardRuntimeOk ? undefined : "Dashboard runtime contract or surface registry is incomplete.",
  });

  const dashboardRoutingOk =
    CANONICAL_DASHBOARD_CONTEXT_ROUTER === "dashboardContextRouter" &&
    DASHBOARD_CONTEXT_ROUTER_VERSION.startsWith("3.2");
  checks.push({
    id: "dashboard.context_routing",
    passed: dashboardRoutingOk,
    detail: dashboardRoutingOk ? undefined : "Dashboard context router contract is incomplete.",
  });

  const dashboardAccordionOk =
    CANONICAL_DASHBOARD_ACCORDION_OWNER === "dashboardAccordionRuntime" &&
    DASHBOARD_ACCORDION_CONTRACT_VERSION.startsWith("3.") &&
    listDashboardAccordionPanelTypes().length >= 7;
  checks.push({
    id: "dashboard.accordion_system",
    passed: dashboardAccordionOk,
    detail: dashboardAccordionOk ? undefined : "Dashboard accordion runtime or registry is incomplete.",
  });

  const dashboardPerformanceOk =
    DASHBOARD_PERFORMANCE_BUDGETS.dashboardTraceMs === 50 &&
    DASHBOARD_PERFORMANCE_BUDGETS.contextRoutingMs === 10;
  checks.push({
    id: "dashboard.performance_optimization",
    passed: dashboardPerformanceOk,
    detail: dashboardPerformanceOk ? undefined : "Dashboard performance budgets are incomplete.",
  });

  const dashboardVisualOk =
    CANONICAL_DASHBOARD_VISUAL_OWNER === "dashboardVisualSignalFramework" &&
    DASHBOARD_VISUAL_SIGNAL_VERSION.startsWith("3.5") &&
    listDashboardSurfaceVisualPanelTypes().length >= 7;
  checks.push({
    id: "dashboard.visual_intelligence",
    passed: dashboardVisualOk,
    detail: dashboardVisualOk ? undefined : "Dashboard visual signal framework is incomplete.",
  });

  const executiveSummarySurfaceOk =
    CANONICAL_EXECUTIVE_SUMMARY_OWNER === "executiveSummaryRuntime" &&
    EXECUTIVE_SUMMARY_SURFACE_VERSION.startsWith("4.1") &&
    getDashboardSurfaceEntry("executive_summary").status === "active";
  checks.push({
    id: "dashboard.executive_summary_surface",
    passed: executiveSummarySurfaceOk,
    detail: executiveSummarySurfaceOk ? undefined : "Executive Summary Surface registration is incomplete.",
  });

  const operationalIntelligenceSurfaceOk =
    CANONICAL_OPERATIONAL_INTELLIGENCE_OWNER === "operationalIntelligenceRuntime" &&
    OPERATIONAL_INTELLIGENCE_SURFACE_VERSION.startsWith("4.2") &&
    getDashboardSurfaceEntry("operational").status === "active";
  checks.push({
    id: "dashboard.operational_intelligence_surface",
    passed: operationalIntelligenceSurfaceOk,
    detail: operationalIntelligenceSurfaceOk
      ? undefined
      : "Operational Intelligence Surface registration is incomplete.",
  });

  const riskIntelligenceSurfaceOk =
    CANONICAL_RISK_INTELLIGENCE_OWNER === "riskIntelligenceRuntime" &&
    RISK_INTELLIGENCE_SURFACE_VERSION.startsWith("4.3") &&
    getDashboardSurfaceEntry("risk").status === "active";
  checks.push({
    id: "dashboard.risk_intelligence_surface",
    passed: riskIntelligenceSurfaceOk,
    detail: riskIntelligenceSurfaceOk
      ? undefined
      : "Risk Intelligence Surface registration is incomplete.",
  });

  const timelineIntelligenceSurfaceOk =
    CANONICAL_TIMELINE_INTELLIGENCE_OWNER === "timelineIntelligenceRuntime" &&
    TIMELINE_INTELLIGENCE_SURFACE_VERSION.startsWith("4.4") &&
    getDashboardSurfaceEntry("timeline").status === "active";
  checks.push({
    id: "dashboard.timeline_intelligence_surface",
    passed: timelineIntelligenceSurfaceOk,
    detail: timelineIntelligenceSurfaceOk
      ? undefined
      : "Timeline Intelligence Surface registration is incomplete.",
  });

  const scenarioIntelligenceSurfaceOk =
    CANONICAL_SCENARIO_INTELLIGENCE_OWNER === "scenarioIntelligenceRuntime" &&
    SCENARIO_INTELLIGENCE_SURFACE_VERSION.startsWith("4.5") &&
    getDashboardSurfaceEntry("scenario").status === "active";
  checks.push({
    id: "dashboard.scenario_intelligence_surface",
    passed: scenarioIntelligenceSurfaceOk,
    detail: scenarioIntelligenceSurfaceOk
      ? undefined
      : "Scenario Intelligence Surface registration is incomplete.",
  });

  const warRoomIntelligenceSurfaceOk =
    CANONICAL_WAR_ROOM_INTELLIGENCE_OWNER === "warRoomIntelligenceRuntime" &&
    WAR_ROOM_INTELLIGENCE_SURFACE_VERSION.startsWith("4.6") &&
    getDashboardSurfaceEntry("war_room").status === "active";
  checks.push({
    id: "dashboard.war_room_intelligence_surface",
    passed: warRoomIntelligenceSurfaceOk,
    detail: warRoomIntelligenceSurfaceOk
      ? undefined
      : "War Room Intelligence Surface registration is incomplete.",
  });

  const executiveAdvisorySurfaceOk =
    CANONICAL_EXECUTIVE_ADVISORY_OWNER === "executiveAdvisoryRuntime" &&
    EXECUTIVE_ADVISORY_SURFACE_VERSION.startsWith("5.") &&
    getDashboardSurfaceEntry("decision").status === "active";
  checks.push({
    id: "dashboard.executive_advisory_surface",
    passed: executiveAdvisorySurfaceOk,
    detail: executiveAdvisorySurfaceOk
      ? undefined
      : "Executive Advisory Surface registration is incomplete.",
  });

  const advisoryContextAggregationOk =
    CANONICAL_ADVISORY_AGGREGATION_OWNER === "advisoryAggregationRuntime" &&
    ADVISORY_CONTEXT_AGGREGATION_VERSION.startsWith("5.2");
  checks.push({
    id: "dashboard.advisory_context_aggregation",
    passed: advisoryContextAggregationOk,
    detail: advisoryContextAggregationOk
      ? undefined
      : "Advisory Context Aggregation registration is incomplete.",
  });

  const advisoryConfidenceFrameworkOk =
    CANONICAL_ADVISORY_CONFIDENCE_OWNER === "advisoryConfidenceRuntime" &&
    ADVISORY_CONFIDENCE_FRAMEWORK_VERSION.startsWith("5.3");
  checks.push({
    id: "dashboard.advisory_confidence_framework",
    passed: advisoryConfidenceFrameworkOk,
    detail: advisoryConfidenceFrameworkOk
      ? undefined
      : "Advisory Confidence Framework registration is incomplete.",
  });

  const advisoryExplainabilityLayerOk =
    CANONICAL_ADVISORY_EXPLAINABILITY_OWNER === "advisoryExplainabilityRuntime" &&
    ADVISORY_EXPLAINABILITY_LAYER_VERSION.startsWith("5.4");
  checks.push({
    id: "dashboard.advisory_explainability_layer",
    passed: advisoryExplainabilityLayerOk,
    detail: advisoryExplainabilityLayerOk
      ? undefined
      : "Advisory Explainability Layer registration is incomplete.",
  });

  const decisionGuidanceSurfaceOk =
    CANONICAL_DECISION_GUIDANCE_OWNER === "decisionGuidanceRuntime" &&
    DECISION_GUIDANCE_SURFACE_VERSION.startsWith("5.5") &&
    getDashboardSurfaceEntry("decision_guidance").status === "active";
  checks.push({
    id: "dashboard.decision_guidance_surface",
    passed: decisionGuidanceSurfaceOk,
    detail: decisionGuidanceSurfaceOk
      ? undefined
      : "Decision Guidance Surface registration is incomplete.",
  });

  const advisoryWarRoomIntegrationOk =
    CANONICAL_ADVISORY_WAR_ROOM_INTEGRATION_OWNER === "advisoryWarRoomIntegrationRuntime" &&
    ADVISORY_WAR_ROOM_INTEGRATION_VERSION.startsWith("5.6");
  checks.push({
    id: "dashboard.advisory_war_room_integration",
    passed: advisoryWarRoomIntegrationOk,
    detail: advisoryWarRoomIntegrationOk
      ? undefined
      : "Advisory–War Room Integration registration is incomplete.",
  });

  const governanceIntelligenceSurfaceOk =
    CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER === "governanceIntelligenceRuntime" &&
    GOVERNANCE_INTELLIGENCE_SURFACE_VERSION.startsWith("6.1") &&
    getDashboardSurfaceEntry("governance").status === "active";
  checks.push({
    id: "dashboard.governance_intelligence_surface",
    passed: governanceIntelligenceSurfaceOk,
    detail: governanceIntelligenceSurfaceOk
      ? undefined
      : "Governance Intelligence Surface registration is incomplete.",
  });

  const strategicAlignmentSurfaceOk =
    CANONICAL_STRATEGIC_ALIGNMENT_OWNER === "strategicAlignmentRuntime" &&
    STRATEGIC_ALIGNMENT_SURFACE_VERSION.startsWith("6.2") &&
    getDashboardSurfaceEntry("strategic_alignment").status === "active";
  checks.push({
    id: "dashboard.strategic_alignment_surface",
    passed: strategicAlignmentSurfaceOk,
    detail: strategicAlignmentSurfaceOk
      ? undefined
      : "Strategic Alignment Surface registration is incomplete.",
  });

  const policyConstraintIntelligenceSurfaceOk =
    CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER === "policyConstraintIntelligenceRuntime" &&
    POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_VERSION.startsWith("6.3") &&
    getDashboardSurfaceEntry("policy_constraint").status === "active";
  checks.push({
    id: "dashboard.policy_constraint_intelligence_surface",
    passed: policyConstraintIntelligenceSurfaceOk,
    detail: policyConstraintIntelligenceSurfaceOk
      ? undefined
      : "Policy & Constraint Intelligence Surface registration is incomplete.",
  });

  const stakeholderIntelligenceSurfaceOk =
    CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER === "stakeholderIntelligenceRuntime" &&
    STAKEHOLDER_INTELLIGENCE_SURFACE_VERSION.startsWith("6.4") &&
    getDashboardSurfaceEntry("stakeholder_intelligence").status === "active";
  checks.push({
    id: "dashboard.stakeholder_intelligence_surface",
    passed: stakeholderIntelligenceSurfaceOk,
    detail: stakeholderIntelligenceSurfaceOk
      ? undefined
      : "Stakeholder Intelligence Surface registration is incomplete.",
  });

  const consensusIntelligenceSurfaceOk =
    CANONICAL_CONSENSUS_INTELLIGENCE_OWNER === "consensusIntelligenceRuntime" &&
    CONSENSUS_INTELLIGENCE_SURFACE_VERSION.startsWith("6.5") &&
    getDashboardSurfaceEntry("consensus_intelligence").status === "active";
  checks.push({
    id: "dashboard.consensus_intelligence_surface",
    passed: consensusIntelligenceSurfaceOk,
    detail: consensusIntelligenceSurfaceOk
      ? undefined
      : "Consensus Intelligence Surface registration is incomplete.",
  });

  const institutionalAlignmentSurfaceOk =
    CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER === "institutionalAlignmentRuntime" &&
    INSTITUTIONAL_ALIGNMENT_SURFACE_VERSION.startsWith("6.6") &&
    getDashboardSurfaceEntry("institutional_alignment").status === "active";
  checks.push({
    id: "dashboard.institutional_alignment_surface",
    passed: institutionalAlignmentSurfaceOk,
    detail: institutionalAlignmentSurfaceOk
      ? undefined
      : "Institutional Alignment Surface registration is incomplete.",
  });

  const result: ArchitectureFreezeValidationResult = Object.freeze({
    ok: checks.every((check) => check.passed),
    contractCount: NEXORA_ARCHITECTURE_FREEZE_REGISTRY.contracts.length,
    checks: Object.freeze(checks),
    coverage: NEXORA_ARCHITECTURE_FREEZE_REGISTRY.coverageMatrix,
  });

  lastValidationResult = result;
  return result;
}

export function initializeNexoraArchitectureFreeze(): ArchitectureFreezeValidationResult {
  if (freezeInitialized && lastValidationResult) {
    return lastValidationResult;
  }

  const validation = runArchitectureFreezeValidationPass({ force: true });
  freezeInitialized = true;

  for (const contract of NEXORA_ARCHITECTURE_FREEZE_REGISTRY.contracts) {
    reportFrozenContract(contract.id, { status: "registry_loaded" });
  }

  if (process.env.NODE_ENV !== "production") {
    globalThis.console?.info?.("[Nexora][ArchitectureFreeze]", {
      loaded: true,
      registryVersion: NEXORA_ARCHITECTURE_FREEZE_REGISTRY.version,
      phase: NEXORA_ARCHITECTURE_FREEZE_REGISTRY.phase,
      contractCount: validation.contractCount,
      validationActive: true,
      validationPass: validation.ok,
      coverage: validation.coverage,
      checks: validation.checks,
    });
  }

  if (typeof globalThis.window !== "undefined") {
    (
      globalThis.window as Window & {
        __NEXORA_ARCHITECTURE_FREEZE__?: () => ArchitectureFreezeValidationResult;
      }
    ).__NEXORA_ARCHITECTURE_FREEZE__ = () => runArchitectureFreezeValidationPass({ force: true });
  }

  return validation;
}

export function isArchitectureFreezeInitialized(): boolean {
  return freezeInitialized;
}

export function resetArchitectureFreezeRuntimeForTests(): void {
  freezeInitialized = false;
  lastValidationResult = null;
  warnedViolationKeys.clear();
}
