import {
  EXECUTIVE_JUDGMENT_API_VERSION,
  EXECUTIVE_JUDGMENT_MODULE_NAME,
  EXECUTIVE_JUDGMENT_PLATFORM_ID,
  EXECUTIVE_JUDGMENT_PLATFORM_NAME,
  EXECUTIVE_JUDGMENT_PLATFORM_TAGS,
  EXECUTIVE_JUDGMENT_PLATFORM_VERSION,
} from "./executiveJudgmentConstants.ts";

export type ExecutiveJudgmentPlatformIdentity = Readonly<{
  readonly platformId: typeof EXECUTIVE_JUDGMENT_PLATFORM_ID;
  readonly platformName: typeof EXECUTIVE_JUDGMENT_PLATFORM_NAME;
  readonly version: typeof EXECUTIVE_JUDGMENT_PLATFORM_VERSION;
  readonly moduleName: typeof EXECUTIVE_JUDGMENT_MODULE_NAME;
  readonly apiVersion: typeof EXECUTIVE_JUDGMENT_API_VERSION;
  readonly description: string;
  readonly dependencies: readonly string[];
  readonly consumers: readonly string[];
  readonly publicApis: readonly string[];
  readonly tags: typeof EXECUTIVE_JUDGMENT_PLATFORM_TAGS;
  readonly metadataOnly: true;
  readonly runtimeBehavior: false;
}>;

export const EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY: ExecutiveJudgmentPlatformIdentity = Object.freeze({
  platformId: EXECUTIVE_JUDGMENT_PLATFORM_ID,
  platformName: EXECUTIVE_JUDGMENT_PLATFORM_NAME,
  version: EXECUTIVE_JUDGMENT_PLATFORM_VERSION,
  moduleName: EXECUTIVE_JUDGMENT_MODULE_NAME,
  apiVersion: EXECUTIVE_JUDGMENT_API_VERSION,
  description: "Immutable contract foundation for future Executive Judgment Platform phases.",
  dependencies: Object.freeze([
    "ExecutiveContextPlatformFreeze",
    "ExecutiveReasoningPlatformFreeze",
  ] as const),
  consumers: Object.freeze([
    "CORE",
    "DS",
    "INT",
    "KNL",
    "APP",
    "LAY",
    "ASS",
    "LLM",
  ] as const),
  publicApis: Object.freeze([
    "EXECUTIVE_JUDGMENT_PLATFORM_IDENTITY",
    "EXECUTIVE_JUDGMENT_CONTRACT_CATALOG",
    "JudgmentStatus",
    "JudgmentState",
    "JudgmentType",
    "EvidenceStrength",
    "ConfidenceLevel",
    "PriorityLevel",
    "TradeoffType",
    "ConstraintType",
    "OutcomeType",
    "DecisionDirection",
  ] as const),
  tags: EXECUTIVE_JUDGMENT_PLATFORM_TAGS,
  metadataOnly: true,
  runtimeBehavior: false,
});
