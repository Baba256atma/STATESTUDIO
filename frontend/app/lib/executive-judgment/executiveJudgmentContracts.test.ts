import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  ConfidenceLevel,
  ConstraintType,
  DecisionDirection,
  EXECUTIVE_JUDGMENT_API_VERSION,
  EXECUTIVE_JUDGMENT_CONTRACT_CATALOG,
  EXECUTIVE_JUDGMENT_MODULE_NAME,
  EXECUTIVE_JUDGMENT_PLATFORM_ID,
  EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY,
  EXECUTIVE_JUDGMENT_PLATFORM_NAME,
  EXECUTIVE_JUDGMENT_PLATFORM_TAGS,
  EXECUTIVE_JUDGMENT_PLATFORM_VERSION,
  EvidenceStrength,
  JudgmentState,
  JudgmentStatus,
  JudgmentType,
  OutcomeType,
  PriorityLevel,
  TradeoffType,
  type ExecutiveJudgment,
} from "./index.ts";

test("preserves type integrity for judgment contracts", () => {
  const judgment: ExecutiveJudgment = Object.freeze({
    judgmentId: "judgment-1",
    judgmentType: JudgmentType.Strategic,
    status: JudgmentStatus.Draft,
    state: JudgmentState.Proposed,
    context: Object.freeze({
      contextId: "context-1",
      workspaceId: "workspace-1",
      executiveContextId: "executive-context-1",
      reasoningPlatformVersion: "APP-REASON-4",
      scopeTags: Object.freeze(["workspace"]),
      metadata: EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY.metadataOnly
        ? Object.freeze({
            source: "contract-test",
            description: "Contract test metadata.",
            tags: Object.freeze(["test"]),
            apiVersion: EXECUTIVE_JUDGMENT_API_VERSION,
            platformVersion: EXECUTIVE_JUDGMENT_PLATFORM_VERSION,
            metadataOnly: true,
          })
        : Object.freeze({
            source: "contract-test",
            description: "Contract test metadata.",
            tags: Object.freeze(["test"]),
            apiVersion: EXECUTIVE_JUDGMENT_API_VERSION,
            platformVersion: EXECUTIVE_JUDGMENT_PLATFORM_VERSION,
            metadataOnly: true,
          }),
    }),
    options: Object.freeze([]),
    candidates: Object.freeze([]),
    evidence: Object.freeze([]),
    constraints: Object.freeze([]),
    assumptions: Object.freeze([]),
    tradeoffs: Object.freeze([]),
    risks: Object.freeze([]),
    opportunities: Object.freeze([]),
    priorities: Object.freeze([]),
    outcome: null,
    confidence: null,
    explanation: null,
    metadata: Object.freeze({
      source: "contract-test",
      description: "Judgment contract test metadata.",
      tags: Object.freeze(["contract"]),
      apiVersion: EXECUTIVE_JUDGMENT_API_VERSION,
      platformVersion: EXECUTIVE_JUDGMENT_PLATFORM_VERSION,
      metadataOnly: true,
    }),
  });

  assert.equal(judgment.judgmentId, "judgment-1");
  assert.equal(judgment.context.reasoningPlatformVersion, "APP-REASON-4");
  assert.equal(judgment.metadata.metadataOnly, true);
});

test("preserves enum integrity", () => {
  assert.equal(JudgmentStatus.Draft, "draft");
  assert.equal(JudgmentState.UnderReview, "under-review");
  assert.equal(JudgmentType.Strategic, "strategic");
  assert.equal(EvidenceStrength.Strong, "strong");
  assert.equal(ConfidenceLevel.High, "high");
  assert.equal(PriorityLevel.Critical, "critical");
  assert.equal(TradeoffType.RiskReward, "risk-reward");
  assert.equal(ConstraintType.Dependency, "dependency");
  assert.equal(OutcomeType.Escalated, "escalated");
  assert.equal(DecisionDirection.Revise, "revise");
});

test("exports immutable constants", () => {
  assert.equal(EXECUTIVE_JUDGMENT_PLATFORM_ID, "APP-JUDGE");
  assert.equal(EXECUTIVE_JUDGMENT_PLATFORM_NAME, "Executive Judgment Platform");
  assert.equal(EXECUTIVE_JUDGMENT_PLATFORM_VERSION, "APP-JUDGE-1");
  assert.equal(EXECUTIVE_JUDGMENT_MODULE_NAME, "Executive Judgment Contract Foundation");
  assert.equal(EXECUTIVE_JUDGMENT_API_VERSION, "app-judge.contracts.v1");
  assert.equal(Object.isFrozen(EXECUTIVE_JUDGMENT_PLATFORM_TAGS), true);
});

test("publishes platform identity", () => {
  assert.equal(EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY.platformId, "APP-JUDGE");
  assert.equal(EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY.platformName, "Executive Judgment Platform");
  assert.equal(EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY.version, "APP-JUDGE-1");
  assert.equal(EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY.runtimeBehavior, false);
  assert.equal(EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY.dependencies.includes("ExecutiveReasoningPlatformFreeze"), true);
  assert.equal(EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY.consumers.includes("APP"), true);
});

test("publishes contract catalog", () => {
  assert.equal(EXECUTIVE_JUDGMENT_CONTRACT_CATALOG.platformId, "APP-JUDGE");
  assert.equal(EXECUTIVE_JUDGMENT_CONTRACT_CATALOG.contracts.includes("ExecutiveJudgment"), true);
  assert.equal(EXECUTIVE_JUDGMENT_CONTRACT_CATALOG.contracts.includes("ExecutiveJudgmentConfidence"), true);
  assert.equal(EXECUTIVE_JUDGMENT_CONTRACT_CATALOG.runtimeBehavior, false);
  assert.equal(Object.isFrozen(EXECUTIVE_JUDGMENT_CONTRACT_CATALOG), true);
});

test("contains no forbidden runtime behavior in source", () => {
  const sources = [
    readFileSync("app/lib/executive-judgment/executiveJudgmentContracts.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentTypes.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentEnums.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentConstants.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/executiveJudgmentIdentity.ts", "utf8"),
    readFileSync("app/lib/executive-judgment/index.ts", "utf8"),
  ].join(" ");

  assert.equal(sources.includes(" any"), false);
  assert.equal(sources.includes("function "), false);
  assert.equal(sources.includes("class "), false);
  assert.equal(sources.includes("calculate"), false);
  assert.equal(sources.includes("score"), false);
  assert.equal(sources.includes("recommend"), false);
});
