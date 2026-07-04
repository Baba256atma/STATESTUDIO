export type ExecutiveJudgmentPlatformPhaseId =
  | "APP-JUDGE-1"
  | "APP-JUDGE-2"
  | "APP-JUDGE-3"
  | "APP-JUDGE-4"
  | "APP-JUDGE-5"
  | "APP-JUDGE-6"
  | "APP-JUDGE-7"
  | "APP-JUDGE-8"
  | "APP-JUDGE-9";

export type ExecutiveJudgmentPlatformRegistry = Readonly<{
  platformId: "APP-JUDGE";
  platformName: "Executive Judgment Platform";
  platformVersion: "APP-JUDGE-9";
  publicApis: readonly string[];
  certifiedPhases: readonly ExecutiveJudgmentPlatformPhaseId[];
  dependencyMatrix: readonly Readonly<{ phaseId: ExecutiveJudgmentPlatformPhaseId; consumes: readonly ExecutiveJudgmentPlatformPhaseId[] }>[];
  consumerMatrix: readonly string[];
  compatibilityMatrix: readonly string[];
  extensionPolicy: Readonly<{
    allowsNewJudgmentLogic: false;
    allowsRecommendations: false;
    allowsCoaching: false;
    allowsLlmCalls: false;
    allowsUiBehavior: false;
    allowsRuntimeSideEffects: false;
    requiresCertifiedPhaseConsumption: true;
  }>;
  releaseMetadata: Readonly<{
    releaseStage: "api-published";
    nextPhase: "APP-JUDGE-10";
    deterministic: true;
    metadataOnly: true;
  }>;
}>;

export const EXECUTIVE_JUDGMENT_PLATFORM_PHASES = Object.freeze([
  "APP-JUDGE-1",
  "APP-JUDGE-2",
  "APP-JUDGE-3",
  "APP-JUDGE-4",
  "APP-JUDGE-5",
  "APP-JUDGE-6",
  "APP-JUDGE-7",
  "APP-JUDGE-8",
  "APP-JUDGE-9",
] as const);

export const EXECUTIVE_JUDGMENT_PLATFORM_PUBLIC_APIS = Object.freeze([
  "runExecutiveJudgmentPlatform",
  "createExecutiveJudgmentPlatform",
  "validateExecutiveJudgmentPlatform",
  "buildExecutiveJudgmentPlatformManifest",
  "getExecutiveJudgmentPlatformRegistry",
  "getExecutiveJudgmentPlatformVersion",
] as const);

export function getExecutiveJudgmentPlatformVersion(): "APP-JUDGE-9" {
  return "APP-JUDGE-9";
}

export function getExecutiveJudgmentPlatformRegistry(): ExecutiveJudgmentPlatformRegistry {
  return Object.freeze({
    platformId: "APP-JUDGE",
    platformName: "Executive Judgment Platform",
    platformVersion: "APP-JUDGE-9",
    publicApis: EXECUTIVE_JUDGMENT_PLATFORM_PUBLIC_APIS,
    certifiedPhases: EXECUTIVE_JUDGMENT_PLATFORM_PHASES,
    dependencyMatrix: Object.freeze([
      Object.freeze({ phaseId: "APP-JUDGE-1", consumes: Object.freeze([]) }),
      Object.freeze({ phaseId: "APP-JUDGE-2", consumes: Object.freeze(["APP-JUDGE-1"] as const) }),
      Object.freeze({ phaseId: "APP-JUDGE-3", consumes: Object.freeze(["APP-JUDGE-1", "APP-JUDGE-2"] as const) }),
      Object.freeze({ phaseId: "APP-JUDGE-4", consumes: Object.freeze(["APP-JUDGE-1", "APP-JUDGE-2", "APP-JUDGE-3"] as const) }),
      Object.freeze({ phaseId: "APP-JUDGE-5", consumes: Object.freeze(["APP-JUDGE-1", "APP-JUDGE-2", "APP-JUDGE-3", "APP-JUDGE-4"] as const) }),
      Object.freeze({ phaseId: "APP-JUDGE-6", consumes: Object.freeze(["APP-JUDGE-1", "APP-JUDGE-2", "APP-JUDGE-3", "APP-JUDGE-4", "APP-JUDGE-5"] as const) }),
      Object.freeze({ phaseId: "APP-JUDGE-7", consumes: Object.freeze(["APP-JUDGE-1", "APP-JUDGE-2", "APP-JUDGE-3", "APP-JUDGE-4", "APP-JUDGE-5", "APP-JUDGE-6"] as const) }),
      Object.freeze({ phaseId: "APP-JUDGE-8", consumes: Object.freeze(["APP-JUDGE-7"] as const) }),
      Object.freeze({ phaseId: "APP-JUDGE-9", consumes: Object.freeze(["APP-JUDGE-1", "APP-JUDGE-2", "APP-JUDGE-3", "APP-JUDGE-4", "APP-JUDGE-5", "APP-JUDGE-6", "APP-JUDGE-7", "APP-JUDGE-8"] as const) }),
    ]),
    consumerMatrix: Object.freeze(["CORE", "DS", "INT", "KNL", "APP", "ASS", "LAY", "LLM"] as const),
    compatibilityMatrix: Object.freeze(["CORE", "DS", "INT", "KNL", "APP", "ASS", "LAY", "LLM"] as const),
    extensionPolicy: Object.freeze({
      allowsNewJudgmentLogic: false,
      allowsRecommendations: false,
      allowsCoaching: false,
      allowsLlmCalls: false,
      allowsUiBehavior: false,
      allowsRuntimeSideEffects: false,
      requiresCertifiedPhaseConsumption: true,
    }),
    releaseMetadata: Object.freeze({
      releaseStage: "api-published",
      nextPhase: "APP-JUDGE-10",
      deterministic: true,
      metadataOnly: true,
    }),
  });
}
