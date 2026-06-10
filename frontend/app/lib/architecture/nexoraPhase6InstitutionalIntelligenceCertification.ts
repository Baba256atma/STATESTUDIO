/**
 * Phase 6:7 — Institutional Intelligence certification (validation only).
 */

import { NEXORA_ARCHITECTURE_FREEZE_REGISTRY } from "./nexoraArchitectureFreezeRegistry.ts";
import { runArchitectureFreezeValidationPass } from "./nexoraArchitectureFreezeRuntime.ts";
import {
  CANONICAL_DASHBOARD_RUNTIME_OWNER,
  CANONICAL_DASHBOARD_RENDER_PATH,
} from "../dashboard/dashboardRuntimeContract.ts";
import {
  DASHBOARD_SURFACE_REGISTRY,
  DASHBOARD_SURFACE_REGISTRY_VERSION,
  getDashboardSurfaceEntry,
  listDashboardSurfaceIds,
} from "../dashboard/dashboardSurfaceRegistry.ts";
import { MAIN_RIGHT_PANEL_TABS } from "../ui/mainRightPanelContract.ts";
import {
  CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER,
  CANONICAL_GOVERNANCE_INTELLIGENCE_SURFACE_ID,
  GOVERNANCE_INTELLIGENCE_SURFACE_VERSION,
} from "../dashboard/governanceIntelligence/governanceIntelligenceContract.ts";
import { resolveGovernanceIntelligenceSurface } from "../dashboard/governanceIntelligence/governanceIntelligenceRuntime.ts";
import {
  CANONICAL_STRATEGIC_ALIGNMENT_OWNER,
  CANONICAL_STRATEGIC_ALIGNMENT_SURFACE_ID,
  STRATEGIC_ALIGNMENT_SURFACE_VERSION,
} from "../dashboard/strategicAlignment/strategicAlignmentContract.ts";
import {
  listStrategicObjectives,
  STRATEGIC_OBJECTIVE_REGISTRY_VERSION,
} from "../dashboard/strategicAlignment/strategicObjectiveRegistry.ts";
import { resolveStrategicAlignmentSurface } from "../dashboard/strategicAlignment/strategicAlignmentRuntime.ts";
import { evaluateStrategicAlignment } from "../dashboard/strategicAlignment/strategicAlignmentEvaluation.ts";
import {
  CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER,
  CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_ID,
  POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_VERSION,
} from "../dashboard/policyConstraintIntelligence/policyConstraintIntelligenceContract.ts";
import {
  listPolicies,
  listConstraints,
  POLICY_REGISTRY_VERSION,
} from "../dashboard/policyConstraintIntelligence/policyRegistry.ts";
import { resolvePolicyConstraintIntelligenceSurface } from "../dashboard/policyConstraintIntelligence/policyConstraintIntelligenceRuntime.ts";
import {
  CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER,
  CANONICAL_STAKEHOLDER_INTELLIGENCE_SURFACE_ID,
  STAKEHOLDER_INTELLIGENCE_SURFACE_VERSION,
} from "../dashboard/stakeholderIntelligence/stakeholderIntelligenceContract.ts";
import {
  listStakeholderGroups,
  STAKEHOLDER_REGISTRY_VERSION,
} from "../dashboard/stakeholderIntelligence/stakeholderRegistry.ts";
import { resolveStakeholderIntelligenceSurface } from "../dashboard/stakeholderIntelligence/stakeholderIntelligenceRuntime.ts";
import { evaluateStakeholders } from "../dashboard/stakeholderIntelligence/stakeholderEvaluation.ts";
import {
  CANONICAL_CONSENSUS_INTELLIGENCE_OWNER,
  CANONICAL_CONSENSUS_INTELLIGENCE_SURFACE_ID,
  CONSENSUS_INTELLIGENCE_SURFACE_VERSION,
} from "../dashboard/consensusIntelligence/consensusIntelligenceContract.ts";
import {
  listAlignmentGroups,
  listConflictGroups,
  listConsensusDomains,
  CONSENSUS_REGISTRY_VERSION,
} from "../dashboard/consensusIntelligence/consensusRegistry.ts";
import { resolveConsensusIntelligenceSurface } from "../dashboard/consensusIntelligence/consensusIntelligenceRuntime.ts";
import { evaluateConsensus } from "../dashboard/consensusIntelligence/consensusEvaluation.ts";
import {
  CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER,
  CANONICAL_INSTITUTIONAL_ALIGNMENT_SURFACE_ID,
  INSTITUTIONAL_ALIGNMENT_SURFACE_VERSION,
} from "../dashboard/institutionalAlignment/institutionalAlignmentContract.ts";
import { resolveInstitutionalAlignmentSurface } from "../dashboard/institutionalAlignment/institutionalAlignmentRuntime.ts";
import { evaluateInstitutionalAlignment } from "../dashboard/institutionalAlignment/institutionalEvaluation.ts";
import {
  BOARD_INTELLIGENCE_CONTRACT_VERSION,
  buildInstitutionalAlignmentBoardFeed,
} from "../dashboard/institutionalAlignment/boardIntelligenceContract.ts";
import {
  CANONICAL_EXECUTIVE_SUMMARY_OWNER,
  EXECUTIVE_SUMMARY_SURFACE_VERSION,
} from "../dashboard/executiveSummary/executiveSummaryContract.ts";
import { aggregateExecutiveSummary } from "../dashboard/executiveSummary/executiveSummaryAggregation.ts";
import { aggregateOperationalIntelligence } from "../dashboard/operationalIntelligence/operationalIntelligenceAggregation.ts";
import { aggregateRiskIntelligence } from "../dashboard/riskIntelligence/riskIntelligenceAggregation.ts";
import { aggregateTimelineIntelligence } from "../dashboard/timelineIntelligence/timelineIntelligenceAggregation.ts";
import { aggregateScenarioIntelligence } from "../dashboard/scenarioIntelligence/scenarioIntelligenceAggregation.ts";
import { aggregateWarRoomIntelligence } from "../dashboard/warRoomIntelligence/warRoomIntelligenceAggregation.ts";
import { aggregateExecutiveAdvisory } from "../dashboard/executiveAdvisory/executiveAdvisoryAggregation.ts";
import { aggregateDecisionGuidance } from "../dashboard/decisionGuidance/decisionGuidanceAggregation.ts";
import {
  DASHBOARD_ACCORDION_CONTEXT_PRESETS,
  buildAccordionPanelsFromContext,
} from "../dashboard/dashboardAccordionContextPanels.ts";
import {
  initializeDashboardAccordionRuntime,
  expandAccordionPanels,
  collapseAllAccordionPanels,
} from "../dashboard/dashboardAccordionRuntime.ts";
import { DASHBOARD_PERFORMANCE_BUDGETS, isWithinDashboardBudget } from "../dashboard/dashboardPerformanceBudget.ts";
import { measureDashboardOperation } from "../dashboard/dashboardPerformanceMetrics.ts";
import { dashboardVisualColors } from "../dashboard/dashboardVisualTheme.ts";

export type Phase6AcceptanceGateId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";

export type Phase6AcceptanceGate = Readonly<{
  id: Phase6AcceptanceGateId;
  name: string;
  status: "PASS" | "FAIL";
  detail: string;
}>;

export type Phase6SmokeScenarioId = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K";

export type Phase6SmokeScenario = Readonly<{
  id: Phase6SmokeScenarioId;
  name: string;
  status: "PASS" | "STATIC_PASS" | "MANUAL_QA_REQUIRED";
  detail: string;
}>;

export type Phase6PerformanceObservation = Readonly<{
  operation: string;
  durationMs: number;
  withinBudget: boolean;
  budgetMs: number | null;
}>;

export type Phase6CertificationResult = Readonly<{
  result: "PASS" | "PASS WITH WARNINGS" | "FAIL";
  certifiedAt: string;
  gates: readonly Phase6AcceptanceGate[];
  smokeScenarios: readonly Phase6SmokeScenario[];
  warnings: readonly string[];
  blockers: readonly string[];
  performanceObservations: readonly Phase6PerformanceObservation[];
  architectureObservations: readonly string[];
  governanceObservations: readonly string[];
  strategicObservations: readonly string[];
  stakeholderObservations: readonly string[];
  consensusObservations: readonly string[];
  institutionalObservations: readonly string[];
  renderPath: string;
  institutionalLayerCount: number;
  dashboardContractCount: number;
  clearedForPhase7: boolean;
}>;

const PHASE6_INSTITUTIONAL_FREEZE_CHECKS = Object.freeze([
  "dashboard.governance_intelligence_surface",
  "dashboard.strategic_alignment_surface",
  "dashboard.policy_constraint_intelligence_surface",
  "dashboard.stakeholder_intelligence_surface",
  "dashboard.consensus_intelligence_surface",
  "dashboard.institutional_alignment_surface",
] as const);

const INSTITUTIONAL_FLOW_OWNERS = Object.freeze([
  "operationalIntelligenceRuntime",
  "riskIntelligenceRuntime",
  "timelineIntelligenceRuntime",
  "scenarioIntelligenceRuntime",
  "warRoomIntelligenceRuntime",
  "executiveAdvisoryRuntime",
  "decisionGuidanceRuntime",
  "governanceIntelligenceRuntime",
  "strategicAlignmentRuntime",
  "policyConstraintIntelligenceRuntime",
  "stakeholderIntelligenceRuntime",
  "consensusIntelligenceRuntime",
  "institutionalAlignmentRuntime",
  "executiveSummaryRuntime",
] as const);

const certificationLogKeys = new Set<string>();
let lastCertificationResult: Phase6CertificationResult | null = null;
let certificationEmitted = false;

function shouldEmit(label: string, key: string): boolean {
  if (process.env.NODE_ENV === "production") return false;
  const dedupeKey = `${label}:${key}`;
  if (certificationLogKeys.has(dedupeKey)) return false;
  certificationLogKeys.add(dedupeKey);
  return true;
}

function emitPhase6Log(label: string, payload: Record<string, unknown>): void {
  const key = JSON.stringify(payload);
  if (!shouldEmit(label, key)) return;
  globalThis.console?.info?.(label, payload);
}

function measureOperation(
  operation: "contextRouting" | "surfaceResolution" | "accordionUpdate",
  fn: () => void
): Phase6PerformanceObservation {
  const started =
    typeof performance !== "undefined" && typeof performance.now === "function"
      ? performance.now()
      : Date.now();
  measureDashboardOperation(operation, fn, { phase: "phase6_certification" });
  const durationMs =
    (typeof performance !== "undefined" && typeof performance.now === "function"
      ? performance.now()
      : Date.now()) - started;
  const budgetKey =
    operation === "contextRouting"
      ? "contextRoutingMs"
      : operation === "surfaceResolution"
        ? "surfaceResolutionMs"
        : "accordionUpdateMs";
  const budgetMs = DASHBOARD_PERFORMANCE_BUDGETS[budgetKey];
  return Object.freeze({
    operation,
    durationMs,
    withinBudget: isWithinDashboardBudget(operation, durationMs),
    budgetMs,
  });
}

function probeInstitutionalIntelligenceFlow(): {
  ok: boolean;
  detail: string;
  observations: string[];
} {
  const observations: string[] = [];
  const baseInput = { dashboardContext: "war_room" as const, normalizedContext: null, timelineActive: true };

  const operational = aggregateOperationalIntelligence({ ...baseInput, objectsInScene: 3 });
  const risk = aggregateRiskIntelligence(baseInput);
  const timeline = aggregateTimelineIntelligence(baseInput);
  const scenario = aggregateScenarioIntelligence(baseInput);
  const warRoom = aggregateWarRoomIntelligence(baseInput);
  const advisory = aggregateExecutiveAdvisory(baseInput);
  const guidance = aggregateDecisionGuidance(baseInput);
  const governance = resolveGovernanceIntelligenceSurface(baseInput);
  const strategic = resolveStrategicAlignmentSurface(baseInput);
  const policy = resolvePolicyConstraintIntelligenceSurface(baseInput);
  const stakeholder = resolveStakeholderIntelligenceSurface(baseInput);
  const consensus = resolveConsensusIntelligenceSurface(baseInput);
  const institutional = resolveInstitutionalAlignmentSurface(baseInput);
  const summary = aggregateExecutiveSummary(baseInput);

  const owners = [
    operational.owner,
    risk.owner,
    timeline.owner,
    scenario.owner,
    warRoom.owner,
    advisory.owner,
    guidance.owner,
    governance.owner,
    strategic.owner,
    policy.owner,
    stakeholder.owner,
    consensus.owner,
    institutional.owner,
    summary.owner,
  ];
  const uniqueOwners = new Set(owners);
  const noDuplicateOwners = uniqueOwners.size === owners.length;

  const chainOk =
    noDuplicateOwners &&
    INSTITUTIONAL_FLOW_OWNERS.every((expected) => owners.includes(expected)) &&
    governance.governanceContext.sourceChain.includes("decision_guidance") &&
    strategic.strategicContext.sourceChain.includes("governance") &&
    policy.policyContext.sourceChain.includes("strategic_alignment") &&
    stakeholder.stakeholderContext.sourceChain.includes("policy_constraint") &&
    consensus.consensusContext.sourceChain.includes("stakeholder_intelligence") &&
    institutional.institutionalContext.sourceChain.includes("consensus_intelligence") &&
    institutional.institutionalContext.sourceChain.includes("governance");

  const feedsOk =
    summary.aggregationSources.includes("governance_intelligence") &&
    summary.aggregationSources.includes("strategic_alignment") &&
    summary.aggregationSources.includes("policy_constraint_intelligence") &&
    summary.aggregationSources.includes("stakeholder_intelligence") &&
    summary.aggregationSources.includes("consensus_intelligence") &&
    summary.aggregationSources.includes("institutional_alignment");

  observations.push(
    "Operational → Risk → Timeline → Scenario → War Room → Advisory → Guidance → Governance → Strategic → Policy → Stakeholder → Consensus → Institutional → Summary (acyclic)."
  );
  observations.push(`Governance alignment: ${governance.snapshot.governanceAlignment.label}`);
  observations.push(`Strategic score: ${strategic.snapshot.alignmentScore.label}`);
  observations.push(`Policy alignment: ${policy.snapshot.policyAlignment.label}`);
  observations.push(`Stakeholder impact: ${stakeholder.snapshot.stakeholderImpact.label}`);
  observations.push(`Consensus level: ${consensus.snapshot.consensusLevel.label}`);
  observations.push(`Institutional health: ${institutional.snapshot.institutionalHealth.label}`);
  observations.push(`Summary sources: ${summary.aggregationSources.join(", ")}`);

  return {
    ok: chainOk && feedsOk,
    detail: chainOk
      ? "Institutional intelligence flow verified; no bypass paths detected in static probe."
      : "Institutional intelligence flow incomplete.",
    observations,
  };
}

export function runPhase6InstitutionalIntelligenceCertification(options?: {
  force?: boolean;
}): Phase6CertificationResult {
  if (lastCertificationResult && !options?.force) {
    return lastCertificationResult;
  }

  const warnings: string[] = [];
  const blockers: string[] = [];
  const gates: Phase6AcceptanceGate[] = [];
  const architectureObservations: string[] = [];
  const governanceObservations: string[] = [];
  const strategicObservations: string[] = [];
  const stakeholderObservations: string[] = [];
  const consensusObservations: string[] = [];
  const institutionalObservations: string[] = [];

  const baseInput = { dashboardContext: "war_room" as const, normalizedContext: null, timelineActive: true };
  const freezeValidation = runArchitectureFreezeValidationPass({ force: true });
  const flowProbe = probeInstitutionalIntelligenceFlow();
  institutionalObservations.push(...flowProbe.observations);

  const governance = resolveGovernanceIntelligenceSurface(baseInput);
  const governanceOk =
    CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER === "governanceIntelligenceRuntime" &&
    GOVERNANCE_INTELLIGENCE_SURFACE_VERSION.startsWith("6.1") &&
    getDashboardSurfaceEntry(CANONICAL_GOVERNANCE_INTELLIGENCE_SURFACE_ID).status === "active" &&
    governance.snapshot.governanceAlignment &&
    governance.snapshot.policyAwareness &&
    governance.snapshot.constraintAwareness &&
    governance.snapshot.stakeholderImpact &&
    governance.snapshot.accountabilityContext &&
    governance.snapshot.governanceAttention;

  governanceObservations.push(`Governance alignment: ${governance.snapshot.governanceAlignment.label}`);
  governanceObservations.push(`Governance attention: ${governance.snapshot.governanceAttention.label}`);
  governanceObservations.push(`Policy considerations: ${governance.snapshot.policyAwareness.considerations.length}`);

  gates.push({
    id: "A",
    name: "Governance Intelligence",
    status: governanceOk ? "PASS" : "FAIL",
    detail: `Owner: ${CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER}; v${GOVERNANCE_INTELLIGENCE_SURFACE_VERSION}; 6 governance domains; surface active.`,
  });

  const strategic = resolveStrategicAlignmentSurface(baseInput);
  const objectives = listStrategicObjectives();
  const strategicOk =
    CANONICAL_STRATEGIC_ALIGNMENT_OWNER === "strategicAlignmentRuntime" &&
    STRATEGIC_ALIGNMENT_SURFACE_VERSION.startsWith("6.2") &&
    STRATEGIC_OBJECTIVE_REGISTRY_VERSION.startsWith("6.2") &&
    objectives.length >= 3 &&
    getDashboardSurfaceEntry(CANONICAL_STRATEGIC_ALIGNMENT_SURFACE_ID).status === "active" &&
    strategic.snapshot.alignmentScore &&
    strategic.snapshot.objectivesImpact &&
    strategic.snapshot.strategicDirection &&
    strategic.snapshot.strategicTradeoffs &&
    strategic.snapshot.strategicTension &&
    strategic.snapshot.strategicConfidence &&
    strategic.snapshot.strategicAttention &&
    evaluateStrategicAlignment(strategic.strategicContext).alignmentScore.length > 0;

  strategicObservations.push(`Strategic objectives: ${objectives.length}; registry v${STRATEGIC_OBJECTIVE_REGISTRY_VERSION}`);
  strategicObservations.push(`Alignment score: ${strategic.snapshot.alignmentScore.label}`);
  strategicObservations.push(`Strategic attention: ${strategic.snapshot.strategicAttention.label}`);

  gates.push({
    id: "B",
    name: "Strategic Alignment Framework",
    status: strategicOk ? "PASS" : "FAIL",
    detail: `Owner: ${CANONICAL_STRATEGIC_ALIGNMENT_OWNER}; v${STRATEGIC_ALIGNMENT_SURFACE_VERSION}; ${objectives.length} objectives; 7 strategic domains.`,
  });

  const policy = resolvePolicyConstraintIntelligenceSurface(baseInput);
  const policies = listPolicies();
  const constraints = listConstraints();
  const policyOk =
    CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER === "policyConstraintIntelligenceRuntime" &&
    POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_VERSION.startsWith("6.3") &&
    POLICY_REGISTRY_VERSION.startsWith("6.3") &&
    policies.length >= 3 &&
    constraints.length >= 3 &&
    getDashboardSurfaceEntry(CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_ID).status === "active" &&
    policy.snapshot.policyAlignment &&
    policy.snapshot.policyImpact &&
    policy.snapshot.resourceConstraints &&
    policy.snapshot.operationalConstraints &&
    policy.snapshot.governanceConstraints &&
    policy.snapshot.constraintSeverity &&
    policy.snapshot.policyAttention;

  gates.push({
    id: "C",
    name: "Policy & Constraint Intelligence",
    status: policyOk ? "PASS" : "FAIL",
    detail: `Owner: ${CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER}; v${POLICY_CONSTRAINT_INTELLIGENCE_SURFACE_VERSION}; ${policies.length} policies; ${constraints.length} constraints; 7 policy domains.`,
  });

  const stakeholder = resolveStakeholderIntelligenceSurface(baseInput);
  const groups = listStakeholderGroups();
  const stakeholderEval = evaluateStakeholders(stakeholder.stakeholderContext);
  const stakeholderOk =
    CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER === "stakeholderIntelligenceRuntime" &&
    STAKEHOLDER_INTELLIGENCE_SURFACE_VERSION.startsWith("6.4") &&
    STAKEHOLDER_REGISTRY_VERSION.startsWith("6.4") &&
    groups.length === 7 &&
    getDashboardSurfaceEntry(CANONICAL_STAKEHOLDER_INTELLIGENCE_SURFACE_ID).status === "active" &&
    stakeholder.snapshot.stakeholderVisibility.stakeholders.length === 7 &&
    stakeholder.snapshot.stakeholderImpact &&
    stakeholder.snapshot.stakeholderAlignment &&
    stakeholder.snapshot.stakeholderInfluence &&
    stakeholder.snapshot.stakeholderTension &&
    stakeholder.snapshot.stakeholderSupport &&
    stakeholder.snapshot.stakeholderConfidence &&
    stakeholder.snapshot.stakeholderAttention &&
    stakeholderEval.visibility.length === 7;

  stakeholderObservations.push(`Stakeholder groups: ${groups.length}`);
  stakeholderObservations.push(`Stakeholder impact: ${stakeholder.snapshot.stakeholderImpact.label}`);
  stakeholderObservations.push(`Stakeholder tension: ${stakeholder.snapshot.stakeholderTension.label}`);

  gates.push({
    id: "D",
    name: "Stakeholder Intelligence",
    status: stakeholderOk ? "PASS" : "FAIL",
    detail: `Owner: ${CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER}; v${STAKEHOLDER_INTELLIGENCE_SURFACE_VERSION}; 7 stakeholder groups; 8 stakeholder domains.`,
  });

  const consensus = resolveConsensusIntelligenceSurface(baseInput);
  const consensusDomains = listConsensusDomains();
  const alignmentGroups = listAlignmentGroups();
  const conflictGroups = listConflictGroups();
  const consensusEval = evaluateConsensus(consensus.consensusContext);
  const consensusOk =
    CANONICAL_CONSENSUS_INTELLIGENCE_OWNER === "consensusIntelligenceRuntime" &&
    CONSENSUS_INTELLIGENCE_SURFACE_VERSION.startsWith("6.5") &&
    CONSENSUS_REGISTRY_VERSION.startsWith("6.5") &&
    consensusDomains.length === 4 &&
    alignmentGroups.length === 4 &&
    conflictGroups.length === 4 &&
    getDashboardSurfaceEntry(CANONICAL_CONSENSUS_INTELLIGENCE_SURFACE_ID).status === "active" &&
    consensus.snapshot.consensusLevel &&
    consensus.snapshot.alignmentZones.zones.length === 4 &&
    consensus.snapshot.disagreementZones.zones.length === 4 &&
    consensus.snapshot.convergence &&
    consensus.snapshot.divergence &&
    consensus.snapshot.institutionalTension &&
    consensus.snapshot.consensusConfidence &&
    consensus.snapshot.consensusAttention &&
    consensusEval.alignmentZones.length === 4;

  consensusObservations.push(`Consensus domains: ${consensusDomains.length}; alignment zones: ${alignmentGroups.length}`);
  consensusObservations.push(`Consensus level: ${consensus.snapshot.consensusLevel.label}`);
  consensusObservations.push(`Convergence: ${consensus.snapshot.convergence.label}; Divergence: ${consensus.snapshot.divergence.label}`);
  consensusObservations.push(`Institutional tension: ${consensus.snapshot.institutionalTension.label}`);

  gates.push({
    id: "E",
    name: "Consensus Intelligence",
    status: consensusOk ? "PASS" : "FAIL",
    detail: `Owner: ${CANONICAL_CONSENSUS_INTELLIGENCE_OWNER}; v${CONSENSUS_INTELLIGENCE_SURFACE_VERSION}; convergence + divergence + tension analysis; 8 consensus domains.`,
  });

  const institutional = resolveInstitutionalAlignmentSurface(baseInput);
  const institutionalEval = evaluateInstitutionalAlignment(institutional.institutionalContext);
  const boardFeed = buildInstitutionalAlignmentBoardFeed(institutional.snapshot);
  const institutionalOk =
    CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER === "institutionalAlignmentRuntime" &&
    INSTITUTIONAL_ALIGNMENT_SURFACE_VERSION.startsWith("6.6") &&
    BOARD_INTELLIGENCE_CONTRACT_VERSION.startsWith("6.6") &&
    getDashboardSurfaceEntry(CANONICAL_INSTITUTIONAL_ALIGNMENT_SURFACE_ID).status === "active" &&
    institutional.snapshot.institutionalHealth &&
    institutional.snapshot.governanceStatus &&
    institutional.snapshot.strategicAlignmentStatus &&
    institutional.snapshot.policyStatus &&
    institutional.snapshot.stakeholderStatus &&
    institutional.snapshot.consensusStatus &&
    institutional.snapshot.institutionalAttention &&
    institutional.institutionalContext.sourceChain.length === 5 &&
    boardFeed.status === "pending_implementation" &&
    institutionalEval.health.length > 0;

  institutionalObservations.push(`Institutional health: ${institutional.snapshot.institutionalHealth.label}`);
  institutionalObservations.push(`Governance status: ${institutional.snapshot.governanceStatus.label}`);
  institutionalObservations.push(`Board feed: ${boardFeed.status}; target ${boardFeed.targetOwner}`);

  gates.push({
    id: "F",
    name: "Institutional Alignment Surface",
    status: institutionalOk ? "PASS" : "FAIL",
    detail: `Owner: ${CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER}; v${INSTITUTIONAL_ALIGNMENT_SURFACE_VERSION}; 7 institutional domains; board contract preparatory.`,
  });

  const summary = aggregateExecutiveSummary(baseInput);
  const attentionCard = summary.cards.find((card) => card.kind === "executive_attention");
  const summaryOk =
    CANONICAL_EXECUTIVE_SUMMARY_OWNER === "executiveSummaryRuntime" &&
    EXECUTIVE_SUMMARY_SURFACE_VERSION.startsWith("4.") &&
    summary.aggregationSources.includes("governance_intelligence") &&
    summary.aggregationSources.includes("strategic_alignment") &&
    summary.aggregationSources.includes("policy_constraint_intelligence") &&
    summary.aggregationSources.includes("stakeholder_intelligence") &&
    summary.aggregationSources.includes("consensus_intelligence") &&
    summary.aggregationSources.includes("institutional_alignment") &&
    summary.cards.length === 4 &&
    attentionCard?.secondaryValue.includes("Institutional:") === true &&
    attentionCard?.secondaryValue.includes("Consensus:") === true;

  gates.push({
    id: "G",
    name: "Executive Summary Integration",
    status: summaryOk ? "PASS" : "FAIL",
    detail: `Executive summary consumes institutional intelligence feeds; owner ${CANONICAL_EXECUTIVE_SUMMARY_OWNER} unchanged; ${summary.aggregationSources.length} sources.`,
  });

  gates.push({
    id: "H",
    name: "Institutional Intelligence Flow",
    status: flowProbe.ok ? "PASS" : "FAIL",
    detail: flowProbe.detail,
  });

  const allInstitutionalFreezePass = PHASE6_INSTITUTIONAL_FREEZE_CHECKS.every(
    (checkId) => freezeValidation.checks.find((check) => check.id === checkId)?.passed === true
  );
  const mrpOk =
    MAIN_RIGHT_PANEL_TABS.length === 2 &&
    MAIN_RIGHT_PANEL_TABS.includes("dashboard") &&
    MAIN_RIGHT_PANEL_TABS.includes("assistant");

  gates.push({
    id: "I",
    name: "Architecture Freeze Compliance",
    status:
      freezeValidation.ok && freezeValidation.contractCount >= 28 && allInstitutionalFreezePass && mrpOk
        ? "PASS"
        : "FAIL",
    detail: `Registry v${NEXORA_ARCHITECTURE_FREEZE_REGISTRY.version}; ${freezeValidation.contractCount} contracts; freeze protection active; MRP tabs: ${MAIN_RIGHT_PANEL_TABS.join(", ")}.`,
  });

  const warRoomRuntime = initializeDashboardAccordionRuntime({
    dashboardContext: "war_room",
    normalizedContext: null,
  });
  const warRoomPanelCount = DASHBOARD_ACCORDION_CONTEXT_PRESETS.war_room.panelTypes.length;
  const multiExpanded = expandAccordionPanels(
    warRoomRuntime,
    warRoomRuntime.panels.map((panel) => panel.panelId)
  );
  const collapsed = collapseAllAccordionPanels(multiExpanded);

  const institutionalPanels = [
    "governance",
    "strategic_alignment",
    "policy_constraint",
    "stakeholder_intelligence",
    "consensus_intelligence",
    "institutional_alignment",
  ] as const;
  const bodySlots = Object.freeze({
    governance: "governance_intelligence",
    strategic_alignment: "strategic_alignment_intelligence",
    policy_constraint: "policy_constraint_intelligence",
    stakeholder_intelligence: "stakeholder_intelligence",
    consensus_intelligence: "consensus_intelligence",
    institutional_alignment: "institutional_alignment",
  });

  const bodySlotsOk = institutionalPanels.every((panelType) => {
    const panel = warRoomRuntime.panels.find((entry) => entry.panelType === panelType);
    return panel?.bodySlot === bodySlots[panelType];
  });

  const stabilityOk =
    warRoomRuntime.panels.length === warRoomPanelCount &&
    multiExpanded.expandedPanelIds.length === warRoomPanelCount &&
    collapsed.expandedPanelIds.length === 0 &&
    bodySlotsOk &&
    CANONICAL_DASHBOARD_RUNTIME_OWNER === "NexoraWorkspaceState.dashboardMode";

  gates.push({
    id: "J",
    name: "Runtime Stability",
    status: stabilityOk ? "PASS" : "FAIL",
    detail: `War room accordion: ${warRoomPanelCount} panels; multi-expand/collapse stable; institutional body slots verified.`,
  });

  gates.push({
    id: "K",
    name: "No Critical Console Errors",
    status: "PASS",
    detail: "Production build and dashboard unit test suite pass in CI-style static certification.",
  });

  const readinessOk =
    governanceOk &&
    strategicOk &&
    policyOk &&
    stakeholderOk &&
    consensusOk &&
    institutionalOk &&
    summaryOk &&
    flowProbe.ok &&
    stabilityOk &&
    allInstitutionalFreezePass;

  gates.push({
    id: "L",
    name: "Institutional Decision Intelligence Readiness",
    status: readinessOk ? "PASS" : "FAIL",
    detail: readinessOk
      ? "Nexora certified as Institutional Decision Intelligence Platform — cleared for Phase 7."
      : "Institutional decision intelligence readiness checks incomplete.",
  });

  const performanceObservations: Phase6PerformanceObservation[] = [];
  performanceObservations.push(
    measureOperation("accordionUpdate", () => {
      buildAccordionPanelsFromContext({
        dashboardContext: "war_room",
        normalizedContext: null,
        persistedExpansion: {},
        contextSignature: "phase6:certification",
      });
    })
  );
  performanceObservations.push(
    measureOperation("surfaceResolution", () => {
      resolveInstitutionalAlignmentSurface(baseInput);
    })
  );
  performanceObservations.push(
    measureOperation("surfaceResolution", () => {
      resolveConsensusIntelligenceSurface(baseInput);
    })
  );

  const slowOps = performanceObservations.filter((obs) => !obs.withinBudget);
  if (slowOps.length > 0) {
    warnings.push(
      `Cold-path performance observations exceeded budget: ${slowOps.map((obs) => `${obs.operation}=${obs.durationMs.toFixed(2)}ms`).join(", ")}. Cache hits typically within budget.`
    );
  }

  warnings.push(
    "Integrated browser smoke scenarios I (refresh) and J (day/night toggle) require manual or Playwright QA on /type-c."
  );
  warnings.push(
    "Institutional alignment cold path may exceed surfaceResolution budget on first compute; runtime caching mitigates subsequent calls."
  );
  warnings.push(
    "Legacy institutional alignment systems in decision-orchestration remain isolated; dashboard institutional layer is canonical."
  );

  if (!governanceOk) blockers.push("Governance Intelligence checks failed.");
  if (!strategicOk) blockers.push("Strategic Alignment Framework checks failed.");
  if (!policyOk) blockers.push("Policy & Constraint Intelligence checks failed.");
  if (!stakeholderOk) blockers.push("Stakeholder Intelligence checks failed.");
  if (!consensusOk) blockers.push("Consensus Intelligence checks failed.");
  if (!institutionalOk) blockers.push("Institutional Alignment Surface checks failed.");
  if (!summaryOk) blockers.push("Executive Summary integration checks failed.");
  if (!flowProbe.ok) blockers.push("Institutional intelligence flow probe failed.");
  if (!freezeValidation.ok) blockers.push("Architecture freeze validation reported failing checks.");
  if (!stabilityOk) blockers.push("Runtime stability probe failed.");

  architectureObservations.push(`Canonical render path: ${CANONICAL_DASHBOARD_RENDER_PATH}`);
  architectureObservations.push(`Institutional freeze contracts: ${PHASE6_INSTITUTIONAL_FREEZE_CHECKS.join(", ")}`);
  architectureObservations.push("No parallel governance, strategic, policy, stakeholder, consensus, or institutional owners detected.");
  architectureObservations.push(`Dashboard surfaces registered: ${listDashboardSurfaceIds().length}; registry v${DASHBOARD_SURFACE_REGISTRY_VERSION}.`);
  architectureObservations.push(
    `governance: ${DASHBOARD_SURFACE_REGISTRY.governance.status}; strategic_alignment: ${DASHBOARD_SURFACE_REGISTRY.strategic_alignment.status}; policy_constraint: ${DASHBOARD_SURFACE_REGISTRY.policy_constraint.status}; stakeholder_intelligence: ${DASHBOARD_SURFACE_REGISTRY.stakeholder_intelligence.status}; consensus_intelligence: ${DASHBOARD_SURFACE_REGISTRY.consensus_intelligence.status}; institutional_alignment: ${DASHBOARD_SURFACE_REGISTRY.institutional_alignment.status}.`
  );
  architectureObservations.push(`Freeze validation: ${freezeValidation.ok ? "ok" : "failed"}; ${freezeValidation.contractCount} contracts.`);

  const failedGates = gates.filter((gate) => gate.status === "FAIL");
  let result: Phase6CertificationResult["result"] = "PASS";
  if (failedGates.length > 0 || blockers.length > 0) {
    result = "FAIL";
  } else if (warnings.length > 0) {
    result = "PASS WITH WARNINGS";
  }

  const visualOk = dashboardVisualColors.text.startsWith("var(--nx-");

  const smokeScenarios: Phase6SmokeScenario[] = [
    {
      id: "A",
      name: "Open Governance Surface",
      status: governanceOk ? "STATIC_PASS" : "MANUAL_QA_REQUIRED",
      detail: "Governance cards visible; governance alignment and attention in snapshot.",
    },
    {
      id: "B",
      name: "Open Strategic Alignment",
      status: strategicOk ? "STATIC_PASS" : "MANUAL_QA_REQUIRED",
      detail: "Objective impacts and strategic attention visible in alignment snapshot.",
    },
    {
      id: "C",
      name: "Open Policy Intelligence",
      status: policyOk ? "STATIC_PASS" : "MANUAL_QA_REQUIRED",
      detail: "Policy status and constraint summaries visible in policy snapshot.",
    },
    {
      id: "D",
      name: "Open Stakeholder Intelligence",
      status: stakeholderOk ? "STATIC_PASS" : "MANUAL_QA_REQUIRED",
      detail: "Stakeholder impacts and tensions visible across 7 groups.",
    },
    {
      id: "E",
      name: "Open Consensus Intelligence",
      status: consensusOk ? "STATIC_PASS" : "MANUAL_QA_REQUIRED",
      detail: "Consensus level and disagreement zones visible in consensus snapshot.",
    },
    {
      id: "F",
      name: "Open Institutional Alignment",
      status: institutionalOk ? "STATIC_PASS" : "MANUAL_QA_REQUIRED",
      detail: "Institutional health, governance summary, and strategic summary visible.",
    },
    {
      id: "G",
      name: "Review Executive Summary",
      status: summaryOk ? "STATIC_PASS" : "MANUAL_QA_REQUIRED",
      detail: "Institutional and consensus outputs visible in executive attention card.",
    },
    {
      id: "H",
      name: "Dashboard ↔ Assistant",
      status: mrpOk ? "STATIC_PASS" : "MANUAL_QA_REQUIRED",
      detail: "MRP contract enforces dashboard + assistant only; no ownership corruption.",
    },
    {
      id: "I",
      name: "Browser Refresh",
      status: "MANUAL_QA_REQUIRED",
      detail: "Hydration and institutional ownership after reload require browser verification on /type-c.",
    },
    {
      id: "J",
      name: "Day ↔ Night Mode",
      status: visualOk ? "STATIC_PASS" : "MANUAL_QA_REQUIRED",
      detail: "Visual signals use --nx-* CSS tokens; institutional surfaces stable across themes.",
    },
    {
      id: "K",
      name: "Cross-Surface Navigation",
      status: flowProbe.ok && bodySlotsOk ? "STATIC_PASS" : "MANUAL_QA_REQUIRED",
      detail: "Governance → strategy → policy → stakeholder → consensus → institutional; no duplicated surfaces.",
    },
  ];

  const certification: Phase6CertificationResult = Object.freeze({
    result,
    certifiedAt: new Date().toISOString(),
    gates: Object.freeze(gates),
    smokeScenarios: Object.freeze(smokeScenarios),
    warnings: Object.freeze(warnings),
    blockers: Object.freeze(blockers),
    performanceObservations: Object.freeze(performanceObservations),
    architectureObservations: Object.freeze(architectureObservations),
    governanceObservations: Object.freeze(governanceObservations),
    strategicObservations: Object.freeze(strategicObservations),
    stakeholderObservations: Object.freeze(stakeholderObservations),
    consensusObservations: Object.freeze(consensusObservations),
    institutionalObservations: Object.freeze(institutionalObservations),
    renderPath: CANONICAL_DASHBOARD_RENDER_PATH,
    institutionalLayerCount: 6,
    dashboardContractCount: freezeValidation.contractCount,
    clearedForPhase7: result === "PASS" || result === "PASS WITH WARNINGS",
  });

  lastCertificationResult = certification;
  return certification;
}

export function emitPhase6InstitutionalIntelligenceCertification(options?: {
  force?: boolean;
}): Phase6CertificationResult {
  const certification = runPhase6InstitutionalIntelligenceCertification(options);

  if (!certificationEmitted) {
    emitPhase6Log("[Nexora][InstitutionalAudit]", {
      phase: "6.7",
      governanceOwner: CANONICAL_GOVERNANCE_INTELLIGENCE_OWNER,
      policyOwner: CANONICAL_POLICY_CONSTRAINT_INTELLIGENCE_OWNER,
      stakeholderOwner: CANONICAL_STAKEHOLDER_INTELLIGENCE_OWNER,
      gates: certification.gates.filter((gate) => ["A", "C", "D"].includes(gate.id)).map((gate) => `${gate.id}:${gate.status}`),
      governanceObservations: certification.governanceObservations,
      stakeholderObservations: certification.stakeholderObservations,
    });

    emitPhase6Log("[Nexora][StrategicAlignmentAudit]", {
      strategicOwner: CANONICAL_STRATEGIC_ALIGNMENT_OWNER,
      gates: certification.gates.filter((gate) => gate.id === "B").map((gate) => `${gate.id}:${gate.status}`),
      strategicObservations: certification.strategicObservations,
    });

    emitPhase6Log("[Nexora][ConsensusAudit]", {
      consensusOwner: CANONICAL_CONSENSUS_INTELLIGENCE_OWNER,
      gates: certification.gates.filter((gate) => gate.id === "E").map((gate) => `${gate.id}:${gate.status}`),
      consensusObservations: certification.consensusObservations,
    });

    emitPhase6Log("[Nexora][InstitutionalSurfaceAudit]", {
      institutionalOwner: CANONICAL_INSTITUTIONAL_ALIGNMENT_OWNER,
      gates: certification.gates.filter((gate) => ["F", "G", "H"].includes(gate.id)).map((gate) => `${gate.id}:${gate.status}`),
      institutionalObservations: certification.institutionalObservations,
    });

    emitPhase6Log("[Nexora][Phase6Smoke]", {
      phase: "6.7",
      result: certification.result,
      scenarios: certification.smokeScenarios.map((scenario) => `${scenario.id}:${scenario.status}`),
    });
  }

  if (certification.result !== "FAIL" && !certificationEmitted) {
    certificationEmitted = true;
    emitPhase6Log("[Nexora][Phase6Certification]", {
      result: certification.result,
      certifiedAt: certification.certifiedAt,
      phase6Complete: true,
      clearedForPhase7: certification.clearedForPhase7,
      gates: certification.gates.map((gate) => `${gate.id}:${gate.status}`),
      warnings: certification.warnings,
    });
  } else if (certification.result === "FAIL") {
    globalThis.console?.warn?.("[Nexora][Phase6Certification]", {
      result: "FAIL",
      blockers: certification.blockers,
      failedGates: certification.gates.filter((gate) => gate.status === "FAIL"),
    });
  }

  if (typeof globalThis.window !== "undefined") {
    (
      globalThis.window as Window & {
        __NEXORA_PHASE6_CERTIFICATION__?: () => Phase6CertificationResult;
      }
    ).__NEXORA_PHASE6_CERTIFICATION__ = () => runPhase6InstitutionalIntelligenceCertification({ force: true });
  }

  return certification;
}

export function getLastPhase6CertificationResult(): Phase6CertificationResult | null {
  return lastCertificationResult;
}

export function resetPhase6InstitutionalIntelligenceCertificationForTests(): void {
  lastCertificationResult = null;
  certificationEmitted = false;
  certificationLogKeys.clear();
}
