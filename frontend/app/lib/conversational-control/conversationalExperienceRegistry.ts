/**
 * CC:6 — Registered executive experiences.
 *
 * Maps conversational situations onto existing NexoraMVPWorkspaceKind values only.
 * Does not invent workspace kinds or fake product surfaces.
 */

import type { NexoraMVPPresentationState } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation.ts";
import type { NexoraMVPWorkspaceKind } from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation.ts";
import { normalizeNexoraConversationalUtterance } from "./conversationalIntentNormalization.ts";

export type NexoraRegisteredExecutiveExperience = {
  readonly id: string;
  readonly label: string;
  readonly aliases: readonly string[];
  /** Must be an existing NexoraMVPWorkspaceKind. */
  readonly workspaceId: NexoraMVPWorkspaceKind;
  readonly presentationState: NexoraMVPPresentationState | null;
  readonly defaultSubjectId: string | null;
};

/**
 * Certified registry — aliases are executive-language labels for real dial workspaces.
 * "Project review" → Decision workspace (commit/review axis), not a new workspace kind.
 */
export const NEXORA_REGISTERED_EXECUTIVE_EXPERIENCES: readonly NexoraRegisteredExecutiveExperience[] =
  Object.freeze([
    Object.freeze({
      id: "executive-overview",
      label: "Executive Overview",
      aliases: Object.freeze([
        "overview",
        "executive overview",
        "overview workspace",
      ]),
      workspaceId: "overview" as const,
      presentationState: null,
      defaultSubjectId: null,
    }),
    Object.freeze({
      id: "problem-investigation",
      label: "Problem Investigation",
      aliases: Object.freeze([
        "problem",
        "problems",
        "problem workspace",
        "operations review",
        "operations meeting",
        "operations team",
        "investigate",
      ]),
      workspaceId: "problem" as const,
      presentationState: null,
      defaultSubjectId: null,
    }),
    Object.freeze({
      id: "scenario-review",
      label: "Scenario Review",
      aliases: Object.freeze([
        "scenario",
        "scenarios",
        "scenario workspace",
        "scenario review",
      ]),
      workspaceId: "scenario" as const,
      presentationState: null,
      defaultSubjectId: null,
    }),
    Object.freeze({
      id: "decision-review",
      label: "Decision Review",
      aliases: Object.freeze([
        "decision",
        "decisions",
        "decision workspace",
        "decision review",
        "project review",
        "project review meeting",
        "project workspace",
        "project meeting",
      ]),
      workspaceId: "decision" as const,
      presentationState: null,
      defaultSubjectId: null,
    }),
    Object.freeze({
      id: "financial-review",
      label: "Financial Review",
      aliases: Object.freeze([
        "financial review",
        "finance review",
        "revenue review",
        "financial workspace",
      ]),
      workspaceId: "scenario" as const,
      presentationState: null,
      defaultSubjectId: null,
    }),
    Object.freeze({
      id: "execution-followthrough",
      label: "Execution Follow-through",
      aliases: Object.freeze([
        "execution",
        "execution workspace",
        "execution review",
        "delivery review",
      ]),
      workspaceId: "execution" as const,
      presentationState: null,
      defaultSubjectId: null,
    }),
  ]);

export function getNexoraRegisteredExecutiveExperiences(): readonly NexoraRegisteredExecutiveExperience[] {
  return NEXORA_REGISTERED_EXECUTIVE_EXPERIENCES;
}

export function findRegisteredExperiencesForHint(
  hintRaw: string,
  registry: readonly NexoraRegisteredExecutiveExperience[] = NEXORA_REGISTERED_EXECUTIVE_EXPERIENCES,
): readonly NexoraRegisteredExecutiveExperience[] {
  const key = normalizeNexoraConversationalUtterance(hintRaw);
  if (!key) return Object.freeze([]);

  const exact: NexoraRegisteredExecutiveExperience[] = [];
  const soft: NexoraRegisteredExecutiveExperience[] = [];

  for (const experience of registry) {
    const candidates = [
      experience.id,
      experience.label,
      experience.workspaceId,
      ...experience.aliases,
    ].map((v) => normalizeNexoraConversationalUtterance(String(v)));

    if (candidates.includes(key)) {
      exact.push(experience);
      continue;
    }

    // Soft containment for phrases like "project review meeting"
    if (
      candidates.some(
        (c) => c.length >= 4 && (key.includes(c) || c.includes(key)),
      )
    ) {
      soft.push(experience);
    }
  }

  const matches = exact.length > 0 ? exact : soft;

  // De-dupe by id
  const seen = new Set<string>();
  return Object.freeze(
    matches.filter((m) => {
      if (seen.has(m.id)) return false;
      seen.add(m.id);
      return true;
    }),
  );
}
