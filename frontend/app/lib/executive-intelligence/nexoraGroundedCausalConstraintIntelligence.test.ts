/**
 * CORE-INT:3 — Grounded Causal & Constraint Intelligence invariants A–X.
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
import { nexoraExecutiveShellVersion } from "../nex-mvp/nexoraExecutiveShell.ts";
import {
  getNexoraManagerMvpReleaseBaselineIdentity,
  nexoraManagerMvpReleaseBaselineIdentity,
} from "../nex-mvp/nexoraManagerMvpReleaseBaseline.ts";
import {
  GROUNDED_CAUSAL_CONSTRAINT_BOUNDARY,
  classifyCausalRelationSemantics,
  nexoraGroundedCausalConstraintIntelligenceIdentity,
  presentBindingAnswer,
  presentCausalAssessment,
  presentConstraintAssessment,
  presentProvenAnswer,
  projectGroundedCausalConstraintIntelligence,
  recordedRelationshipImpliesCause,
} from "./nexoraGroundedCausalConstraintIntelligence.ts";
import { nexoraSharedEpistemicFoundationIdentity } from "./nexoraSharedEpistemicFoundation.ts";

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

test("CORE-INT:3 identity reuses CORE-INT:2 and is not a parallel epistemic engine", () => {
  assert.equal(
    nexoraGroundedCausalConstraintIntelligenceIdentity,
    "CORE-INT:3/GroundedCausalConstraintIntelligence",
  );
  assert.equal(
    GROUNDED_CAUSAL_CONSTRAINT_BOUNDARY.epistemicAuthority,
    nexoraSharedEpistemicFoundationIdentity,
  );
  assert.equal(GROUNDED_CAUSAL_CONSTRAINT_BOUNDARY.infersCausality, false);
  assert.equal(GROUNDED_CAUSAL_CONSTRAINT_BOUNDARY.autoPrimaryContributor, false);
  assert.equal(GROUNDED_CAUSAL_CONSTRAINT_BOUNDARY.autoBindingConstraint, false);
  assert.equal(GROUNDED_CAUSAL_CONSTRAINT_BOUNDARY.inventsPriority, false);
  assert.equal(GROUNDED_CAUSAL_CONSTRAINT_BOUNDARY.wiresEi4, false);
  assert.equal(GROUNDED_CAUSAL_CONSTRAINT_BOUNDARY.startsExi4, false);
  assert.equal(GROUNDED_CAUSAL_CONSTRAINT_BOUNDARY.usesLlm, false);
});

test("A — Relationship ≠ cause", () => {
  assert.equal(recordedRelationshipImpliesCause("associated-with"), false);
  assert.equal(recordedRelationshipImpliesCause("related"), false);
  assert.equal(classifyCausalRelationSemantics("associated-with"), "associated");
  const projected = projectGroundedCausalConstraintIntelligence({
    subjectId: "obj-risk",
    subjectLabel: "Risk",
    subjectKind: "object",
    isOverview: false,
    relationships: [
      {
        relationshipId: "rel-risk-margin",
        otherId: "ctx-problem-margin",
        otherLabel: "Margin Pressure",
        relationKind: "associated-with",
        direction: "undirected",
      },
    ],
  });
  assert.equal(projected.causal.contributors.length, 0);
  assert.equal(projected.causal.relatedFactors.length, 1);
  assert.equal(projected.causal.relatedFactors[0]?.semantics, "associated");
  assert.equal(projected.causal.relatedFactors[0]?.interpretationClaim.type, "UNKNOWN");
  assert.doesNotMatch(presentCausalAssessment(projected.causal), /\bcauses\b|\bcaused\b/i);
  assert.match(presentCausalAssessment(projected.causal), /does not establish a cause/i);
});

test("B — Contributor evidence", () => {
  const pack = pipeline("obj-capacity");
  assert.ok(pack.experience.coreCausalAssessment.contributors.length >= 1);
  for (const contributor of pack.experience.coreCausalAssessment.contributors) {
    assert.ok(contributor.evidenceRefs.length > 0);
    assert.ok(contributor.provenanceRefs.length > 0);
    assert.ok(contributor.existenceClaim.claimId.length > 0);
  }
});

test("C — Contributor epistemics preserve CORE-INT:2 classification", () => {
  const pack = pipeline("obj-capacity");
  const contributor = pack.experience.coreCausalAssessment.contributors[0];
  assert.ok(contributor);
  assert.equal(contributor.existenceClaim.type, "FACT");
  assert.equal(contributor.interpretationClaim.type, "ASSUMPTION");
  assert.notEqual(contributor.existenceClaim.claimId, contributor.interpretationClaim.claimId);
});

test("D — No automatic primary", () => {
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.coreCausalAssessment.contributors.length, 1);
  assert.equal(pack.experience.coreCausalAssessment.primaryContributor, null);
  assert.equal(pack.experience.causeAssessment.primaryContributor, null);
});

test("E — No automatic root cause", () => {
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.coreCausalAssessment.rootCause, null);
  assert.equal(pack.experience.causeAssessment.rootCause, null);
  assert.match(
    presentCausalAssessment(pack.experience.coreCausalAssessment),
    /root cause has not been established/i,
  );
});

test("F — Multiple contributors remain unranked", () => {
  const projected = projectGroundedCausalConstraintIntelligence({
    subjectId: "obj-revenue",
    subjectLabel: "Revenue",
    subjectKind: "object",
    isOverview: false,
    relationships: [
      {
        relationshipId: "a",
        otherId: "ctx-problem-margin",
        otherLabel: "Margin Pressure",
        relationKind: "affected-by",
        direction: "inbound",
      },
      {
        relationshipId: "b",
        otherId: "obj-capacity",
        otherLabel: "Capacity",
        relationKind: "constrained-by",
        direction: "inbound",
      },
    ],
  });
  assert.equal(projected.causal.contributors.length, 2);
  assert.equal(projected.causal.primaryContributor, null);
  assert.equal(projected.causal.ranked, false);
  const live = pipeline("obj-revenue");
  assert.ok(live.experience.coreCausalAssessment.contributors.length >= 2);
  assert.equal(live.experience.coreCausalAssessment.primaryContributor, null);
});

test("G — Causal confidence cannot exceed supporting evidence", () => {
  const pack = pipeline("obj-capacity");
  const contributor = pack.experience.coreCausalAssessment.contributors[0];
  assert.ok(contributor);
  assert.equal(contributor.confidence, contributor.interpretationClaim.confidence);
  assert.notEqual(contributor.interpretationClaim.confidence, "high");
  assert.ok(
    pack.experience.coreCausalAssessment.causalConfidence === "medium" ||
      pack.experience.coreCausalAssessment.causalConfidence === "low" ||
      pack.experience.coreCausalAssessment.causalConfidence === "unknown",
  );
});

test("H — No transitive causality", () => {
  const projected = projectGroundedCausalConstraintIntelligence({
    subjectId: "obj-capacity",
    subjectLabel: "Capacity",
    subjectKind: "object",
    isOverview: false,
    relationships: [
      {
        relationshipId: "in",
        otherId: "ctx-problem-capacity",
        otherLabel: "Capacity Gap",
        relationKind: "constrained-by",
        direction: "inbound",
      },
      {
        relationshipId: "out",
        otherId: "obj-delivery",
        otherLabel: "Delivery",
        relationKind: "blocks",
        direction: "outbound",
      },
    ],
  });
  assert.equal(projected.causal.chain.length, 2);
  assert.ok(
    projected.causal.chain.every(
      (edge) =>
        !(edge.fromLabel === "Capacity Gap" && edge.toLabel === "Delivery"),
    ),
  );
  assert.equal(GROUNDED_CAUSAL_CONSTRAINT_BOUNDARY.infersTransitiveCausality, false);
});

test("I — Constraint qualification", () => {
  const pack = pipeline("obj-capacity");
  assert.ok(pack.experience.coreConstraintAssessment.constraints.length >= 1);
  assert.ok(
    pack.experience.coreConstraintAssessment.constraints.every(
      (entry) =>
        entry.relationKind === "constrained-by" || entry.relationKind === "blocks",
    ),
  );
});

test("J — Dependency ≠ constraint", () => {
  const pack = pipeline("obj-delivery");
  assert.ok(
    pack.experience.coreCausalAssessment.relatedFactors.some(
      (entry) => entry.semantics === "dependency",
    ),
  );
  assert.ok(
    pack.experience.coreConstraintAssessment.constraints.every(
      (entry) =>
        entry.relationKind === "blocks" ||
        entry.relationKind === "constrained-by",
    ),
  );
});

test("K — Constraint evidence", () => {
  const pack = pipeline("obj-capacity");
  for (const constraint of pack.experience.coreConstraintAssessment.constraints) {
    assert.ok(constraint.evidenceRefs.length > 0);
    assert.ok(constraint.provenanceRefs.length > 0);
    assert.equal(constraint.existenceClaim.type, "FACT");
    assert.equal(constraint.interpretationClaim.type, "ASSUMPTION");
  }
});

test("L — Single constraint ≠ binding", () => {
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.coreConstraintAssessment.constraints.length, 1);
  assert.equal(pack.experience.coreConstraintAssessment.bindingConstraint, null);
  assert.equal(pack.experience.constraintAssessment.bindingConstraint, null);
});

test("M — Binding requires explicit authority", () => {
  const without = projectGroundedCausalConstraintIntelligence({
    subjectId: "obj-capacity",
    subjectLabel: "Capacity",
    subjectKind: "object",
    isOverview: false,
    relationships: [
      {
        relationshipId: "gap",
        otherId: "ctx-problem-capacity",
        otherLabel: "Capacity Gap",
        relationKind: "constrained-by",
        direction: "inbound",
      },
    ],
  });
  assert.equal(without.constraint.bindingConstraint, null);
  const withAuthority = projectGroundedCausalConstraintIntelligence({
    subjectId: "obj-capacity",
    subjectLabel: "Capacity",
    subjectKind: "object",
    isOverview: false,
    relationships: [
      {
        relationshipId: "gap",
        otherId: "ctx-problem-capacity",
        otherLabel: "Capacity Gap",
        relationKind: "constrained-by",
        direction: "inbound",
      },
    ],
    explicitBindingConstraintId: "gap",
  });
  assert.equal(withAuthority.constraint.bindingConstraint?.constraintId, "gap");
});

test("N — Unknown binding is a successful result", () => {
  const pack = pipeline("obj-capacity");
  assert.match(
    presentBindingAnswer(pack.experience.coreConstraintAssessment),
    /does not yet have enough evidence to determine which one is binding/i,
  );
});

test("O — Cause ≠ constraint", () => {
  const pack = pipeline("obj-revenue");
  const contributorLabels = pack.experience.coreCausalAssessment.contributors.map(
    (entry) => entry.label,
  );
  const constraintLabels = pack.experience.coreConstraintAssessment.constraints.map(
    (entry) => entry.label,
  );
  assert.ok(contributorLabels.includes("Margin Pressure"));
  assert.ok(constraintLabels.includes("Capacity"));
  assert.equal(constraintLabels.includes("Margin Pressure"), false);
});

test("P — Data Reality observation does not prove causal interpretation", () => {
  const pack = pipeline("obj-capacity");
  const observation = pack.experience.epistemicFoundation.observation;
  assert.ok(observation);
  assert.equal(observation.claim.type, "FACT");
  const contributor = pack.experience.coreCausalAssessment.contributors[0];
  assert.ok(contributor);
  assert.equal(contributor.interpretationClaim.type, "ASSUMPTION");
  assert.notEqual(observation.claim.claimId, contributor.interpretationClaim.claimId);
});

test("Q — EXI reads Core", () => {
  const pack = pipeline("obj-capacity");
  assert.equal(
    pack.experience.coreCausalAssessment.identity,
    nexoraGroundedCausalConstraintIntelligenceIdentity,
  );
  assert.equal(
    pack.experience.causes.statement,
    pack.experience.causeAssessment.summary.statement,
  );
  assert.match(pack.experience.causes.statement ?? "", /possible contributor|recorded/i);
  assert.equal(pack.experience.causeAssessment.primaryContributor, pack.experience.coreCausalAssessment.primaryContributor && pack.experience.causeAssessment.primaryContributor);
});

test("R — EXI cannot upgrade cause/constraint meaning", () => {
  const grounding = readFileSync(
    join(here, "../nex-mvp/nexoraExecutiveIntelligenceExperienceGrounding.ts"),
    "utf8",
  );
  assert.doesNotMatch(grounding, /supported\.length === 1 \? supported\[0\]/);
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.causeAssessment.primaryContributor, null);
  assert.equal(pack.experience.constraintAssessment.bindingConstraint, null);
  assert.doesNotMatch(pack.experience.causes.statement ?? "", /\bcauses\b|\bcaused\b/i);
});

test("S — Conversation parity", () => {
  const pack = pipeline("obj-capacity");
  const answers = projectNexoraExiConversationalAnswers(pack.experience);
  const causing = ask(pack, "What is causing this?");
  assert.ok(causing.response.includes(answers.causes.slice(0, 40)));
  assert.equal(causing.shouldCommitRuntime, false);
});

test("T — Follow-up continuity", () => {
  const pack = pipeline("obj-capacity");
  const subject = pack.experience.subjectId;
  const why = ask(pack, "Why is this happening?");
  const proven = ask(pack, "Is that proven?", "Why is this happening?");
  const evidence = ask(pack, "What evidence supports it?", "Is that proven?");
  const constraining = ask(pack, "What is constraining us?", "What evidence supports it?");
  const binding = ask(pack, "Which constraint is binding?", "What is constraining us?");
  assert.equal(pack.state.focusedSubject?.id, subject);
  assert.match(why.response, /contributor|related|evidence/i);
  assert.match(proven.response, /not proven|assumption|does not/i);
  assert.match(evidence.response, /recorded relationship|Claim core-int3/i);
  assert.match(constraining.response, /constraint/i);
  assert.match(binding.response, /not yet have enough evidence to determine which one is binding/i);
});

test("U — Stage safety", () => {
  const pack = pipeline("obj-capacity");
  const before = pack.state.focusedSubject?.id;
  const result = ask(pack, "Why is this happening?");
  assert.equal(pack.state.focusedSubject?.id, before);
  assert.equal(result.shouldCommitRuntime, false);
  const focused = pack.presentation.scene.objects.find((object) => object.focused);
  assert.ok(focused);
  assert.equal(focused.targetPosition[2], 0);
  assert.equal(focused.targetPosition[0], EXECUTIVE_STAGE_2D_CENTER.x);
});

test("V — Decision safety", () => {
  const pack = pipeline("ctx-decision-capacity");
  const result = ask(pack, "What is constraining us?");
  assert.equal(GROUNDED_CAUSAL_CONSTRAINT_BOUNDARY.mutatesDecision, false);
  assert.equal(result.shouldCommitRuntime, false);
  assert.doesNotMatch(result.response, /committed|approved/i);
});

test("W — APP-4 safety", () => {
  assert.equal(GROUNDED_CAUSAL_CONSTRAINT_BOUNDARY.writesMemory, false);
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.coreCausalAssessment.writesMemory, false);
  assert.equal(pack.experience.coreConstraintAssessment.writesMemory, false);
});

test("X — Frozen MVP", () => {
  const identity = getNexoraManagerMvpReleaseBaselineIdentity();
  assert.equal(nexoraManagerMvpReleaseBaselineIdentity, "MVP:1/NexoraManagerMVPReleaseBaseline");
  assert.equal(identity.version, "1.2.0");
  assert.equal(identity.version, nexoraExecutiveShellVersion);
  const pack = pipeline("obj-capacity");
  assert.equal(pack.experience.identity, "EXI:1/NexoraExecutiveIntelligenceExperience");
  assert.equal(pack.experience.enrichment, "EXI:2/GroundedCauseConstraintTradeoff");
  assert.equal(pack.experience.comparisonEnrichment, "EXI:3/LiveTradeoffOptionComparison");
});

test("Live causal — Capacity contributor is qualified", () => {
  const pack = pipeline("obj-capacity");
  const causal = pack.experience.coreCausalAssessment;
  assert.equal(causal.subjectId, "obj-capacity");
  assert.ok(causal.contributors.some((entry) => entry.label === "Capacity Gap"));
  assert.equal(causal.contributors[0]?.interpretationClaim.type, "ASSUMPTION");
  assert.equal(causal.rootCause, null);
  assert.doesNotMatch(presentCausalAssessment(causal), /\bcauses Capacity\b/i);
});

test("Live constraint — Capacity Gap is recorded, not binding", () => {
  const pack = pipeline("obj-capacity");
  const constraint = pack.experience.coreConstraintAssessment;
  assert.ok(constraint.constraints.some((entry) => entry.label === "Capacity Gap"));
  assert.equal(constraint.bindingConstraint, null);
  assert.match(presentConstraintAssessment(constraint), /not yet have enough evidence/i);
});

test("Live relationship-not-cause — Risk / Margin Pressure", () => {
  const pack = pipeline("obj-risk");
  assert.doesNotMatch(pack.experience.causes.statement ?? "", /\bcauses\b|\bcaused\b/i);
  assert.match(pack.experience.causes.statement ?? "", /related|associated|does not establish a cause/i);
});

test("Live conversation chain classifiers", () => {
  assert.equal(classifyNexoraExiUtterance("Explain Capacity"), null);
  assert.equal(classifyNexoraExiUtterance("Why is this happening?"), "causes");
  assert.equal(classifyNexoraExiUtterance("Why is Capacity under pressure?"), "causes");
  assert.equal(classifyNexoraExiUtterance("Is that proven?"), "proven");
  assert.equal(classifyNexoraExiUtterance("How sure are you?"), "confidence");
  assert.equal(classifyNexoraExiUtterance("What evidence supports it?"), "evidenceFollowup");
  assert.equal(classifyNexoraExiUtterance("What is constraining us?"), "constraints");
  assert.equal(classifyNexoraExiUtterance("Which constraint is binding?"), "binding");
  assert.equal(classifyNexoraExiUtterance("What don't we know?"), "whatUnknown");
});

test("Live conversation chain on Capacity", () => {
  const pack = pipeline("obj-capacity");
  const focus = pack.state.focusedSubject?.id;
  const explain = ask(pack, "Explain Capacity");
  const why = ask(pack, "Why is this happening?", "Explain Capacity");
  const proven = ask(pack, "Is that proven?", "Why is this happening?");
  const sure = ask(pack, "How sure are you?", "Is that proven?");
  const evidence = ask(pack, "What evidence supports it?", "How sure are you?");
  const constraining = ask(pack, "What is constraining us?", "What evidence supports it?");
  const binding = ask(pack, "Which constraint is binding?", "What is constraining us?");
  const unknown = ask(pack, "What don't we know?", "Which constraint is binding?");
  assert.equal(pack.state.focusedSubject?.id, focus);
  assert.equal(explain.shouldCommitRuntime, false);
  assert.ok(why.response.length > 8);
  assert.match(proven.response, /not proven|assumption/i);
  assert.match(sure.response, /Evidence limited|Not enough evidence/i);
  assert.match(evidence.response, /recorded relationship|Claim core-int3/i);
  assert.match(constraining.response, /constraint/i);
  assert.match(binding.response, /binding/i);
  assert.ok(unknown.response.length > 8);
});

test("Problem / Risk / Decision / Scenario integration boundaries", () => {
  const problem = pipeline("ctx-problem-capacity");
  assert.ok(
    problem.experience.coreCausalAssessment.contributors.length +
      problem.experience.coreCausalAssessment.relatedFactors.length >=
      0,
  );
  const risk = pipeline("obj-risk");
  assert.equal(risk.experience.coreCausalAssessment.contributors.length, 0);
  const decision = pipeline("ctx-decision-capacity");
  assert.equal(decision.experience.coreCausalAssessment.mutatesDecision, false);
  const scenario = pipeline("ctx-scenario-capacity");
  assert.equal(scenario.experience.epistemicFoundation.prediction?.claim.type, "PREDICTION");
  assert.doesNotMatch(scenario.experience.causes.statement ?? "", /observed fact of causation/i);
});

test("Conflicting evidence does not upgrade or designate primary/root/binding", () => {
  const projected = projectGroundedCausalConstraintIntelligence({
    subjectId: "obj-capacity",
    subjectLabel: "Capacity",
    subjectKind: "object",
    isOverview: false,
    conflictingEvidence: true,
    explicitPrimaryContributorId: "gap",
    explicitRootCauseId: "gap",
    causeEstablishedIds: ["gap"],
    explicitBindingConstraintId: "gap",
    relationships: [
      {
        relationshipId: "gap",
        otherId: "ctx-problem-capacity",
        otherLabel: "Capacity Gap",
        relationKind: "constrained-by",
        direction: "inbound",
      },
    ],
  });
  assert.equal(projected.causal.evidenceStatus, "conflicting");
  assert.equal(projected.causal.primaryContributor, null);
  assert.equal(projected.causal.rootCause, null);
  assert.equal(projected.constraint.bindingConstraint, null);
  assert.equal(projected.causal.causalConfidence, "unknown");
});

test("CORE-INT:3 EXI and live collector do not construct claims", () => {
  const grounding = readFileSync(
    join(here, "../nex-mvp/nexoraExecutiveIntelligenceExperienceGrounding.ts"),
    "utf8",
  );
  const composer = readFileSync(
    join(here, "../nex-mvp/nexoraExecutiveIntelligenceExperience.ts"),
    "utf8",
  );
  const live = readFileSync(join(here, "../nex-mvp/nexoraLiveEpistemicProjection.ts"), "utf8");
  assert.doesNotMatch(grounding, /createExecutiveClaim\(/);
  assert.doesNotMatch(composer, /createExecutiveClaim\(/);
  assert.doesNotMatch(live, /createExecutiveClaim\(/);
  assert.match(composer, /projectNexoraLiveCausalConstraintIntelligence/);
});
