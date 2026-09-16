/**
 * DTH:2 — Renderer-neutral visual-family discriminator.
 * Classification is semantic. It must not depend on CSS, color, size, label, or renderer.
 */

export const nexoraDecisionTheatreVisualLanguageIdentity =
  "DTH:2/ExecutiveAndIconicObjectLanguage" as const;
export const nexoraDecisionTheatreVisualLanguageVersion = "1.0.0" as const;

export const NEXORA_DECISION_THEATRE_VISUAL_FAMILIES = Object.freeze([
  "EXECUTIVE_OBJECT",
  "ICONIC_OBJECT",
  "DATA_OBJECT",
  "VARIABLE_SYMBOL",
] as const);

export type NexoraDecisionTheatreVisualFamily =
  (typeof NEXORA_DECISION_THEATRE_VISUAL_FAMILIES)[number];

export const NEXORA_DECISION_THEATRE_ICONIC_ID_PREFIX = "dth2-iconic:" as const;
export const NEXORA_DECISION_THEATRE_DATA_ID_PREFIX = "data-source:" as const;
export const NEXORA_DECISION_THEATRE_VARIABLE_SYMBOL_ID_PREFIX = "var-symbol:" as const;

export type NexoraDecisionTheatreCanonicalObjectType =
  | "manager"
  | "goal"
  | "objective"
  | "kpi"
  | "koi"
  | "problem"
  | "risk"
  | "opportunity"
  | "constraint"
  | "scenario"
  | "decision"
  | "execution"
  | "outcome"
  | "learning"
  | "project"
  | "task"
  | "insight"
  | "object";

const CONTEXT_KINDS = new Set<string>([
  "problem",
  "scenario",
  "decision",
  "execution",
  "goal",
  "opportunity",
  "constraint",
  "insight",
  "outcome",
  "learning",
  "objective",
  "koi",
  "project",
  "task",
  "manager",
]);

const KPI_OBJECT_IDS = new Set([
  "obj-revenue",
  "obj-capacity",
  "obj-budget",
  "obj-demand",
  "obj-inventory",
  "obj-delivery",
  "obj-customer",
]);

export function isNexoraDecisionTheatreIconicPresentationId(id: string): boolean {
  return id.startsWith(NEXORA_DECISION_THEATRE_ICONIC_ID_PREFIX);
}

export function resolveCanonicalExecutiveObjectType(input: {
  readonly id: string;
  readonly kind: string;
  readonly label: string;
}): NexoraDecisionTheatreCanonicalObjectType {
  const kind = input.kind.trim().toLowerCase();
  if (CONTEXT_KINDS.has(kind) && kind !== "object") {
    return kind as NexoraDecisionTheatreCanonicalObjectType;
  }
  if (input.id === "obj-risk" || /\brisk\b/i.test(input.label)) {
    return "risk";
  }
  if (/\bgoal\b/i.test(input.label) || input.id === "obj-goal") {
    return "goal";
  }
  if (/\bkpi\b/i.test(input.label) || KPI_OBJECT_IDS.has(input.id)) {
    return "kpi";
  }
  if (/\bproblem\b/i.test(input.label)) return "problem";
  if (/\bscenario\b/i.test(input.label)) return "scenario";
  if (/\bdecision\b/i.test(input.label)) return "decision";
  if (/\bexecution\b/i.test(input.label)) return "execution";
  if (/\boutcome\b/i.test(input.label)) return "outcome";
  return "object";
}

export function classifyNexoraDecisionTheatreVisualFamily(input: {
  readonly id: string;
  readonly kind?: string;
}): NexoraDecisionTheatreVisualFamily {
  if (input.id.startsWith(NEXORA_DECISION_THEATRE_DATA_ID_PREFIX)) {
    return "DATA_OBJECT";
  }
  if (input.id.startsWith(NEXORA_DECISION_THEATRE_VARIABLE_SYMBOL_ID_PREFIX)) {
    return "VARIABLE_SYMBOL";
  }
  if (isNexoraDecisionTheatreIconicPresentationId(input.id)) {
    return "ICONIC_OBJECT";
  }
  return "EXECUTIVE_OBJECT";
}

export function deriveNexoraDecisionTheatreIconicPresentationId(input: {
  readonly ownerExecutiveObjectId: string;
  readonly role: string;
  readonly relationshipId?: string | null;
  readonly sourceRef: string;
}): string {
  const owner = input.ownerExecutiveObjectId.trim();
  const role = input.role.trim();
  const relationship = (input.relationshipId ?? "owner").trim() || "owner";
  const source = input.sourceRef.trim();
  return `${NEXORA_DECISION_THEATRE_ICONIC_ID_PREFIX}${owner}:${role}:${relationship}:${source}`;
}
