/**
 * APP-4:2 — Executive Memory record builders.
 * Lightweight structure initialization — no persistence.
 */

import { createExecutiveMemoryConfidence } from "./executiveMemoryConfidence.ts";
import { createExecutiveMemoryDecision } from "./executiveMemoryDecision.ts";
import { createExecutiveMemoryEvidence } from "./executiveMemoryEvidence.ts";
import { createExecutiveMemoryGoal } from "./executiveMemoryGoal.ts";
import {
  createExecutiveMemoryBody,
  createExecutiveMemoryBusinessContext,
  createExecutiveMemoryHeader,
  createExecutiveMemoryMetadata,
  createExecutiveMemoryTag,
  createExecutiveMemoryVersion,
} from "./executiveMemoryMetadata.ts";
import {
  createExecutiveMemoryRecord,
  type ExecutiveMemoryRecord,
} from "./executiveMemoryRecord.ts";
import {
  EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
  EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION,
} from "./executiveMemoryRecordConstants.ts";
import { createExecutiveMemoryReference } from "./executiveMemoryReference.ts";
import { createExecutiveMemoryIntent, createExecutiveMemoryScenario } from "./executiveMemoryScenario.ts";
import type { ExecutiveMemoryCategory } from "./executiveMemoryTypes.ts";

export {
  createExecutiveMemoryReference,
  createExecutiveMemoryMetadata,
  createExecutiveMemoryRecord,
};

const DEFAULT_TIME = "2026-01-01T00:00:00.000Z";

export function buildExecutiveMemoryRecordExample(
  timestamp: string = DEFAULT_TIME,
  category: ExecutiveMemoryCategory = "decision"
): ExecutiveMemoryRecord {
  const workspaceId = "ws-memory-record-001";
  const memoryId = "memory-record-example-001";
  const providerId = "executive-memory-foundation-provider";

  const header = createExecutiveMemoryHeader({
    title: "Approved European market expansion",
    summary: "Executive decision to expand into the European market next fiscal year.",
    owner: "executive-owner",
    sourceModule: "executive-memory-record",
  });

  const body = createExecutiveMemoryBody({
    narrative:
      "Leadership approved a phased market expansion based on validated demand signals and risk review.",
    keyPoints: Object.freeze([
      "Phased rollout over four quarters",
      "Risk review completed",
      "Budget envelope approved",
    ]),
  });

  const metadata = createExecutiveMemoryMetadata({
    memoryId,
    workspaceId,
    category,
    owner: "executive-owner",
    sourceModule: "executive-memory-record",
    tags: Object.freeze([
      createExecutiveMemoryTag({ tagId: "tag-strategy", label: "strategy" }),
    ]),
    references: Object.freeze([
      createExecutiveMemoryReference({
        referenceId: "ref-scenario-001",
        referenceType: "scenario",
        targetId: "scenario-eu-expansion-001",
        label: "EU expansion scenario",
        module: "scenario-intelligence",
        workspaceId,
      }),
    ]),
  });

  const version = createExecutiveMemoryVersion({
    versionId: "memory-version-001",
    schemaVersion: EXECUTIVE_MEMORY_RECORD_SCHEMA_VERSION,
    contractVersion: EXECUTIVE_MEMORY_RECORD_CONTRACT_VERSION,
    semanticVersion: "1.0.0",
    createdAt: timestamp,
  });

  return createExecutiveMemoryRecord({
    id: memoryId,
    providerId,
    workspaceId,
    category,
    header,
    body,
    goal: createExecutiveMemoryGoal({
      goalId: "goal-expansion-001",
      title: "Expand into European market",
      description: "Increase revenue through European market entry.",
      targetMetric: "revenue",
      targetValue: "+15%",
      horizon: "next_fiscal_year",
    }),
    intent: createExecutiveMemoryIntent({
      intentId: "intent-expansion-001",
      title: "European market expansion",
      summary: "Expand company presence in Europe.",
      category: "growth",
      readiness: "ready",
    }),
    scenario: createExecutiveMemoryScenario({
      scenarioId: "scenario-eu-expansion-001",
      title: "EU expansion scenario",
      summary: "Scenario package for European expansion.",
      scenarioType: "growth",
      packageId: "pkg-eu-expansion-001",
    }),
    decision: createExecutiveMemoryDecision({
      decisionId: "decision-expansion-001",
      title: "Approve European expansion",
      rationale: "Validated demand and acceptable risk profile.",
      status: "approved",
      decidedAt: timestamp,
      decidedBy: "executive-committee",
    }),
    evidence: Object.freeze([
      createExecutiveMemoryEvidence({
        evidenceId: "evidence-market-001",
        source: "market-analysis",
        summary: "European demand analysis completed.",
        capturedAt: timestamp,
        reliability: "high",
      }),
    ]),
    confidence: createExecutiveMemoryConfidence({
      confidenceId: "confidence-001",
      score: 0.82,
      level: "high",
      source: "executive-review",
      explanation: "Strong evidence and aligned scenario analysis.",
      calculationMethod: "executive_assessment_v1",
    }),
    businessContext: createExecutiveMemoryBusinessContext({
      contextId: "context-eu-001",
      domain: "growth",
      businessUnit: "international",
      department: "strategy",
      market: "europe",
      description: "European expansion business context.",
    }),
    references: metadata.references,
    tags: metadata.tags,
    metadata,
    version,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

export const ExecutiveMemoryRecordBuilder = Object.freeze({
  createExecutiveMemoryRecord,
  createExecutiveMemoryReference,
  createExecutiveMemoryMetadata,
  buildExecutiveMemoryRecordExample,
});
