/**
 * NPA-T RMS:8 — customer presentation projection.
 * Formats manager-visible state. Does not invent Problems or hidden causes.
 */

import { RMS_8_BOUNDARY, type RmsWatchConversationTurn, type RmsWatchMoment, type RmsWatchPresentation, type RmsWatchProgress, type RmsWatchSafeSurface, type RmsWatchScenarioCard } from "./rmsWatchContract.ts";

const HIDDEN = /machineAvailability|availableCapacity|"evt:|Ground Truth|MACHINE_FAILURE|DEMAND_SURGE|\bCC:5\b|\bRDI:|\bVAI:|NCA\/ECA|OPERATOR_ERROR|CAUSAL_OVERCLAIM|information-bounded/i;

export function assertRmsWatchCustomerSafe(payload: unknown): void {
  const text = JSON.stringify(payload);
  if (HIDDEN.test(text)) {
    throw new Error("RMS:8 customer WATCH payload must not leak hidden simulation material");
  }
}

export function projectRmsWatchPresentation(input: {
  readonly surface: RmsWatchSafeSurface;
  readonly card: RmsWatchScenarioCard;
  readonly organizationLabel: string;
}): RmsWatchPresentation {
  if (RMS_8_BOUNDARY.inventsProblems || RMS_8_BOUNDARY.rewritesNexoraResponses) {
    throw new Error("RMS:8 must not invent Problems or rewrite Nexora");
  }
  const moments: RmsWatchMoment[] = [
    Object.freeze({
      momentId: "moment:start",
      kind: "SIMULATION_STARTED",
      label: "Simulation starts",
      summary: `${input.organizationLabel} is operating. A Simulated Manager is working with Nexora.`,
      conversationTurnIndex: null,
      invented: false,
    }),
  ];
  const available = input.surface.data.filter((item) => item.status === "AVAILABLE");
  if (available.length > 0) {
    moments.push(
      Object.freeze({
        momentId: "moment:data",
        kind: "DATA_CHANGE",
        label: "Operational data is visible",
        summary: `Visible readings: ${available.map((item) => item.field).join(", ")}.`,
        conversationTurnIndex: null,
        invented: false,
      }),
    );
  }
  const conversation: RmsWatchConversationTurn[] = [];
  for (const turn of input.surface.turns) {
    conversation.push(
      Object.freeze({
        turnIndex: turn.turnIndex,
        speaker: "SIMULATED_MANAGER",
        managerLabel: "Simulated Manager",
        nexoraLabel: "Nexora",
        text: turn.utterance,
        rewritten: false,
        focusedSubjectId: turn.focusedSubjectId,
        focusedSubjectLabel: turn.focusedSubjectLabel,
      }),
    );
    conversation.push(
      Object.freeze({
        turnIndex: turn.turnIndex,
        speaker: "NEXORA",
        managerLabel: "Simulated Manager",
        nexoraLabel: "Nexora",
        text: turn.nexoraResponse,
        rewritten: false,
        focusedSubjectId: turn.focusedSubjectId,
        focusedSubjectLabel: turn.focusedSubjectLabel,
      }),
    );
    moments.push(
      Object.freeze({
        momentId: `moment:mgr:${turn.turnIndex}`,
        kind: turn.intent === "INVESTIGATE" ? "INVESTIGATION" : "MANAGER_QUESTION",
        label: "Simulated Manager asks Nexora",
        summary: turn.utterance,
        conversationTurnIndex: turn.turnIndex,
        invented: false,
      }),
    );
    moments.push(
      Object.freeze({
        momentId: `moment:nexora:${turn.turnIndex}`,
        kind: turn.focusedSubjectLabel ? "NEXORA_ATTENTION" : "NEXORA_ATTENTION",
        label: turn.focusedSubjectLabel ? `Nexora attention: ${turn.focusedSubjectLabel}` : "Nexora responds",
        summary: turn.nexoraResponse.slice(0, 180),
        conversationTurnIndex: turn.turnIndex,
        invented: false,
      }),
    );
    if (turn.focusedSubjectLabel && /problem|risk|gap|pressure/i.test(turn.focusedSubjectLabel)) {
      moments.push(
        Object.freeze({
          momentId: `moment:focus:${turn.turnIndex}`,
          kind: /risk/i.test(turn.focusedSubjectLabel) ? "RISK_IDENTIFIED" : "PROBLEM_IDENTIFIED",
          label: `Nexora focuses ${turn.focusedSubjectLabel}`,
          summary: `Nexora's Stage attention is on ${turn.focusedSubjectLabel}.`,
          conversationTurnIndex: turn.turnIndex,
          invented: false,
        }),
      );
    }
    if (turn.confirmationRequired) {
      moments.push(
        Object.freeze({
          momentId: `moment:ready:${turn.turnIndex}`,
          kind: "DECISION_READINESS",
          label: "Decision confirmation is required",
          summary: "Nexora is waiting for confirmation before a decision commitment.",
          conversationTurnIndex: turn.turnIndex,
          invented: false,
        }),
      );
    }
  }
  const dataNames = available.map((item) => item.field);
  const lastAsk = input.surface.turns[input.surface.turns.length - 1]?.utterance ?? "The Simulated Manager has not spoken yet.";
  const lastFocus = input.surface.stage.focusedSubjectLabel;
  const presentation: RmsWatchPresentation = Object.freeze({
    scenario: input.card,
    organizationLabel: input.organizationLabel,
    managerLabel: "Simulated Manager",
    managerObjective: input.surface.managerObjective,
    moments: Object.freeze(moments),
    conversation: Object.freeze(conversation),
    data: input.surface.data,
    stage: input.surface.stage,
    whatChanged: dataNames.length
      ? `Operational readings visible to the Manager now include ${dataNames.join(", ")}. Field meanings remain unconfirmed unless Nexora has confirmed them.`
      : "The situation is beginning. Visible operational readings have not yet arrived.",
    whyNexoraReacted: lastFocus
      ? `The Simulated Manager asked: “${lastAsk}” Visible data included ${dataNames.join(", ") || "no confirmed readings"}. Nexora's Stage attention is ${lastFocus}.`
      : `The Simulated Manager asked: “${lastAsk}” Nexora responded from the live conversation. No hidden simulation cause was used.`,
    guidance: Object.freeze([
      "Watch how Nexora separates observed data from possible causes.",
      "Notice that Nexora may ask for more information before confirming a cause.",
      "The Simulated Manager can then investigate possible actions.",
    ]),
    takeControlReserved: true,
    takeControlImplemented: false,
    forkCompatible: true,
    sealedGroundTruthExposed: false,
    observerDiagnosticsExposed: false,
  });
  assertRmsWatchCustomerSafe(presentation);
  return presentation;
}

export function progressForCursor(moments: readonly RmsWatchMoment[], cursor: number): RmsWatchProgress {
  const visible = moments.slice(0, Math.max(0, cursor) + 1);
  if (visible.some((item) => item.kind === "NEXORA_ATTENTION" || item.kind === "PROBLEM_IDENTIFIED")) return "Management Response";
  if (visible.some((item) => item.kind === "MANAGER_QUESTION" || item.kind === "INVESTIGATION")) return "Investigation";
  if (visible.some((item) => item.kind === "DATA_CHANGE" || item.kind === "KPI_CHANGE")) return "Situation Developing";
  return "Beginning";
}

export function verifyRmsWatchExperience(): { readonly ok: true } {
  if (RMS_8_BOUNDARY.ownsStage || RMS_8_BOUNDARY.ownsAdvisor) throw new Error("RMS:8 must not own Stage/Advisor");
  if (RMS_8_BOUNDARY.startsRms9) throw new Error("RMS:8 must not start RMS:9");
  if (RMS_8_BOUNDARY.takeControlImplemented || RMS_8_BOUNDARY.experimentImplemented) {
    throw new Error("RMS:8 must not implement TAKE_CONTROL or EXPERIMENT");
  }
  return Object.freeze({ ok: true as const });
}
