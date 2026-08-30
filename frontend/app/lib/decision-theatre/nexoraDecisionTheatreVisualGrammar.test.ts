/**
 * DTH:3 — NexoGraph Visual Grammar tests.
 * Does not replace DTH:1, DTH:2, Stage, Director, Manager–Object, or NEX-EXP tests.
 */

import assert from "node:assert/strict";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "@/app/lib/conversational-control/conversationalSubjectRegistry.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { NexoraDecisionTheatreIconicSatellite } from "../../executive/nex-mvp/stage/NexoraDecisionTheatreIconicSatellites.tsx";
import { NEXORA_DECISION_THEATRE_CHANNEL_OWNERSHIP } from "./nexoraDecisionTheatreChannelOwnership.ts";
import {
  NEXORA_DECISION_THEATRE_SEMANTIC_PALETTE,
  resolveSemanticStateToken,
} from "./nexoraDecisionTheatreSemanticPalette.ts";
import { resolveNexoraDecisionTheatreStateSwatch } from "./nexoraDecisionTheatreRendererTokens.ts";
import { resolveNexoraDecisionTheatreRelationshipVisual } from "./nexoraDecisionTheatreRelationshipGrammar.ts";
import {
  evaluateNexoraDecisionTheatreInvariants,
  inspectNexoraDecisionTheatreProjection,
  NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES,
  NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES,
  NEXORA_DECISION_THEATRE_VISUAL_CHANNELS,
  nexoraDecisionTheatreVisualGrammarIdentity,
  projectNexoraDecisionTheatreFoundation,
  projectNexoraDecisionTheatreVisualGrammar,
  resolveImpactScaleTokens,
} from "./nexoraDecisionTheatrePublicIndex.ts";
import {
  DTH3_PROOF_BACKGROUND,
  DTH3_PROOF_DECISION,
  DTH3_PROOF_GOAL,
  DTH3_PROOF_MISSING,
  DTH3_PROOF_REL_CANDIDATE,
  DTH3_PROOF_REL_SUPPORTED,
  DTH3_PROOF_REL_UNKNOWN,
  DTH3_PROOF_RISK,
  DTH3_PROOF_SCENARIO,
  DTH3_PROOF_SELECTED,
  dth3ProofIconic,
} from "./nexoraDecisionTheatreVisualGrammarFixtures.ts";
import { NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES } from "./nexoraDecisionTheatreIconicFixtures.ts";

const catalog = getDefaultNexoraMVPObjectInteractionCatalog();
const subjects = projectDefaultNexoraMvpConversationalSubjects();

function initial() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function grammarProof(extra?: Parameters<typeof projectNexoraDecisionTheatreVisualGrammar>[0]["grammar"]) {
  const iconic = dth3ProofIconic("proof-scenario", "cost");
  return projectNexoraDecisionTheatreVisualGrammar({
    executives: [
      DTH3_PROOF_GOAL,
      DTH3_PROOF_SCENARIO,
      DTH3_PROOF_DECISION,
      DTH3_PROOF_RISK,
      DTH3_PROOF_MISSING,
      DTH3_PROOF_SELECTED,
      DTH3_PROOF_BACKGROUND,
    ],
    iconicObjects: [iconic],
    relationships: [DTH3_PROOF_REL_SUPPORTED, DTH3_PROOF_REL_CANDIDATE, DTH3_PROOF_REL_UNKNOWN],
    grammar: extra,
  });
}

test("grammar contract is renderer-neutral, versioned, and channel-complete", () => {
  assert.equal(nexoraDecisionTheatreVisualGrammarIdentity, "DTH:3/NexoGraphVisualGrammar");
  assert.equal(NEXORA_DECISION_THEATRE_VISUAL_CHANNELS.length, 11);
  for (const channel of NEXORA_DECISION_THEATRE_VISUAL_CHANNELS) {
    assert.ok(NEXORA_DECISION_THEATRE_CHANNEL_OWNERSHIP[channel].primaryMeaning.length > 0);
    assert.ok(NEXORA_DECISION_THEATRE_CHANNEL_OWNERSHIP[channel].mustNotMean.length > 0);
  }
  assert.equal(NEXORA_DECISION_THEATRE_CHANNEL_OWNERSHIP.form.mustNotMean.includes("status"), true);
  assert.equal(NEXORA_DECISION_THEATRE_CHANNEL_OWNERSHIP.color.mustNotMean.includes("object type"), true);
  assert.equal(NEXORA_DECISION_THEATRE_CHANNEL_OWNERSHIP.size.mustNotMean.includes("urgency"), true);
  assert.equal(NEXORA_DECISION_THEATRE_CHANNEL_OWNERSHIP.distance.mustNotMean.includes("causality"), true);
  assert.equal(NEXORA_DECISION_THEATRE_CHANNEL_OWNERSHIP.opacity.mustNotMean.includes("deleted"), true);
  assert.equal(NEXORA_DECISION_THEATRE_CHANNEL_OWNERSHIP.halo.mustNotMean.includes("focus"), true);
  const projection = grammarProof();
  for (const directive of projection.directives) {
    assert.doesNotMatch(directive.visualToken, /#([0-9a-f]{3,8})\b/i);
    assert.doesNotMatch(directive.semanticToken, /\brgba?\(/i);
    assert.equal(directive.grammarVersion, "1.0.0");
  }
  assert.equal(Object.isFrozen(projection), true);
  const serialized = JSON.stringify(projection);
  assert.deepEqual(JSON.parse(serialized).grammarVersion, projection.grammarVersion);
});

test("semantic palette maps existing runtime states without exposing WATCH", () => {
  assert.equal(resolveSemanticStateToken("stable"), "state-stable");
  assert.equal(resolveSemanticStateToken("watch"), "state-attention-required");
  assert.equal(resolveSemanticStateToken("risk"), "state-critical");
  assert.equal(resolveSemanticStateToken("unresolved"), "state-uncertain");
  assert.equal(resolveSemanticStateToken(null), "state-neutral");
  assert.equal(NEXORA_DECISION_THEATRE_SEMANTIC_PALETTE["state-attention-required"].accessibleLabel, "Attention required");
  assert.doesNotMatch(NEXORA_DECISION_THEATRE_SEMANTIC_PALETTE["state-attention-required"].accessibleLabel, /WATCH/i);
  const swatch = resolveNexoraDecisionTheatreStateSwatch("state-critical");
  assert.match(swatch.border, /rgba/);
  assert.equal(swatch.token.startsWith("nxg-"), true);
});

test("proofs 1-9: identity, state, focus, selection, and halo stay independent", () => {
  const projection = grammarProof();
  const byId = Object.fromEntries(projection.presentations.map((item) => [item.participantId, item]));
  assert.equal(byId["proof-goal"].formToken, "form-executive-goal");
  assert.equal(byId["proof-scenario"].formToken, "form-executive-scenario");
  assert.equal(byId["proof-decision"].formToken, "form-executive-decision");
  assert.equal(byId["proof-goal"].stateToken, "state-stable");
  assert.equal(byId["proof-scenario"].stateToken, "state-attention-required");
  assert.equal(byId["proof-decision"].stateToken, "state-critical");
  assert.equal(byId["proof-missing"].stateToken, "state-neutral");
  assert.equal(byId["proof-risk"].stateToken, "state-uncertain");
  assert.equal(byId["proof-decision"].overlayFocus, true);
  assert.equal(byId["proof-decision"].stateToken, "state-critical");
  assert.equal(byId["proof-selected"].overlaySelection, true);
  assert.equal(byId["proof-selected"].stateToken, "state-stable");
  assert.equal(byId["proof-scenario"].haloToken, "halo-attention");
  assert.equal(byId["proof-scenario"].overlayFocus, false);
  assert.equal(byId["proof-decision"].haloToken, "halo-none");
  const iconic = projection.presentations.find((item) => item.visualFamily === "ICONIC_OBJECT");
  assert.ok(iconic);
  assert.equal(iconic.formToken, "form-iconic-cost");
  assert.equal(iconic.stateToken, "state-neutral");
  assert.ok(projection.conflicts.some((item) => item.code === "focus-versus-status"));
  assert.ok(projection.conflicts.some((item) => item.code === "selection-versus-status"));
  assert.ok(projection.conflicts.some((item) => item.code === "halo-versus-focus") === false);
});

test("proofs 10-13: size comparability and opacity de-emphasis", () => {
  const comparable = grammarProof({
    impactCriterion: {
      criterionId: "relative-exposure",
      unit: "index",
      values: {
        "proof-goal": 10,
        "proof-scenario": 20,
        "proof-decision": 40,
        "proof-risk": 10,
        "proof-missing": 10,
        "proof-selected": 10,
        "proof-background": 10,
      },
    },
  });
  const byId = Object.fromEntries(comparable.presentations.map((item) => [item.participantId, item]));
  assert.equal(byId["proof-decision"].scaleToken, "size-higher");
  assert.equal(byId["proof-goal"].scaleToken === "size-equal" || byId["proof-goal"].scaleToken === "size-lower", true);
  const incomparable = resolveImpactScaleTokens(
    { criterionId: "mix", unit: "index", values: { a: 1, b: null } },
    ["a", "b"],
  );
  assert.equal(incomparable.a, "size-equal");
  assert.equal(incomparable.b, "size-equal");
  const missing = resolveImpactScaleTokens(
    { criterionId: "mix", unit: "index", values: { a: 1 } },
    ["a", "b"],
  );
  assert.equal(missing.a, "size-equal");
  assert.equal(missing.b, "size-equal");
  const equalLive = grammarProof();
  assert.ok(equalLive.presentations.filter((item) => item.visualFamily === "EXECUTIVE_OBJECT").every((item) => item.scaleToken === "size-equal"));
  assert.equal(byId["proof-background"].opacityToken, "opacity-deemphasized");
  const fadeClaim = comparable.claims.find((item) => item.participantId === "proof-background" && item.channel === "opacity");
  assert.ok(fadeClaim);
  assert.ok(fadeClaim.mustNotInfer.includes("deleted"));
});

test("proofs 14-21: relationship pattern, weight, direction, and non-causal language", () => {
  const projection = grammarProof({
    relationshipPresentations: [
      {
        relationshipId: "rel-supported",
        supportState: "established",
        strength: 8,
        strengthComparable: true,
        direction: "source-to-target",
        causalAuthority: true,
      },
      {
        relationshipId: "rel-candidate",
        supportState: "candidate",
        strength: 2,
        strengthComparable: true,
        direction: "none",
      },
      {
        relationshipId: "rel-unknown",
        supportState: "unknown",
        strength: null,
        strengthComparable: false,
        direction: "none",
      },
    ],
  });
  const byRel = Object.fromEntries(projection.relationshipVisuals.map((item) => [item.relationshipId, item]));
  assert.equal(byRel["rel-supported"].patternToken, "line-supported");
  assert.equal(byRel["rel-candidate"].patternToken, "line-candidate");
  assert.equal(byRel["rel-unknown"].patternToken, "line-unknown");
  assert.match(byRel["rel-unknown"].explanation, /not mean it is false/i);
  assert.equal(byRel["rel-supported"].weightToken, "weight-higher");
  assert.equal(byRel["rel-candidate"].weightToken, "weight-lower");
  const incomparable = resolveNexoraDecisionTheatreRelationshipVisual({
    relationshipId: "x",
    semanticType: "related",
    strength: 9,
    strengthComparable: false,
    peerStrengths: [1],
  });
  assert.equal(incomparable.weightToken, "weight-neutral");
  assert.equal(byRel["rel-supported"].directionToken, "arrow-source-to-target");
  assert.equal(byRel["rel-candidate"].directionToken, "arrow-none");
  assert.equal(byRel["rel-supported"].causalLanguageAllowed, false);
  assert.match(byRel["rel-supported"].explanation, /not cause/i);
  assert.doesNotMatch(byRel["rel-supported"].explanation, /this is a confirmed cause/i);
  const unknownLive = grammarProof();
  assert.ok(unknownLive.relationshipVisuals.every((item) => item.patternToken === "line-unknown"));
  assert.ok(unknownLive.relationshipVisuals.every((item) => item.weightToken === "weight-neutral"));
});

test("proofs 22-26: risk identity, iconic subordination, claims, fallback, determinism", () => {
  const first = grammarProof();
  const second = grammarProof();
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  const risk = first.presentations.find((item) => item.participantId === "proof-risk");
  assert.equal(risk?.formToken, "form-executive-risk");
  assert.equal(
    first.presentations.some((item) => item.formToken === "form-iconic-risk"),
    false,
  );
  const iconic = first.presentations.find((item) => item.visualFamily === "ICONIC_OBJECT");
  assert.equal(iconic?.scaleToken, "size-subordinate");
  assert.equal(iconic?.subordinate, true);
  const nonNeutral = first.directives.filter((item) => item.nonNeutral);
  for (const item of nonNeutral) {
    assert.ok(
      first.claims.some(
        (claim) =>
          claim.participantId === item.participantId &&
          claim.channel === item.channel &&
          claim.semanticToken === item.semanticToken,
      ),
      item.explanationRef,
    );
  }
  assert.ok(first.fallbacks.includes("impact-incomparable-equal-size"));
  assert.equal(first.mutatedDomain, false);
  assert.equal(first.atmosphere, "none");
});

test("proofs 27-30: reduced motion, accessibility, no domain mutation, empty live grammar", () => {
  const motion = grammarProof({ reducedMotion: true });
  const standard = grammarProof({ reducedMotion: false });
  assert.deepEqual(
    motion.presentations.map((item) => [item.participantId, item.stateToken, item.formToken]),
    standard.presentations.map((item) => [item.participantId, item.stateToken, item.formToken]),
  );
  assert.ok(motion.directives.every((item) => item.channel !== "motion" || item.semanticToken === "motion-none"));
  for (const presentation of motion.presentations) {
    assert.ok(presentation.accessibilityDescription.length > 0);
    assert.doesNotMatch(presentation.accessibilityDescription, /^#[0-9a-f]+$/i);
  }
  const live = projectNexoraDecisionTheatreFoundation({
    stageState: initial(),
    catalog,
  });
  assert.equal(live.visualGrammar.presentations.every((item) => item.scaleToken === "size-equal" || item.scaleToken === "size-subordinate"), true);
  assert.equal(live.visualGrammar.atmosphere, "none");
  assert.equal(evaluateNexoraDecisionTheatreInvariants(live).ok, true);
  const before = JSON.stringify(initial());
  projectNexoraDecisionTheatreFoundation({ stageState: initial(), catalog });
  assert.equal(JSON.stringify(initial()), before);
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("nexo-graph-visual-grammar"));
  assert.ok(NEXORA_DECISION_THEATRE_SUPPORTED_CAPABILITIES.includes("war-room-atmosphere"));
  assert.equal(NEXORA_DECISION_THEATRE_RESERVED_CAPABILITIES.length, 7);
});

test("color safety, diagnostics, advisor explanations, and DTH:1/DTH:2 regression", () => {
  const focused = selectNexoraMVPInteractionSubject(initial(), "obj-revenue", catalog);
  const theatre = projectNexoraDecisionTheatreFoundation({
    stageState: focused,
    catalog,
    iconicAuthoritativeSources: NEXORA_DECISION_THEATRE_DTH2_SCENARIO_ICONIC_SOURCES,
  });
  for (const presentation of theatre.visualGrammar.presentations) {
    const palette = NEXORA_DECISION_THEATRE_SEMANTIC_PALETTE[presentation.stateToken];
    assert.ok(palette.nonColorEquivalent.length > 0);
    assert.ok(palette.accessibleLabel.length > 0);
  }
  const diagnostics = inspectNexoraDecisionTheatreProjection({
    theatre,
    projectionInput: { stageState: focused, catalog },
  });
  assert.ok(diagnostics.visualDirectiveCount > 0);
  assert.equal(diagnostics.visualAtmosphere, "none");
  assert.equal(diagnostics.unauthorizedMutation, false);
  const advisorText = JSON.stringify(theatre.advisorReadable);
  assert.doesNotMatch(advisorText, /NexoGraph|DTH:3|WATCH/);
  assert.ok(theatre.advisorReadable.visualExplanations.length > 0);
  assert.equal(theatre.iconicObjects.length, 0);
  assert.equal(theatre.visibleExecutiveObjects.some((item) => item.id === "obj-revenue"), true);
  assert.equal(evaluateNexoraDecisionTheatreInvariants(theatre).ok, true);
  const html = renderToStaticMarkup(
    React.createElement(NexoraDecisionTheatreIconicSatellite, { iconic: dth3ProofIconic("proof-scenario") }),
  );
  assert.match(html, /data-nexograph-subordinate="true"/);
  const conversation = executeNexoraConversationalExperience({
    utterance: "Explain it",
    conversationContext: Object.freeze({
      currentSubjectId: focused.focusedSubject?.id ?? null,
      previousSubjectIds: Object.freeze([]),
      currentWorkspaceId: focused.workspace,
    }),
    executiveSubjects: subjects,
    runtimeState: focused,
    catalog,
    messageIdSeed: "dth3-explain",
  });
  assert.equal(conversation.nextRuntimeState.focusedSubject?.id, "obj-revenue");
  assert.equal(conversation.decisionTheatre?.writes.decisionState, false);
  assert.equal(conversation.decisionTheatre?.visualGrammar.atmosphere, "none");
});
