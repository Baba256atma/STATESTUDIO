/**
 * DTH:1 — Theatre invariants. Evaluated against a projection; they do not create truth.
 */

import type { NexoraDecisionTheatreFoundation } from "./nexoraDecisionTheatreContract.ts";
import { NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY } from "./nexoraDecisionTheatreDirectorBoundary.ts";

export const NEXORA_DECISION_THEATRE_INVARIANTS = Object.freeze({
  authority: Object.freeze([
    "Stage is presentation and navigation only",
    "Director composes presentation but does not create business truth",
    "Advisor explains and guides but does not own Stage or domain truth",
    "Runtime authorities remain the source of truth",
    "Decision Theatre does not mutate Decision or Execution state",
    "Decision Theatre does not create Outcome or Learning",
    "Evidence presentation does not create evidence",
    "Relationship does not mean causality",
    "Candidate does not mean confirmed",
    "Scenario preference does not mean Decision approval",
    "Execution presentation does not mean Execution started",
    "Current KPI does not automatically mean Outcome",
  ] as const),
  experience: Object.freeze([
    "One canonical Stage remains",
    "One canonical Director remains",
    "Click and conversation use compatible runtime paths",
    "Stage state survives unrelated read-only Advisor questions",
    "Unsupported presentation requests do not clear or corrupt Stage",
    "Theatre projection is deterministic for the same authoritative input",
    "Theatre contracts are serializable and immutable",
    "Existing Manager–Object behavior remains intact",
    "Existing Stage navigation remains intact",
    "Existing collection presentation remains intact",
    "No architecture or internal codes appear in manager-facing copy",
    "Executive Objects remain canonical actors",
    "Iconic Objects remain presentation-only and owner-attached",
    "Iconic Objects do not enter Queue, collections, navigation or topology",
    "Unknown and missing Iconic values are never displayed as zero",
    "Visual directives remain renderer-neutral and do not mutate domain state",
    "Color is never the only carrier of status meaning",
  ] as const),
  visual: Object.freeze([
    "Stage remains a fixed 2D environment",
    "Existing Objects may preserve their current local 3D appearance",
    "DTH:1 must not introduce decorative animation",
    "Visual behavior must never imply unsupported importance, urgency, causality or confidence",
    "Future visual states must always be explainable by Advisor and traceable to authoritative input",
  ] as const),
} as const);

const ARCHITECTURE_TERMS =
  /\b(DTH:12|DTH:11|DTH:10|DTH:9|DTH:8|DTH:2|DTH:1|DIR:1|REX-2|CC:\d|NEX-MVP|NexoGraph|NexoTime|NexoLens|NexoSelect|NexoCompare|Scene Intent|Scene Script)\b/;

export function evaluateNexoraDecisionTheatreInvariants(
  theatre: NexoraDecisionTheatreFoundation,
): Readonly<{ ok: true; failed: readonly string[] }> | Readonly<{ ok: false; failed: readonly string[] }> {
  const failed: string[] = [];
  if (theatre.writes.decisionState || theatre.writes.executionState) {
    failed.push("theatre-wrote-decision-or-execution");
  }
  if (theatre.writes.outcome || theatre.writes.learning || theatre.writes.evidence) {
    failed.push("theatre-created-outcome-learning-or-evidence");
  }
  if (theatre.relationships.some((item) => item.impliesCausality !== false)) {
    failed.push("relationship-implied-causality");
  }
  if (theatre.relationships.some((item) => item.candidateMeansConfirmed !== false)) {
    failed.push("candidate-meant-confirmed");
  }
  if (theatre.directorProjection?.businessMutationAllowed !== false && theatre.directorProjection != null) {
    failed.push("director-business-mutation-allowed");
  }
  if (NEXORA_DECISION_THEATRE_DIRECTOR_BOUNDARY.businessMutationAllowed !== false) {
    failed.push("director-boundary-allows-mutation");
  }
  if (theatre.visualFoundation.decorativeAnimationIntroduced) {
    failed.push("decorative-animation-introduced");
  }
  if (theatre.sceneProvenance.adapterIsParallelAuthority) {
    failed.push("adapter-became-parallel-authority");
  }
  if (theatre.sceneProvenance.snapshotsRewritten || theatre.sceneProvenance.navigationHistoryDuplicated) {
    failed.push("stage-snapshots-or-navigation-rewritten");
  }
  const advisorText = [
    theatre.advisorReadable.whatIsOnStage,
    theatre.advisorReadable.focusedObject ?? "",
    ...theatre.advisorReadable.visibleObjectLabels,
    ...theatre.advisorReadable.whyPresent,
    ...theatre.advisorReadable.relationshipsShown,
    ...theatre.advisorReadable.unavailable,
    ...theatre.advisorReadable.visualExplanations.flatMap((item) => [
      item.subject,
      item.appearance,
      item.meaning,
      item.supportedBy,
      item.remainsUnknown,
      item.doNotInfer,
    ]),
    theatre.advisorReadable.atmosphere.meaning,
    theatre.advisorReadable.atmosphere.supportedBy,
    theatre.advisorReadable.atmosphere.remainsUnknown,
    theatre.advisorReadable.atmosphere.doNotInfer,
    theatre.advisorReadable.scene.question,
    theatre.advisorReadable.scene.anchor ?? "",
    ...theatre.advisorReadable.scene.visibleActors,
    ...theatre.advisorReadable.scene.roles,
    ...theatre.advisorReadable.scene.whyPresent,
    ...theatre.advisorReadable.scene.relationshipsThatMatter,
    ...theatre.advisorReadable.scene.unavailable,
    ...theatre.advisorReadable.scene.mustNotInfer,
    theatre.advisorReadable.investigation?.whyInvestigating ?? "",
    theatre.advisorReadable.investigation?.evidence ?? "",
    theatre.advisorReadable.investigation?.related ?? "",
    theatre.advisorReadable.investigation?.uncertainty ?? "",
    ...(theatre.advisorReadable.investigation?.suggestedQuestions ?? []),
    ...(theatre.advisorReadable.investigation?.mustNotInfer ?? []),
    theatre.advisorReadable.comparison?.choice ?? "",
    theatre.advisorReadable.comparison?.candidates ?? "",
    theatre.advisorReadable.comparison?.differences ?? "",
    theatre.advisorReadable.comparison?.evidence ?? "",
    theatre.advisorReadable.comparison?.uncertainty ?? "",
    theatre.advisorReadable.comparison?.tradeOffs ?? "",
    theatre.advisorReadable.comparison?.recommendation ?? "",
    theatre.advisorReadable.comparison?.readiness ?? "",
    theatre.advisorReadable.comparison?.ambiguousBetter ?? "",
    ...(theatre.advisorReadable.comparison?.mustNotInfer ?? []),
    theatre.advisorReadable.commitment?.reviewing ?? "",
    theatre.advisorReadable.commitment?.why ?? "",
    theatre.advisorReadable.commitment?.evidence ?? "",
    theatre.advisorReadable.commitment?.tradeOffs ?? "",
    theatre.advisorReadable.commitment?.uncertainty ?? "",
    theatre.advisorReadable.commitment?.haveIDecided ?? "",
    theatre.advisorReadable.commitment?.recommendationDistinct ?? "",
    ...(theatre.advisorReadable.commitment?.mustNotInfer ?? []),
    ...theatre.advisorReadable.iconicObjects.flatMap((item) => [
      item.ownerLabel,
      item.meaning,
      item.whyVisible,
      ...item.mustNotInterpretAs,
    ]),
  ].join(" ");
  if (ARCHITECTURE_TERMS.test(advisorText)) {
    failed.push("architecture-terms-in-advisor-copy");
  }
  for (const iconic of theatre.iconicObjects) {
    if (iconic.visualFamily !== "ICONIC_OBJECT") {
      failed.push("iconic-family-invalid");
    }
    const ownerVisible = theatre.visibleExecutiveObjects.some((item) => item.id === iconic.ownerExecutiveObjectId);
    if (!ownerVisible) {
      failed.push("iconic-unattached");
    }
    if (theatre.visibleExecutiveObjects.some((item) => item.id === iconic.presentationId)) {
      failed.push("iconic-promoted-to-executive");
    }
    if ((iconic.unknown || iconic.missing) && iconic.value != null) {
      failed.push("unknown-or-missing-flattened-to-value");
    }
  }
  if (theatre.visualGrammar.mutatedDomain) {
    failed.push("visual-grammar-mutated-domain");
  }
  if (theatre.visualGrammar.atmosphere !== "none") {
    failed.push("nexograph-owned-stage-atmosphere");
  }
  if (theatre.warRoomAtmosphere.sceneIntentImplemented) {
    failed.push("atmosphere-claimed-scene-intent");
  }
  if (theatre.sceneIntent.derivationMetadata.parsedRawManagerText) {
    failed.push("scene-intent-reparsed-text");
  }
  if (theatre.sceneIntent.derivationMetadata.atmosphereSelected) {
    failed.push("scene-intent-selected-atmosphere");
  }
  if (
    theatre.sceneScript.derivationMetadata.mutatedDecision ||
    theatre.sceneScript.derivationMetadata.startedExecution ||
    theatre.sceneScript.derivationMetadata.createdOutcomeOrLearning
  ) {
    failed.push("scene-script-mutated-domain");
  }
  if (theatre.sceneScript.atmosphereRef !== theatre.warRoomAtmosphere.mode) {
    failed.push("scene-script-selected-atmosphere");
  }
  for (const actor of theatre.sceneScript.actors) {
    if (actor.executive && !theatre.visibleExecutiveObjects.some((item) => item.id === actor.canonicalId)) {
      failed.push("scene-script-invented-actor");
    }
    if (!actor.executive && actor.ownerExecutiveObjectId) {
      const ownerPresent = theatre.sceneScript.actors.some(
        (item) => item.executive && item.canonicalId === actor.ownerExecutiveObjectId,
      );
      if (!ownerPresent) failed.push("iconic-without-owner");
    }
  }
  if (theatre.warRoomAtmosphere.mutatedDomain) {
    failed.push("atmosphere-mutated-domain");
  }
  if (/#([0-9a-f]{3,8})\b|\brgba?\(/i.test(theatre.warRoomAtmosphere.rendererToken)) {
    failed.push("atmosphere-hex-in-semantic-token");
  }
  if (theatre.warRoomAtmosphere.mode === "none" && theatre.warRoomAtmosphere.claim != null) {
    failed.push("none-atmosphere-claimed");
  }
  if (theatre.warRoomAtmosphere.mode !== "none" && theatre.warRoomAtmosphere.claim == null) {
    failed.push("non-none-atmosphere-missing-claim");
  }
  const nonNeutral = theatre.visualGrammar.directives.filter((item) => item.nonNeutral);
  for (const item of nonNeutral) {
    const claimed = theatre.visualGrammar.claims.some(
      (claim) =>
        claim.participantId === item.participantId &&
        claim.channel === item.channel &&
        claim.semanticToken === item.semanticToken,
    );
    if (!claimed) failed.push(`missing-visual-claim:${item.participantId}:${item.channel}`);
  }
  for (const executive of theatre.visibleExecutiveObjects) {
    if (executive.visualFamily !== "EXECUTIVE_OBJECT") {
      failed.push("executive-family-invalid");
    }
  }
  if (theatre.objectInvestigation?.derivationMetadata.inventedEvidence) {
    failed.push("investigation-invented-evidence");
  }
  if (theatre.objectInvestigation?.derivationMetadata.mutatedStage) {
    failed.push("investigation-mutated-stage");
  }
  if (theatre.objectInvestigation?.derivationMetadata.manufacturedComparison) {
    failed.push("investigation-manufactured-comparison");
  }
  if (theatre.decisionComparison?.derivationMetadata.inventedCandidates) {
    failed.push("comparison-invented-candidates");
  }
  if (theatre.decisionComparison?.derivationMetadata.inventedScores) {
    failed.push("comparison-invented-scores");
  }
  if (theatre.decisionComparison?.derivationMetadata.approvedDecision) {
    failed.push("comparison-approved-decision");
  }
  if (theatre.decisionComparison?.derivationMetadata.proximityInferred) {
    failed.push("comparison-proximity-inferred");
  }
  if (theatre.decisionCommitment?.derivationMetadata.inventedDecision) {
    failed.push("commitment-invented-decision");
  }
  if (theatre.decisionCommitment?.derivationMetadata.clickCommitted) {
    failed.push("commitment-click-committed");
  }
  if (theatre.decisionCommitment?.derivationMetadata.startedExecution) {
    failed.push("commitment-started-execution");
  }
  if (theatre.decisionCommitment?.derivationMetadata.silentOverwrite) {
    failed.push("commitment-silent-overwrite");
  }
  if (theatre.executionReadiness?.derivationMetadata.inventedExecution) {
    failed.push("readiness-invented-execution");
  }
  if (theatre.executionReadiness?.derivationMetadata.clickStartedExecution) {
    failed.push("readiness-click-started-execution");
  }
  if (theatre.executionReadiness?.derivationMetadata.unknownPromotedToBlocked) {
    failed.push("readiness-unknown-promoted-to-blocked");
  }
  if (theatre.advisorReadable.executionReadiness && ARCHITECTURE_TERMS.test(JSON.stringify(theatre.advisorReadable.executionReadiness))) {
    failed.push("readiness-architecture-terms");
  }
  if (theatre.liveExecution?.derivationMetadata.inventedExecution) {
    failed.push("live-invented-execution");
  }
  if (theatre.liveExecution?.derivationMetadata.inventedProgress) {
    failed.push("live-invented-progress");
  }
  if (theatre.liveExecution?.derivationMetadata.unknownPromotedToBlocked) {
    failed.push("live-unknown-promoted-to-blocked");
  }
  if (theatre.liveExecution?.derivationMetadata.unknownPromotedToAttention) {
    failed.push("live-unknown-promoted-to-attention");
  }
  if (theatre.liveExecution?.derivationMetadata.associationPromotedToCause) {
    failed.push("live-association-promoted-to-cause");
  }
  if (theatre.liveExecution?.derivationMetadata.clickMutatedExecution) {
    failed.push("live-click-mutated-execution");
  }
  if (theatre.liveExecution?.derivationMetadata.inventedOutcome) {
    failed.push("live-invented-outcome");
  }
  if (theatre.advisorReadable.liveExecution && ARCHITECTURE_TERMS.test(JSON.stringify(theatre.advisorReadable.liveExecution))) {
    failed.push("live-architecture-terms");
  }
  if (theatre.outcomeObservation?.derivationMetadata.inventedOutcome) {
    failed.push("outcome-invented");
  }
  if (theatre.outcomeObservation?.derivationMetadata.completionMeansSuccess) {
    failed.push("outcome-completion-means-success");
  }
  if (theatre.outcomeObservation?.derivationMetadata.inventedCausality) {
    failed.push("outcome-invented-causality");
  }
  if (theatre.outcomeObservation?.derivationMetadata.inventedLearning) {
    failed.push("outcome-invented-learning");
  }
  if (theatre.outcomeObservation?.derivationMetadata.inventedDecision) {
    failed.push("outcome-invented-decision");
  }
  if (theatre.advisorReadable.outcomeObservation && ARCHITECTURE_TERMS.test(JSON.stringify(theatre.advisorReadable.outcomeObservation))) {
    failed.push("outcome-architecture-terms");
  }
  if (theatre.learningReassessment?.derivationMetadata.inventedLearning) {
    failed.push("learning-invented");
  }
  if (theatre.learningReassessment?.derivationMetadata.inventedAssumption) {
    failed.push("learning-invented-assumption");
  }
  if (theatre.learningReassessment?.derivationMetadata.inventedCausality) {
    failed.push("learning-invented-causality");
  }
  if (theatre.learningReassessment?.derivationMetadata.learningBecameDurable) {
    failed.push("learning-became-durable");
  }
  if (theatre.learningReassessment?.derivationMetadata.persistedApp4) {
    failed.push("learning-persisted-app4");
  }
  if (theatre.learningReassessment?.derivationMetadata.mutatedDecision) {
    failed.push("learning-mutated-decision");
  }
  if (theatre.learningReassessment?.derivationMetadata.mutatedGoal) {
    failed.push("learning-mutated-goal");
  }
  if (theatre.advisorReadable.learningReassessment && ARCHITECTURE_TERMS.test(JSON.stringify(theatre.advisorReadable.learningReassessment))) {
    failed.push("learning-architecture-terms");
  }
  return Object.freeze({
    ok: failed.length === 0,
    failed: Object.freeze(failed),
  });
}
