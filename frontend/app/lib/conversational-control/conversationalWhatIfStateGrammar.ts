/**
 * CC:1 — Generalized deterministic What-If state-change grammar.
 *
 * WHAT_IF + SUBJECT + STATE CHANGE / DIRECTION + optional intensity + optional magnitude.
 * Lexical only. Does not resolve subject IDs or invent Scenario impact.
 */

import { isAmbiguousConversationalReference } from "./conversationalIntentNormalization.ts";

export const WHAT_IF_PREFIX =
  /^(?:show\s+me\s+)?(?:what\s+(?:would\s+)?happen(?:s|ed)?\s+if|what\s+happens\s+when|what\s+if|simulate|what\s+is\s+the\s+impact\s+if)\s+/;

export const NEXORA_WHAT_IF_INTENSITIES = Object.freeze([
  "too",
  "very",
  "extremely",
  "more",
  "less",
] as const);

export type NexoraWhatIfIntensity =
  (typeof NEXORA_WHAT_IF_INTENSITIES)[number];

export const NEXORA_WHAT_IF_STATES = Object.freeze([
  "late",
  "delayed",
  "high",
  "higher",
  "low",
  "lower",
  "slow",
  "fast",
  "critical",
  "stable",
  "worse",
  "better",
] as const);

export type NexoraWhatIfState = (typeof NEXORA_WHAT_IF_STATES)[number];

export type NexoraWhatIfDirection =
  | "increase"
  | "decrease"
  | "delay"
  | "worsen"
  | "improve"
  | "hold";

export type NexoraWhatIfChangeKind = "directional" | "state";

export type NexoraWhatIfStateChange = {
  readonly rawClause: string;
  readonly subjectRaw: string;
  readonly deictic: boolean;
  readonly changeKind: NexoraWhatIfChangeKind;
  readonly state: NexoraWhatIfState | null;
  readonly direction: NexoraWhatIfDirection;
  readonly actionKind: "increase-by" | "decrease-by" | "hold" | "delay";
  readonly intensity: NexoraWhatIfIntensity | null;
  readonly magnitude: number | null;
  readonly unit: "%" | null;
};

const COPULA = "(?:be|is|are|was|were|gets?|becomes?)";
const INTENSITY = "(?:too|very|extremely|more|less)";
const STATE =
  "(?:delayed|late|higher|lower|high|low|slow|fast|critical|stable|worse|better)";
const DIRECTIONAL_VERB =
  "(?:increases?|decreases?|improves?|reduces?|rises?|falls?|drops?|worsens?|slows?)";
const VERB_FIRST =
  "(?:increase|decrease|improve|reduce|raise|lower|expand|worsen)";

function isIntensity(value: string): value is NexoraWhatIfIntensity {
  return (NEXORA_WHAT_IF_INTENSITIES as readonly string[]).includes(value);
}

function isState(value: string): value is NexoraWhatIfState {
  return (NEXORA_WHAT_IF_STATES as readonly string[]).includes(value);
}

function splitTrailingMagnitude(phrase: string): {
  readonly body: string;
  readonly value?: number;
  readonly unit?: "%";
} {
  const matched = phrase.match(
    /^(.*?)\s+(?:by\s+)?(\d+(?:\.\d+)?)(?:\s*(%|percent|pct))?$/,
  );
  if (!matched) return { body: phrase };
  const body = (matched[1] ?? "").trim();
  if (!body) return { body: phrase };
  const value = Number(matched[2]);
  const unitRaw = matched[3];
  return Object.freeze({
    body,
    value,
    ...(unitRaw ? { unit: "%" as const } : {}),
  });
}

function mapState(state: NexoraWhatIfState): {
  readonly actionKind: NexoraWhatIfStateChange["actionKind"];
  readonly direction: NexoraWhatIfDirection;
  readonly changeKind: NexoraWhatIfChangeKind;
} {
  if (state === "late" || state === "delayed") {
    return { actionKind: "delay", direction: "delay", changeKind: "state" };
  }
  if (state === "stable") {
    return { actionKind: "hold", direction: "hold", changeKind: "state" };
  }
  if (
    state === "high" ||
    state === "higher" ||
    state === "fast" ||
    state === "better" ||
    state === "critical"
  ) {
    return {
      actionKind: "increase-by",
      direction: state === "better" ? "improve" : "increase",
      changeKind: "state",
    };
  }
  if (state === "worse") {
    return {
      actionKind: "increase-by",
      direction: "worsen",
      changeKind: "state",
    };
  }
  return {
    actionKind: "decrease-by",
    direction: "decrease",
    changeKind: "state",
  };
}

function mapDirectionalVerb(verb: string): {
  readonly actionKind: "increase-by" | "decrease-by";
  readonly direction: NexoraWhatIfDirection;
} {
  if (/increase|improve|raise|expand|rise/.test(verb)) {
    return {
      actionKind: "increase-by",
      direction: /improve/.test(verb) ? "improve" : "increase",
    };
  }
  if (/worsen/.test(verb)) {
    return { actionKind: "increase-by", direction: "worsen" };
  }
  return { actionKind: "decrease-by", direction: "decrease" };
}

function freezeChange(
  input: Omit<NexoraWhatIfStateChange, "deictic"> & { readonly deictic?: boolean },
): NexoraWhatIfStateChange {
  const subjectRaw = input.subjectRaw.trim();
  return Object.freeze({
    rawClause: input.rawClause,
    subjectRaw,
    deictic:
      input.deictic ??
      (!subjectRaw || isAmbiguousConversationalReference(subjectRaw)),
    changeKind: input.changeKind,
    state: input.state,
    direction: input.direction,
    actionKind: input.actionKind,
    intensity: input.intensity,
    magnitude: input.magnitude,
    unit: input.unit,
  });
}

/**
 * Parse the clause after a What-If prefix into a canonical state-change.
 * Returns null when the clause is not a recognized subject + change structure.
 */
export function parseNexoraWhatIfStateChange(
  rest: string,
): NexoraWhatIfStateChange | null {
  const clause = rest.trim();
  if (!clause || /^(?:we\s+|i\s+)?do\s+nothing\b/.test(clause)) return null;

  const prefix = /^(?:we\s+|i\s+)?(?:the\s+)?/;
  const body = clause.replace(prefix, "").trim();

  const verbFirst = body.match(
    new RegExp(`^(${VERB_FIRST})(?:s|ing)?\\s+(?:the\\s+)?(.+)$`),
  );
  if (verbFirst) {
    const magnitude = splitTrailingMagnitude((verbFirst[2] ?? "").trim());
    const mapped = mapDirectionalVerb(verbFirst[1] ?? "");
    return freezeChange({
      rawClause: clause,
      subjectRaw: magnitude.body,
      changeKind: "directional",
      state: null,
      direction: mapped.direction,
      actionKind: mapped.actionKind,
      intensity: null,
      magnitude: magnitude.value ?? null,
      unit: magnitude.unit ?? null,
    });
  }

  const copulaState = body.match(
    new RegExp(
      `^(.+?)\\s+${COPULA}\\s+(?:(${INTENSITY})\\s+)?(${STATE})(?:\\s+(?:by\\s+)?(\\d+(?:\\.\\d+)?)(?:\\s*(%|percent|pct))?)?$`,
    ),
  );
  if (copulaState) {
    const stateRaw = copulaState[3] ?? "";
    if (!isState(stateRaw)) return null;
    const intensityRaw = copulaState[2] ?? "";
    const mapped = mapState(stateRaw);
    const magnitude = copulaState[4] ? Number(copulaState[4]) : null;
    return freezeChange({
      rawClause: clause,
      subjectRaw: (copulaState[1] ?? "").trim(),
      changeKind: mapped.changeKind,
      state: stateRaw,
      direction: mapped.direction,
      actionKind: mapped.actionKind,
      intensity: isIntensity(intensityRaw) ? intensityRaw : null,
      magnitude,
      unit: copulaState[5] ? "%" : null,
    });
  }

  const subjectDirectional = body.match(
    new RegExp(
      `^(.+?)\\s+(${DIRECTIONAL_VERB})(?:\\s+(?:by\\s+)?(\\d+(?:\\.\\d+)?)(?:\\s*(%|percent|pct))?)?$`,
    ),
  );
  if (subjectDirectional) {
    const mapped = mapDirectionalVerb(subjectDirectional[2] ?? "");
    return freezeChange({
      rawClause: clause,
      subjectRaw: (subjectDirectional[1] ?? "").trim(),
      changeKind: "directional",
      state: null,
      direction: mapped.direction,
      actionKind: mapped.actionKind,
      intensity: null,
      magnitude: subjectDirectional[3] ? Number(subjectDirectional[3]) : null,
      unit: subjectDirectional[4] ? "%" : null,
    });
  }

  const lateFirst = body.match(/^(?:a\s+|the\s+)?late\s+(.+)$/);
  if (lateFirst) {
    return freezeChange({
      rawClause: clause,
      subjectRaw: (lateFirst[1] ?? "").trim(),
      changeKind: "state",
      state: "late",
      direction: "delay",
      actionKind: "delay",
      intensity: null,
      magnitude: null,
      unit: null,
    });
  }

  const delayNoun = body.match(
    /^(?:we\s+|i\s+|a\s+|the\s+)?(.+?)\s+delay(?:s|ed)?$/,
  );
  if (delayNoun) {
    return freezeChange({
      rawClause: clause,
      subjectRaw: (delayNoun[1] ?? "").trim(),
      changeKind: "state",
      state: "delayed",
      direction: "delay",
      actionKind: "delay",
      intensity: null,
      magnitude: null,
      unit: null,
    });
  }

  return null;
}

export function parseNexoraWhatIfUtterance(
  normalized: string,
): NexoraWhatIfStateChange | null {
  if (!WHAT_IF_PREFIX.test(normalized)) return null;
  const rest = normalized.replace(WHAT_IF_PREFIX, "").trim();
  return parseNexoraWhatIfStateChange(rest);
}
