/**
 * DKL-5:2 — Knowledge Validation Quality Signal Registry.
 *
 * Registers the 20 approved DKL-5:1 quality signals. No numeric scores.
 *
 * Ownership: owned exclusively by DKL-5:2.
 */

import { KnowledgeValidationFoundation } from "./knowledgeValidationFoundation.ts";
import type { QualitySignalRegistryEntry } from "./knowledgeValidationRegistryTypes.ts";

const OWNER = "DKL-5 Knowledge Validation Registry";
const PHASE = "DKL-5:2";
const NS = "nexora.dkl.knowledge-validation.registry.signal";

/** Canonical immutable knowledge quality signal registry. */
export const KnowledgeValidationSignalRegistry: readonly QualitySignalRegistryEntry[] =
  Object.freeze(
    KnowledgeValidationFoundation.contracts.qualitySignals.map((signal, index) =>
      Object.freeze({
        id: `kv-reg-signal-${signal.id.toLowerCase()}`,
        name: signal.id,
        namespace: `${NS}.${signal.id.toLowerCase()}`,
        description: signal.meaning,
        category: "KnowledgeQualitySignal" as const,
        owner: OWNER,
        sourcePhase: PHASE,
        lifecycleStatus: "Registered" as const,
        stabilityStatus: "Stable" as const,
        compatibilityStatus: "Compatible" as const,
        extensionStatus: "Closed" as const,
        publicVisibility: "Public" as const,
        deterministicOrder: index + 1,
        tags: Object.freeze(["quality-signal", signal.dimension, signal.polarity]),
        dimension: signal.dimension,
        meaning: signal.meaning,
        polarity: signal.polarity,
        severity: signal.severity,
        consumerImpact: signal.consumerImpact,
        clarificationRecommended: signal.clarificationRecommended,
        blockingStatus: signal.blockingStatus,
        numericScoreAssigned: false as const,
      }),
    ),
  );
