/**
 * MRP:5A:6 — Advisory workspace certification runner.
 *
 * Validates frozen Advisory workspace architecture. Certification only — no new features.
 */

import {
  guardAdvisoryForbiddenAction,
  guardAdvisoryRecommendationBoundary,
} from "./advisoryBoundaryRuntime.ts";
import {
  commitRecommendationToGovernance,
  resetAdvisoryHandoffRuntimeForTests,
} from "./advisoryHandoffRuntime.ts";
import {
  resetAdvisoryExplainabilityRuntimeForTests,
} from "./advisoryExplainabilityRuntime.ts";
import {
  syncAdvisoryRecommendation,
  resetAdvisoryRecommendationRuntimeForTests,
} from "./advisoryRecommendationRuntime.ts";
import { guardAdvisorySceneWrite } from "./advisorySceneAwarenessRuntime.ts";
import type { AdvisorySceneForbiddenCapability } from "./advisorySceneAwarenessContract.ts";
import {
  resetAdvisoryStateRuntimeForTests,
} from "./advisoryStateRuntime.ts";
import {
  ADVISORY_WORKSPACE_SECTION_ORDER,
  ADVISORY_WORKSPACE_VERSION,
  CANONICAL_ADVISORY_WORKSPACE_OWNER,
  MRP_ADVISORY_CERTIFIED_TAG,
  MRP_PHASE5A_COMPLETE_TAG,
} from "./advisoryWorkspaceContract.ts";
import {
  buildAdvisoryWorkspaceView,
  resetAdvisoryWorkspaceRuntimeForTests,
} from "./advisoryWorkspaceRuntime.ts";
import {
  getAdvisoryWorkspaceState,
  getAdvisoryWorkspaceStateServerSnapshot,
  hydrateAdvisoryWorkspaceStateOnMount,
  resetAdvisoryWorkspaceStateRuntimeForTests,
} from "./advisoryWorkspaceStateRuntime.ts";
import {
  syncAdvisoryWorkspaceContext,
  resetAdvisoryWorkspaceContextRuntimeForTests,
} from "./advisoryWorkspaceContextRuntime.ts";
import {
  ADVISORY_WORKSPACE_CERTIFICATION_FREEZE_TAGS,
  ADVISORY_WORKSPACE_CERTIFICATION_VERSION,
  type AdvisoryWorkspaceCertificationGate,
  type AdvisoryWorkspaceCertificationResult,
  type AdvisoryWorkspaceValidationCheck,
} from "./advisoryWorkspaceCertificationContract.ts";
import { verifyNexoraRule14CertificationCompliance } from "../governance/nexoraRule14RecommendationOwnershipRuntime.ts";
import {
  guardGovernanceForbiddenAction,
} from "../governance/governanceBoundaryRuntime.ts";
import {
  resetGovernanceBoundaryRuntimeForTests,
} from "../governance/governanceBoundaryRuntime.ts";
import {
  resetGovernanceRecommendationHandoffRuntimeForTests,
} from "../governance/governanceRecommendationHandoffRuntime.ts";
import {
  resetGovernanceRecommendationIntakeRuntimeForTests,
} from "../governance/governanceRecommendationIntakeRuntime.ts";
import { getMrpWorkspaceRegistryEntry } from "../mrpWorkspaceRegistry.ts";
import { resolveMrpWorkspaceMountPlan } from "../mrpWorkspaceResolver.ts";
import { MRP_CERTIFIED_WORKSPACE_RENDERER_CONNECTED_TAG } from "../mrpWorkspaceLoaderContract.ts";
import { publishRiskWorkspaceState } from "../risk/riskWorkspaceStateRuntime.ts";
import { resetRiskWorkspaceStateRuntimeForTests } from "../risk/riskWorkspaceStateRuntime.ts";

let lastCertificationResult: AdvisoryWorkspaceCertificationResult | null = null;

const SCENE_CAPABILITIES: readonly AdvisorySceneForbiddenCapability[] = Object.freeze([
  "modify_scene",
  "move_objects",
  "modify_topology",
  "change_camera",
  "control_scene",
]);

export function resetAdvisoryWorkspaceCertificationForTests(): void {
  lastCertificationResult = null;
  resetAdvisoryWorkspaceRuntimeForTests();
  resetGateFixture();
}

function resetGateFixture(): void {
  resetAdvisoryHandoffRuntimeForTests();
  resetAdvisoryExplainabilityRuntimeForTests();
  resetAdvisoryRecommendationRuntimeForTests();
  resetAdvisoryStateRuntimeForTests();
  resetAdvisoryWorkspaceStateRuntimeForTests();
  resetAdvisoryWorkspaceContextRuntimeForTests();
  resetGovernanceRecommendationHandoffRuntimeForTests();
  resetGovernanceRecommendationIntakeRuntimeForTests();
  resetGovernanceBoundaryRuntimeForTests();
  resetRiskWorkspaceStateRuntimeForTests();
}

function seedAdvisoryWorkspace(mountKey: string): void {
  hydrateAdvisoryWorkspaceStateOnMount(mountKey);
  syncAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  publishRiskWorkspaceState({
    phase: "ready",
    selectedObjectId: "factory-a",
    riskCount: 2,
    elevatedRiskCount: 1,
    criticalRiskCount: 0,
    dominantRiskCategory: "Operational",
  });
  syncAdvisoryRecommendation();
}

function validateGateA(): AdvisoryWorkspaceCertificationGate {
  resetGateFixture();
  const failures: string[] = [];

  hydrateAdvisoryWorkspaceStateOnMount("cert-a");
  const view = buildAdvisoryWorkspaceView();
  if (view.workspaceId !== "advisory") failures.push("workspaceId !== advisory");
  if (CANONICAL_ADVISORY_WORKSPACE_OWNER !== "AdvisoryWorkspace") {
    failures.push("canonical owner mismatch");
  }
  if (view.cards.length !== 5) failures.push(`cards.length=${view.cards.length}`);
  if (
    view.cards.map((card) => card.id).join(",") !== ADVISORY_WORKSPACE_SECTION_ORDER.join(",")
  ) {
    failures.push("card order mismatch");
  }
  if (!view.ownsRecommendationsOnly) failures.push("ownsRecommendationsOnly false");

  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "advisory",
    dashboardContext: "advisory",
    subWorkspaceMode: "advisory",
  });
  if (plan.workspaceId !== "advisory") failures.push(`plan workspaceId=${plan.workspaceId}`);
  if (plan.mountTarget !== "advisory_workspace") {
    failures.push(`plan mountTarget=${plan.mountTarget}`);
  }

  const entry = getMrpWorkspaceRegistryEntry("advisory");
  if (entry.loaderStatus !== "foundation") failures.push(`loaderStatus=${entry.loaderStatus}`);
  if (entry.mountTarget !== "advisory_workspace") {
    failures.push(`registry mountTarget=${entry.mountTarget}`);
  }

  return Object.freeze({
    id: "A",
    name: "Workspace Rendering",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "AdvisoryWorkspace renders 5 sections; subWorkspaceMode advisory resolves to advisory_workspace foundation mount."
        : failures.join("; "),
  });
}

function validateGateB(): AdvisoryWorkspaceCertificationGate {
  resetGateFixture();
  const failures: string[] = [];

  seedAdvisoryWorkspace("cert-b");
  const state = getAdvisoryWorkspaceState();
  if (state.phase !== "ready") failures.push(`phase=${state.phase}`);
  if (!state.signature.length) failures.push("signature empty");
  if (!state.recommendationOwned) failures.push("recommendationOwned false");
  if (!state.explainabilityReadOnly) failures.push("explainabilityReadOnly false");
  if (state.revision < 0) failures.push("revision invalid");

  const loadingSnapshot = getAdvisoryWorkspaceStateServerSnapshot();
  if (loadingSnapshot.phase !== "loading") failures.push("server snapshot not loading");

  return Object.freeze({
    id: "B",
    name: "Runtime State",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "AdvisoryWorkspaceState publish/subscribe hydrates ready state with recommendation and explainability layers."
        : failures.join("; "),
  });
}

function validateGateC(): AdvisoryWorkspaceCertificationGate {
  resetGateFixture();
  const failures: string[] = [];

  hydrateAdvisoryWorkspaceStateOnMount("cert-c");
  syncAdvisoryWorkspaceContext({
    selectedObjectId: "factory-a",
    selectedObjectLabel: "Factory A",
  });
  const withSelection = getAdvisoryWorkspaceState();
  if (!withSelection.workspaceContext.hasSelection) failures.push("hasSelection false");
  if (withSelection.workspaceContext.selectedObjectId !== "factory-a") {
    failures.push("selectedObjectId lost");
  }

  syncAdvisoryWorkspaceContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  const deselected = getAdvisoryWorkspaceState();
  if (deselected.workspaceContext.hasSelection) failures.push("deselect failed");
  if (!deselected.workspaceContext.selectedObject.includes("No object selected")) {
    failures.push("deselect label missing");
  }

  return Object.freeze({
    id: "C",
    name: "Object Context",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Selected object sync and deselect preserve advisory workspace context contract."
        : failures.join("; "),
  });
}

function validateGateD(): AdvisoryWorkspaceCertificationGate {
  resetGateFixture();
  const failures: string[] = [];

  const plan = resolveMrpWorkspaceMountPlan({
    dashboardMode: "advisory",
    dashboardContext: "advisory",
    subWorkspaceMode: "advisory",
  });
  if (!plan.mountKey.includes("advisory_workspace")) {
    failures.push("mountKey missing advisory_workspace");
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
        ? "Advisory registered as foundation mount; certified renderer path active in MrpDynamicWorkspaceLoader."
        : failures.join("; "),
  });
}

function validateGateE(): AdvisoryWorkspaceCertificationGate {
  resetGateFixture();
  const failures: string[] = [];

  for (const capability of SCENE_CAPABILITIES) {
    const guard = guardAdvisorySceneWrite({ capability, source: "cert-e" });
    if (guard.allowed) failures.push(`${capability} not blocked`);
  }

  return Object.freeze({
    id: "E",
    name: "Scene Awareness",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "All advisory scene write capabilities blocked — recommendation surfaces remain read-only."
        : failures.join("; "),
  });
}

function validateGateF(): AdvisoryWorkspaceCertificationGate {
  resetGateFixture();
  const failures: string[] = [];

  seedAdvisoryWorkspace("cert-f");
  const before = getAdvisoryWorkspaceState().revision;
  syncAdvisoryRecommendation();
  syncAdvisoryRecommendation();
  const after = getAdvisoryWorkspaceState().revision;
  if (after !== before) failures.push(`duplicate sync changed revision ${before}→${after}`);

  return Object.freeze({
    id: "F",
    name: "No Runtime Errors",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Recommendation sync dedupes signatures; no runaway publish loop detected."
        : failures.join("; "),
  });
}

function validateGateG(): AdvisoryWorkspaceCertificationGate {
  resetGateFixture();
  const failures: string[] = [];

  const preHydrate = buildAdvisoryWorkspaceView();
  if (preHydrate.phase !== "loading") failures.push("pre-hydrate phase not loading");

  seedAdvisoryWorkspace("cert-g");
  const postHydrate = buildAdvisoryWorkspaceView();
  if (postHydrate.phase !== "ready") failures.push("post-hydrate phase not ready");
  if (!postHydrate.recommendation.createsRecommendation) {
    failures.push("recommendation surface missing");
  }
  if (postHydrate.explainability.drivers.sections.length !== 4) {
    failures.push("explainability drivers missing");
  }
  if (!postHydrate.handoff.preparesOnly) failures.push("handoff surface missing");

  return Object.freeze({
    id: "G",
    name: "No Hydration Errors",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Loading snapshot transitions to ready view with recommendation, explainability, and handoff surfaces."
        : failures.join("; "),
  });
}

function validateGateH(): AdvisoryWorkspaceCertificationGate {
  resetGateFixture();
  const failures: string[] = [];

  seedAdvisoryWorkspace("cert-h");
  syncAdvisoryWorkspaceContext({
    selectedObjectId: null,
    selectedObjectLabel: null,
  });
  const afterDeselect = getAdvisoryWorkspaceState();
  if (afterDeselect.explainabilityLayer.drivers.sections.length !== 4) {
    failures.push("explainability sections lost on deselect");
  }
  if (afterDeselect.recommendationLayer.consumesIntelligenceOnly !== true) {
    failures.push("recommendation layer contract lost");
  }

  return Object.freeze({
    id: "H",
    name: "No Context Loss",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Deselect resets recommendation runtime without corrupting advisory layer contracts."
        : failures.join("; "),
  });
}

function validateGateI(): AdvisoryWorkspaceCertificationGate {
  resetGateFixture();
  const failures: string[] = [];

  if (
    !guardAdvisoryRecommendationBoundary({
      action: "generate_recommendation",
      source: "cert-i",
    }).allowed
  ) {
    failures.push("generate_recommendation blocked");
  }

  seedAdvisoryWorkspace("cert-i");
  const state = getAdvisoryWorkspaceState();
  if (!state.recommendationLayer.createsRecommendation) {
    failures.push("createsRecommendation false");
  }
  if (state.recommendationLayer.executesActions) failures.push("executesActions true");
  if (!state.recommendationOwned) failures.push("recommendationOwned false");

  return Object.freeze({
    id: "I",
    name: "Recommendation Ownership Verified",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Advisory owns recommendation generation; Rule #14 recommendation actions allowed."
        : failures.join("; "),
  });
}

function validateGateJ(): AdvisoryWorkspaceCertificationGate {
  resetGateFixture();
  const failures: string[] = [];

  if (guardAdvisoryForbiddenAction({ action: "commit_decision", source: "cert-j" }).allowed) {
    failures.push("commit_decision allowed on advisory");
  }
  seedAdvisoryWorkspace("cert-j");
  if (getAdvisoryWorkspaceState().recommendationLayer.executesActions) {
    failures.push("recommendation layer executesActions true");
  }

  return Object.freeze({
    id: "J",
    name: "No War Room Ownership Violation",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Advisory may recommend but may not commit decisions — War Room owns commitment."
        : failures.join("; "),
  });
}

function validateGateK(): AdvisoryWorkspaceCertificationGate {
  resetGateFixture();
  const failures: string[] = [];

  if (guardAdvisoryForbiddenAction({ action: "approve_decision", source: "cert-k" }).allowed) {
    failures.push("approve_decision allowed on advisory");
  }
  seedAdvisoryWorkspace("cert-k");
  const handoff = commitRecommendationToGovernance({
    createdAt: "2026-06-13T12:00:00.000Z",
  });
  if (!handoff.ok) failures.push(handoff.reason ?? "handoff failed");
  if (
    guardGovernanceForbiddenAction({
      action: "issue_recommendation",
      source: "cert-k",
    }).allowed
  ) {
    failures.push("governance issue_recommendation not blocked");
  }

  return Object.freeze({
    id: "K",
    name: "No Governance Ownership Violation",
    status: failures.length === 0 ? "PASS" : "FAIL",
    detail:
      failures.length === 0
        ? "Advisory packages recommendations for governance review without approving — Governance owns approval."
        : failures.join("; "),
  });
}

function validateGateL(): AdvisoryWorkspaceCertificationGate {
  resetGateFixture();
  const result = verifyNexoraRule14CertificationCompliance("advisory");
  return Object.freeze({
    id: "L",
    name: "Rule #14 Compliance",
    status: result.compliant ? "PASS" : "FAIL",
    detail: result.compliant
      ? "Advisory recommends; Governance approves; War Room commits — Rule #14 guards verified."
      : result.violations.join("; "),
  });
}

function runValidationChecks(): AdvisoryWorkspaceValidationCheck[] {
  resetGateFixture();
  seedAdvisoryWorkspace("cert-validation");
  const handoff = commitRecommendationToGovernance({
    createdAt: "2026-06-13T12:00:00.000Z",
  });
  const state = getAdvisoryWorkspaceState();
  const approvalBlocked = guardAdvisoryForbiddenAction({
    action: "approve_decision",
    source: "cert-validation",
  }).allowed;

  const checks: AdvisoryWorkspaceValidationCheck[] = [
    Object.freeze({
      id: "creates_recommendations",
      label: "Creates recommendations",
      expected: true,
      actual: state.recommendationLayer.createsRecommendation,
      status: state.recommendationLayer.createsRecommendation ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "explains_recommendations",
      label: "Explains recommendations",
      expected: true,
      actual: state.explainabilityLayer.explainsRecommendationOnly,
      status: state.explainabilityLayer.explainsRecommendationOnly ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "produces_confidence_analysis",
      label: "Produces confidence analysis",
      expected: true,
      actual: state.explainabilityLayer.confidenceAnalysis.confidenceScore > 0,
      status:
        state.explainabilityLayer.confidenceAnalysis.confidenceScore > 0 ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "creates_governance_package",
      label: "Creates governance package",
      expected: true,
      actual: handoff.ok === true && state.handoffReady === true,
      status: handoff.ok && state.handoffReady ? "PASS" : "FAIL",
    }),
    Object.freeze({
      id: "executes_decisions",
      label: "Executes decisions",
      expected: false,
      actual: state.recommendationLayer.executesActions,
      status: state.recommendationLayer.executesActions ? "FAIL" : "PASS",
    }),
    Object.freeze({
      id: "approves_decisions",
      label: "Approves decisions",
      expected: false,
      actual: approvalBlocked,
      status: approvalBlocked ? "FAIL" : "PASS",
    }),
  ];

  return checks;
}

export function runAdvisoryWorkspaceCertification(options?: {
  force?: boolean;
}): AdvisoryWorkspaceCertificationResult {
  if (lastCertificationResult && !options?.force) {
    return lastCertificationResult;
  }

  resetAdvisoryWorkspaceCertificationForTests();

  const gates: AdvisoryWorkspaceCertificationGate[] = [
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
    "Governance workspace UI remains loader_shell — handoff intake verified statically.",
  ];

  const gateBlockers = gates
    .filter((gate) => gate.status === "FAIL")
    .map((gate) => `${gate.id}: ${gate.name}`);
  const validationBlockers = validationChecks
    .filter((check) => check.status === "FAIL")
    .map((check) => check.id);
  const blockers = [...gateBlockers, ...validationBlockers];

  let verdict: AdvisoryWorkspaceCertificationResult["verdict"] = "PASS";
  if (blockers.length > 0) {
    verdict = "FAIL";
  } else if (warnings.length > 0) {
    verdict = "PASS WITH WARNINGS";
  }

  const result: AdvisoryWorkspaceCertificationResult = Object.freeze({
    verdict,
    certifiedAt: new Date().toISOString(),
    version: ADVISORY_WORKSPACE_CERTIFICATION_VERSION,
    gates: Object.freeze(gates),
    validationChecks: Object.freeze(validationChecks),
    warnings: Object.freeze(warnings),
    blockers: Object.freeze(blockers),
    freezeTags: Object.freeze([...ADVISORY_WORKSPACE_CERTIFICATION_FREEZE_TAGS]),
  });

  lastCertificationResult = result;

  if (process.env.NODE_ENV !== "production" && verdict !== "FAIL") {
    globalThis.console?.info?.(MRP_ADVISORY_CERTIFIED_TAG, {
      verdict,
      version: ADVISORY_WORKSPACE_CERTIFICATION_VERSION,
      workspaceVersion: ADVISORY_WORKSPACE_VERSION,
      gates: gates.map((gate) => `${gate.id}:${gate.status}`),
    });
    globalThis.console?.info?.(MRP_PHASE5A_COMPLETE_TAG, {
      phase: "5A",
      slices: ["5A.1", "5A.2", "5A.3", "5A.4", "5A.5", "5A.6"],
    });
  }

  return result;
}

export function getLastAdvisoryWorkspaceCertificationResult(): AdvisoryWorkspaceCertificationResult | null {
  return lastCertificationResult;
}
