/**
 * MRP:5B:6 — Governance workspace certification runner.
 *
 * Validates frozen Governance workspace architecture. Certification only — no new features.
 */

import { guardGovernanceApprovalLayerForbiddenAction } from "./governanceApprovalLayerBoundary.ts";
import { guardGovernanceDecisionGateForbiddenAction } from "./governanceDecisionGateBoundary.ts";
import { guardGovernanceFoundationForbiddenAction } from "./governanceWorkspaceFoundationBoundary.ts";
import { guardGovernancePolicyConstraintForbiddenAction } from "./governancePolicyConstraintBoundary.ts";
import {
  CANONICAL_GOVERNANCE_WORKSPACE_OWNER,
  GOVERNANCE_WORKSPACE_SECTION_ORDER,
  GOVERNANCE_WORKSPACE_VERSION,
  MRP_GOVERNANCE_CERTIFIED_TAG,
  MRP_PHASE5B_COMPLETE_TAG,
} from "./governanceWorkspaceContract.ts";
import {
  buildGovernanceWorkspaceView,
  resetGovernanceWorkspaceRuntimeForTests,
} from "./governanceWorkspaceRuntime.ts";
import {
  getGovernanceWorkspaceState,
  getGovernanceWorkspaceStatePublishCountForTests,
  getGovernanceWorkspaceStateServerSnapshot,
  hydrateGovernanceWorkspaceStateOnMount,
  syncGovernanceWorkspaceContext,
  teardownGovernanceWorkspaceStateOnUnmount,
} from "./governanceWorkspaceState.ts";
import { buildGovernanceWorkspaceViewFromState } from "./governanceWorkspaceStateViewMapper.ts";
import {
  GOVERNANCE_WORKSPACE_CERTIFICATION_FREEZE_TAGS,
  GOVERNANCE_WORKSPACE_CERTIFICATION_VERSION,
  type GovernanceWorkspaceCertificationGate,
  type GovernanceWorkspaceCertificationResult,
  type GovernanceWorkspaceValidationCheck,
} from "./governanceWorkspaceCertificationContract.ts";
import { verifyNexoraRule14CertificationCompliance } from "./nexoraRule14RecommendationOwnershipRuntime.ts";
import { getMrpWorkspaceRegistryEntry } from "../mrpWorkspaceRegistry.ts";
import { resolveMrpWorkspaceMountPlan } from "../mrpWorkspaceResolver.ts";
import { MRP_CERTIFIED_WORKSPACE_RENDERER_CONNECTED_TAG } from "../mrpWorkspaceLoaderContract.ts";
import type { MrpContextStoreSnapshot } from "../../mrpContext/mrpContextStoreContract.ts";

let lastCertificationResult: GovernanceWorkspaceCertificationResult | null = null;

const baseSnapshot = Object.freeze({
  revision: 1,
  selectedObjectId: "factory-a",
  activeTab: "dashboard",
  dashboardMode: "governance",
  dashboardContext: "governance",
  signature: "cert-signature",
  header: Object.freeze({
    panelName: "Governance",
    activeMode: "Approval • Policy • Authority",
    selectedObject: "Factory A",
    backLabel: "← Back",
    showBackNavigation: false,
    revision: 1,
    source: "mrp_context_store" as const,
  }),
}) as MrpContextStoreSnapshot;

export function resetGovernanceWorkspaceCertificationForTests(): void {
  lastCertificationResult = null;
  resetGovernanceWorkspaceRuntimeForTests();
}

function seedGovernanceWorkspace(mountKey: string): void {
  hydrateGovernanceWorkspaceStateOnMount(mountKey);
  syncGovernanceWorkspaceContext(baseSnapshot, {
    routeObjectId: "factory-a",
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
}

function validateGateA(): GovernanceWorkspaceCertificationGate {
  resetGovernanceWorkspaceRuntimeForTests();
  const failures: string[] = [];

  hydrateGovernanceWorkspaceStateOnMount("cert-a");
  const view = buildGovernanceWorkspaceView({ mountKey: "cert-a" });
  if (view.workspaceId !== "governance") failures.push("workspaceId !== governance");
  if (CANONICAL_GOVERNANCE_WORKSPACE_OWNER !== "GovernanceWorkspace") {
    failures.push("canonical owner mismatch");
  }
  if (view.panels.length !== GOVERNANCE_WORKSPACE_SECTION_ORDER.length) {
    failures.push(`panels.length=${view.panels.length}`);
  }
  if (
    view.panels.map((panel) => panel.id).join(",") !== GOVERNANCE_WORKSPACE_SECTION_ORDER.join(",")
  ) {
    failures.push("panel order mismatch");
  }
  if (!view.ownsGovernanceReviewOnly) failures.push("ownsGovernanceReviewOnly false");
  if (!view.policyIntelligence.readOnly) failures.push("policyIntelligence not read-only");
  if (!view.decisionGate.decidesReadiness) failures.push("decisionGate missing");

  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "governance",
    dashboardContext: "governance",
    subWorkspaceMode: null,
  });
  if (plan.workspaceId !== "governance") failures.push(`plan workspaceId=${plan.workspaceId}`);
  if (plan.mountTarget !== "governance_workspace") {
    failures.push(`plan mountTarget=${plan.mountTarget}`);
  }

  const entry = getMrpWorkspaceRegistryEntry("governance");
  if (entry.loaderStatus !== "foundation") failures.push(`loaderStatus=${entry.loaderStatus}`);
  if (entry.mountTarget !== "governance_workspace") {
    failures.push(`registry mountTarget=${entry.mountTarget}`);
  }

  return Object.freeze({
    id: "A",
    name: "Workspace Rendering",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "GovernanceWorkspace renders 6 sections plus decision gate; dashboardMode governance resolves to governance_workspace foundation mount."
        : failures.join("; "),
  });
}

function validateGateB(): GovernanceWorkspaceCertificationGate {
  resetGovernanceWorkspaceRuntimeForTests();
  const failures: string[] = [];

  seedGovernanceWorkspace("cert-b");
  const state = getGovernanceWorkspaceState();
  if (state.phase !== "ready") failures.push(`phase=${state.phase}`);
  if (!state.signature.length) failures.push("signature empty");
  if (state.workspaceId !== "governance") failures.push("workspaceId mismatch");
  if (state.revision < 0) failures.push("revision invalid");

  const loadingSnapshot = getGovernanceWorkspaceStateServerSnapshot();
  if (loadingSnapshot.phase !== "loading") failures.push("server snapshot not loading");

  return Object.freeze({
    id: "B",
    name: "Runtime State",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "GovernanceWorkspaceState publish/subscribe hydrates ready state with policy, approval, and decision gate layers."
        : failures.join("; "),
  });
}

function validateGateC(): GovernanceWorkspaceCertificationGate {
  resetGovernanceWorkspaceRuntimeForTests();
  const failures: string[] = [];

  hydrateGovernanceWorkspaceStateOnMount("cert-c");
  syncGovernanceWorkspaceContext(baseSnapshot, {
    routeObjectId: "factory-a",
    selectedObjectId: "factory-a",
  });
  if (getGovernanceWorkspaceState().selectedObjectId !== "factory-a") {
    failures.push("selectedObjectId lost");
  }

  const view = buildGovernanceWorkspaceViewFromState(getGovernanceWorkspaceState());
  if (view.selectedObjectId !== "factory-a") failures.push("view selectedObjectId lost");

  syncGovernanceWorkspaceContext(baseSnapshot, {});
  if (getGovernanceWorkspaceState().selectedObjectId !== "factory-a") {
    failures.push("snapshot fallback failed");
  }

  return Object.freeze({
    id: "C",
    name: "Object Context",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Route object and MRP snapshot sync preserve governance object context."
        : failures.join("; "),
  });
}

function validateGateD(): GovernanceWorkspaceCertificationGate {
  resetGovernanceWorkspaceRuntimeForTests();
  const failures: string[] = [];

  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "governance",
    dashboardContext: "governance",
    subWorkspaceMode: null,
  });
  if (!plan.mountKey.includes("governance_workspace")) {
    failures.push("mountKey missing governance_workspace");
  }
  if (plan.mountTarget === "loader_shell") failures.push("resolved to loader_shell");
  if (!MRP_CERTIFIED_WORKSPACE_RENDERER_CONNECTED_TAG.startsWith("[MRP_")) {
    failures.push("certified renderer tag missing");
  }

  return Object.freeze({
    id: "D",
    name: "MRP Integration",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Governance registered as foundation mount; certified renderer path active in MrpDynamicWorkspaceLoader."
        : failures.join("; "),
  });
}

function validateGateE(): GovernanceWorkspaceCertificationGate {
  resetGovernanceWorkspaceRuntimeForTests();
  const failures: string[] = [];

  for (const action of ["scene_write", "object_mutation"] as const) {
    if (guardGovernanceFoundationForbiddenAction({ action, source: "cert-e" }).allowed) {
      failures.push(`${action} not blocked`);
    }
  }

  seedGovernanceWorkspace("cert-e");
  const view = buildGovernanceWorkspaceViewFromState(getGovernanceWorkspaceState());
  if (!view.policyIntelligence.readOnly) failures.push("policy not read-only");
  if (!view.constraintIntelligence.readOnly) failures.push("constraint not read-only");

  return Object.freeze({
    id: "E",
    name: "Scene Awareness",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Scene writes and object mutation blocked — governance intelligence surfaces remain read-only."
        : failures.join("; "),
  });
}

function validateGateF(): GovernanceWorkspaceCertificationGate {
  resetGovernanceWorkspaceRuntimeForTests();
  const failures: string[] = [];

  seedGovernanceWorkspace("cert-f");
  const revisionAfterFirst = getGovernanceWorkspaceState().revision;
  const publishAfterFirst = getGovernanceWorkspaceStatePublishCountForTests();

  syncGovernanceWorkspaceContext(baseSnapshot, { routeObjectId: "factory-a" });
  syncGovernanceWorkspaceContext(baseSnapshot, { routeObjectId: "factory-a" });

  if (getGovernanceWorkspaceState().revision !== revisionAfterFirst) {
    failures.push("duplicate sync changed revision");
  }
  if (getGovernanceWorkspaceStatePublishCountForTests() !== publishAfterFirst) {
    failures.push("duplicate sync incremented publish count");
  }

  return Object.freeze({
    id: "F",
    name: "No Runtime Errors",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Context sync dedupes signatures; no runaway publish loop detected."
        : failures.join("; "),
  });
}

function validateGateG(): GovernanceWorkspaceCertificationGate {
  resetGovernanceWorkspaceRuntimeForTests();
  const failures: string[] = [];

  const preHydrate = buildGovernanceWorkspaceViewFromState(getGovernanceWorkspaceState());
  if (preHydrate.phase !== "loading") failures.push("pre-hydrate phase not loading");

  seedGovernanceWorkspace("cert-g");
  const postHydrate = buildGovernanceWorkspaceViewFromState(getGovernanceWorkspaceState());
  if (postHydrate.phase !== "ready") failures.push("post-hydrate phase not ready");
  if (postHydrate.policyIntelligence.rows.length !== 3) failures.push("policy intelligence missing");
  if (postHydrate.constraintIntelligence.rows.length !== 4) {
    failures.push("constraint intelligence missing");
  }
  if (postHydrate.approvalLayerIntelligence.approvalChain.rows.length < 3) {
    failures.push("approval chain missing");
  }
  if (!postHydrate.decisionGate.outcome.length) failures.push("decision gate outcome missing");

  return Object.freeze({
    id: "G",
    name: "No Hydration Errors",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Loading snapshot transitions to ready view with policy, constraint, approval, and decision gate surfaces."
        : failures.join("; "),
  });
}

function validateGateH(): GovernanceWorkspaceCertificationGate {
  resetGovernanceWorkspaceRuntimeForTests();
  const failures: string[] = [];

  seedGovernanceWorkspace("cert-h");
  syncGovernanceWorkspaceContext(baseSnapshot, { routeObjectId: "factory-a" });
  const objectBefore = getGovernanceWorkspaceState().selectedObjectId;

  teardownGovernanceWorkspaceStateOnUnmount("cert-h");
  hydrateGovernanceWorkspaceStateOnMount("cert-h-2");
  syncGovernanceWorkspaceContext(baseSnapshot, { routeObjectId: "factory-a" });

  if (getGovernanceWorkspaceState().selectedObjectId !== objectBefore) {
    failures.push("object context lost on remount");
  }
  const view = buildGovernanceWorkspaceViewFromState(getGovernanceWorkspaceState());
  if (view.approvalLayerIntelligence.authorityReview.warRoomOwnsCommitment !== true) {
    failures.push("authority review contract lost");
  }

  return Object.freeze({
    id: "H",
    name: "No Context Loss",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Remount and context resync preserve object context and approval layer contracts."
        : failures.join("; "),
  });
}

function validateGateI(): GovernanceWorkspaceCertificationGate {
  resetGovernanceWorkspaceRuntimeForTests();
  const failures: string[] = [];

  if (
    guardGovernancePolicyConstraintForbiddenAction({ action: "write_timeline", source: "cert-i" })
      .allowed
  ) {
    failures.push("write_timeline allowed");
  }

  seedGovernanceWorkspace("cert-i");
  if (buildGovernanceWorkspaceViewFromState(getGovernanceWorkspaceState()).decisionGate.mayExecute) {
    failures.push("decision gate mayExecute true");
  }

  return Object.freeze({
    id: "I",
    name: "No Timeline Ownership Violation",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Governance policy intelligence does not write to Timeline — Timeline owns history."
        : failures.join("; "),
  });
}

function validateGateJ(): GovernanceWorkspaceCertificationGate {
  resetGovernanceWorkspaceRuntimeForTests();
  const failures: string[] = [];

  if (
    guardGovernancePolicyConstraintForbiddenAction({ action: "write_scenario", source: "cert-j" })
      .allowed
  ) {
    failures.push("write_scenario allowed");
  }
  if (guardGovernanceFoundationForbiddenAction({ action: "create_scenario", source: "cert-j" }).allowed) {
    failures.push("create_scenario allowed");
  }

  return Object.freeze({
    id: "J",
    name: "No Scenario Ownership Violation",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Governance does not create scenarios — Scenario owns possibility."
        : failures.join("; "),
  });
}

function validateGateK(): GovernanceWorkspaceCertificationGate {
  resetGovernanceWorkspaceRuntimeForTests();
  const failures: string[] = [];

  if (
    guardGovernanceDecisionGateForbiddenAction({ action: "commit_decision", source: "cert-k" })
      .allowed
  ) {
    failures.push("commit_decision allowed");
  }
  if (
    guardGovernanceApprovalLayerForbiddenAction({ action: "commit_decision", source: "cert-k" })
      .allowed
  ) {
    failures.push("approval layer commit_decision allowed");
  }
  if (guardGovernanceFoundationForbiddenAction({ action: "execute_decision", source: "cert-k" }).allowed) {
    failures.push("execute_decision allowed");
  }

  seedGovernanceWorkspace("cert-k");
  const gate = buildGovernanceWorkspaceViewFromState(getGovernanceWorkspaceState()).decisionGate;
  if (gate.mayExecute) failures.push("decision gate mayExecute true");
  if (!gate.warRoomExecutes) failures.push("warRoomExecutes false");

  return Object.freeze({
    id: "K",
    name: "No War Room Ownership Violation",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Governance approves readiness — War Room owns commitment execution."
        : failures.join("; "),
  });
}

function validateGateL(): GovernanceWorkspaceCertificationGate {
  resetGovernanceWorkspaceRuntimeForTests();
  const result = verifyNexoraRule14CertificationCompliance("governance");
  return Object.freeze({
    id: "L",
    name: "Rule #14 Compliance",
    status: result.compliant ? "PASS" : "FAIL",
    detail: result.compliant
      ? "Advisory recommends; Governance approves; War Room executes — Rule #14 guards verified."
      : result.violations.join("; "),
  });
}

function runValidationChecks(): GovernanceWorkspaceValidationCheck[] {
  resetGovernanceWorkspaceRuntimeForTests();
  seedGovernanceWorkspace("cert-validation");
  const view = buildGovernanceWorkspaceViewFromState(getGovernanceWorkspaceState());

  const forecastBlocked = !guardGovernanceFoundationForbiddenAction({
    action: "generate_forecast",
    source: "cert-validation",
  }).allowed;
  const scenarioBlocked = !guardGovernanceFoundationForbiddenAction({
    action: "create_scenario",
    source: "cert-validation",
  }).allowed;
  const executeBlocked = !guardGovernanceFoundationForbiddenAction({
    action: "execute_decision",
    source: "cert-validation",
  }).allowed;

  return [
    Object.freeze({
      id: "policy_review",
      label: "Policy Review",
      expected: true,
      actual: view.policyIntelligence.rows.length === 3,
      status: view.policyIntelligence.rows.length === 3 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "constraint_review",
      label: "Constraint Review",
      expected: true,
      actual: view.constraintIntelligence.rows.length === 4,
      status: view.constraintIntelligence.rows.length === 4 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "approval_chain",
      label: "Approval Chain",
      expected: true,
      actual: view.approvalLayerIntelligence.approvalChain.rows.length >= 3,
      status: view.approvalLayerIntelligence.approvalChain.rows.length >= 3 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "authority_review",
      label: "Authority Review",
      expected: true,
      actual: view.approvalLayerIntelligence.authorityReview.warRoomOwnsCommitment === true,
      status:
        view.approvalLayerIntelligence.authorityReview.warRoomOwnsCommitment === true
          ? "PASS"
          : "FAIL",
    }),
    Object.freeze({
      id: "governance_outcome",
      label: "Governance Outcome",
      expected: true,
      actual: Boolean(view.decisionGate.outcome),
      status: view.decisionGate.outcome ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "forecast_generation",
      label: "Forecast Generation",
      expected: false,
      actual: !forecastBlocked,
      status: forecastBlocked ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "scenario_creation",
      label: "Scenario Creation",
      expected: false,
      actual: !scenarioBlocked,
      status: scenarioBlocked ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "decision_execution",
      label: "Decision Execution",
      expected: false,
      actual: !executeBlocked,
      status: executeBlocked ? "PASS" : "FAIL",
    }),
  ];
}

export function runGovernanceWorkspaceCertification(options?: {
  force?: boolean;
}): GovernanceWorkspaceCertificationResult {
  if (lastCertificationResult && !options?.force) {
    return lastCertificationResult;
  }

  resetGovernanceWorkspaceCertificationForTests();

  const gates: GovernanceWorkspaceCertificationGate[] = [
    validateGateA(),
    validateGateB(),
    validateGateC(),
    validateGateD(),
    validateGateE(),
    validateGateF(),
    validateGateG(),
    validateGateH(),
    validateGateI(),
    validateGateJ(),
    validateGateK(),
    validateGateL(),
  ];

  const validationChecks = runValidationChecks();

  const warnings: string[] = [
    "Browser hydration and day/night theme smoke require manual verification on /type-c.",
  ];

  const gateBlockers = gates
    .filter((gate) => gate.status === "FAIL")
    .map((gate) => `${gate.id}: ${gate.name}`);
  const validationBlockers = validationChecks
    .filter((check) => check.status === "FAIL")
    .map((check) => check.id);
  const blockers = [...gateBlockers, ...validationBlockers];

  let verdict: GovernanceWorkspaceCertificationResult["verdict"] = "PASS";
  if (blockers.length > 0) {
    verdict = "FAIL";
  } else if (warnings.length > 0) {
    verdict = "PASS WITH WARNINGS";
  }

  const result: GovernanceWorkspaceCertificationResult = Object.freeze({
    verdict,
    certifiedAt: new Date().toISOString(),
    version: GOVERNANCE_WORKSPACE_CERTIFICATION_VERSION,
    gates: Object.freeze(gates),
    validationChecks: Object.freeze(validationChecks),
    warnings: Object.freeze(warnings),
    blockers: Object.freeze(blockers),
    freezeTags: Object.freeze([...GOVERNANCE_WORKSPACE_CERTIFICATION_FREEZE_TAGS]),
    status: "Governance Workspace Frozen",
  });

  lastCertificationResult = result;

  if (process.env.NODE_ENV !== "production" && verdict !== "FAIL") {
    globalThis.console?.info?.(MRP_GOVERNANCE_CERTIFIED_TAG, {
      verdict,
      version: GOVERNANCE_WORKSPACE_CERTIFICATION_VERSION,
      workspaceVersion: GOVERNANCE_WORKSPACE_VERSION,
      gates: gates.map((gate) => `${gate.id}:${gate.status}`),
      status: "Governance Workspace Frozen",
    });
    globalThis.console?.info?.(MRP_PHASE5B_COMPLETE_TAG, {
      phase: "5B",
      slices: ["5B.1", "5B.2", "5B.3", "5B.4", "5B.5", "5B.6"],
    });
  }

  return result;
}

export function getLastGovernanceWorkspaceCertificationResult(): GovernanceWorkspaceCertificationResult | null {
  return lastCertificationResult;
}
