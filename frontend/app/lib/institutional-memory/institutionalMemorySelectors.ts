import { getInstitutionalMemoryStore } from "./institutionalMemoryStore";
import type {
  InstitutionalLearningSnapshot,
  InstitutionalMemoryRecord,
  OrganizationalExperience,
} from "./institutionalMemoryTypes";

/** Readonly selectors for future institutional memory panels and timelines. */

export function selectInstitutionalMemoryRecords(
  organizationId: string
): readonly InstitutionalMemoryRecord[] {
  return getInstitutionalMemoryStore(organizationId).getState().records;
}

export function selectOrganizationalExperiences(
  organizationId: string
): readonly OrganizationalExperience[] {
  return getInstitutionalMemoryStore(organizationId).getState().experiences;
}

export function selectInstitutionalMemorySignature(organizationId: string): string {
  return getInstitutionalMemoryStore(organizationId).getState().signature;
}

export function selectInstitutionalLearningSnapshot(
  organizationId: string
): InstitutionalLearningSnapshot | null {
  const state = getInstitutionalMemoryStore(organizationId).getState();
  if (state.records.length === 0) return null;

  return {
    signature: state.signature,
    organizationId,
    generatedAt: state.updatedAt,
    memoryCount: state.records.length,
    experienceCount: state.experiences.length,
    historicalSummary:
      state.records.length > 0
        ? `Organization retains ${state.records.length} institutional memory records.`
        : "No institutional memory accumulated.",
    dominantCategories: Object.freeze(
      Array.from(new Set(state.records.map((r) => r.category))).slice(0, 4)
    ),
    recentMemories: Object.freeze(state.records.slice(0, 6)),
    recentExperiences: Object.freeze(state.experiences.slice(0, 4)),
    continuityConcernActive: state.records.some(
      (r) => r.category === "strategic" && r.observations.includes("continuity_concern")
    ),
  };
}
