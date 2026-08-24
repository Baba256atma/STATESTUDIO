/**
 * NCA:7 — Compose one manager-facing turn from certified NCA:1–6 outputs.
 * Does not invent conversation intelligence. Does not hide lower-layer defects.
 */

import {
  NCA7_CANONICAL_PRECEDENCE_NOTE,
  NEXORA_NCA7_BOUNDARY,
  nexoraNca7Identity,
  nexoraNca7Namespace,
  nexoraNca7Version,
  type Nca7PrecedenceRank,
  type Nca7ResponseOwner,
  type NexoraConversationTurnResult,
} from "./nexoraNca7EndToEndOrchestrationTypes.ts";

export {
  NCA7_CANONICAL_PRECEDENCE_NOTE,
  NCA7_PRECEDENCE,
  NEXORA_NCA7_BOUNDARY,
  nexoraNca7Identity,
  nexoraNca7Namespace,
  nexoraNca7Version,
} from "./nexoraNca7EndToEndOrchestrationTypes.ts";
export type {
  Nca7ResponseOwner,
  NexoraConversationTurnResult,
} from "./nexoraNca7EndToEndOrchestrationTypes.ts";

export function getNexoraNca7Identity() {
  return Object.freeze({
    id: nexoraNca7Identity,
    version: nexoraNca7Version,
    namespace: nexoraNca7Namespace,
  });
}

export function verifyNexoraNca7(): { readonly ok: true } {
  if (getNexoraNca7Identity().id !== nexoraNca7Identity) {
    throw new Error("NCA:7 identity mismatch");
  }
  if (NEXORA_NCA7_BOUNDARY.createsSeventhIntelligenceEngine) {
    throw new Error("NCA:7 must not become a seventh intelligence engine");
  }
  if (NEXORA_NCA7_BOUNDARY.usesLiveLlm) {
    throw new Error("NCA:7 must not claim a live LLM");
  }
  if (NEXORA_NCA7_BOUNDARY.hidesLowerLayerDefects) {
    throw new Error("NCA:7 must not hide lower-layer defects");
  }
  return Object.freeze({ ok: true as const });
}

type Loose = Record<string, unknown>;

function rec(value: unknown): Loose {
  return value && typeof value === "object" ? (value as Loose) : {};
}

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function at(root: unknown, path: readonly string[]): unknown {
  let current: unknown = root;
  for (const key of path) {
    if (!current || typeof current !== "object") return null;
    current = (current as Loose)[key];
  }
  return current;
}

function firstText(root: unknown, paths: readonly (readonly string[])[]): string | null {
  for (const path of paths) {
    const value = text(at(root, path));
    if (value) return value;
  }
  return null;
}

function firstBool(root: unknown, paths: readonly (readonly string[])[]): boolean {
  for (const path of paths) {
    const value = at(root, path);
    if (typeof value === "boolean") return value;
  }
  return false;
}

function resolveOwner(input: {
  readonly locked: boolean;
  readonly entranceOwned: boolean;
  readonly clarificationOwns: boolean;
  readonly decisionConfirmation: boolean;
  readonly executionConfirmation: boolean;
  readonly pendingAnswer: boolean;
  readonly shouldAsk: boolean;
  readonly managerRequestOwns: boolean;
  readonly shouldAdvise: boolean;
  readonly initiativeOwns: boolean;
}): { readonly owner: Nca7ResponseOwner; readonly action: string; readonly rank: Nca7PrecedenceRank } {
  if (input.clarificationOwns) {
    return {
      owner: "SAFETY",
      rank: "SAFETY_AUTHORITY",
      action: "Hold the turn until the manager's reference or confirmation is safe.",
    };
  }
  if (input.locked && input.entranceOwned) {
    return {
      owner: "ENTRANCE",
      rank: "ENTRANCE_JOURNEY",
      action: "Preserve NEX-EXP / journey ownership of the presented response.",
    };
  }
  if (input.decisionConfirmation) {
    return {
      owner: "DECISION_CONFIRMATION",
      rank: "DECISION_CONFIRMATION",
      action: "Keep Decision confirmation with existing CC Decision authority.",
    };
  }
  if (input.executionConfirmation) {
    return {
      owner: "EXECUTION_CONFIRMATION",
      rank: "EXECUTION_CONFIRMATION",
      action: "Keep Execution confirmation with existing CC Execution authority.",
    };
  }
  if (input.pendingAnswer && !input.shouldAsk) {
    return {
      owner: "NCA2_PENDING_ANSWER",
      rank: "NCA2_PENDING_ANSWER",
      action: "Treat the manager utterance as the answer to the pending Nexora question.",
    };
  }
  if (input.shouldAsk) {
    return {
      owner: "NCA3_GAP",
      rank: "NCA3_MATERIAL_GAP",
      action: "Ask one material question and withhold unsupported advice.",
    };
  }
  if (input.managerRequestOwns) {
    return {
      owner: "MANAGER_REQUEST",
      rank: "MANAGER_CURRENT_REQUEST",
      action: "Answer the manager's current request without layer hijack.",
    };
  }
  if (input.shouldAdvise) {
    return {
      owner: "NCA4_ADVISORY",
      rank: "NCA4_ADVISORY",
      action: "Present the justified advisory position without committing a Decision.",
    };
  }
  if (input.initiativeOwns) {
    return {
      owner: "NCA5_INITIATIVE",
      rank: "NCA5_JUSTIFIED_INITIATIVE",
      action: "Surface a justified initiative without mutating Decision or Execution.",
    };
  }
  return {
    owner: "MANAGER_REQUEST",
    rank: "MANAGER_CURRENT_REQUEST",
    action: "Keep one coherent manager-facing response.",
  };
}

function managerRequestOwns(need: string | null, shouldAsk: boolean, shouldAdvise: boolean): boolean {
  if (shouldAsk || shouldAdvise) return false;
  if (!need) return false;
  return /EXPLAIN|UNDERSTAND|TEACH|ORIENT|LOCATE|INVESTIGATE|SOCIAL|FOLLOW_UP|LEARN/i.test(
    need,
  );
}

export function composeNca7TurnResult(input: {
  readonly utterance: string;
  readonly response: string;
  readonly nca: unknown;
  readonly conversation: unknown;
  readonly nca3: unknown;
  readonly nca4: unknown;
  readonly nca5: unknown;
  readonly nca6: unknown;
  readonly locked?: boolean;
  readonly entranceOwned?: boolean;
  readonly clarificationOwns?: boolean;
  readonly decisionConfirmation?: boolean;
  readonly executionConfirmation?: boolean;
  readonly commitsDecision?: boolean;
  readonly startsExecution?: boolean;
  readonly writesBusinessTruth?: boolean;
}): NexoraConversationTurnResult {
  const conversation = rec(input.conversation);
  const nca5 = rec(input.nca5);
  const nca6 = rec(input.nca6);
  const need = firstText(input.nca, [
    ["need", "family"],
    ["need", "family"],
  ]);
  const reference = firstText(input.nca, [
    ["reference", "resolvedName"],
    ["reference", "resolvedName"],
    ["strategy", "subject"],
  ]);
  const behavior = firstText(input.nca, [["advisorBehavior"], ["advisorBehavior"]]);
  const shouldAsk = firstBool(input.nca3, [["shouldAsk"], ["shouldAsk"]]);
  const shouldAdvise = firstBool(input.nca4, [["shouldAdvise"], ["shouldAdvise"]]);
  const shouldInitiate = firstBool(nca5, [["shouldInitiate"], ["shouldInitiate"]]);
  const interruptJustified = firstBool(nca5, [
    ["decision", "interruption", "justified"],
    ["decision", "interruption", "justified"],
  ]);
  const dialogueMove = firstText(conversation, [["dialogueMove"], ["dialogueMove"]]);
  const pendingAnswer = /ANSWER_NEXORA/i.test(dialogueMove ?? "");
  const authority = resolveOwner({
    locked: Boolean(input.locked),
    entranceOwned: Boolean(input.entranceOwned),
    clarificationOwns: Boolean(input.clarificationOwns),
    decisionConfirmation: Boolean(input.decisionConfirmation),
    executionConfirmation: Boolean(input.executionConfirmation),
    pendingAnswer,
    shouldAsk,
    managerRequestOwns: managerRequestOwns(need, shouldAsk, shouldAdvise),
    shouldAdvise,
    initiativeOwns: shouldInitiate && (interruptJustified || !input.utterance.trim()),
  });
  const topic = firstText(conversation, [["activeTopic", "label"], ["activeTopic", "label"]]);
  const subject =
    firstText(conversation, [["activeSubject", "name"], ["activeSubject", "name"]]) ??
    reference;
  const pendingQuestion = firstText(conversation, [
    ["pendingQuestion", "question"],
    ["pendingQuestion", "question"],
  ]) ?? firstText(input.nca3, [["question"], ["question"]]);
  return Object.freeze({
    identity: nexoraNca7Identity,
    interpretation: Object.freeze({
      need,
      reference,
      behavior,
    }),
    dialogue: Object.freeze({
      topic,
      subject,
      move: dialogueMove,
      thread: firstText(conversation, [["currentThreadId"], ["currentThreadId"]]),
      pendingQuestion,
    }),
    sufficiency: Object.freeze({
      state: firstText(input.nca3, [["sufficiency"], ["sufficiency"]]),
      materialGap: firstText(input.nca3, [["gap", "id"], ["gap", "id"]]),
      shouldAsk,
    }),
    advisory: Object.freeze({
      shouldAdvise,
      status: firstText(input.nca4, [["position", "status"]]),
      option: firstText(input.nca4, [
        ["position", "recommendation", "optionLabel"],
        ["position", "recommendation", "optionLabel"],
      ]),
      confidence: firstText(input.nca4, [
        ["position", "confidence", "level"],
        ["position", "confidence"],
      ]),
    }),
    initiative: Object.freeze({
      shouldInitiate,
      behavior: firstText(nca5, [["decision", "behavior"], ["behavior"]]),
      interruptJustified,
    }),
    communication: Object.freeze({
      depth: firstText(nca6, [["strategy", "depth"], ["snapshot", "depth"]]),
      framing: firstText(nca6, [["strategy", "framing"], ["snapshot", "framing"]]),
      familiarity: firstText(nca6, [["snapshot", "familiarity"]]),
      role: firstText(nca6, [["snapshot", "role"]]),
    }),
    authority: Object.freeze(authority),
    response: Object.freeze({
      managerFacingText: input.response,
    }),
    effects: Object.freeze({
      commitsDecision: Boolean(input.commitsDecision),
      startsExecution: Boolean(input.startsExecution),
      writesBusinessTruth: Boolean(input.writesBusinessTruth),
    }),
    diagnosticTrace: formatNca7DiagnosticTrace({
      utterance: input.utterance,
      need,
      reference,
      topic,
      subject,
      move: dialogueMove,
      shouldAsk,
      sufficiency: firstText(input.nca3, [["sufficiency"], ["sufficiency"]]),
      shouldAdvise,
      option: firstText(input.nca4, [
        ["position", "recommendation", "optionLabel"],
        ["position", "recommendation", "optionLabel"],
      ]),
      status: firstText(input.nca4, [["position", "status"]]),
      shouldInitiate,
      interruptJustified,
      depth: firstText(nca6, [["strategy", "depth"]]),
      framing: firstText(nca6, [["strategy", "framing"]]),
      owner: authority.owner,
      response: input.response,
    }),
  });
}

export function formatNca7DiagnosticTrace(input: {
  readonly utterance: string;
  readonly need: string | null;
  readonly reference: string | null;
  readonly topic: string | null;
  readonly subject: string | null;
  readonly move: string | null;
  readonly shouldAsk: boolean;
  readonly sufficiency: string | null;
  readonly shouldAdvise: boolean;
  readonly option: string | null;
  readonly status: string | null;
  readonly shouldInitiate: boolean;
  readonly interruptJustified: boolean;
  readonly depth: string | null;
  readonly framing: string | null;
  readonly owner: Nca7ResponseOwner;
  readonly response: string;
}): string {
  return [
    `TURN Manager: “${input.utterance}”`,
    `NCA:1 Need = ${input.need ?? "UNKNOWN"} Reference = ${input.reference ?? "none"}`,
    `NCA:2 Topic = ${input.topic ?? "none"} Subject = ${input.subject ?? "none"} Dialogue = ${input.move ?? "UNKNOWN"}`,
    `NCA:3 Sufficiency = ${input.sufficiency ?? "unknown"} Ask = ${input.shouldAsk}`,
    `NCA:4 Advise = ${input.shouldAdvise} Position = ${input.option ?? "none"} Status = ${input.status ?? "none"}`,
    `NCA:5 Initiative = ${input.shouldInitiate ? "INITIATE" : "SILENT"} Interrupt = ${input.interruptJustified}`,
    `NCA:6 Depth = ${input.depth ?? "STANDARD"} Framing = ${input.framing ?? "NEUTRAL"}`,
    `Authority ${input.owner}`,
    `Response ${input.response}`,
  ].join("\n");
}

void NCA7_CANONICAL_PRECEDENCE_NOTE;
verifyNexoraNca7();
