/**
 * NEX-ENT:6 — teaches Data & Evidence. Does not own Data UX, RDI, semantics, or DIR:GA.
 */

import { interpretCsvSemantics } from "@/app/lib/data-reality/csvSemanticUnderstanding.ts";
import {
  parseCsvDeterministically,
  suggestCsvColumnMappings,
  type CsvVerticalSliceInput,
} from "@/app/lib/data-reality/csvRealDataVerticalSlice.ts";
import type { NexoraMVPObjectInteractionState } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction.ts";
import type { NexoraGuidedAttentionTarget } from "@/app/lib/director/nexoraGuidedAttentionPresentation.ts";
import type { NexoraEntranceSession } from "./nexoraEntranceTypes.ts";
import type { NexoraGuidedEntranceTurnResult } from "./nexoraGuidedEntranceExperience.ts";
import {
  NEXORA_DATA_EDUCATION_CHOICE_ACTIONS,
  NEXORA_DATA_EDUCATION_QUESTION_ACTIONS,
  inactiveNexoraDataEducationSession,
  verifyNexoraDataEducation,
  type NexoraDataEducationSession,
  type NexoraDataEducationState,
  type NexoraGuidedEntranceSuggestedAction,
  type NexoraStagePresentationCue,
} from "./nexoraGuidedEntranceTypes.ts";
import {
  attentionEducationOf,
  classifyAttentionEducationMove,
} from "./nexoraAttentionEducationExperience.ts";

export {
  NEXORA_DATA_EDUCATION_BOUNDARY,
  NEXORA_DATA_EDUCATION_CHOICE_ACTIONS,
  getNexoraDataEducationIdentity,
  inactiveNexoraDataEducationSession,
  verifyNexoraDataEducation,
} from "./nexoraGuidedEntranceTypes.ts";

const EXAMPLE_CSV =
  "DT,ORD_QTY,OTD,CAP_AV,BKL\n2026-05-01,1310,89.8,805,280\n2026-06-01,1370,90.1,815,295";
const UNKNOWN_CSV = "date,value,status,index\n2026-08-01,4,ok,1";

const SOURCE_COPY =
  "You’ve seen how we work together. Now let me show you where my understanding of the real situation comes from. Data is where you can bring information into Nexora. I won’t open it for you — you’re in control. We can look at how Data works using an example, or you can use your own CSV.";

const PREVIEW_COPY =
  "This is example data from a certified production fixture, not your business library. Uploading a file doesn’t automatically make it accepted evidence. You can review what Nexora found before using a source.";

const OWN_CSV_COPY =
  "Use Data to choose your CSV. I won’t open the file chooser for you. Pending review is not accepted evidence until you use the source.";

const MEANING_LEAD =
  "I can see the fields in this example source. Seeing a field and understanding its business meaning are different things.";

const EVIDENCE_COPY =
  "Once the important fields are understood, Nexora can use a source as evidence about the situation. Evidence helps us understand what is happening. It doesn’t automatically prove why it happened.";

const DATA_OBJECT_COPY =
  "Nexora can keep a data source visible as a Data Object so you can inspect where evidence comes from. That is not a Goal, Problem, Scenario, or Decision. Data is where you manage sources; the Stage is where we work with the current situation.";

const REVIEW_COPY =
  "Nexora keeps the source visible, interprets meaning carefully, asks when it isn’t sure, and does not treat raw data as automatic business truth.";

export type NexoraDataEducationMove =
  | "NEXT"
  | "EXAMPLE"
  | "OWN_CSV"
  | "SKIP"
  | "FIELD"
  | "WHY_ASK"
  | "UNSURE"
  | "CORRECT"
  | "CAUSE"
  | "DECISION"
  | "REMOVE"
  | "UPDATE"
  | "CHART"
  | "SAFETY"
  | "SOURCE_Q"
  | "PERSIST"
  | "RAIL"
  | "OBJECT_Q";

export function dataEducationOf(
  session: NexoraEntranceSession | null | undefined,
): NexoraDataEducationSession {
  return (
    session?.guidedIntroduction?.dataEducation ??
    inactiveNexoraDataEducationSession()
  );
}

export function isNexoraDataEducationActive(
  session: NexoraEntranceSession | null | undefined,
): boolean {
  const state = dataEducationOf(session).state;
  return state !== "NOT_STARTED" && state !== "SKIPPED";
}

export function shouldBeginNexoraDataEducation(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (isNexoraDataEducationActive(session)) return false;
  const attention = attentionEducationOf(session).state;
  if (attention !== "REVIEW" && attention !== "COMPLETED") return false;
  const attentionMove = classifyAttentionEducationMove(utterance);
  const dataMove = classifyDataEducationMove(utterance);
  return (
    attentionMove === "NEXT" ||
    dataMove === "NEXT" ||
    dataMove === "EXAMPLE" ||
    dataMove === "OWN_CSV"
  );
}

export function shouldNexoraDataEducationOwnUtterance(
  session: NexoraEntranceSession | null | undefined,
  utterance: string,
): boolean {
  if (shouldBeginNexoraDataEducation(session, utterance)) return true;
  if (!isNexoraDataEducationActive(session)) return false;
  return classifyDataEducationMove(utterance) != null;
}

export function resolveNexoraDataEducationTurn(input: {
  readonly utterance: string;
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
}): NexoraGuidedEntranceTurnResult {
  verifyNexoraDataEducation();
  const move = classifyDataEducationMove(input.utterance);
  const education = dataEducationOf(input.session);
  if (!isNexoraDataEducationActive(input.session)) {
    if (shouldBeginNexoraDataEducation(input.session, input.utterance)) {
      return presentStep(
        input.session,
        input.runtimeState,
        { state: "SOURCE", examplePath: false },
        SOURCE_COPY,
        "DATA_ENTRY",
      );
    }
    return idle(input.session, input.runtimeState);
  }
  if (move === "SKIP") {
    return presentStep(
      input.session,
      input.runtimeState,
      { state: "SKIPPED", examplePath: education.examplePath },
      "That’s fine. Your Data Library is unchanged. You can open Data whenever you want.",
      null,
    );
  }
  if (move === "EXAMPLE") {
    return presentStep(
      input.session,
      input.runtimeState,
      { state: "PREVIEW", examplePath: true },
      PREVIEW_COPY,
      "DATA_ENTRY",
    );
  }
  if (move === "OWN_CSV") {
    return presentStep(
      input.session,
      input.runtimeState,
      { state: "PREVIEW", examplePath: false },
      OWN_CSV_COPY,
      "DATA_ENTRY",
    );
  }
  if (move === "FIELD") {
    return presentStep(
      input.session,
      input.runtimeState,
      education,
      fieldCopy(input.utterance, education.examplePath),
      null,
    );
  }
  if (move === "WHY_ASK") {
    return presentStep(input.session, input.runtimeState, education, whyAskingCopy(), null);
  }
  if (move === "UNSURE") {
    return presentStep(
      input.session,
      input.runtimeState,
      education,
      "That’s fine. I’ll keep it unresolved rather than guessing. This example is not accepted evidence.",
      null,
    );
  }
  if (move === "CORRECT") {
    return presentStep(
      input.session,
      input.runtimeState,
      education,
      "Nexora can propose a meaning, and you can correct it. Confirmation is recorded only on that source, through the existing Data conversation — not by this introduction.",
      null,
    );
  }
  if (move === "CAUSE") {
    return presentStep(
      input.session,
      input.runtimeState,
      education,
      "The data may support investigating capacity, but association alone does not establish cause.",
      null,
    );
  }
  if (move === "DECISION") {
    return presentStep(
      input.session,
      input.runtimeState,
      education,
      "Data informs the situation. Nexora can help analyze and recommend, but you remain the one who commits to a Decision.",
      null,
    );
  }
  if (move === "REMOVE") {
    return presentStep(
      input.session,
      input.runtimeState,
      education,
      "Yes. If other Nexora objects depend on the source, Nexora should show the impact and ask before removal. I won’t remove anything just because you asked.",
      null,
    );
  }
  if (move === "UPDATE") {
    return presentStep(
      input.session,
      input.runtimeState,
      education,
      "You can update a file through the existing Data flow. That isn’t required to finish this introduction.",
      null,
    );
  }
  if (move === "CHART") {
    return presentStep(
      input.session,
      input.runtimeState,
      education,
      "CSV is one way Nexora can receive data. Charts of that evidence are a later capability, not part of this introduction.",
      null,
    );
  }
  if (move === "SAFETY") {
    return presentStep(
      input.session,
      input.runtimeState,
      education,
      "Nexora keeps the source visible so you can see where information came from. I won’t make security claims that aren’t established here.",
      null,
    );
  }
  if (move === "SOURCE_Q") {
    return presentStep(
      input.session,
      input.runtimeState,
      education,
      education.examplePath
        ? "This is an example source based on a certified fixture. Nexora keeps real sources visible in Data so they don’t disappear into an opaque system."
        : "Nexora keeps the source visible so you can see where information came from.",
      null,
    );
  }
  if (move === "PERSIST") {
    return presentStep(
      input.session,
      input.runtimeState,
      education,
      "A Data Library can keep a source you actually used. This introduction does not persist just because a source is durable.",
      null,
    );
  }
  if (move === "RAIL") {
    return presentStep(
      input.session,
      input.runtimeState,
      education,
      "Data is where you manage sources. The Stage is where we work with the current executive situation.",
      null,
    );
  }
  if (move === "OBJECT_Q") {
    return presentStep(
      input.session,
      input.runtimeState,
      education,
      DATA_OBJECT_COPY,
      null,
    );
  }
  if (move === "NEXT") {
    const following = nextState(education.state);
    return presentStep(
      input.session,
      input.runtimeState,
      { state: following, examplePath: education.examplePath },
      copyForState(following, education.examplePath),
      following === "SOURCE" || following === "PREVIEW" ? "DATA_ENTRY" : null,
    );
  }
  return presentStep(
    input.session,
    input.runtimeState,
    education,
    copyForState(education.state, education.examplePath),
    education.state === "SOURCE" ? "DATA_ENTRY" : null,
  );
}

function reviewFor(fileName: string, csvText: string) {
  const parse = parseCsvDeterministically(csvText);
  const input: CsvVerticalSliceInput = Object.freeze({
    workspaceId: "overview",
    fileName,
    fileSize: csvText.length,
    csvText,
    importId: "nex-ent6-example-not-stored",
    importedAt: "2026-05-01T00:00:00.000Z",
    observedAt: "2026-05-01T00:00:00.000Z",
  });
  return interpretCsvSemantics({
    input,
    parse,
    structural: suggestCsvColumnMappings(parse.columns, input.importId),
  });
}

function fieldSemantic(column: string) {
  const review = ["value", "status", "index"].includes(column)
    ? reviewFor("export.csv", UNKNOWN_CSV)
    : reviewFor("data-ux3-update.csv", EXAMPLE_CSV);
  return review.mappings.find((entry) => entry.sourceColumn === column)?.semantic ?? null;
}

function fieldCopy(utterance: string, examplePath: boolean): string {
  const normalized = utterance.toLowerCase();
  const column = /\botd\b/.test(normalized)
    ? "OTD"
    : /\bcap_av\b|\bcap av\b/.test(normalized)
      ? "CAP_AV"
      : /\bord_qty\b/.test(normalized)
        ? "ORD_QTY"
        : /\bvalue\b/.test(normalized)
          ? "value"
          : "BKL";
  const semantic = fieldSemantic(column);
  const exampleNote = examplePath
    ? " This is example data, not accepted business evidence."
    : " If this field is in a source you uploaded, Nexora uses that source’s meaning only.";
  if (!semantic) {
    return `I don’t have enough information to know what ${column} represents.${exampleNote}`;
  }
  if (semantic.state === "UNKNOWN" || !semantic.proposedMeaning) {
    return `I can see ${column} in this source, but I don’t have enough information to know what it represents. What does ${column} mean?${exampleNote}`;
  }
  if (semantic.state === "AMBIGUOUS") {
    return `${column} could refer to more than one plausible meaning, including ${semantic.proposedMeaning}. That is not confirmed.${exampleNote}`;
  }
  if (semantic.state === "LIKELY") {
    return `This likely represents ${semantic.proposedMeaning}. That is a candidate, not a confirmed fact.${exampleNote}`;
  }
  return `${column} is understood as ${semantic.proposedMeaning ?? "a known field"} from the existing mapping.${exampleNote}`;
}

function whyAskingCopy(): string {
  const unknown = fieldSemantic("value");
  if (unknown?.state === "UNKNOWN" || !unknown?.proposedMeaning) {
    return "Because I can see the field in the source, but I don’t have enough evidence to know its business meaning. I’d rather confirm it than guess.";
  }
  return "Because the field is in the source, and I would rather confirm meaning than guess.";
}

function presentStep(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
  education: NexoraDataEducationSession,
  response: string,
  pendingOfferTarget: NexoraGuidedAttentionTarget | null,
): NexoraGuidedEntranceTurnResult {
  const nextSession = withDataEducation(session, Object.freeze(education));
  return freezeTurn({
    session: nextSession,
    runtimeState,
    response,
    ownsResponse: true,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: actionsFor(education.state),
    move: "CONTINUE",
    presentationCue: null,
    pendingOfferTarget,
    clearGuidedAttention: false,
  });
}

function idle(
  session: NexoraEntranceSession,
  runtimeState: NexoraMVPObjectInteractionState,
): NexoraGuidedEntranceTurnResult {
  return freezeTurn({
    session,
    runtimeState,
    response: "",
    ownsResponse: false,
    shouldCommitRuntime: false,
    centerTransferred: false,
    suggestedActions: Object.freeze([]),
    move: null,
    presentationCue: null,
    pendingOfferTarget: null,
    clearGuidedAttention: false,
  });
}

function withDataEducation(
  session: NexoraEntranceSession,
  dataEducation: NexoraDataEducationSession,
): NexoraEntranceSession {
  const guided = session.guidedIntroduction;
  if (!guided) return session;
  const attention = attentionEducationOf(session);
  return Object.freeze({
    ...session,
    guidedIntroduction: Object.freeze({
      ...guided,
      state: "COMPLETED" as const,
      introduced: true,
      introductionSeeded: true,
      skipRequested: false,
      attentionEducation: Object.freeze({
        state:
          attention.state === "REVIEW" || attention.state === "COMPLETED"
            ? ("COMPLETED" as const)
            : attention.state,
      }),
      dataEducation,
    }),
  });
}

function nextState(state: NexoraDataEducationState): NexoraDataEducationState {
  switch (state) {
    case "NOT_STARTED":
      return "SOURCE";
    case "SOURCE":
      return "PREVIEW";
    case "PREVIEW":
      return "MEANING";
    case "MEANING":
      return "CLARIFICATION";
    case "CLARIFICATION":
      return "EVIDENCE";
    case "EVIDENCE":
      return "DATA_OBJECT";
    case "DATA_OBJECT":
      return "REVIEW";
    case "REVIEW":
    case "COMPLETED":
      return "COMPLETED";
    case "SKIPPED":
      return "SKIPPED";
  }
}

function copyForState(state: NexoraDataEducationState, examplePath: boolean): string {
  switch (state) {
    case "SOURCE":
      return SOURCE_COPY;
    case "PREVIEW":
      return examplePath ? PREVIEW_COPY : OWN_CSV_COPY;
    case "MEANING":
      return `${MEANING_LEAD} ${fieldCopy("What does OTD mean?", examplePath)}`;
    case "CLARIFICATION":
      return fieldCopy("What does value mean?", examplePath);
    case "EVIDENCE":
      return EVIDENCE_COPY;
    case "DATA_OBJECT":
      return DATA_OBJECT_COPY;
    case "REVIEW":
    case "COMPLETED":
      return REVIEW_COPY;
    default:
      return SOURCE_COPY;
  }
}

function actionsFor(
  state: NexoraDataEducationState,
): readonly NexoraGuidedEntranceSuggestedAction[] {
  if (state === "SOURCE") return NEXORA_DATA_EDUCATION_CHOICE_ACTIONS;
  if (state === "SKIPPED") return Object.freeze([]);
  return Object.freeze([
    ...NEXORA_DATA_EDUCATION_QUESTION_ACTIONS,
    ...NEXORA_DATA_EDUCATION_CHOICE_ACTIONS.slice(2),
  ]);
}

function freezeTurn(input: {
  readonly session: NexoraEntranceSession;
  readonly runtimeState: NexoraMVPObjectInteractionState;
  readonly response: string;
  readonly ownsResponse: boolean;
  readonly shouldCommitRuntime: boolean;
  readonly centerTransferred: boolean;
  readonly suggestedActions: readonly NexoraGuidedEntranceSuggestedAction[];
  readonly move: NexoraGuidedEntranceTurnResult["move"];
  readonly presentationCue: NexoraStagePresentationCue;
  readonly pendingOfferTarget: NexoraGuidedAttentionTarget | null;
  readonly clearGuidedAttention: boolean;
}): NexoraGuidedEntranceTurnResult {
  return Object.freeze({
    session: input.session,
    response: input.response,
    ownsResponse: input.ownsResponse,
    shouldCommitRuntime: input.shouldCommitRuntime,
    nextRuntimeState: input.runtimeState,
    centerTransferred: input.centerTransferred,
    suggestedActions: Object.freeze([...input.suggestedActions]),
    move: input.move,
    presentationCue: input.presentationCue,
    pendingOfferTarget: input.pendingOfferTarget,
    clearGuidedAttention: input.clearGuidedAttention,
  });
}

export function classifyDataEducationMove(
  utterance: string,
): NexoraDataEducationMove | null {
  const normalized = utterance
    .toLowerCase()
    .replace(/['’]/g, "'")
    .replace(/[.!?]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return null;
  if (
    /^where is data/.test(normalized) ||
    /^how do i add/.test(normalized) ||
    /^show me the problems$/.test(normalized) ||
    normalized === "show me" ||
    /^what is a problem/.test(normalized)
  ) {
    return null;
  }
  if (normalized === "show me an example") return "EXAMPLE";
  if (normalized === "use my csv") return "OWN_CSV";
  if (
    normalized === "skip for now" ||
    normalized === "skip this" ||
    normalized === "skip introduction"
  ) {
    return "SKIP";
  }
  if (normalized === "why are you asking" || normalized === "why don't you know") {
    return "WHY_ASK";
  }
  if (
    /i don'?t know/.test(normalized) ||
    normalized === "i'm not sure" ||
    normalized === "im not sure"
  ) {
    return "UNSURE";
  }
  if (
    /^can i correct/.test(normalized) ||
    /^no, it means/.test(normalized) ||
    /^no it means/.test(normalized)
  ) {
    return "CORRECT";
  }
  if (/prove|caused the delay|does that prove/.test(normalized)) return "CAUSE";
  if (/will nexora make the decision|decide automatically/.test(normalized)) {
    return "DECISION";
  }
  if (/can i remove/.test(normalized)) return "REMOVE";
  if (/can i update/.test(normalized)) return "UPDATE";
  if (/chart this|show me delivery performance/.test(normalized)) return "CHART";
  if (/is my data safe/.test(normalized)) return "SAFETY";
  if (/what is this source/.test(normalized)) return "SOURCE_Q";
  if (/keep the source|data library/.test(normalized)) return "PERSIST";
  if (/data rail|versus the stage|vs the stage/.test(normalized)) return "RAIL";
  if (/what is a data object|explain this data object/.test(normalized)) {
    return "OBJECT_Q";
  }
  if (
    /what does (otd|bkl|cap_av|ord_qty|value|this field) mean/.test(normalized) ||
    /explain (otd|bkl|cap_av|value)/.test(normalized)
  ) {
    return "FIELD";
  }
  if (
    normalized === "show me the next one" ||
    normalized === "continue" ||
    normalized === "show me something"
  ) {
    return "NEXT";
  }
  return null;
}
