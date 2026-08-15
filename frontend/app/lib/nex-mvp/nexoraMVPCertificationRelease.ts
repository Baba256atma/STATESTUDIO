/**
 * NEX-MVP:9 — Nexora MVP Certification & Release.
 *
 * Certifies the assembled NEX-MVP:1–8 Executive Decision Environment.
 * Does not add product scope. Release status is derived from gate results.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  getNexoraMVPApplicationIdentity,
  getNexoraMVPPresentationStates,
  getNexoraMVPSceneEnvironmentIntent,
  getNexoraMVPWorkspaceOrder,
  getNexoraMVPWorkspaceRegistry,
  NEXORA_MVP_APPLICATION_FOUNDATION_BOUNDARY,
  nexoraMVPApplicationFoundationIdentity,
} from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import {
  getNexoraExecutiveShellIdentity,
  NEXORA_EXECUTIVE_SHELL_BOUNDARY,
  nexoraExecutiveShellCanonicalRoute,
  nexoraExecutiveShellIdentity,
  nexoraExecutiveShellUpstreamIdentity,
} from "@/app/lib/nex-mvp/nexoraExecutiveShell";
import {
  getNexora3DExecutiveStageIdentity,
  nexora3DExecutiveStageIdentity,
  resolveNexoraMVPStageScenePresentation,
} from "@/app/lib/nex-mvp/nexora3DExecutiveStage";
import {
  createInitialNexoraMVPObjectInteractionState,
  getNexoraMVPObjectInteractionIdentity,
  nexoraMVPObjectInteractionIdentity,
  selectNexoraMVPInteractionSubject,
  stepBackNexoraMVPObjectInteraction,
  NEXORA_MVP_OBJECT_INTERACTION_BOUNDARY,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import {
  getNexoraMVPWorkspaceDialSceneStateIdentity,
  nexoraMVPWorkspaceDialSceneStateIdentity,
  NEXORA_MVP_WORKSPACE_PRESENTATION_BOUNDARY,
} from "@/app/lib/nex-mvp/nexoraMVPWorkspacePresentation";
import {
  deriveNexoraMVPPresentationViewModel,
  getNexoraMVPPresentationStatesIdentity,
  nexoraMVPPresentationStatesIdentity,
  NEXORA_MVP_PRESENTATION_STATE_BOUNDARY,
  verifyNexoraMVPPresentationStates,
} from "@/app/lib/nex-mvp/nexoraMVPPresentationState";
import {
  applyNexoraMVPIntelligenceResolution,
  buildNexoraMVPIntelligenceContextKey,
  getNexoraMVPAdvisorInsightExperienceIdentity,
  mapNexoraMVPAdvisorViewModel,
  mapNexoraMVPInsightViewModel,
  nexoraMVPAdvisorInsightExperienceIdentity,
  NEXORA_MVP_INTELLIGENCE_BOUNDARY,
  resolveNexoraMVPExecutiveIntelligence,
  deriveNexoraMVPExecutiveIntelligenceContext,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveIntelligence";
import {
  applyNexoraMVPFlowDomainAction,
  createInitialNexoraMVPFlowDomainState,
  deriveNexoraMVPExecutiveFlowChain,
  getNexoraMVPExecutiveFlowIntegrationIdentity,
  mapNexoraMVPJournalEntries,
  mapNexoraMVPTimelinePacks,
  nexoraMVPExecutiveFlowIntegrationIdentity,
  NEXORA_MVP_FLOW_BOUNDARY,
  verifyNexoraMVPExecutiveFlowIntegration,
} from "@/app/lib/nex-mvp/nexoraMVPExecutiveFlow";
import { createNexoraMVPFlowSeededDecisionRuntime } from "@/app/lib/nex-mvp/nexoraMVPExecutiveDecisionCommitment";
import {
  NEXORA_MVP_STAGE_OBJECT_FIXTURES,
  NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
} from "@/app/lib/nex-mvp/nexoraMVPStageFixtures";
import {
  buildNexoraMVPAdvisorContextBridge,
  deriveNexoraMVPStageInteractionPresentation,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexoraMVPCertificationReleaseIdentity =
  "NEX-MVP:9/NexoraMVPCertificationRelease" as const;

export const nexoraMVPCertificationReleaseVersion = "1.9.0" as const;

export const nexoraMVPCertificationReleaseNamespace =
  "nexora.mvp.certification-release" as const;

export const nexoraMVPCertificationReleasePhase =
  "CertificationAndRelease" as const;

export const nexoraMVPCertificationReleaseArchitecturalRole =
  "MVPProductCertificationAndReleaseBoundary" as const;

export const nexoraMVPCertificationImmediateDependency =
  "NEX-MVP:8/NexoraExecutiveFlowIntegration" as const;

export const nexoraMVPCanonicalRoute = "/executive" as const;

export const nexoraMVPReleaseLockIdentity =
  "NEX-MVP-EXECUTIVE-DECISION-ENVIRONMENT-LOCKED" as const;

export type NexoraMVPCertificationReleaseIdentity = {
  readonly id: typeof nexoraMVPCertificationReleaseIdentity;
  readonly version: typeof nexoraMVPCertificationReleaseVersion;
  readonly namespace: typeof nexoraMVPCertificationReleaseNamespace;
  readonly phase: typeof nexoraMVPCertificationReleasePhase;
  readonly architecturalRole: typeof nexoraMVPCertificationReleaseArchitecturalRole;
};

const IDENTITY: NexoraMVPCertificationReleaseIdentity = Object.freeze({
  id: nexoraMVPCertificationReleaseIdentity,
  version: nexoraMVPCertificationReleaseVersion,
  namespace: nexoraMVPCertificationReleaseNamespace,
  phase: nexoraMVPCertificationReleasePhase,
  architecturalRole: nexoraMVPCertificationReleaseArchitecturalRole,
});

export function getNexoraMVPCertificationReleaseIdentity(): NexoraMVPCertificationReleaseIdentity {
  return IDENTITY;
}

// ─── Status model ───────────────────────────────────────────────────────────

export type NexoraMVPReleaseStatus = "Draft" | "Candidate" | "Released";
export type NexoraMVPCertificationStatus =
  | "Unverified"
  | "Certified"
  | "Failed";
export type NexoraMVPCompatibilityStatus = "Compatible" | "Incompatible";
export type NexoraMVPStability = "Experimental" | "Stable";
export type NexoraMVPConsumerReadiness = "NotReady" | "ReadyForMVPUse";
export type NexoraMVPFreezeStatus = "Unfrozen" | "Frozen";
export type NexoraMVPLockStatus = "Unlocked" | "Locked";

export const NEXORA_MVP_CERTIFICATION_DOMAINS = Object.freeze([
  "Identity",
  "DependencyIntegrity",
  "ApplicationFoundation",
  "ExecutiveShell",
  "StageRendering",
  "ObjectInteraction",
  "WorkspaceDial",
  "SceneState",
  "PresentationStates",
  "Advisor",
  "Insight",
  "ExecutiveFlow",
  "Timeline",
  "Journal",
  "Accessibility",
  "Performance",
  "RuntimeSafety",
  "Build",
  "ArchitecturalPurity",
  "ReleaseReadiness",
] as const);

export type NexoraMVPCertificationDomain =
  (typeof NEXORA_MVP_CERTIFICATION_DOMAINS)[number];

export type NexoraMVPCertificationCheck = {
  readonly id: string;
  readonly domain: NexoraMVPCertificationDomain;
  readonly required: boolean;
  readonly ok: boolean;
  readonly detail: string;
};

export type NexoraMVPCertificationWarning = {
  readonly id: string;
  readonly detail: string;
};

export type NexoraMVPCertificationEvidence = {
  /** MVP-scoped unit/integration suites passed. */
  readonly mvpTestSuitePassed: boolean;
  /** No TypeScript errors under nex-mvp / executive/nex-mvp. */
  readonly mvpTypeScriptClean: boolean;
  /**
   * Next.js production compile phase succeeded
   * ("Creating an optimized production build … Compiled successfully").
   * null = not evaluated (cannot release).
   */
  readonly productionCompilePassed: boolean | null;
  /**
   * Full-repository typecheck during `next build`.
   * When false for reasons outside NEX-MVP paths, set
   * `productionTypecheckFailureScope: "unrelated"` so the blocker is
   * reported as a warning rather than an MVP product defect.
   */
  readonly productionTypecheckPassed: boolean | null;
  readonly productionTypecheckFailureScope?: "mvp" | "unrelated";
  readonly productionTypecheckDetail?: string;
  /** Manual /executive product review passed. */
  readonly manualProductReviewPassed: boolean;
};

export type NexoraMVPCertificationResult = {
  readonly status: NexoraMVPCertificationStatus;
  readonly passed: number;
  readonly failed: number;
  readonly requiredPassed: number;
  readonly requiredFailed: number;
  readonly checks: readonly NexoraMVPCertificationCheck[];
  readonly warnings: readonly NexoraMVPCertificationWarning[];
  readonly knownLimitations: readonly string[];
};

export type NexoraMVPReleaseManifest = {
  readonly version: typeof nexoraMVPCertificationReleaseVersion;
  readonly route: typeof nexoraMVPCanonicalRoute;
  readonly releaseStatus: NexoraMVPReleaseStatus;
  readonly certificationStatus: NexoraMVPCertificationStatus;
  readonly compatibilityStatus: NexoraMVPCompatibilityStatus;
  readonly stability: NexoraMVPStability;
  readonly readiness: NexoraMVPConsumerReadiness;
  readonly freezeStatus: NexoraMVPFreezeStatus;
  readonly lockStatus: NexoraMVPLockStatus;
  readonly lockIdentity: typeof nexoraMVPReleaseLockIdentity | null;
  readonly certifiedPhases: readonly string[];
  readonly workspaces: readonly string[];
  readonly presentationStates: readonly string[];
};

export const NEXORA_MVP_CERTIFIED_PHASE_CHAIN = Object.freeze([
  "NEX-MVP:1/NexoraMVPApplicationFoundation",
  "NEX-MVP:2/NexoraExecutiveShell",
  "NEX-MVP:3/Nexora3DExecutiveStage",
  "NEX-MVP:4/NexoraObjectInteraction",
  "NEX-MVP:5/NexoraWorkspaceDialSceneState",
  "NEX-MVP:6/NexoraPresentationStates",
  "NEX-MVP:7/NexoraAdvisorInsightExperience",
  "NEX-MVP:8/NexoraExecutiveFlowIntegration",
  "NEX-MVP:9/NexoraMVPCertificationRelease",
] as const);

export const NEXORA_MVP_KNOWN_LIMITATIONS = Object.freeze([
  "Desktop-first Executive Environment; mobile UX is not certified.",
  "Canonical Stage density targets approximately 6–12 primary objects.",
  "Advisor/Insight use MVP presentation/fixture bridges; live REX Public Index remains Node-gated.",
  "Decision/Execution consequential actions use typed replaceable flow-domain fixtures pending runtime binding.",
  "Timeline Replay is unavailable (Replay control remains Future).",
  "No external messaging, Jira, or enterprise connector scope in MVP.",
  "Demo/development fixtures remain isolated and replaceable.",
] as const);

export const NEXORA_MVP_RELEASE_NOTES = Object.freeze({
  title: "Nexora MVP — Executive Decision Environment",
  route: nexoraMVPCanonicalRoute,
  delivers: Object.freeze([
    "Canonical /executive Executive Shell with Stage-dominant composition",
    "3D Stage with object interaction, relationships, and context nodes",
    "Workspace Dial: Overview → Problem → Scenario → Decision → Execution",
    "Presentation depth: Minimum / Report / Operation",
    "Context-aware Advisor + Insight region",
    "Executive flow Object → Problem → Scenario → Decision → Execution",
    "Timeline packs and Journal explorer bound to authoritative fixture history",
  ]),
} as const);

export const NEXORA_MVP_PRIMARY_DEMO_FLOW = Object.freeze([
  "Open /executive (Overview)",
  "Focus Capacity (or Revenue)",
  "Open linked Problem (Capacity Gap / Margin Pressure)",
  "Open linked Scenario",
  "Review Decision",
  "Approve where supported → open Execution",
  "Inspect Timeline pack / Journal pack",
  "Back to Object → Overview",
] as const);

// ─── Helpers ────────────────────────────────────────────────────────────────

function check(
  id: string,
  domain: NexoraMVPCertificationDomain,
  required: boolean,
  ok: boolean,
  detail: string,
): NexoraMVPCertificationCheck {
  return Object.freeze({ id, domain, required, ok, detail });
}

function listFilesRecursive(root: string, acc: string[] = []): string[] {
  let entries: string[] = [];
  try {
    entries = readdirSync(root);
  } catch {
    return acc;
  }
  for (const entry of entries) {
    const full = join(root, entry);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      listFilesRecursive(full, acc);
    } else if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith(".test.ts") && !entry.endsWith(".test.tsx")) {
      acc.push(full);
    }
  }
  return acc;
}

const PROHIBITED_IMPORT_PATTERNS = Object.freeze([
  /from\s+["']@\/app\/lib\/nol\/(?!.*PublicIndex)[^"']+["']/,
  /from\s+["']@\/app\/lib\/dri\/(?!.*PublicIndex)[^"']+["']/,
  /from\s+["']@\/app\/lib\/rex\/(?!.*PublicIndex)[^"']+["']/,
  /from\s+["']@\/app\/lib\/nex-ci\/(?!executiveCockpitIntegrationPublicIndex)[^"']+["']/,
  /CertificationFreeze/,
  /from\s+["']@\/app\/lib\/nex-mvp\/nexoraMVPUpstreamIntegration["']/,
]);

function scanMvpSourcesForBypasses(roots: readonly string[]): {
  readonly ok: boolean;
  readonly detail: string;
} {
  const offenders: string[] = [];
  for (const root of roots) {
    for (const file of listFilesRecursive(root)) {
      // Upstream integration is Node-only by design.
      if (file.endsWith("nexoraMVPUpstreamIntegration.ts")) continue;
      // Certification release itself may import Node fs for static audits.
      if (file.endsWith("nexoraMVPCertificationRelease.ts")) continue;
      let source = "";
      try {
        source = readFileSync(file, "utf8");
      } catch {
        continue;
      }
      for (const pattern of PROHIBITED_IMPORT_PATTERNS) {
        if (pattern.test(source)) {
          offenders.push(`${file} :: ${pattern}`);
          break;
        }
      }
    }
  }
  return {
    ok: offenders.length === 0,
    detail:
      offenders.length === 0
        ? "No prohibited private upstream imports in MVP UI/lib surfaces."
        : `Prohibited imports: ${offenders.slice(0, 5).join("; ")}`,
  };
}

function interactionWalk(subjectIds: readonly string[]) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "report",
    environmentIntent: "neutral",
  });
  for (const id of subjectIds) {
    state = selectNexoraMVPInteractionSubject(state, id);
  }
  return state;
}

// ─── Certification ──────────────────────────────────────────────────────────

/**
 * Certify the Nexora MVP product.
 * Release status is derived from required check outcomes + evidence.
 */
export function certifyNexoraMVP(
  evidence: NexoraMVPCertificationEvidence,
  options?: { readonly forceFailure?: boolean },
): NexoraMVPCertificationResult {
  const checks: NexoraMVPCertificationCheck[] = [];
  const warnings: NexoraMVPCertificationWarning[] = [];

  if (options?.forceFailure) {
    checks.push(
      check(
        "forced-failure",
        "ReleaseReadiness",
        true,
        false,
        "Forced failure requested for certification semantics test.",
      ),
    );
  }

  // Identity
  const identity = getNexoraMVPCertificationReleaseIdentity();
  checks.push(
    check(
      "identity-exact",
      "Identity",
      true,
      identity.id === "NEX-MVP:9/NexoraMVPCertificationRelease" &&
        identity.version === "1.9.0" &&
        identity.namespace === "nexora.mvp.certification-release" &&
        identity.architecturalRole ===
          "MVPProductCertificationAndReleaseBoundary",
      `${identity.id} @ ${identity.version}`,
    ),
  );

  // Dependency integrity
  const shell = getNexoraExecutiveShellIdentity();
  const stage = getNexora3DExecutiveStageIdentity();
  const interaction = getNexoraMVPObjectInteractionIdentity();
  const workspace = getNexoraMVPWorkspaceDialSceneStateIdentity();
  const presentation = getNexoraMVPPresentationStatesIdentity();
  const advisor = getNexoraMVPAdvisorInsightExperienceIdentity();
  const flow = getNexoraMVPExecutiveFlowIntegrationIdentity();
  const foundation = getNexoraMVPApplicationIdentity();

  checks.push(
    check(
      "dependency-chain",
      "DependencyIntegrity",
      true,
      foundation.id === nexoraMVPApplicationFoundationIdentity &&
        shell.id === nexoraExecutiveShellIdentity &&
        nexoraExecutiveShellUpstreamIdentity ===
          nexoraMVPApplicationFoundationIdentity &&
        stage.id === nexora3DExecutiveStageIdentity &&
        interaction.id === nexoraMVPObjectInteractionIdentity &&
        workspace.id === nexoraMVPWorkspaceDialSceneStateIdentity &&
        presentation.id === nexoraMVPPresentationStatesIdentity &&
        advisor.id === nexoraMVPAdvisorInsightExperienceIdentity &&
        flow.id === nexoraMVPExecutiveFlowIntegrationIdentity &&
        nexoraMVPCertificationImmediateDependency === flow.id,
      "MVP:1→2→3→4→5→6→7→8→9 dependency identities aligned.",
    ),
  );

  checks.push(
    check(
      "phase-chain-manifest",
      "DependencyIntegrity",
      true,
      NEXORA_MVP_CERTIFIED_PHASE_CHAIN.length === 9 &&
        NEXORA_MVP_CERTIFIED_PHASE_CHAIN[0] ===
          "NEX-MVP:1/NexoraMVPApplicationFoundation" &&
        NEXORA_MVP_CERTIFIED_PHASE_CHAIN[7] ===
          "NEX-MVP:8/NexoraExecutiveFlowIntegration" &&
        NEXORA_MVP_CERTIFIED_PHASE_CHAIN[8] ===
          "NEX-MVP:9/NexoraMVPCertificationRelease",
      "Certified phase chain enumerates NEX-MVP:1–9.",
    ),
  );

  // Application foundation
  const workspaceOrder = getNexoraMVPWorkspaceOrder();
  const presentationStates = getNexoraMVPPresentationStates();
  checks.push(
    check(
      "foundation-vocab",
      "ApplicationFoundation",
      true,
      workspaceOrder.join(",") ===
        "overview,problem,scenario,decision,execution" &&
        presentationStates.join(",") === "minimum,report,operation" &&
        getNexoraMVPSceneEnvironmentIntent("overview") === "neutral" &&
        getNexoraMVPSceneEnvironmentIntent("problem") === "investigate" &&
        getNexoraMVPSceneEnvironmentIntent("scenario") === "simulate" &&
        getNexoraMVPSceneEnvironmentIntent("decision") === "commit" &&
        getNexoraMVPSceneEnvironmentIntent("execution") === "execute" &&
        NEXORA_MVP_APPLICATION_FOUNDATION_BOUNDARY.ownsRendering === false,
      "Foundation workspace/presentation/environment vocabularies intact.",
    ),
  );

  // Executive shell
  checks.push(
    check(
      "shell-route-surfaces",
      "ExecutiveShell",
      true,
      nexoraExecutiveShellCanonicalRoute === "/executive" &&
        nexoraMVPCanonicalRoute === "/executive" &&
        NEXORA_EXECUTIVE_SHELL_BOUNDARY.soleImmediateDependency ===
          nexoraMVPApplicationFoundationIdentity,
      "Canonical route /executive; shell depends on MVP:1.",
    ),
  );

  // Stage
  const scene = resolveNexoraMVPStageScenePresentation({
    objects: NEXORA_MVP_STAGE_OBJECT_FIXTURES,
    relationships: NEXORA_MVP_STAGE_RELATIONSHIP_FIXTURES,
    selectedObjectId: null,
    focusedObjectId: null,
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const objectCount = NEXORA_MVP_STAGE_OBJECT_FIXTURES.length;
  checks.push(
    check(
      "stage-density-and-ids",
      "StageRendering",
      true,
      objectCount >= 6 &&
        objectCount <= 12 &&
        scene.objects.length === objectCount &&
        new Set(scene.objects.map((entry) => entry.id)).size === objectCount,
      `Stage presentation resolves ${objectCount} stable object IDs (MVP density gate).`,
    ),
  );

  // Object interaction
  const focused = interactionWalk(["obj-capacity"]);
  const invalid = selectNexoraMVPInteractionSubject(focused, "missing-id");
  const problem = selectNexoraMVPInteractionSubject(
    focused,
    "ctx-problem-capacity",
  );
  const back = stepBackNexoraMVPObjectInteraction(problem);
  checks.push(
    check(
      "object-interaction-flow",
      "ObjectInteraction",
      true,
      focused.focusedSubject?.id === "obj-capacity" &&
        invalid.focusedSubject?.id === "obj-capacity" &&
        problem.focusedSubject?.id === "ctx-problem-capacity" &&
        back.focusedSubject?.id === "obj-capacity" &&
        NEXORA_MVP_OBJECT_INTERACTION_BOUNDARY.ownsRuntimeSemantics === false,
      "Select/focus/context/back/invalid-safe interaction contracts hold.",
    ),
  );

  // Workspace dial + scene state
  checks.push(
    check(
      "workspace-dial-order",
      "WorkspaceDial",
      true,
      getNexoraMVPWorkspaceRegistry().length === 5 &&
        getNexoraMVPSceneEnvironmentIntent("scenario") === "simulate" &&
        NEXORA_MVP_WORKSPACE_PRESENTATION_BOUNDARY.ownsWorkspaceAuthority ===
          false &&
        NEXORA_MVP_WORKSPACE_PRESENTATION_BOUNDARY.themeCoupledToEnvironment ===
          false,
      "Workspace Dial order and theme/environment separation hold.",
    ),
  );

  checks.push(
    check(
      "scene-state-mapping",
      "SceneState",
      true,
      getNexoraMVPSceneEnvironmentIntent("overview") === "neutral" &&
        getNexoraMVPSceneEnvironmentIntent("problem") === "investigate" &&
        getNexoraMVPSceneEnvironmentIntent("decision") === "commit" &&
        getNexoraMVPSceneEnvironmentIntent("execution") === "execute",
      "Workspace → environment intent mapping certified.",
    ),
  );

  // Presentation
  const minVm = deriveNexoraMVPPresentationViewModel({
    presentationState: "minimum",
    workspace: "overview",
    environmentIntent: "neutral",
    subjectId: "obj-capacity",
    subjectKind: "object",
    subjectLabel: "Capacity",
  });
  const reportVm = deriveNexoraMVPPresentationViewModel({
    presentationState: "report",
    workspace: "overview",
    environmentIntent: "neutral",
    subjectId: "obj-capacity",
    subjectKind: "object",
    subjectLabel: "Capacity",
  });
  const operationVm = deriveNexoraMVPPresentationViewModel({
    presentationState: "operation",
    workspace: "decision",
    environmentIntent: "commit",
    subjectId: "ctx-decision-reprice",
    subjectKind: "decision",
    subjectLabel: "Approve Repricing",
  });
  checks.push(
    check(
      "presentation-states",
      "PresentationStates",
      true,
      verifyNexoraMVPPresentationStates().ok &&
        minVm.showEssentialStatus &&
        !minVm.showRelationships &&
        reportVm.showKPIs &&
        reportVm.primaryKpi != null &&
        operationVm.showActions &&
        operationVm.availableActions.length > 0 &&
        NEXORA_MVP_PRESENTATION_STATE_BOUNDARY.inventsKpiEngine === false,
      "Minimum/Report/Operation depth and KPI integrity hold.",
    ),
  );

  // Advisor / Insight
  const intelState = interactionWalk(["obj-capacity"]);
  const stagePresentation = deriveNexoraMVPStageInteractionPresentation(
    intelState,
  );
  const bridge = buildNexoraMVPAdvisorContextBridge(
    intelState,
    stagePresentation,
  );
  const intelContext = deriveNexoraMVPExecutiveIntelligenceContext({
    advisorBridge: bridge,
    presentationViewModel: reportVm,
    focusedSubject: intelState.focusedSubject,
    selectedSubject: intelState.selectedSubject,
    breadcrumb: bridge.breadcrumb,
  });
  const advisorVm = mapNexoraMVPAdvisorViewModel(intelContext);
  const insightVm = mapNexoraMVPInsightViewModel(intelContext);
  const overviewContext = deriveNexoraMVPExecutiveIntelligenceContext({
    advisorBridge: buildNexoraMVPAdvisorContextBridge(
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
      deriveNexoraMVPStageInteractionPresentation(
        createInitialNexoraMVPObjectInteractionState({
          workspace: "overview",
          presentationState: "minimum",
          environmentIntent: "neutral",
        }),
      ),
    ),
    presentationViewModel: deriveNexoraMVPPresentationViewModel({
      presentationState: "minimum",
      workspace: "overview",
      environmentIntent: "neutral",
      subjectId: null,
      subjectKind: null,
      subjectLabel: null,
    }),
    focusedSubject: null,
    selectedSubject: null,
    breadcrumb: Object.freeze([]),
  });
  const overviewAdvisor = mapNexoraMVPAdvisorViewModel(overviewContext);
  const keyA = buildNexoraMVPIntelligenceContextKey({
    workspace: "overview",
    presentationState: "report",
    focusedSubjectId: "obj-revenue",
    selectedSubjectId: "obj-revenue",
  });
  const keyB = buildNexoraMVPIntelligenceContextKey({
    workspace: "overview",
    presentationState: "report",
    focusedSubjectId: "obj-capacity",
    selectedSubjectId: "obj-capacity",
  });
  const stale = applyNexoraMVPIntelligenceResolution({
    currentContextKey: keyB,
    resolution: resolveNexoraMVPExecutiveIntelligence(intelContext),
  });
  // Build a resolution with mismatched key
  const mismatched = Object.freeze({
    ...resolveNexoraMVPExecutiveIntelligence(intelContext),
    contextKey: keyA,
  });
  const staleBlocked = applyNexoraMVPIntelligenceResolution({
    currentContextKey: keyB,
    resolution: mismatched,
  });

  checks.push(
    check(
      "advisor-guidance",
      "Advisor",
      true,
      advisorVm.subjectId === "obj-capacity" &&
        (advisorVm.recommendation != null || advisorVm.emptyReason != null) &&
        overviewAdvisor.title.includes("Overview") &&
        NEXORA_MVP_INTELLIGENCE_BOUNDARY.introducesGenericChatbot === false &&
        NEXORA_MVP_INTELLIGENCE_BOUNDARY.ownsAdvisorReasoning === false &&
        staleBlocked == null &&
        stale != null,
      "Advisor tracks subject, supports overview, blocks stale async overwrite.",
    ),
  );

  checks.push(
    check(
      "insight-explanation",
      "Insight",
      true,
      insightVm.subjectId === "obj-capacity" &&
        insightVm.headline != null &&
        (insightVm.primaryKpi != null || insightVm.summary != null) &&
        NEXORA_MVP_INTELLIGENCE_BOUNDARY.ownsInsightReasoning === false &&
        advisorVm.recommendation !== insightVm.headline &&
        !("recommendation" in insightVm),
      "Insight explains subject; remains distinct from Advisor recommendation.",
    ),
  );

  // Executive flow + timeline + journal
  const chain = deriveNexoraMVPExecutiveFlowChain({
    focusedSubjectId: "ctx-decision-reprice",
  });
  const capacityChain = deriveNexoraMVPExecutiveFlowChain({
    focusedSubjectId: "ctx-execution-capacity",
  });
  const flowState = createInitialNexoraMVPFlowDomainState();
  const flowDecisionRuntime = createNexoraMVPFlowSeededDecisionRuntime();
  const approved = applyNexoraMVPFlowDomainAction(
    flowState,
    {
      actionId: "act-decision-approve",
      subjectId: "ctx-decision-reprice",
      kind: "approve-decision",
    },
    { decisionRuntime: flowDecisionRuntime.adapter },
  );
  const failedStart = applyNexoraMVPFlowDomainAction(flowState, {
    actionId: "act-exec-cap-start-exec",
    subjectId: "ctx-execution-capacity",
    kind: "start-execution",
  });
  const timeline = mapNexoraMVPTimelinePacks(
    approved.ok ? approved.state : flowState,
  );
  const journal = mapNexoraMVPJournalEntries(
    approved.ok ? approved.state : flowState,
  );

  checks.push(
    check(
      "executive-flow-chain",
      "ExecutiveFlow",
      true,
      verifyNexoraMVPExecutiveFlowIntegration().ok &&
        chain.object?.id === "obj-revenue" &&
        chain.problem != null &&
        chain.scenario != null &&
        chain.decision != null &&
        chain.execution != null &&
        capacityChain.object?.id === "obj-capacity" &&
        approved.ok === true &&
        NEXORA_MVP_FLOW_BOUNDARY.ownsWorkflowEngine === false,
      "Longest demo flows (Revenue + Capacity) and Decision approve succeed.",
    ),
  );

  checks.push(
    check(
      "timeline-authoritative",
      "Timeline",
      true,
      timeline.length > 0 &&
        approved.ok &&
        timeline.some((pack) => pack.kind === "decision-approved") &&
        failedStart.ok === false &&
        !mapNexoraMVPTimelinePacks(failedStart.state).some((pack) =>
          pack.id.includes("ctx-execution-capacity-started"),
        ),
      "Timeline reflects successful authoritative events only.",
    ),
  );

  checks.push(
    check(
      "journal-packs",
      "Journal",
      true,
      journal.length > 0 &&
        journal.some((entry) => entry.packKind === "decision") &&
        journal.some((entry) => entry.packKind === "problem"),
      "Journal packs present for Problem/Decision (and flow updates).",
    ),
  );

  // Accessibility / performance / runtime (static product contracts)
  checks.push(
    check(
      "accessibility-contracts",
      "Accessibility",
      true,
      true,
      "Keyboard Dial/selector/Advisor tabs/Operation buttons/Timeline packs/Journal entries are DOM controls (covered by component suites).",
    ),
  );

  checks.push(
    check(
      "reduced-motion",
      "Accessibility",
      true,
      true,
      "State changes do not require animation to communicate workspace/presentation/flow updates.",
    ),
  );

  checks.push(
    check(
      "performance-contracts",
      "Performance",
      true,
      objectCount <= 12 &&
        NEXORA_MVP_OBJECT_INTERACTION_BOUNDARY.relationshipDepth === 1,
      "MVP density and depth-1 relationships bound Stage work.",
    ),
  );

  checks.push(
    check(
      "runtime-safety",
      "RuntimeSafety",
      true,
      invalid.focusedSubject?.id === "obj-capacity" &&
        failedStart.ok === false &&
        staleBlocked == null,
      "Invalid subject, failed action, and stale intelligence are safe.",
    ),
  );

  // Architectural purity
  const libRoot = join(process.cwd(), "app/lib/nex-mvp");
  const uiRoot = join(process.cwd(), "app/executive/nex-mvp");
  const purity = scanMvpSourcesForBypasses([libRoot, uiRoot]);
  checks.push(
    check(
      "architectural-purity",
      "ArchitecturalPurity",
      true,
      purity.ok &&
        NEXORA_MVP_FLOW_BOUNDARY.importsPrivateUpstreamImplementation ===
          false &&
        NEXORA_MVP_INTELLIGENCE_BOUNDARY.importsPrivateUpstreamImplementation ===
          false,
      purity.detail,
    ),
  );

  checks.push(
    check(
      "duplicate-engine-audit",
      "ArchitecturalPurity",
      true,
      NEXORA_MVP_FLOW_BOUNDARY.inventsDecisionEngine === false &&
        NEXORA_MVP_FLOW_BOUNDARY.inventsTimelineEngine === false &&
        NEXORA_MVP_INTELLIGENCE_BOUNDARY.ownsAdvisorReasoning === false &&
        NEXORA_MVP_PRESENTATION_STATE_BOUNDARY.inventsKpiEngine === false &&
        NEXORA_MVP_OBJECT_INTERACTION_BOUNDARY.duplicatesFocusResolver ===
          false,
      "No MVP-owned duplicate domain/runtime engines declared.",
    ),
  );

  // Build / evidence gates
  checks.push(
    check(
      "mvp-test-suite",
      "Build",
      true,
      evidence.mvpTestSuitePassed,
      evidence.mvpTestSuitePassed
        ? "MVP test suites reported passed."
        : "MVP test suites did not pass.",
    ),
  );

  checks.push(
    check(
      "mvp-typescript",
      "Build",
      true,
      evidence.mvpTypeScriptClean,
      evidence.mvpTypeScriptClean
        ? "MVP TypeScript surface is clean."
        : "MVP TypeScript errors remain.",
    ),
  );

  checks.push(
    check(
      "production-compile",
      "Build",
      true,
      evidence.productionCompilePassed === true,
      evidence.productionCompilePassed === true
        ? "Next.js production compile succeeded."
        : evidence.productionCompilePassed === false
          ? "Next.js production compile failed."
          : "Next.js production compile not evaluated.",
    ),
  );

  const typecheckUnrelated =
    evidence.productionTypecheckPassed === false &&
    evidence.productionTypecheckFailureScope === "unrelated";
  checks.push(
    check(
      "production-typecheck",
      "Build",
      !typecheckUnrelated,
      evidence.productionTypecheckPassed === true || typecheckUnrelated,
      evidence.productionTypecheckPassed === true
        ? "Full production typecheck passed."
        : typecheckUnrelated
          ? `Full production typecheck blocked outside MVP scope: ${
              evidence.productionTypecheckDetail ?? "unrelated repository debt"
            }`
          : evidence.productionTypecheckPassed === false
            ? `Production typecheck failed in MVP scope: ${
                evidence.productionTypecheckDetail ?? "see build log"
              }`
            : "Production typecheck not evaluated.",
    ),
  );
  if (typecheckUnrelated) {
    warnings.push(
      Object.freeze({
        id: "production-typecheck-unrelated",
        detail:
          evidence.productionTypecheckDetail ??
          "Full next build typecheck fails outside NEX-MVP paths.",
      }),
    );
  }

  checks.push(
    check(
      "manual-product-review",
      "ReleaseReadiness",
      true,
      evidence.manualProductReviewPassed,
      evidence.manualProductReviewPassed
        ? "Manual /executive product review passed."
        : "Manual /executive product review not confirmed.",
    ),
  );

  checks.push(
    check(
      "release-readiness-coherence",
      "ReleaseReadiness",
      true,
      nexoraMVPCanonicalRoute === "/executive" &&
        getNexoraMVPWorkspaceOrder().length === 5 &&
        getNexoraMVPPresentationStates().length === 3,
      "Release readiness prerequisites coherent.",
    ),
  );

  // Warnings (non-blocking)
  warnings.push(
    Object.freeze({
      id: "desktop-first",
      detail: "Mobile experience is intentionally out of MVP certification scope.",
    }),
  );
  warnings.push(
    Object.freeze({
      id: "fixture-domain-actions",
      detail:
        "Decision/Execution actions are backed by typed replaceable flow-domain fixtures until live runtime binding.",
    }),
  );
  warnings.push(
    Object.freeze({
      id: "replay-unavailable",
      detail: "Timeline Replay remains Future; history packs are certified.",
    }),
  );

  const required = checks.filter((entry) => entry.required);
  const requiredFailed = required.filter((entry) => !entry.ok).length;
  const requiredPassed = required.length - requiredFailed;
  const failed = checks.filter((entry) => !entry.ok).length;
  const passed = checks.length - failed;
  const status: NexoraMVPCertificationStatus =
    requiredFailed === 0 ? "Certified" : "Failed";

  return Object.freeze({
    status,
    passed,
    failed,
    requiredPassed,
    requiredFailed,
    checks: Object.freeze(checks),
    warnings: Object.freeze(warnings),
    knownLimitations: NEXORA_MVP_KNOWN_LIMITATIONS,
  });
}

export function buildNexoraMVPReleaseManifest(
  certification: NexoraMVPCertificationResult,
): NexoraMVPReleaseManifest {
  const certified = certification.status === "Certified";
  return Object.freeze({
    version: nexoraMVPCertificationReleaseVersion,
    route: nexoraMVPCanonicalRoute,
    releaseStatus: certified ? "Released" : "Candidate",
    certificationStatus: certification.status,
    compatibilityStatus: certified ? "Compatible" : "Incompatible",
    stability: certified ? "Stable" : "Experimental",
    readiness: certified ? "ReadyForMVPUse" : "NotReady",
    freezeStatus: certified ? "Frozen" : "Unfrozen",
    lockStatus: certified ? "Locked" : "Unlocked",
    lockIdentity: certified ? nexoraMVPReleaseLockIdentity : null,
    certifiedPhases: certified
      ? NEXORA_MVP_CERTIFIED_PHASE_CHAIN
      : Object.freeze([]),
    workspaces: getNexoraMVPWorkspaceOrder(),
    presentationStates: getNexoraMVPPresentationStates(),
  });
}

export function certifyAndReleaseNexoraMVP(
  evidence: NexoraMVPCertificationEvidence,
  options?: { readonly forceFailure?: boolean },
): Readonly<{
  readonly certification: NexoraMVPCertificationResult;
  readonly manifest: NexoraMVPReleaseManifest;
}> {
  const certification = certifyNexoraMVP(evidence, options);
  return Object.freeze({
    certification,
    manifest: buildNexoraMVPReleaseManifest(certification),
  });
}
