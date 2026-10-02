/**
 * LLM-MVP:2 — bounded management context for the CC:5 LLM participant.
 * Deterministic fakes only. No network, keys, or vendor SDKs.
 */

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";

import { semanticCandidateIntelligenceIdentity } from "@/app/lib/data-reality/semanticCandidateIntelligence.ts";
import type { AdvisorDataContext } from "@/app/lib/manager-object/nexoraAdvisorDataContext.ts";
import { nexoraAdvisorDataContextIdentity } from "@/app/lib/manager-object/nexoraAdvisorDataContext.ts";
import { createEmptyConversationContinuity } from "@/app/lib/manager-object/conversationContinuitySnapshot.ts";
import { NEXORA_NCA1_BOUNDARY } from "@/app/lib/manager-object/nexoraNca1ConversationTypes.ts";
import {
  createInitialNexoraMVPObjectInteractionState,
  getDefaultNexoraMVPObjectInteractionCatalog,
  type NexoraMVPObjectInteractionCatalog,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NmiCanonicalRef } from "@/app/lib/nmi/nmiContract.ts";
import { composeNmiUnifiedManagementModel } from "@/app/lib/nmi/nmiFoundation.ts";
import { composeNmiManagementMap } from "@/app/lib/nmi/nmiManagementMapCompose.ts";
import type { NmiAdvisorBundle } from "@/app/lib/nmi/nmiAdvisorContract.ts";
import { nmiAdvisorIdentity } from "@/app/lib/nmi/nmiAdvisorIdentity.ts";
import type { NmiManagementRelationship } from "@/app/lib/nmi/nmiRelationshipContract.ts";
import { CONVERSATIONAL_EXPERIENCE_BOUNDARY } from "./conversationalExperience.ts";
import { executeNexoraConversationalExperience } from "./conversationalExperienceOrchestrator.ts";
import { projectDefaultNexoraMvpConversationalSubjects } from "./conversationalSubjectRegistry.ts";
import {
  NEXORA_LLM_CONTEXT_BOUNDS,
  NEXORA_LLM_CONTEXT_BOUNDARY,
  NEXORA_LLM_CONTEXT_OWNERS,
  nexoraLlmManagementContextIdentity,
  projectNexoraLlmManagementContext,
  readActiveScenarioContext,
  readDecisionContext,
  type NexoraLlmManagementContextInput,
} from "./nexoraLlmManagementContext.ts";
import {
  NEXORA_LLM_PARTICIPANT_BOUNDARY,
  type NexoraLlmConversationParticipant,
} from "./nexoraLlmConversationParticipant.ts";

function initialState() {
  return createInitialNexoraMVPObjectInteractionState({
    workspace: "overview",
    presentationState: "minimum",
    environmentIntent: "neutral",
  });
}

function catalogWithValues(
  values: Readonly<Record<string, string>>,
): NexoraMVPObjectInteractionCatalog {
  const base = getDefaultNexoraMVPObjectInteractionCatalog();
  return {
    ...base,
    objects: base.objects.map((object) =>
      values[object.id]
        ? { ...object, primaryValue: values[object.id], primaryMetricLabel: object.label }
        : object,
    ),
  };
}

function ref(id: string, kind: NmiCanonicalRef["kind"], authority: string): NmiCanonicalRef {
  return { id, kind, authority, sourceRef: `src:${id}` };
}

function rel(
  relationshipId: string,
  fromId: string,
  toId: string,
  kind: NmiManagementRelationship["kind"],
  epistemicStatus: NmiManagementRelationship["epistemicStatus"] = "DECLARED",
): NmiManagementRelationship {
  return {
    relationshipId,
    fromId,
    toId,
    kind,
    epistemicStatus,
    causal: false,
    convertsAssociationToCause: false,
    convertsAssumptionToFact: false,
    sourceAuthority: "canonical",
    sourceRef: relationshipId,
  };
}

function managementBundle(extra: readonly NmiManagementRelationship[] = []): NmiAdvisorBundle {
  const model = composeNmiUnifiedManagementModel({
    modelId: "llm-mvp2-plant",
    contextId: "bca:ctx:plant",
    contextKind: "BUSINESS",
    businessProjectRef: ref("org:plant", "BUSINESS_PROJECT", "BCA:1"),
    nodes: [
      ref("goal:otd", "GOAL", "MO:1"),
      ref("kpi:otd", "KPI", "KPI"),
      ref("data:otd", "DATA_EVIDENCE", "P0:1"),
      ref("ctx-problem-capacity", "PROBLEM", "MO:1"),
      ref("ctx-problem-margin", "PROBLEM", "MO:1"),
      ref("vai:capacity", "VARIABLE", "VAI:1"),
    ],
    relationships: [
      rel("rel:threat", "ctx-problem-capacity", "goal:otd", "threatens"),
      rel("rel:affects", "vai:capacity", "ctx-problem-capacity", "affects", "ASSOCIATION"),
      rel("rel:ev", "kpi:otd", "data:otd", "evidenced_by", "UNKNOWN"),
      rel("rel:margin", "ctx-problem-margin", "goal:otd", "threatens", "DECLARED"),
      ...extra,
    ],
    unresolvedRelationshipIds: ["rel:ev"],
  });
  return {
    map: composeNmiManagementMap({
      mapId: "map-llm-mvp2",
      model,
      annotations: [
        { id: "ctx-problem-capacity", title: "Capacity Gap" },
        { id: "ctx-problem-margin", title: "Margin Pressure" },
        { id: "data:otd", title: "OTD evidence", knownStatus: "UNRESOLVED" },
      ],
    }),
  };
}

function advisorData(): AdvisorDataContext {
  return {
    identity: nexoraAdvisorDataContextIdentity,
    workspaceId: "overview",
    sources: [
      {
        sourceContextId: "csv-capacity",
        sourceType: "csv",
        lifecycle: "committed",
        label: "capacity.csv",
        statusLabel: "Committed",
        description: "Capacity evidence",
        acceptedEvidence: true,
        relatedObjectLabels: ["Capacity"],
        relatedUncertainty: false,
        recordCount: 3,
        fields: [
          {
            sourceContextId: "csv-capacity",
            sourceLabel: "capacity.csv",
            column: "CAP_AV",
            fieldId: "field-cap-av",
            confirmedMeaning: "Available capacity",
            proposedMeaning: null,
            confirmationSource: "authoritative-mapping",
            confidence: "authoritative",
            ignored: false,
            semanticResolution: {
              state: "AUTHORITATIVE",
              candidates: [],
              requiresConfirmation: false,
              explanation: "Authoritative mapping.",
              authority: semanticCandidateIntelligenceIdentity,
            },
            observation: {
              rowCount: 3,
              nonNullCount: 3,
              uniqueCount: 2,
              numeric: true,
              minimum: 1,
              maximum: 3,
              average: 2,
            },
          },
        ],
      },
      {
        sourceContextId: "csv-revenue",
        sourceType: "csv",
        lifecycle: "committed",
        label: "revenue.csv",
        statusLabel: "Committed",
        description: "Revenue evidence",
        acceptedEvidence: true,
        relatedObjectLabels: ["Revenue"],
        relatedUncertainty: false,
        recordCount: 4,
        fields: [
          {
            sourceContextId: "csv-revenue",
            sourceLabel: "revenue.csv",
            column: "REV",
            fieldId: "field-rev",
            confirmedMeaning: "Revenue amount",
            proposedMeaning: null,
            confirmationSource: "manager",
            confidence: "confirmed",
            ignored: false,
            semanticResolution: {
              state: "MANAGER_CONFIRMED",
              candidates: [],
              requiresConfirmation: false,
              explanation: "Manager confirmed.",
              authority: semanticCandidateIntelligenceIdentity,
            },
            observation: {
              rowCount: 4,
              nonNullCount: 4,
              uniqueCount: 4,
              numeric: true,
              minimum: 10,
              maximum: 40,
              average: 25,
            },
          },
        ],
      },
    ],
  };
}

function run(
  utterance: string,
  options?: {
    readonly previous?: ReturnType<typeof executeNexoraConversationalExperience>;
    readonly llmParticipant?: NexoraLlmConversationParticipant | null;
    readonly seed?: string;
    readonly catalog?: NexoraMVPObjectInteractionCatalog;
    readonly nmiAdvisorBundle?: NmiAdvisorBundle | null;
    readonly previousUtterance?: string | null;
  },
) {
  return executeNexoraConversationalExperience({
    utterance,
    conversationContext:
      options?.previous?.nextConversationContext ??
      Object.freeze({
        currentSubjectId: null,
        previousSubjectIds: Object.freeze([] as string[]),
      }),
    executiveContext: options?.previous?.nextExecutiveContext,
    executiveSubjects: projectDefaultNexoraMvpConversationalSubjects(),
    runtimeState: options?.previous?.nextRuntimeState ?? initialState(),
    catalog: options?.catalog ?? getDefaultNexoraMVPObjectInteractionCatalog(),
    scenarioSession: options?.previous?.nextScenarioSession ?? null,
    decisionSession: options?.previous?.nextDecisionSession ?? null,
    previousManagerObjectSession: options?.previous?.managerObjectTurn.session ?? null,
    previousUtterance: options?.previousUtterance ?? null,
    nmiAdvisorBundle: options?.nmiAdvisorBundle,
    llmParticipant: options?.llmParticipant,
    messageIdSeed: options?.seed ?? `llm-mvp2-${utterance}`,
  });
}

function captureParticipant(): {
  readonly participant: NexoraLlmConversationParticipant;
  readonly requests: {
    readonly context: ReturnType<typeof projectNexoraLlmManagementContext>;
    readonly deterministicResponse: string;
  }[];
} {
  const requests: {
    readonly context: ReturnType<typeof projectNexoraLlmManagementContext>;
    readonly deterministicResponse: string;
  }[] = [];
  const participant: NexoraLlmConversationParticipant = Object.freeze({
    contribute(request) {
      requests.push(
        Object.freeze({
          context: request.managementContext,
          deterministicResponse: request.deterministicResponse,
        }),
      );
      return Object.freeze({ contribution: "Optional language overlay." });
    },
  });
  return { participant, requests };
}

function baseInput(
  overrides: Partial<NexoraLlmManagementContextInput> = {},
): NexoraLlmManagementContextInput {
  return {
    resolvedSubjectId: "obj-capacity",
    subjectLabel: "Capacity",
    subjectKind: "object",
    subjectEpistemic: "observed",
    referentId: "obj-capacity",
    referentProvenance: "conversation",
    utterance: "Why?",
    previousUtterance: "Focus on Capacity",
    advisorData: null,
    ...overrides,
  };
}

test("LLM-MVP:2 context projection does not own Nexora truth or a provider", () => {
  assert.equal(nexoraLlmManagementContextIdentity, "LLM-MVP:2/ManagementContextProjection");
  assert.equal(NEXORA_LLM_CONTEXT_OWNERS.nmi, "composeNmiAdvisorContext");
  assert.equal(NEXORA_LLM_CONTEXT_BOUNDARY.ownsMemory, false);
  assert.equal(NEXORA_LLM_CONTEXT_BOUNDARY.ownsReferent, false);
  assert.equal(NEXORA_LLM_CONTEXT_BOUNDARY.ownsNmi, false);
  assert.equal(NEXORA_LLM_CONTEXT_BOUNDARY.ownsDataReality, false);
  assert.equal(NEXORA_LLM_CONTEXT_BOUNDARY.ownsScenario, false);
  assert.equal(NEXORA_LLM_CONTEXT_BOUNDARY.ownsDecision, false);
  assert.equal(NEXORA_LLM_CONTEXT_BOUNDARY.mutatesCanonicalState, false);
  assert.equal(NEXORA_LLM_CONTEXT_BOUNDARY.providerNeutral, true);
  assert.equal(NEXORA_LLM_CONTEXT_BOUNDARY.usesLiveProvider, false);
  assert.equal(NEXORA_LLM_PARTICIPANT_BOUNDARY.replacesDeterministicResponse, false);
  assert.equal(NEXORA_NCA1_BOUNDARY.usesLiveLlm, false);
  assert.equal(CONVERSATIONAL_EXPERIENCE_BOUNDARY.usesLlmOrExternalProvider, false);
  const source = readFileSync(new URL("./nexoraLlmManagementContext.ts", import.meta.url), "utf8");
  assert.match(source, /composeNmiAdvisorContext/);
  assert.doesNotMatch(source, /composeNmiUnifiedManagementModel/);
  assert.doesNotMatch(source, /csvRealDataImportStore/);
  assert.doesNotMatch(source, /defineNexoraExecutiveScenario|commitNexora|openai|anthropic|ollama|\bjev\b/i);
});

test("A: resolved CC subject is the participant subject", () => {
  const captured = captureParticipant();
  const result = run("Focus on Capacity", {
    llmParticipant: captured.participant,
    seed: "llm-mvp2-a",
  });
  const context = captured.requests[0]?.context;
  assert.ok(context);
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(context.subject.canonicalId, "obj-capacity");
  assert.equal(context.subject.canonicalId, result.nextRuntimeState.focusedSubject?.id);
  assert.equal(context.subject.label, "Capacity");
  assert.equal(context.subject.epistemic, result.ncaTurn.knowledgeState.evidenceState);
  assert.equal(result.llmParticipantTurn?.deterministicResponse, result.response);
  assert.notEqual(result.response, "Optional language overlay.");
});

test("B: follow-up referent comes from NCA and the participant cannot replace it", () => {
  const focused = run("Focus on Capacity", { seed: "llm-mvp2-b-focus" });
  const captured = captureParticipant();
  const explained = run("Explain it.", {
    previous: focused,
    previousUtterance: "Focus on Capacity",
    llmParticipant: Object.freeze({
      contribute(request) {
        assert.throws(() => {
          (request.managementContext.referent as { canonicalId: string | null }).canonicalId =
            "obj-revenue";
        });
        captured.requests.push(
          Object.freeze({
            context: request.managementContext,
            deterministicResponse: request.deterministicResponse,
          }),
        );
        return Object.freeze({ contribution: "The subject is Revenue." });
      },
    }),
    seed: "llm-mvp2-b-explain",
  });
  const context = captured.requests[0]?.context;
  assert.ok(context);
  assert.equal(context.referent.canonicalId, explained.ncaTurn.reference.resolvedId);
  assert.equal(context.referent.canonicalId, "obj-capacity");
  assert.equal(context.subject.canonicalId, "obj-capacity");
  assert.equal(explained.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.notEqual(explained.response, "The subject is Revenue.");

  const why = run("Why?", {
    previous: focused,
    previousUtterance: "Focus on Capacity",
    llmParticipant: captured.participant,
    seed: "llm-mvp2-b-why",
  });
  assert.equal(captured.requests[1]?.context.referent.canonicalId, why.ncaTurn.reference.resolvedId);
  assert.equal(why.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(why.response, why.llmParticipantTurn?.deterministicResponse);
});

test("C/G/H/I: NMI context is the existing advisor projection, bounded to the subject", () => {
  const captured = captureParticipant();
  const result = run("Where is this in my business?", {
    previous: run("Focus on Capacity", { seed: "llm-mvp2-c-focus" }),
    nmiAdvisorBundle: managementBundle(),
    llmParticipant: captured.participant,
    seed: "llm-mvp2-c",
  });
  const context = captured.requests[0]?.context;
  assert.ok(context);
  assert.equal(context.management.projection, nmiAdvisorIdentity);
  assert.equal(context.subject.canonicalId, result.ncaTurn.reference.resolvedId ?? "obj-capacity");
  const serialized = JSON.stringify(context);
  assert.equal(serialized.includes("ctx-problem-margin"), false);
  assert.equal(serialized.includes("Margin Pressure"), false);
  const direct = projectNexoraLlmManagementContext(
    baseInput({
      resolvedSubjectId: "ctx-problem-capacity",
      subjectLabel: "Capacity Gap",
      subjectKind: "problem",
      referentId: "ctx-problem-capacity",
      nmiBundle: managementBundle(),
      advisorData: null,
    }),
  );
  assert.equal(direct.management.projection, nmiAdvisorIdentity);
  assert.ok(direct.management.refs.some((item) => item.id === "ctx-problem-capacity"));
  assert.ok(direct.management.refs.some((item) => item.epistemic === "ASSOCIATION"));
  assert.ok(direct.management.refs.some((item) => item.provenanceId === "canonical"));
  assert.equal(JSON.stringify(direct).includes("ctx-problem-margin"), false);
  assert.equal(JSON.stringify(direct).includes("calculated"), false);
  assert.equal(JSON.stringify(direct).includes("estimated"), false);
  const evidenceNode = projectNexoraLlmManagementContext(
    baseInput({
      resolvedSubjectId: "data:otd",
      subjectLabel: "OTD evidence",
      referentId: "data:otd",
      nmiBundle: managementBundle(),
    }),
  );
  assert.equal(
    evidenceNode.management.refs.find((item) => item.id === "data:otd")?.epistemic,
    "UNRESOLVED",
  );
  assert.equal(evidenceNode.subject.epistemic, "observed");
});

test("D/G: Data Reality and CSV evidence stay on the subject", () => {
  const catalog = catalogWithValues({
    "obj-capacity": "82.0%",
    "obj-revenue": "10.0%",
    "obj-delivery": "64.0%",
  });
  const captured = captureParticipant();
  const result = run("Focus on Capacity", {
    catalog,
    llmParticipant: captured.participant,
    seed: "llm-mvp2-d",
  });
  const live = captured.requests[0]?.context;
  assert.ok(live);
  assert.equal(result.response, "Focused on Capacity.");
  assert.ok(live.dataReality.refs.some((item) => item.id === "obj-capacity" && item.value === "82.0%"));
  assert.equal(live.dataReality.refs.some((item) => item.id === "obj-revenue"), false);
  assert.equal(live.dataReality.refs.some((item) => item.id === "obj-delivery"), false);
  assert.ok(live.dataReality.projections.includes(NEXORA_LLM_CONTEXT_OWNERS.dataRealityCatalog));

  const projected = projectNexoraLlmManagementContext(
    baseInput({
      catalog,
      advisorData: advisorData(),
      comparisonCandidateIds: ["obj-delivery"],
    }),
  );
  const dataIds = projected.dataReality.refs.map((item) => item.id);
  assert.ok(dataIds.includes("obj-capacity"));
  assert.ok(dataIds.includes("obj-delivery"));
  assert.equal(dataIds.includes("obj-revenue"), false);
  assert.ok(dataIds.includes("field-cap-av"));
  assert.equal(dataIds.includes("field-rev"), false);
  const field = projected.dataReality.refs.find((item) => item.id === "field-cap-av");
  assert.equal(field?.kind, "data-reality-field");
  assert.equal(field?.epistemic, "authoritative");
  assert.equal(field?.provenanceId, "csv-capacity");
  assert.match(field?.value ?? "", /Available capacity/);
  assert.equal(projected.dataReality.refs.find((item) => item.id === "obj-capacity")?.epistemic, null);
  const secret = projectNexoraLlmManagementContext(
    baseInput({
      catalog: catalogWithValues({ "obj-capacity": "sk-abcdefghijklmnop" }),
      advisorData: null,
    }),
  );
  assert.equal(secret.dataReality.refs.some((item) => item.id === "obj-capacity"), false);
  assert.equal(JSON.stringify(secret).includes("sk-"), false);
});

test("E: conversation continuity is a bounded slice and is not stored as LLM memory", () => {
  const continuity = {
    ...createEmptyConversationContinuity(),
    thread: Object.freeze(
      [0, 1, 2, 3, 4].map((turnIndex) =>
        Object.freeze({
          subjectId: `obj-${turnIndex}`,
          subjectKind: "object",
          operation: "EXPLAIN" as const,
          turnIndex,
        }),
      ),
    ),
  };
  const first = projectNexoraLlmManagementContext(
    baseInput({
      utterance: "Why?",
      previousUtterance: "Focus on Capacity",
      continuity,
    }),
  );
  assert.equal(first.conversation.projection, NEXORA_LLM_CONTEXT_OWNERS.conversation);
  assert.equal(first.conversation.currentUtterance, "Why?");
  assert.equal(first.conversation.previousUtterance, "Focus on Capacity");
  assert.equal(first.conversation.frames.length, NEXORA_LLM_CONTEXT_BOUNDS.conversationFrames);
  assert.deepEqual(
    first.conversation.frames.map((frame) => frame.subjectId),
    ["obj-2", "obj-3", "obj-4"],
  );
  const second = projectNexoraLlmManagementContext(
    baseInput({
      continuity: {
        ...createEmptyConversationContinuity(),
        thread: Object.freeze([
          Object.freeze({
            subjectId: "obj-capacity",
            subjectKind: "object",
            operation: "FOCUS" as const,
            turnIndex: 1,
          }),
        ]),
      },
    }),
  );
  assert.equal(second.conversation.frames.length, 1);
  assert.equal(second.conversation.frames[0]?.subjectId, "obj-capacity");
  const source = readFileSync(new URL("./nexoraLlmManagementContext.ts", import.meta.url), "utf8");
  assert.doesNotMatch(source, /llmMessages|providerThread|conversationMemory/);
});

test("F: oversized context is reduced to the declared bounds", () => {
  const extra = Array.from({ length: 8 }, (_, index) =>
    rel(`rel:extra-${index}`, "ctx-problem-capacity", "goal:otd", "supports", "DECLARED"),
  );
  extra.push(rel("rel:overflow-marker", "ctx-problem-capacity", "goal:otd", "supports"));
  const projected = projectNexoraLlmManagementContext(
    baseInput({
      resolvedSubjectId: "ctx-problem-capacity",
      referentId: "ctx-problem-capacity",
      nmiBundle: managementBundle(extra),
      utterance: "C".repeat(400),
      catalog: {
        objects: ["obj-capacity", "obj-a", "obj-b", "obj-c", "obj-d", "obj-e", "obj-f"].map(
          (id) => ({ id, label: id, primaryValue: `${id}-value` }),
        ),
      },
      comparisonCandidateIds: ["obj-a", "obj-b", "obj-c", "obj-d", "obj-e", "obj-f"],
      advisorData: null,
    }),
  );
  assert.equal(projected.management.refs.length, NEXORA_LLM_CONTEXT_BOUNDS.managementRefs);
  assert.equal(
    projected.management.refs.some((item) => item.id === "rel:overflow-marker"),
    false,
  );
  assert.equal(projected.dataReality.refs.length, NEXORA_LLM_CONTEXT_BOUNDS.dataRealityRefs);
  assert.equal(projected.dataReality.refs.some((item) => item.id === "obj-f"), false);
  assert.equal(projected.conversation.currentUtterance.length, NEXORA_LLM_CONTEXT_BOUNDS.utteranceChars);
  assert.equal(projected.scenario.refs.length <= NEXORA_LLM_CONTEXT_BOUNDS.scenarioRefs, true);
  assert.equal(projected.decision.refs.length <= NEXORA_LLM_CONTEXT_BOUNDS.decisionRefs, true);
  assert.equal(JSON.parse(JSON.stringify(projected)).identity, nexoraLlmManagementContextIdentity);
});

test("J: scenario and decision context is read-only", () => {
  const session = Object.freeze({
    activeScenarioId: "sc-capacity",
    scenariosById: Object.freeze({
      "sc-capacity": Object.freeze({
        scenarioId: "sc-capacity",
        name: "Capacity plan",
        status: "defined",
        sourceSubjectId: "obj-capacity",
        subjectIds: Object.freeze(["obj-capacity"]),
      }),
      "sc-revenue": Object.freeze({
        scenarioId: "sc-revenue",
        name: "Revenue plan",
        status: "defined",
        sourceSubjectId: "obj-revenue",
        subjectIds: Object.freeze(["obj-revenue"]),
      }),
    }),
  });
  const before = JSON.stringify(session);
  const scenario = readActiveScenarioContext(session, "obj-capacity");
  assert.equal(JSON.stringify(session), before);
  assert.equal(scenario?.scenarioId, "sc-capacity");
  const projected = projectNexoraLlmManagementContext(
    baseInput({
      scenario,
      decision: readDecisionContext({
        session: {
          pendingConfirmation: null,
          lastReferencedDecisionId: "dec-revenue",
          provenanceByDecisionId: {
            "dec-revenue": {
              scenarioId: "sc-revenue",
              evidenceRefs: [{ sourceId: "ev-revenue", subjectId: "obj-revenue" }],
            },
          },
        },
        committed: {
          decisionId: "dec-capacity",
          title: "Expand capacity",
          status: "Approved",
          subjectIds: ["obj-capacity"],
          evidenceRefs: [{ sourceId: "kpi:otd", subjectId: "obj-capacity" }],
        },
        subjectId: "obj-capacity",
      }),
    }),
  );
  assert.equal(projected.scenario.refs.length, 1);
  assert.equal(projected.scenario.refs[0]?.id, "sc-capacity");
  assert.equal(projected.scenario.refs[0]?.epistemic, null);
  assert.equal(JSON.stringify(projected).includes("sc-revenue"), false);
  assert.equal(projected.decision.refs[0]?.id, "dec-capacity");
  assert.equal(projected.decision.refs[0]?.value, "Approved");
  assert.equal(projected.decision.refs[0]?.provenanceId, "kpi:otd");
  assert.equal(projected.decision.refs[0]?.epistemic, null);
  assert.equal(
    readDecisionContext({
      session: {
        pendingConfirmation: null,
        lastReferencedDecisionId: "dec-revenue",
        provenanceByDecisionId: {
          "dec-revenue": {
            evidenceRefs: [{ sourceId: "ev-revenue", subjectId: "obj-revenue" }],
          },
        },
      },
      committed: null,
      subjectId: "obj-capacity",
    }),
    null,
  );

  const inventory = run("Focus on Inventory", { seed: "llm-mvp2-j-focus" });
  const whatIf = run("what happend if increase inventory", {
    previous: inventory,
    llmParticipant: Object.freeze({
      contribute: () => Object.freeze({ contribution: "Created scenario S-NEW and committed decision D-NEW." }),
    }),
    seed: "llm-mvp2-j-whatif",
  });
  const quiet = run("Why?", { previous: whatIf, seed: "llm-mvp2-j-why" });
  const noisy = run("Why?", {
    previous: whatIf,
    llmParticipant: Object.freeze({
      contribute: () => Object.freeze({ contribution: "Commit the decision and open another scenario." }),
    }),
    seed: "llm-mvp2-j-why",
  });
  assert.ok(whatIf.scenarioResult?.scenario);
  assert.equal(whatIf.decisionCommitmentResult, null);
  assert.equal(noisy.response, quiet.response);
  assert.equal(noisy.nextScenarioSession?.activeScenarioId, quiet.nextScenarioSession?.activeScenarioId);
  assert.equal(noisy.decisionCommitmentResult, null);
  assert.equal(noisy.response, noisy.llmParticipantTurn?.deterministicResponse);
});

test("K: context projection failure still returns deterministic D", () => {
  const nmiAdvisorBundle = {
    get map(): NmiAdvisorBundle["map"] {
      throw new Error("llm context boom");
    },
  } as NmiAdvisorBundle;
  let called = false;
  const result = run("Focus on Capacity", {
    nmiAdvisorBundle,
    llmParticipant: Object.freeze({
      contribute() {
        called = true;
        return Object.freeze({ contribution: "should not run" });
      },
    }),
    seed: "llm-mvp2-k",
  });
  assert.equal(called, false);
  assert.equal(result.response, "Focused on Capacity.");
  assert.equal(result.nexoraMessage.text, "Focused on Capacity.");
  assert.equal(result.nextRuntimeState.focusedSubject?.id, "obj-capacity");
  assert.equal(result.llmParticipantTurn?.status, "failed");
  assert.equal(result.llmParticipantTurn?.invoked, false);
  assert.equal(result.llmParticipantTurn?.fallbackUsed, true);
  assert.equal(result.llmParticipantTurn?.contribution, null);
});

test("L: phase-1 participant outcomes still keep D", () => {
  const absent = run("Focus on Capacity", { seed: "llm-mvp2-l-absent" });
  assert.equal(absent.response, "Focused on Capacity.");
  assert.equal(absent.llmParticipantTurn?.status, "not-configured");

  const succeeded = run("Focus on Capacity", {
    llmParticipant: Object.freeze({
      contribute: () => Object.freeze({ contribution: "Optional language overlay." }),
    }),
    seed: "llm-mvp2-l-ok",
  });
  assert.equal(succeeded.response, "Focused on Capacity.");
  assert.equal(succeeded.llmParticipantTurn?.status, "succeeded");
  assert.equal(succeeded.llmParticipantTurn?.contribution, "Optional language overlay.");

  const failed = run("Focus on Capacity", {
    llmParticipant: Object.freeze({
      contribute() {
        throw new Error("participant boom");
      },
    }),
    seed: "llm-mvp2-l-fail",
  });
  assert.equal(failed.response, "Focused on Capacity.");
  assert.equal(failed.llmParticipantTurn?.status, "failed");
  assert.equal(failed.llmParticipantTurn?.invoked, true);
  assert.equal(failed.llmParticipantTurn?.contribution, null);

  const rejected = run("Focus on Capacity", {
    llmParticipant: Object.freeze({
      contribute: () => Object.freeze({ contribution: "   " }),
    }),
    seed: "llm-mvp2-l-reject",
  });
  assert.equal(rejected.response, "Focused on Capacity.");
  assert.equal(rejected.llmParticipantTurn?.status, "rejected");
});

test("M: CSV semantic early-return does not create a second LLM context authority", () => {
  const shell = readFileSync(
    new URL("../../executive/nex-mvp/NexoraExecutiveShell.tsx", import.meta.url),
    "utf8",
  );
  const orchestrator = readFileSync(
    new URL("./conversationalExperienceOrchestrator.ts", import.meta.url),
    "utf8",
  );
  assert.match(shell, /DATA-ADV and CSV field Q&A are owned by CC:5/);
  assert.match(shell, /answerCsvSemanticInquiry/);
  assert.match(shell, /second LLM participant or context authority/);
  assert.doesNotMatch(shell, /nexoraLlmConversationParticipant|nexoraLlmManagementContext|invokeNexoraLlmConversationParticipant/);
  assert.match(orchestrator, /invokeNexoraLlmConversationParticipant/);
  assert.equal(orchestrator.split("invokeNexoraLlmConversationParticipant(").length, 2);
});
