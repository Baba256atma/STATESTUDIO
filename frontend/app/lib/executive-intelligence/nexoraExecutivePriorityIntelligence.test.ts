/**
 * CORE-INT:4 — Executive Priority Intelligence invariants A–Y.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { executeNexoraConversationalExperience } from "../conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "../conversational-control/conversationalSubjectRegistry.ts";
import {
  deriveNexoraMVPExecutiveIntelligenceContext,
  resolveNexoraMVPExecutiveIntelligence,
} from "../nex-mvp/nexoraMVPExecutiveIntelligence.ts";
import { composeNexoraProfessionalAdvisorPresentation } from "../nex-mvp/nexoraMVPProfessionalAdvisorPresentation.ts";
import {
  classifyNexoraExiUtterance,
  composeNexoraExecutiveIntelligenceExperience,
  projectNexoraExiConversationalAnswers,
} from "../nex-mvp/nexoraExecutiveIntelligenceExperience.ts";
import {
  buildNexoraMVPAdvisorContextBridge,
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
  type NexoraMVPObjectInteractionState,
} from "../nex-mvp/nexoraMVPObjectInteraction.ts";
import { deriveNexoraMVPPresentationViewModel } from "../nex-mvp/nexoraMVPPresentationState.ts";
import { applyExecutiveFocusVisualGrammarToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveFocusVisualGrammar.ts";
import { applyExecutiveNetworkTopologyToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveNetworkTopology.ts";
import { applyExecutivePresentationPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutivePresentationPlane.ts";
import { applyExecutiveStage2DTopologyPlaneToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyPlane.ts";
import { applyExecutiveStage2DTopologyRecompositionToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DTopologyRecomposition.ts";
import { applyExecutiveStageFixedCameraToStagePresentation } from "../nex-mvp/nexoraMVPExecutiveStage2DFixedCamera.ts";
import { EXECUTIVE_STAGE_2D_CENTER } from "../spatial-presentation/executiveStage2DFixedCamera.ts";
import { rankExecutiveCollectionMembers } from "../spatial-presentation/executiveStageQueueFoundation.ts";
import { livePriorityOrderedIdsForCollection } from "../nex-mvp/nexoraLiveEpistemicProjection.ts";
import { nexoraExecutiveShellVersion } from "../nex-mvp/nexoraExecutiveShell.ts";
import {
  getNexoraManagerMvpReleaseBaselineIdentity,
  nexoraManagerMvpReleaseBaselineIdentity,
} from "../nex-mvp/nexoraManagerMvpReleaseBaseline.ts";
import { createPriorityFactor } from "./scenarioPriorityTradeoffIntelligence.ts";
import {
  EXECUTIVE_PRIORITY_BOUNDARY,
  nexoraExecutivePriorityIntelligenceIdentity,
  presentPriorityAssessment,
  presentSecondPriority,
  presentWhyAOverB,
  projectExecutivePriorityIntelligence,
  resolvePriorityEligibleKind,
  type ExecutivePriorityCandidateSource,
} from "./nexoraExecutivePriorityIntelligence.ts";
import { nexoraSharedEpistemicFoundationIdentity } from "./nexoraSharedEpistemicFoundation.ts";
import { nexoraGroundedCausalConstraintIntelligenceIdentity } from "./nexoraGroundedCausalConstraintIntelligence.ts";

const here = dirname(fileURLToPath(import.meta.url));

function selectSubject(
  state: NexoraMVPObjectInteractionState,
  subjectId: string | null,
): NexoraMVPObjectInteractionState {
  const next = selectNexoraMVPInteractionSubject(state, subjectId);
  return syncNexoraMVPObjectInteractionShellContext(next, {
    workspace: next.workspace,
    presentationState: "minimum",
    environmentIntent: next.environmentIntent,
  });
}

function pipeline(subjectId: string | null) {
  let state = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  if (subjectId != null) state = selectSubject(state, subjectId);
  const base = deriveNexoraMVPStageInteractionPresentation(state);
  const withGrammar = applyExecutiveFocusVisualGrammarToStagePresentation(base, {
    presentationDepth: "minimum",
  });
  const withNetwork = applyExecutiveNetworkTopologyToStagePresentation(withGrammar);
  const withPlane = applyExecutivePresentationPlaneToStagePresentation(withNetwork);
  const withFlat = applyExecutiveStage2DTopologyPlaneToStagePresentation(withPlane);
  const withRecomposition =
    applyExecutiveStage2DTopologyRecompositionToStagePresentation(withFlat);
  const presentation =
    applyExecutiveStageFixedCameraToStagePresentation(withRecomposition);
  const advisorBridge = buildNexoraMVPAdvisorContextBridge(state, presentation);
  const presentationViewModel = deriveNexoraMVPPresentationViewModel({
    presentationState: state.presentationState,
    workspace: state.workspace,
    environmentIntent: state.environmentIntent,
    subjectId: state.focusedSubject?.id ?? null,
    subjectKind: state.focusedSubject?.kind ?? null,
    subjectLabel: state.focusedSubject?.label ?? null,
  });
  const intelligenceContext = deriveNexoraMVPExecutiveIntelligenceContext({
    advisorBridge,
    presentationViewModel,
    focusedSubject: state.focusedSubject,
    selectedSubject: state.selectedSubject,
    breadcrumb: advisorBridge.breadcrumb,
  });
  const resolution = resolveNexoraMVPExecutiveIntelligence(intelligenceContext);
  const narrative = composeNexoraProfessionalAdvisorPresentation({
    advisor: resolution.advisor,
    insight: resolution.insight,
    intelligence: intelligenceContext,
    advisorBridge,
    nextBestAction: advisorBridge.nextBestAction,
    decisionBrief: advisorBridge.decisionBrief,
    decisionMemory: advisorBridge.decisionMemory,
  });
  const experience = composeNexoraExecutiveIntelligenceExperience({
    narrative,
    presentationMode: advisorBridge.presentationMode,
    liveOutcomeAvailable: false,
    liveLearningAvailable: false,
    cc11Live: false,
  });
  return Object.freeze({ state, presentation, advisorBridge, narrative, experience });
}

function ask(
  pack: ReturnType<typeof pipeline>,
  utterance: string,
  previousUtterance?: string,
) {
  return executeNexoraConversationalExperience({
    utterance,
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: pack.state,
    previousUtterance,
    advisorGrounding: Object.freeze({
      isOverview: pack.experience.isOverview,
      currentSubjectId: pack.experience.subjectId,
      currentSubjectLabel: pack.experience.subjectLabel,
      attentionSubjectId: pack.experience.attentionSubjectId,
      attentionSubjectLabel: pack.narrative.attentionSubjectLabel,
      attentionReason: pack.narrative.attentionReason,
      situation: pack.experience.situation.statement,
      whyItMatters: pack.experience.significance.statement,
      recommendation: pack.narrative.recommendation,
      noRecommendationReason: pack.narrative.noRecommendationReason,
      primaryActionLabel: pack.narrative.primaryAction?.label ?? null,
      evidenceState: pack.narrative.evidenceState,
      evidenceSummary: pack.narrative.evidenceSummary,
      recommendationAuthority: pack.narrative.recommendationAuthority,
      experienceAnswers: projectNexoraExiConversationalAnswers(pack.experience),
    }),
  });
}

function source(
  input: Partial<ExecutivePriorityCandidateSource> &
    Pick<ExecutivePriorityCandidateSource, "subjectId" | "subjectLabel" | "eligibleKind">,
): ExecutivePriorityCandidateSource {
  return {
    subjectKind: input.subjectKind ?? input.eligibleKind,
    attention: input.attention ?? "normal",
    status: input.status ?? "stable",
    recordedConstraintCount: input.recordedConstraintCount ?? 0,
    downstreamCount: input.downstreamCount ?? 0,
    linkedDecision: input.linkedDecision ?? false,
    evidenceConfidence: input.evidenceConfidence ?? "medium",
    evidenceRefs: input.evidenceRefs ?? [
      {
        sourceKind: "relationship",
        sourceId: input.subjectId,
        subjectId: input.subjectId,
        factKey: input.eligibleKind,
      },
    ],
    provenanceRefs: input.provenanceRefs ?? [`test:${input.subjectId}`],
    additionalFactors: input.additionalFactors,
    ...input,
  };
}

function highUrgency(subjectId: string, reason: string) {
  return createPriorityFactor({
    factorId: `${subjectId}:urgency`,
    dimension: "urgency",
    level: "high",
    effect: "raises",
    reason,
    evidenceRefs: [
      {
        sourceKind: "relationship",
        sourceId: `${subjectId}:deadline`,
        subjectId,
        factKey: "urgency",
      },
    ],
    assumptionRefs: [`test:urgency:${subjectId}`],
  });
}

test("CORE-INT:4 identity reuses EI:4 priority without trade-off wiring", () => {
  assert.equal(
    nexoraExecutivePriorityIntelligenceIdentity,
    "CORE-INT:4/ExecutivePriorityIntelligence",
  );
  assert.equal(EXECUTIVE_PRIORITY_BOUNDARY.epistemicAuthority, nexoraSharedEpistemicFoundationIdentity);
  assert.equal(
    EXECUTIVE_PRIORITY_BOUNDARY.causalConstraintAuthority,
    nexoraGroundedCausalConstraintIntelligenceIdentity,
  );
  assert.equal(EXECUTIVE_PRIORITY_BOUNDARY.reusesEi4Tradeoffs, false);
  assert.equal(EXECUTIVE_PRIORITY_BOUNDARY.wiresEi4Runtime, false);
  assert.equal(EXECUTIVE_PRIORITY_BOUNDARY.startsExi4, false);
  assert.equal(EXECUTIVE_PRIORITY_BOUNDARY.usesLlm, false);
  assert.equal(EXECUTIVE_PRIORITY_BOUNDARY.inventsNumericScore, false);
});

test("A — Attention ≠ Priority", () => {
  const projected = projectExecutivePriorityIntelligence({
    scopeId: "workspace",
    attentionSubjectId: "obj-risk",
    sources: [
      source({
        subjectId: "obj-risk",
        subjectLabel: "Risk",
        eligibleKind: "risk",
        attention: "critical",
        status: "risk",
      }),
      source({
        subjectId: "ctx-problem-capacity",
        subjectLabel: "Capacity Gap",
        eligibleKind: "problem",
        attention: "important",
        status: "watch",
        recordedConstraintCount: 1,
      }),
    ],
  });
  assert.equal(projected.attentionSubjectId, "obj-risk");
  assert.equal(projected.topPriority, null);
});

test("B — Severity ≠ Priority", () => {
  const projected = projectExecutivePriorityIntelligence({
    scopeId: "problems",
    sources: [
      source({
        subjectId: "ctx-problem-margin",
        subjectLabel: "Margin Pressure",
        eligibleKind: "problem",
        status: "risk",
        attention: "critical",
      }),
      source({
        subjectId: "ctx-problem-capacity",
        subjectLabel: "Capacity Gap",
        eligibleKind: "problem",
        status: "watch",
        attention: "important",
      }),
    ],
  });
  assert.equal(projected.topPriority, null);
});

test("C — Urgency ≠ Priority", () => {
  assert.equal(EXECUTIVE_PRIORITY_BOUNDARY.urgencyEqualsPriority, false);
  const live = pipeline(null);
  assert.ok(
    live.experience.corePriorityAssessment.candidates.every(
      (entry) => entry.urgency === "missing",
    ),
  );
});

test("D — Candidate scope", () => {
  const problems = projectExecutivePriorityIntelligence({
    scopeId: "problems",
    sources: [
      source({ subjectId: "ctx-problem-margin", subjectLabel: "Margin Pressure", eligibleKind: "problem" }),
      source({ subjectId: "ctx-problem-capacity", subjectLabel: "Capacity Gap", eligibleKind: "problem" }),
      source({ subjectId: "ctx-decision-reprice", subjectLabel: "Approve Repricing", eligibleKind: "decision" }),
    ],
  });
  assert.equal(problems.scopeId, "problems");
  const live = pipeline("ctx-problem-capacity");
  assert.equal(live.experience.corePriorityAssessment.scopeId, "problems");
  assert.ok(
    live.experience.corePriorityAssessment.candidates.every(
      (entry) => entry.eligibleKind === "problem",
    ),
  );
});

test("E — Eligibility excludes decorative subjects", () => {
  assert.equal(resolvePriorityEligibleKind("object", "Capacity", "obj-capacity"), null);
  assert.equal(resolvePriorityEligibleKind("scenario", "Pricing Response", "ctx-scenario-pricing"), null);
  assert.equal(resolvePriorityEligibleKind("execution", "Capacity Expansion", "ctx-execution-capacity"), null);
  assert.equal(resolvePriorityEligibleKind("object", "Risk", "obj-risk"), "risk");
  const live = pipeline(null);
  assert.ok(
    live.experience.corePriorityAssessment.candidates.every(
      (entry) =>
        entry.eligibleKind === "problem" ||
        entry.eligibleKind === "risk" ||
        entry.eligibleKind === "decision",
    ),
  );
  assert.ok(
    !live.experience.corePriorityAssessment.candidates.some(
      (entry) => entry.subjectId === "obj-capacity" || entry.subjectId === "obj-inventory",
    ),
  );
});

test("F — Explainability", () => {
  const ranked = projectExecutivePriorityIntelligence({
    scopeId: "problems",
    sources: [
      source({
        subjectId: "ctx-problem-margin",
        subjectLabel: "Margin Pressure",
        eligibleKind: "problem",
        additionalFactors: [highUrgency("ctx-problem-margin", "A recorded decision deadline is pending.")],
      }),
      source({
        subjectId: "ctx-problem-capacity",
        subjectLabel: "Capacity Gap",
        eligibleKind: "problem",
        recordedConstraintCount: 1,
      }),
    ],
  });
  assert.ok(ranked.topPriority);
  assert.ok(ranked.topPriority.rationale.length > 0);
});

test("G — Evidence", () => {
  const live = pipeline(null);
  for (const candidate of live.experience.corePriorityAssessment.candidates) {
    for (const factor of candidate.factors) {
      if (factor.level !== "unknown") {
        assert.ok(factor.evidenceRefs.length + factor.assumptionRefs.length > 0);
      }
    }
  }
});

test("H — Confidence bounded", () => {
  const live = pipeline(null);
  assert.ok(
    live.experience.corePriorityAssessment.confidence === "medium" ||
      live.experience.corePriorityAssessment.confidence === "low" ||
      live.experience.corePriorityAssessment.confidence === "unknown",
  );
  assert.notEqual(live.experience.corePriorityAssessment.confidence, "high");
});

test("I — No invented score", () => {
  const live = pipeline(null);
  assert.ok(
    live.experience.corePriorityAssessment.orderedCandidates.every(
      (entry) => entry.numericalScore === null,
    ),
  );
});

test("J — Tie", () => {
  const projected = projectExecutivePriorityIntelligence({
    scopeId: "problems",
    sources: [
      source({ subjectId: "a", subjectLabel: "Problem A", eligibleKind: "problem", status: "risk" }),
      source({ subjectId: "b", subjectLabel: "Problem B", eligibleKind: "problem", status: "risk" }),
    ],
  });
  assert.equal(projected.topPriority, null);
  assert.match(presentPriorityAssessment(projected), /cannot confidently distinguish|not sufficient to prioritize/i);
});

test("K — No evidence means no top priority", () => {
  const decisions = pipeline("ctx-decision-capacity");
  assert.equal(decisions.experience.corePriorityAssessment.scopeId, "decisions");
  assert.equal(decisions.experience.corePriorityAssessment.topPriority, null);
  assert.match(
    decisions.experience.priority.statement ?? "",
    /not sufficient to prioritize/i,
  );
});

test("L — Constraint input is grounded only", () => {
  const live = pipeline("ctx-problem-capacity");
  const gap = live.experience.corePriorityAssessment.candidates.find(
    (entry) => entry.subjectId === "ctx-problem-capacity",
  );
  assert.ok(gap);
  assert.ok(gap.constraintPressure >= 0);
  assert.equal(live.experience.coreConstraintAssessment.identity, nexoraGroundedCausalConstraintIntelligenceIdentity);
});

test("M — Binding ≠ Priority", () => {
  assert.equal(EXECUTIVE_PRIORITY_BOUNDARY.bindingEqualsPriority, false);
  const live = pipeline("obj-capacity");
  assert.equal(live.experience.coreConstraintAssessment.bindingConstraint, null);
});

test("N — Cause ≠ Priority", () => {
  assert.equal(EXECUTIVE_PRIORITY_BOUNDARY.causeEqualsPriority, false);
  const live = pipeline("obj-capacity");
  assert.ok(live.experience.coreCausalAssessment.contributors.length >= 1);
  assert.equal(live.experience.coreCausalAssessment.rootCause, null);
  assert.equal(live.experience.coreCausalAssessment.primaryContributor, null);
});

test("O — Recommendation ≠ Priority", () => {
  assert.equal(EXECUTIVE_PRIORITY_BOUNDARY.recommendationEqualsPriority, false);
  const live = pipeline("obj-capacity");
  assert.ok(live.experience.recommendation.statement || live.narrative.noRecommendationReason);
  assert.notEqual(
    live.experience.corePriorityAssessment.topPriority?.subjectId,
    live.experience.subjectId,
  );
});

test("P — NBA ≠ Priority", () => {
  assert.equal(EXECUTIVE_PRIORITY_BOUNDARY.nbaEqualsPriority, false);
  const live = pipeline(null);
  assert.notEqual(live.experience.corePriorityAssessment.identity, "STAGE-PROD:3");
});

test("Q — Queue reads Core when ranked", () => {
  const subjects = [
    { subjectId: "b", label: "B", attention: "critical", status: "risk" },
    { subjectId: "a", label: "A", attention: "normal", status: "stable" },
  ];
  const without = rankExecutiveCollectionMembers({
    subjects,
    objectIds: ["a", "b"],
  });
  assert.equal(without.rankedIds[0], "b");
  const withCore = rankExecutiveCollectionMembers({
    subjects,
    objectIds: ["a", "b"],
    priorityOrderedIds: ["a", "b"],
  });
  assert.equal(withCore.rankedIds[0], "a");
  const liveProblems = livePriorityOrderedIdsForCollection("problem");
  assert.ok(liveProblems);
  assert.equal(liveProblems[0], "ctx-problem-capacity");
  assert.equal(livePriorityOrderedIdsForCollection("decision"), null);
});

test("R — EXI reads Core", () => {
  const live = pipeline(null);
  assert.equal(
    live.experience.corePriorityAssessment.identity,
    nexoraExecutivePriorityIntelligenceIdentity,
  );
  assert.equal(
    live.experience.priority.statement,
    presentPriorityAssessment(live.experience.corePriorityAssessment),
  );
});

test("S — EXI cannot override", () => {
  const composer = readFileSync(
    join(here, "../nex-mvp/nexoraExecutiveIntelligenceExperience.ts"),
    "utf8",
  );
  assert.match(composer, /projectNexoraLiveExecutivePriorityIntelligence/);
  assert.doesNotMatch(composer, /topPriority\s*=\s*attentionSubjectId/);
  const live = pipeline(null);
  assert.notEqual(
    live.experience.corePriorityAssessment.topPriority?.subjectId ?? null,
    live.narrative.attentionSubjectId,
  );
});

test("T — Conversation parity", () => {
  const pack = pipeline(null);
  const answers = projectNexoraExiConversationalAnswers(pack.experience);
  const asked = ask(pack, "What matters most right now?");
  assert.ok(asked.response.includes(answers.priority.slice(0, 40)));
  assert.equal(asked.shouldCommitRuntime, false);
});

test("U — Follow-up comparison", () => {
  const pack = pipeline(null);
  const first = ask(pack, "What matters most right now?");
  const why = ask(pack, "Why?", "What matters most right now?");
  const compare = ask(
    pack,
    "Why this instead of the other problem?",
    "Why?",
  );
  assert.match(first.response, /attention|prioritize|priority/i);
  assert.ok(why.response.length > 8);
  assert.match(compare.response, /evidence|distinguish|scope|priority/i);
});

test("V — Focus safety", () => {
  const pack = pipeline("obj-capacity");
  const before = pack.state.focusedSubject?.id;
  const result = ask(pack, "What matters most right now?");
  assert.equal(pack.state.focusedSubject?.id, before);
  assert.equal(result.shouldCommitRuntime, false);
  const focused = pack.presentation.scene.objects.find((object) => object.focused);
  assert.ok(focused);
  assert.equal(focused.targetPosition[2], 0);
  assert.equal(focused.targetPosition[0], EXECUTIVE_STAGE_2D_CENTER.x);
});

test("W — Decision safety", () => {
  const pack = pipeline("ctx-decision-capacity");
  const result = ask(pack, "What matters most right now?");
  assert.equal(EXECUTIVE_PRIORITY_BOUNDARY.mutatesDecision, false);
  assert.equal(result.shouldCommitRuntime, false);
  assert.doesNotMatch(result.response, /committed|approved/i);
});

test("X — APP-4 safety", () => {
  assert.equal(EXECUTIVE_PRIORITY_BOUNDARY.writesMemory, false);
  const pack = pipeline(null);
  assert.equal(pack.experience.corePriorityAssessment.writesMemory, false);
});

test("Y — Frozen MVP", () => {
  const identity = getNexoraManagerMvpReleaseBaselineIdentity();
  assert.equal(nexoraManagerMvpReleaseBaselineIdentity, "MVP:1/NexoraManagerMVPReleaseBaseline");
  assert.equal(identity.version, "1.2.0");
  assert.equal(identity.version, nexoraExecutiveShellVersion);
  const pack = pipeline(null);
  assert.equal(pack.experience.identity, "EXI:1/NexoraExecutiveIntelligenceExperience");
});

test("Live — workspace comparison is grounded and distinct from attention", () => {
  const pack = pipeline(null);
  assert.ok(pack.experience.corePriorityAssessment.candidates.length >= 2);
  assert.equal(
    pack.experience.corePriorityAssessment.topPriority?.subjectId,
    "ctx-problem-capacity",
  );
  assert.ok(pack.narrative.attentionSubjectId);
  assert.notEqual(
    pack.experience.corePriorityAssessment.topPriority?.subjectId,
    pack.narrative.attentionSubjectId,
  );
});

test("Live conversation chain", () => {
  assert.equal(classifyNexoraExiUtterance("What matters most right now?"), "priority");
  assert.equal(classifyNexoraExiUtterance("What should I deal with first?"), "priority");
  assert.equal(classifyNexoraExiUtterance("Why?"), "whyPriority");
  assert.equal(classifyNexoraExiUtterance("Why this instead of the other problem?"), "comparePriority");
  assert.equal(classifyNexoraExiUtterance("What is second priority?"), "secondPriority");
  const pack = pipeline(null);
  const focus = pack.state.focusedSubject?.id ?? null;
  const first = ask(pack, "What matters most right now?");
  const why = ask(pack, "Why?", "What matters most right now?");
  const compare = ask(pack, "Why this instead of the other problem?", "Why?");
  const second = ask(pack, "What is second priority?", "Why this instead of the other problem?");
  const sure = ask(pack, "How sure are you?", "What is second priority?");
  const evidence = ask(pack, "What evidence supports that?", "How sure are you?");
  const insufficient = ask(pack, "What if the evidence is insufficient?", "What evidence supports that?");
  assert.equal(pack.state.focusedSubject?.id ?? null, focus);
  assert.equal(first.shouldCommitRuntime, false);
  assert.match(presentSecondPriority(pack.experience.corePriorityAssessment), /no first priority|second priority/i);
  assert.match(sure.response, /Evidence limited|not stronger than the current evidence/i);
  assert.ok(evidence.response.length > 8);
  assert.match(insufficient.response, /does not force a ranking|insufficient/i);
  assert.ok(why.response.length > 8);
  assert.ok(compare.response.length > 8);
  assert.ok(second.response.length > 8);
});

test("Ranked comparator can produce first and second without numeric scores", () => {
  const ranked = projectExecutivePriorityIntelligence({
    scopeId: "problems",
    sources: [
      source({
        subjectId: "ctx-problem-margin",
        subjectLabel: "Margin Pressure",
        eligibleKind: "problem",
        additionalFactors: [highUrgency("ctx-problem-margin", "A recorded decision deadline is pending.")],
      }),
      source({
        subjectId: "ctx-problem-capacity",
        subjectLabel: "Capacity Gap",
        eligibleKind: "problem",
        additionalFactors: [
          createPriorityFactor({
            factorId: "cap:urgency",
            dimension: "urgency",
            level: "medium",
            effect: "raises",
            reason: "Capacity pressure is recorded but not time-bound.",
            evidenceRefs: [
              {
                sourceKind: "relationship",
                sourceId: "cap:urgency",
                subjectId: "ctx-problem-capacity",
                factKey: "urgency",
              },
            ],
            assumptionRefs: ["test:urgency:cap"],
          }),
        ],
      }),
    ],
  });
  assert.equal(ranked.topPriority?.subjectId, "ctx-problem-margin");
  assert.equal(ranked.secondPriority?.subjectId, "ctx-problem-capacity");
  assert.equal(ranked.topPriority?.numericalScore, null);
  assert.match(
    presentWhyAOverB(ranked, "Margin Pressure", "Capacity Gap"),
    /Margin Pressure/,
  );
});

test("CORE-INT:4 live collector does not construct EI:4 trade-off traces", () => {
  const live = readFileSync(join(here, "../nex-mvp/nexoraLiveEpistemicProjection.ts"), "utf8");
  const composer = readFileSync(
    join(here, "../nex-mvp/nexoraExecutiveIntelligenceExperience.ts"),
    "utf8",
  );
  assert.doesNotMatch(live, /createScenarioPriorityTradeoffTrace|resolveExplainablePriority/);
  assert.doesNotMatch(composer, /createScenarioPriorityTradeoffTrace|resolveExplainablePriority/);
  assert.doesNotMatch(live, /createExecutiveClaim\(/);
});
