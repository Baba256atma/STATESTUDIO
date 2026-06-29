/**
 * APP-9:8 — Confidence Evolution Platform Certification manifest.
 */

import { STAGE_GLOBAL_FORBIDDEN_PATTERNS } from "../stage/stageArchitectureContract.ts";
import type { StageManifest } from "../stage/stageArchitectureTypes.ts";
import {
  CONFIDENCE_EVOLUTION_PLATFORM_ID,
  CONFIDENCE_EVOLUTION_PLATFORM_NAME,
} from "./confidenceEvolutionConstants.ts";
import { CONFIDENCE_EVOLUTION_API_SELF_MANIFEST } from "./confidenceEvolutionApiManifest.ts";
import {
  CONFIDENCE_EVOLUTION_API_GROUP_KEYS,
  CONFIDENCE_EVOLUTION_CONSUMER_KEYS,
  type ConfidenceEvolutionConsumerContract,
} from "./confidenceEvolutionApiTypes.ts";
import {
  CONFIDENCE_EVOLUTION_API_FORBIDDEN_CAPABILITIES,
  CONFIDENCE_EVOLUTION_API_READ_CAPABILITIES,
  CONFIDENCE_EVOLUTION_API_WRITE_CAPABILITIES,
} from "./confidenceEvolutionApiManifest.ts";
import { listConfidenceEvolutionConsumerContracts } from "./confidenceEvolutionConsumerContracts.ts";

export const CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION = "APP-9/8" as const;
export const CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_ARCHITECTURE_VERSION =
  "APP-9/8-platform-certification-arch" as const;

export const CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_TAGS = Object.freeze([
  "[APP9_8]",
  "[PLATFORM_CERTIFICATION]",
  "[READ_ONLY]",
  "[NO_NEW_FEATURES]",
  "[NO_PLATFORM_MUTATIONS]",
  "[ARCHITECTURE_SAFE]",
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_CERTIFIED_MODULES = Object.freeze([
  { layerId: "APP-9/1", title: "Confidence Evolution Foundation", contractVersion: "APP-9/1" },
  { layerId: "APP-9/2", title: "Confidence Evolution Engine", contractVersion: "APP-9/2" },
  { layerId: "APP-9/3", title: "Confidence Evolution Query + Ordering", contractVersion: "APP-9/3" },
  { layerId: "APP-9/4", title: "Confidence Trend + Volatility", contractVersion: "APP-9/4" },
  { layerId: "APP-9/5", title: "Confidence Evidence + Reason Link", contractVersion: "APP-9/5" },
  { layerId: "APP-9/6", title: "Confidence Calibration + Accuracy", contractVersion: "APP-9/6" },
  { layerId: "APP-9/7", title: "Confidence API + Consumer Contract", contractVersion: "APP-9/7" },
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_GROUP_KEYS = Object.freeze([
  "A_app9_1_foundation",
  "B_app9_2_engine",
  "C_app9_3_query_layer",
  "D_app9_4_trend_layer",
  "E_app9_5_evidence_reason_layer",
  "F_app9_6_calibration_layer",
  "G_app9_7_api_layer",
  "H_public_facade_groups",
  "I_consumer_contracts",
  "J_workspace_isolation",
  "K_end_to_end_flow",
  "L_mutation_boundaries",
  "M_archive_policy",
  "N_readonly_consumers",
  "O_workspace_controlled_writes",
  "P_dashboard_assistant_visualization_readonly",
  "Q_no_app6_integration",
  "R_no_app7_integration",
  "S_no_app8_integration",
  "T_no_dashboard_implementation",
  "U_no_assistant_implementation",
  "V_no_visualization_implementation",
  "W_no_persistence",
  "X_no_prediction_recommendation",
  "Y_prior_platforms_untouched",
  "Z_certification_deterministic",
  "AA_platform_manifest_valid",
  "AB_ready_for_freeze",
] as const);

export type ConfidenceEvolutionPlatformCertificationGroupKey =
  (typeof CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_GROUP_KEYS)[number];

export const CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_REQUIRED_DOCS = Object.freeze([
  "docs/app-9-1-confidence-evolution-foundation.md",
  "docs/app-9-2-confidence-evolution-engine.md",
  "docs/app-9-3-confidence-evolution-query-ordering.md",
  "docs/app-9-4-confidence-trend-volatility.md",
  "docs/app-9-5-confidence-evidence-reason-link.md",
  "docs/app-9-6-confidence-calibration-accuracy.md",
  "docs/app-9-7-confidence-api-consumer-contract.md",
  "docs/app-9-8-confidence-evolution-platform-certification.md",
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS = Object.freeze([
  ...STAGE_GLOBAL_FORBIDDEN_PATTERNS,
  "components/",
  ".tsx",
  "React.",
  "useState",
  "localStorage",
  "indexedDB",
  "openai",
  "ChatGPT",
  "prompt(",
  "fetch(",
  "DashboardAdapter",
  "AssistantAdapter",
  "VisualizationRenderer",
  "ConfidenceChart",
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_PREREQUISITE_PLATFORMS = Object.freeze([
  "APP-1",
  "APP-2",
  "APP-3",
  "APP-4",
  "APP-5",
  "APP-6",
  "APP-7",
  "APP-8",
  "DS",
  "INT",
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_PUBLIC_APIS = Object.freeze([
  "createConfidenceEvolutionApi",
  "getConfidenceEvolutionApi",
  "getConfidenceEvolutionApiManifest",
  "validateConfidenceEvolutionApiContract",
  "getConfidenceEvolutionConsumerContract",
  "validateConfidenceEvolutionConsumerAccess",
  "runConfidenceEvolutionApiCertification",
  "runConfidenceEvolutionPlatformCertification",
  "runConfidenceEvolutionPlatformRegression",
  "getConfidenceEvolutionPlatformManifest",
  "getConfidenceEvolutionPlatformReadinessReport",
  "validateConfidenceEvolutionPlatform",
] as const);

export const CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_SELF_MANIFEST = Object.freeze({
  stageId: "APP-9/8",
  title: "Confidence Evolution Platform Certification",
  goal: "Official read-only full-platform certification for APP-9:1 through APP-9:7.",
  lifecycle: "build" as const,
  allowedFiles: Object.freeze([
    ...CONFIDENCE_EVOLUTION_API_SELF_MANIFEST.allowedFiles,
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformCertificationTypes.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformCertificationManifest.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformRegression.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformReadiness.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformCertification.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformCertificationRunner.ts",
    "frontend/app/lib/confidence-evolution/confidenceEvolutionPlatformCertification.test.ts",
    "docs/app-9-8-confidence-evolution-platform-certification.md",
  ]),
  forbiddenPatterns: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_FORBIDDEN_PATTERNS,
  prerequisites: Object.freeze(["APP-9/1", "APP-9/2", "APP-9/3", "APP-9/4", "APP-9/5", "APP-9/6", "APP-9/7"]),
  runtimePath: "library-only" as const,
  tags: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_TAGS,
} satisfies StageManifest);

export type ConfidenceEvolutionPlatformManifest = Readonly<{
  platformId: typeof CONFIDENCE_EVOLUTION_PLATFORM_ID;
  platformName: typeof CONFIDENCE_EVOLUTION_PLATFORM_NAME;
  platformVersion: typeof CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION;
  appId: "APP-9";
  phases: readonly Readonly<{ phaseId: string; title: string; contractVersion: string; readOnly: true }>[];
  publicApis: typeof CONFIDENCE_EVOLUTION_PLATFORM_PUBLIC_APIS;
  consumers: readonly ConfidenceEvolutionConsumerContract[];
  capabilities: readonly string[];
  forbiddenCapabilities: typeof CONFIDENCE_EVOLUTION_API_FORBIDDEN_CAPABILITIES;
  certificationGroups: typeof CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_GROUP_KEYS;
  prerequisitePlatforms: typeof CONFIDENCE_EVOLUTION_PLATFORM_PREREQUISITE_PLATFORMS;
  compatibilityMatrix: readonly Readonly<{ guaranteeId: string; description: string; enforced: true; readOnly: true }>[];
  readyForFreeze: boolean;
  certifiedAt: string | null;
  generatedAt: string;
  readOnly: true;
}>;

export function buildConfidenceEvolutionPlatformManifest(
  generatedAt: string,
  readyForFreeze: boolean,
  certifiedAt: string | null = null
): ConfidenceEvolutionPlatformManifest {
  return Object.freeze({
    platformId: CONFIDENCE_EVOLUTION_PLATFORM_ID,
    platformName: CONFIDENCE_EVOLUTION_PLATFORM_NAME,
    platformVersion: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_CONTRACT_VERSION,
    appId: "APP-9",
    phases: Object.freeze(
      CONFIDENCE_EVOLUTION_PLATFORM_CERTIFIED_MODULES.map((entry) =>
        Object.freeze({
          phaseId: entry.layerId,
          title: entry.title,
          contractVersion: entry.contractVersion,
          readOnly: true as const,
        })
      )
    ),
    publicApis: CONFIDENCE_EVOLUTION_PLATFORM_PUBLIC_APIS,
    consumers: listConfidenceEvolutionConsumerContracts(),
    capabilities: Object.freeze([
      ...CONFIDENCE_EVOLUTION_API_READ_CAPABILITIES,
      ...CONFIDENCE_EVOLUTION_API_WRITE_CAPABILITIES,
      ...CONFIDENCE_EVOLUTION_API_GROUP_KEYS,
    ]),
    forbiddenCapabilities: CONFIDENCE_EVOLUTION_API_FORBIDDEN_CAPABILITIES,
    certificationGroups: CONFIDENCE_EVOLUTION_PLATFORM_CERTIFICATION_GROUP_KEYS,
    prerequisitePlatforms: CONFIDENCE_EVOLUTION_PLATFORM_PREREQUISITE_PLATFORMS,
    compatibilityMatrix: Object.freeze([
      Object.freeze({
        guaranteeId: "app6-decision-reference",
        description: "Compatible with APP-6 Decision Timeline without direct integration.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "app7-business-reference",
        description: "Compatible with APP-7 Business Timeline without modification.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "app8-journal-reference",
        description: "Compatible with APP-8 Decision Journal without direct integration.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "frozen-prior-platforms",
        description: "Does not modify certified APP-1 through APP-8 platforms.",
        enforced: true as const,
        readOnly: true as const,
      }),
      Object.freeze({
        guaranteeId: "facade-only-consumption",
        description: "Future consumers must use APP-9:7 facade — not internal modules.",
        enforced: true as const,
        readOnly: true as const,
      }),
    ]),
    readyForFreeze,
    certifiedAt,
    generatedAt,
    readOnly: true as const,
  });
}

export function validateConfidenceEvolutionPlatformManifest(
  manifest: ConfidenceEvolutionPlatformManifest
): Readonly<{ valid: boolean; issues: readonly string[]; readOnly: true }> {
  const issues: string[] = [];
  if (manifest.platformId !== CONFIDENCE_EVOLUTION_PLATFORM_ID) {
    issues.push("Invalid platformId.");
  }
  if (manifest.phases.length !== 7) {
    issues.push("Expected seven certified phases.");
  }
  if (manifest.consumers.length !== CONFIDENCE_EVOLUTION_CONSUMER_KEYS.length) {
    issues.push("Consumer contract count mismatch.");
  }
  if (manifest.certificationGroups.length !== 28) {
    issues.push("Expected 28 certification groups.");
  }
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}
