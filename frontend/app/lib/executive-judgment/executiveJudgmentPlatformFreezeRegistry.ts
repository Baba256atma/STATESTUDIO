import {
  EXECUTIVE_JUDGMENT_PLATFORM_PUBLIC_APIS,
  getExecutiveJudgmentPlatformRegistry,
} from "./executiveJudgmentPlatformIndex.ts";
import type {
  ExecutiveJudgmentPlatformExtensionPolicy,
  ExecutiveJudgmentPlatformFreezeIdentity,
  ExecutiveJudgmentPlatformFreezePhase,
  ExecutiveJudgmentPlatformFreezePublicApi,
} from "./executiveJudgmentPlatformFreezeTypes.ts";

export const EXECUTIVE_JUDGMENT_FREEZE_IDENTITY: ExecutiveJudgmentPlatformFreezeIdentity = Object.freeze({
  platformId: "APP-JUDGE",
  platformName: "Executive Judgment Platform",
  platformVersion: "APP-JUDGE-10",
  releaseVersion: "executive-judgment-platform.freeze.v1",
  certified: true,
  frozen: true,
  released: true,
  metadataOnly: true,
});

export const EXECUTIVE_JUDGMENT_FREEZE_PHASES: readonly ExecutiveJudgmentPlatformFreezePhase[] = Object.freeze([
  Object.freeze({ phaseId: "APP-JUDGE-1", title: "Contract Foundation", order: 1, status: "certified", metadataOnly: true }),
  Object.freeze({ phaseId: "APP-JUDGE-2", title: "Judgment Context Engine", order: 2, status: "certified", metadataOnly: true }),
  Object.freeze({ phaseId: "APP-JUDGE-3", title: "Evidence Evaluation Engine", order: 3, status: "certified", metadataOnly: true }),
  Object.freeze({ phaseId: "APP-JUDGE-4", title: "Constraint Analysis Engine", order: 4, status: "certified", metadataOnly: true }),
  Object.freeze({ phaseId: "APP-JUDGE-5", title: "Trade-off Analysis Engine", order: 5, status: "certified", metadataOnly: true }),
  Object.freeze({ phaseId: "APP-JUDGE-6", title: "Risk & Opportunity Balancing Engine", order: 6, status: "certified", metadataOnly: true }),
  Object.freeze({ phaseId: "APP-JUDGE-7", title: "Executive Judgment Engine", order: 7, status: "certified", metadataOnly: true }),
  Object.freeze({ phaseId: "APP-JUDGE-8", title: "Judgment Explanation Engine", order: 8, status: "certified", metadataOnly: true }),
  Object.freeze({ phaseId: "APP-JUDGE-9", title: "Executive Judgment Platform API", order: 9, status: "certified", metadataOnly: true }),
  Object.freeze({ phaseId: "APP-JUDGE-10", title: "Platform Certification & Freeze", order: 10, status: "frozen", metadataOnly: true }),
]);

export const EXECUTIVE_JUDGMENT_FREEZE_EXTENSION_POLICY: ExecutiveJudgmentPlatformExtensionPolicy = Object.freeze({
  allowsNewEngines: false,
  allowsNewJudgmentLogic: false,
  allowsRecommendations: false,
  allowsCoaching: false,
  allowsExplanationLogic: false,
  allowsLlmCalls: false,
  allowsUiBehavior: false,
  allowsStorageWrites: false,
  allowsNetworkCalls: false,
  requiresReadOnlyCertification: true,
  policy: "certified-frozen-metadata-only",
});

export const EXECUTIVE_JUDGMENT_FREEZE_PUBLIC_APIS: readonly ExecutiveJudgmentPlatformFreezePublicApi[] = Object.freeze([
  ...EXECUTIVE_JUDGMENT_PLATFORM_PUBLIC_APIS.map((apiName) =>
    Object.freeze({ apiName, phaseId: "APP-JUDGE-9" as const, stable: true as const, metadataOnly: true as const })
  ),
  ...[
    "buildExecutiveJudgmentPlatformFreezeManifest",
    "runExecutiveJudgmentPlatformCertification",
    "runExecutiveJudgmentPlatformRegression",
    "runExecutiveJudgmentPlatformFreeze",
    "getExecutiveJudgmentPlatformFreezeState",
    "listExecutiveJudgmentPlatformPhases",
    "listExecutiveJudgmentPlatformPublicApis",
    "getExecutiveJudgmentPlatformCompatibilityMatrix",
    "getExecutiveJudgmentPlatformExtensionPolicy",
  ].map((apiName) => Object.freeze({ apiName, phaseId: "APP-JUDGE-10" as const, stable: true as const, metadataOnly: true as const })),
]);

export function listExecutiveJudgmentPlatformPhases(): readonly ExecutiveJudgmentPlatformFreezePhase[] {
  return EXECUTIVE_JUDGMENT_FREEZE_PHASES;
}

export function listExecutiveJudgmentPlatformPublicApis(): readonly ExecutiveJudgmentPlatformFreezePublicApi[] {
  return EXECUTIVE_JUDGMENT_FREEZE_PUBLIC_APIS;
}

export function getExecutiveJudgmentPlatformExtensionPolicy(): ExecutiveJudgmentPlatformExtensionPolicy {
  return EXECUTIVE_JUDGMENT_FREEZE_EXTENSION_POLICY;
}

export function getExecutiveJudgmentPlatformDependencyRegistry() {
  return getExecutiveJudgmentPlatformRegistry().dependencyMatrix;
}
