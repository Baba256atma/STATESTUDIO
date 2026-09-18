/**
 * NPA-T NMI:FINAL — program integration & boundary certification.
 * Audit harness only. Does not add NMI features, NMI:9, or DTH-EXP.
 */

import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { NexoraExecutiveQueueOverlay } from "@/app/executive/nex-mvp/stage/NexoraExecutiveQueueOverlay.tsx";
import { conversationalExperienceIdentity } from "@/app/lib/conversational-control/conversationalExperience.ts";
import { executeNexoraConversationalExperience } from "@/app/lib/conversational-control/conversationalExperienceOrchestrator.ts";
import { createEmptyManagerObjectSession } from "@/app/lib/manager-object/managerObjectActive.ts";
import { projectManagerObjectConversationalSubjects } from "@/app/lib/manager-object/managerObjectCatalog.ts";
import { realDataIntegrationFoundationIdentity } from "@/app/lib/data-reality/realDataIntegrationFoundation.ts";
import { DirectorFoundationId } from "@/app/lib/director/directorFoundation.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  deriveNexoraMVPStageInteractionPresentation,
  getDefaultNexoraMVPObjectInteractionCatalog,
  selectNexoraMVPInteractionSubject,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import { RMS_NEXORA_PARTICIPANT_CONTRACT } from "@/app/lib/rms/rmsActorContracts.ts";
import { VAI_CAUSAL_SAFETY_BOUNDARY } from "@/app/lib/vai/vaiCausalContract.ts";
import { verifyExecutiveStageQueueFoundation } from "@/app/lib/spatial-presentation/executiveStageQueueFoundation.ts";
import { NMI_AUTHORITY_BOUNDARY, verifyNmiAuthorityBoundary } from "./nmiAuthorityBoundary.ts";
import { NMI_GATE_BOUNDARY } from "./nmiGateBoundary.ts";
import { NMI_RMS_BOUNDARY } from "./nmiRmsBoundary.ts";
import { NMI_ADVISOR_CONTRACT } from "./nmiAdvisorContract.ts";
import { verifyNmiAdvisorIntegration } from "./nmiAdvisorFoundation.ts";
import { NMI_LIVE_GATE_FLOW, NMI_LIVE_HOST_CONTRACT, NMI_LIVE_PIPELINE } from "./nmiLiveContract.ts";
import { verifyNmiLiveHost } from "./nmiLiveFoundation.ts";
import {
  hostNmiLiveManagementIntelligence,
  projectNmiLiveSelectionToStage,
} from "./nmiLivePipeline.ts";
import { handoffNmiStageProjectionToExistingStage } from "./nmiStageProjectionHandoff.ts";
import { NMI_STAGE_PROJECTION_CONTRACT } from "./nmiStageProjectionContract.ts";
import { NMI_MANAGEMENT_NAVIGATION_CONTRACT } from "./nmiManagementNavigationContract.ts";
import { NMI_FOUNDATION_CONTRACT } from "./nmiContract.ts";
import { NMI_CAUSAL_EVIDENCE_SAFETY } from "./nmiRelationshipContract.ts";
import { rejectSealedRmsAdvisorFact } from "./nmiAdvisorCompose.ts";

const HERE = dirname(fileURLToPath(import.meta.url));
const FRONTEND = join(HERE, "../../..");

function catalog() {
  return getDefaultNexoraMVPObjectInteractionCatalog();
}

function live(focusedSubjectId: string | null = null) {
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const presentation = deriveNexoraMVPStageInteractionPresentation(initial, catalog());
  return hostNmiLiveManagementIntelligence({
    catalog: catalog(),
    queueEntries: presentation.queueEntries ?? [],
    focusedSubjectId,
  });
}

function talk(
  utterance: string,
  previous?: ReturnType<typeof executeNexoraConversationalExperience>,
  hosted = live(),
  resolvedRuntime = previous?.nextRuntimeState,
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext: previous?.nextConversationContext,
    executiveContext: previous?.nextExecutiveContext,
    executiveSubjects: projectManagerObjectConversationalSubjects(catalog()),
    runtimeState:
      resolvedRuntime ??
      createInitialNexoraMVPObjectInteractionState({
        workspace: "overview",
        presentationState: "minimum",
        environmentIntent: "neutral",
      }),
    catalog: catalog(),
    previousManagerObjectSession: previous?.managerObjectTurn.session ?? createEmptyManagerObjectSession(),
    scenarioSession: previous?.nextScenarioSession ?? null,
    decisionSession: previous?.nextDecisionSession ?? null,
    messageIdSeed: `nmi-final-${utterance}`,
    nmiAdvisorBundle: hosted.advisorBundle,
  });
}

test("NMI:FINAL verifies one NMI:1–8 pipeline without NMI:9 or DTH-EXP", () => {
  assert.equal(verifyNmiAuthorityBoundary().ok, true);
  assert.equal(verifyNmiAdvisorIntegration().ok, true);
  assert.equal(verifyNmiLiveHost().ok, true);
  assert.equal(verifyExecutiveStageQueueFoundation().ok, true);
  assert.deepEqual([...NMI_LIVE_PIPELINE], [
    "CANONICAL_AUTHORITIES",
    "NMI_1_UNIFIED_MANAGEMENT_MODEL",
    "NMI_2_MANAGEMENT_MAP",
    "NMI_3_RELATIONSHIP_INTELLIGENCE",
    "NMI_4_DECISION_ROADMAP",
    "NMI_5_NAVIGATION_ATTENTION",
    "NMI_6_STAGE_PROJECTION",
    "NMI_7_ADVISOR_CONTEXT",
    "EXISTING_UI_STAGE_ADVISOR",
  ]);
  assert.equal(NMI_LIVE_HOST_CONTRACT.secondManagementStore, false);
  assert.equal(NMI_AUTHORITY_BOUNDARY.parallelObjectStore, false);
  assert.equal(NMI_AUTHORITY_BOUNDARY.parallelAdvisor, false);
  assert.equal(NMI_AUTHORITY_BOUNDARY.parallelStage, false);
  assert.equal(NMI_AUTHORITY_BOUNDARY.nmiGate, false);
  assert.equal(NMI_FOUNDATION_CONTRACT.mutatesObjects, false);
  assert.equal(NMI_CAUSAL_EVIDENCE_SAFETY.correlationToCausation, false);
  assert.equal(NMI_MANAGEMENT_NAVIGATION_CONTRACT.secondQueue, false);
  assert.equal(NMI_MANAGEMENT_NAVIGATION_CONTRACT.mapNodeImpliesAttention, false);
  assert.equal(NMI_STAGE_PROJECTION_CONTRACT.startsDthExp, false);
  assert.equal(NMI_ADVISOR_CONTRACT.secondAdvisor, false);
  assert.equal(NMI_LIVE_HOST_CONTRACT.startsDthExp, false);
  assert.equal(NMI_LIVE_HOST_CONTRACT.conversationalAuthority, conversationalExperienceIdentity);
  assert.equal(NMI_STAGE_PROJECTION_CONTRACT.presentationAuthority, DirectorFoundationId);
  assert.equal(existsSync(join(HERE, "nmi9.ts")), false);
  assert.equal(existsSync(join(FRONTEND, "artifacts/nmi/NMI-9")), false);
  const nmiFiles = readdirSync(HERE).filter((name) => name.startsWith("nmi") && name.toLowerCase().includes("nmi9"));
  assert.deepEqual(nmiFiles, []);
});

test("NMI:FINAL live host is a composer and preserves Map, Attention, Stage, and Advisor integrity", () => {
  const hosted = live();
  assert.equal(hosted.writesCanonical, false);
  assert.equal(hosted.secondManagementStore, false);
  assert.equal(hosted.model.contextKind, "UNKNOWN");
  assert.equal(hosted.model.nodes.some((node) => node.kind === "PROCESS"), false);
  assert.ok(hosted.map.nodes.some((node) => node.nodeId === "ctx-problem-capacity"));
  const operations = hosted.navigation.mapViews.find((view) => view.section === "OPERATIONS");
  assert.equal(operations?.count, 0);
  const queueIds = [...new Set(hosted.navigation.queueEntries.flatMap((entry) => [...entry.objectIds]))].sort();
  assert.deepEqual(hosted.navigation.attentionItems.map((item) => item.itemId).sort(), queueIds);
  assert.equal(hosted.advisorBundle.map, hosted.map);
  const projection = projectNmiLiveSelectionToStage({
    live: hosted,
    selectedCanonicalId: "ctx-problem-capacity",
    source: "MANAGEMENT_MAP",
  });
  assert.equal(projection.selectedCanonicalId, projection.projectionAnchorId);
  assert.equal(projection.projectionAnchorId, "ctx-problem-capacity");
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const handoff = handoffNmiStageProjectionToExistingStage({
    projection,
    interactionState: initial,
    catalog: catalog(),
  });
  assert.equal(handoff.nmiWroteStage, false);
  assert.equal(handoff.focusedSubjectId, "ctx-problem-capacity");
  const html = renderToStaticMarkup(
    React.createElement(NexoraExecutiveQueueOverlay, {
      entries: [
        {
          category: "problem",
          count: 1,
          objectIds: ["ctx-problem-capacity"],
          isSemanticObject: false,
          isActive: false,
        },
      ],
      mapNodes: hosted.overlayMapNodes,
      projectionAnchorId: "ctx-problem-capacity",
      onSelectCategory: () => undefined,
      onSelectCanonicalId: () => undefined,
    }),
  );
  assert.match(html, /data-nmi-live="8"/);
  assert.match(html, /data-nmi-map-node="ctx-problem-capacity"/);
  const shell = readFileSync(join(FRONTEND, "app/executive/nex-mvp/NexoraExecutiveShell.tsx"), "utf8");
  assert.match(shell, /hostNmiLiveManagementIntelligence/);
  assert.match(shell, /nmiAdvisorBundle:/);
  assert.doesNotMatch(readFileSync(join(HERE, "nmiLiveHost.ts"), "utf8"), /rmsGroundTruth/);
  assert.equal(NMI_LIVE_GATE_FLOW[0], "EXTERNAL_OR_INTERNAL_INPUT");
  assert.equal(NMI_GATE_BOUNDARY.gateApi, realDataIntegrationFoundationIdentity);
  assert.equal(NMI_RMS_BOUNDARY.nmiIsSimulationEngine, false);
  assert.equal(RMS_NEXORA_PARTICIPANT_CONTRACT.groundTruthAccess, "FORBIDDEN");
  assert.equal(rejectSealedRmsAdvisorFact("rms:ground-truth:secret").spoken, false);
  assert.equal(VAI_CAUSAL_SAFETY_BOUNDARY.parallelCausalTruthStore, false);
});

test("NMI:FINAL manager journey keeps Capacity Gap then explicitly switches to Margin Pressure", () => {
  const hosted = live();
  const attention = hosted.navigation.attentionItems.find((item) => item.itemId === "ctx-problem-capacity");
  assert.ok(attention);
  assert.ok(hosted.overlayMapNodes.some((node) => node.nodeId === "ctx-problem-capacity"));
  const initial = createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
  const selected = selectNexoraMVPInteractionSubject(initial, "ctx-problem-capacity", catalog());
  assert.equal(selected.focusedSubject?.id, "ctx-problem-capacity");
  const focusedHost = live("ctx-problem-capacity");
  let turn = talk("Explain it.", undefined, focusedHost, selected);
  assert.equal(turn.ncaTurn.reference.resolvedName, "Capacity Gap");
  turn = talk("What is related to it?", turn, focusedHost);
  assert.equal(turn.ncaTurn.reference.resolvedName, "Capacity Gap");
  assert.equal(turn.nmiAdvisorComposition?.activeCanonicalId, "ctx-problem-capacity");
  assert.match(turn.response, /related/i);
  turn = talk("Why is this in Attention?", turn, focusedHost);
  assert.equal(turn.ncaTurn.reference.resolvedName, "Capacity Gap");
  assert.match(turn.response, /Capacity Gap|Queue|Attention/i);
  turn = talk("Where are we with this problem?", turn, focusedHost);
  assert.equal(turn.ncaTurn.reference.resolvedName, "Capacity Gap");
  assert.equal(turn.nmiAdvisorComposition?.activeCanonicalId, "ctx-problem-capacity");
  assert.match(turn.response, /roadmap position|descriptive/i);
  turn = talk("What is missing?", turn, focusedHost);
  assert.equal(turn.nmiAdvisorComposition?.activeCanonicalId, "ctx-problem-capacity");
  assert.match(turn.response, /MISSING|UNRESOLVED|NOT_REACHED/);
  turn = talk("Explain Margin Pressure.", turn, focusedHost);
  turn = talk("What is related to it?", turn, focusedHost);
  assert.equal(turn.ncaTurn.reference.resolvedName, "Margin Pressure");
  assert.equal(turn.nmiAdvisorComposition?.activeCanonicalId, "ctx-problem-margin");
  assert.doesNotMatch(turn.response, /Capacity Gap is related/);
});
