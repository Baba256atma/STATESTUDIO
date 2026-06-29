/**
 * APP-4:11 — Executive Assistant Memory citation builder.
 */

import { mapGovernanceStateLabel } from "./executiveAssistantMemoryIntegrationAccessValidator.ts";
import { getExecutiveMemoryLifecycle } from "./executiveMemoryLifecycleRegistry.ts";
import { EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_LIMITS } from "./executiveAssistantMemoryIntegrationConstants.ts";
import type {
  ExecutiveAssistantMemoryCitation,
  ExecutiveAssistantMemoryExplanation,
} from "./executiveAssistantMemoryIntegrationTypes.ts";
import type { ExecutiveMemoryStoredRecord } from "./executiveMemoryStorageTypes.ts";

export function buildAssistantMemoryCitation(input: {
  record: ExecutiveMemoryStoredRecord;
  retrievalProfileId: string;
  rankingProfileId: string;
  selectionReasons: readonly string[];
}): ExecutiveAssistantMemoryCitation | null {
  if (input.record.record.id.trim().length === 0) {
    return null;
  }

  const governance = getExecutiveMemoryLifecycle(input.record.record.id);
  const reasons = Object.freeze(
    [...input.selectionReasons].slice(0, EXECUTIVE_ASSISTANT_MEMORY_INTEGRATION_LIMITS.maxCitationReasons)
  );

  return Object.freeze({
    memoryId: input.record.record.id,
    memoryType: input.record.record.category,
    versionId: input.record.record.version.versionId,
    semanticVersion: input.record.record.version.semanticVersion,
    confidenceScore: input.record.record.confidence?.score ?? null,
    confidenceLevel: input.record.record.confidence?.level ?? null,
    lifecycleState: input.record.lifecycle,
    governanceState: mapGovernanceStateLabel(governance?.governanceState ?? null),
    retrievalProfileId: input.retrievalProfileId,
    rankingProfileId: input.rankingProfileId,
    selectionReasons: reasons,
    readOnly: true as const,
  });
}

export function explainAssistantMemorySelection(input: {
  record: ExecutiveMemoryStoredRecord;
  retrievalProfileId: string;
  score: number;
  rankingReasons: readonly string[];
}): ExecutiveAssistantMemoryExplanation {
  const deterministicReasons = input.rankingReasons
    .map((entry) => entry.replace(/^\+ /, ""))
    .filter((entry) => entry.length > 0);

  return Object.freeze({
    memoryId: input.record.record.id,
    score: input.score,
    retrievalProfileId: input.retrievalProfileId,
    reasons: Object.freeze(deterministicReasons),
    readOnly: true as const,
  });
}

export const ExecutiveAssistantMemoryCitationBuilder = Object.freeze({
  buildAssistantMemoryCitation,
  explainAssistantMemorySelection,
});
