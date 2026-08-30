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
] as const);

export type NexoraDecisionTheatreVisualFamily =
  (typeof NEXORA_DECISION_THEATRE_VISUAL_FAMILIES)[number];

export const NEXORA_DECISION_THEATRE_ICONIC_ID_PREFIX = "dth2-iconic:" as const;

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
  if (input.id === "obj-risk" || /^risk$/i.test(input.label.trim())) {
    return "risk";
  }
  if (/\bgoal\b/i.test(input.label) || input.id === "obj-goal") {
    return "goal";
  }
  if (KPI_OBJECT_IDS.has(input.id)) {
    return "kpi";
  }
  return "object";
}

export function classifyNexoraDecisionTheatreVisualFamily(input: {
  readonly id: string;
  readonly kind?: string;
}): NexoraDecisionTheatreVisualFamily {
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
