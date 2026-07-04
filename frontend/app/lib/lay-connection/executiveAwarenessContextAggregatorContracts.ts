import type {
  ExecutiveAwarenessContextAggregator as ExecutiveAwarenessContextAggregatorContract,
  ExecutiveContextAggregationPolicy,
  ExecutiveContextCategory,
  ExecutiveContextMetadata,
  ExecutiveContextSource,
} from "./executiveAwarenessContextAggregatorTypes.ts";

export const EXECUTIVE_AWARENESS_CONTEXT_AGGREGATOR_ID = "executive-awareness-context-aggregator";
export const EXECUTIVE_AWARENESS_CONTEXT_AGGREGATOR_VERSION = "LAY-CONN-5";

export const EXECUTIVE_AWARENESS_CONTEXT_CATEGORIES: readonly ExecutiveContextCategory[] = Object.freeze([
  "Strategic Context",
  "Operational Context",
  "Decision Context",
  "Risk Context",
  "Opportunity Context",
  "Evidence Context",
  "Constraint Context",
  "Assumption Context",
  "Stakeholder Context",
  "Timeline Context",
  "Knowledge Context",
  "Identity Context",
] as const);

export const EXECUTIVE_AWARENESS_CONTEXT_SOURCES: readonly ExecutiveContextSource[] = Object.freeze([
  "Executive Reasoning",
  "Executive Judgment",
  "Executive Recommendation",
  "Executive Explanation",
  "Shared Mental Model",
  "Identity",
  "Knowledge",
  "Assistant",
  "Dashboard",
  "Scene",
  "Runtime",
] as const);

export const EXECUTIVE_AWARENESS_CONTEXT_METADATA: ExecutiveContextMetadata = Object.freeze({
  aggregatorId: EXECUTIVE_AWARENESS_CONTEXT_AGGREGATOR_ID,
  phaseId: "LAY-CONN-5",
  metadataOnly: true,
  immutable: true,
  tags: Object.freeze(["lay-connection", "awareness-context", "metadata-contract"] as const),
});

export const EXECUTIVE_AWARENESS_CONTEXT_POLICY: ExecutiveContextAggregationPolicy = Object.freeze({
  policyId: "awareness-context-metadata-only-policy",
  executionAllowed: false,
  stateMutationAllowed: false,
  derivedContextAllowed: false,
  extensionMode: "additive-only",
});

export const EXECUTIVE_AWARENESS_CONTEXT_TYPES: readonly string[] = Object.freeze([
  "reasoning-context",
  "judgment-context",
  "recommendation-context",
  "explanation-context",
  "shared-mental-model-context",
  "identity-context",
  "knowledge-context",
  "assistant-context",
  "dashboard-context",
  "scene-context",
  "runtime-context",
] as const);

export const ExecutiveAwarenessContextAggregator: ExecutiveAwarenessContextAggregatorContract = Object.freeze({
  aggregatorId: EXECUTIVE_AWARENESS_CONTEXT_AGGREGATOR_ID,
  name: "Executive Awareness Context Aggregator",
  context: Object.freeze({
    contextId: "executive-awareness-context-contract",
    entries: Object.freeze([
      Object.freeze({ entryId: "reasoning-context-entry", source: "Executive Reasoning", category: "Evidence Context", contextType: "reasoning-context", priority: "Required", metadata: EXECUTIVE_AWARENESS_CONTEXT_METADATA }),
      Object.freeze({ entryId: "judgment-context-entry", source: "Executive Judgment", category: "Decision Context", contextType: "judgment-context", priority: "Required", metadata: EXECUTIVE_AWARENESS_CONTEXT_METADATA }),
      Object.freeze({ entryId: "recommendation-context-entry", source: "Executive Recommendation", category: "Opportunity Context", contextType: "recommendation-context", priority: "Recommended", metadata: EXECUTIVE_AWARENESS_CONTEXT_METADATA }),
      Object.freeze({ entryId: "explanation-context-entry", source: "Executive Explanation", category: "Strategic Context", contextType: "explanation-context", priority: "Future", metadata: EXECUTIVE_AWARENESS_CONTEXT_METADATA }),
      Object.freeze({ entryId: "smm-context-entry", source: "Shared Mental Model", category: "Stakeholder Context", contextType: "shared-mental-model-context", priority: "Future", metadata: EXECUTIVE_AWARENESS_CONTEXT_METADATA }),
      Object.freeze({ entryId: "identity-context-entry", source: "Identity", category: "Identity Context", contextType: "identity-context", priority: "Future", metadata: EXECUTIVE_AWARENESS_CONTEXT_METADATA }),
      Object.freeze({ entryId: "knowledge-context-entry", source: "Knowledge", category: "Knowledge Context", contextType: "knowledge-context", priority: "Future", metadata: EXECUTIVE_AWARENESS_CONTEXT_METADATA }),
      Object.freeze({ entryId: "assistant-context-entry", source: "Assistant", category: "Operational Context", contextType: "assistant-context", priority: "Future", metadata: EXECUTIVE_AWARENESS_CONTEXT_METADATA }),
      Object.freeze({ entryId: "dashboard-context-entry", source: "Dashboard", category: "Timeline Context", contextType: "dashboard-context", priority: "Future", metadata: EXECUTIVE_AWARENESS_CONTEXT_METADATA }),
      Object.freeze({ entryId: "scene-context-entry", source: "Scene", category: "Risk Context", contextType: "scene-context", priority: "Future", metadata: EXECUTIVE_AWARENESS_CONTEXT_METADATA }),
      Object.freeze({ entryId: "runtime-context-entry", source: "Runtime", category: "Constraint Context", contextType: "runtime-context", priority: "Future", metadata: EXECUTIVE_AWARENESS_CONTEXT_METADATA }),
    ] as const),
    metadata: EXECUTIVE_AWARENESS_CONTEXT_METADATA,
  }),
  policy: EXECUTIVE_AWARENESS_CONTEXT_POLICY,
  metadata: EXECUTIVE_AWARENESS_CONTEXT_METADATA,
});
