/**
 * ASS-9 — Platform identity, phase registry, and release metadata.
 */

import { ASS_EXTENSION_POINT_KEYS, ASS_PLATFORM_ID, ASS_PLATFORM_NAME } from "./executiveAssistantPlatformContracts.ts";
import { ASS_PLATFORM_CONTRACT_VERSION, ASS_PUBLIC_API_REGISTRY } from "./executiveAssistantPlatformContracts.ts";
import { ASS_CLARIFICATION_PLATFORM_ID, ASS_CLARIFICATION_PUBLIC_API_REGISTRY, ASS_CLARIFICATION_VERSION } from "./executiveAssistantClarificationContracts.ts";
import { ASS_CONVERSATION_PLATFORM_ID, ASS_CONVERSATION_PUBLIC_API_REGISTRY, ASS_CONVERSATION_CONTRACT_VERSION } from "./executiveAssistantConversationContracts.ts";
import { ASS_CONVERSATION_STATE_PLATFORM_ID, ASS_CONVERSATION_STATE_PUBLIC_API_REGISTRY, ASS_CONVERSATION_STATE_VERSION } from "./executiveAssistantConversationStateContracts.ts";
import { ASS_COORDINATION_PLATFORM_ID, ASS_COORDINATION_PUBLIC_API_REGISTRY, ASS_COORDINATION_VERSION } from "./executiveAssistantCoordinationContracts.ts";
import { ASS_INTENT_PLATFORM_ID, ASS_INTENT_PUBLIC_API_REGISTRY, ASS_INTENT_VERSION } from "./executiveAssistantIntentContracts.ts";
import { ASS_RESPONSE_PLATFORM_ID, ASS_RESPONSE_PUBLIC_API_REGISTRY, ASS_RESPONSE_VERSION } from "./executiveAssistantResponseContracts.ts";
import { ASS_ROUTING_PLATFORM_ID, ASS_ROUTING_PUBLIC_API_REGISTRY, ASS_ROUTING_VERSION } from "./executiveAssistantRoutingContracts.ts";
import type {
  ExecutiveAssistantPlatformExtensionRegistration,
  ExecutiveAssistantPlatformPhaseRegistration,
  ExecutiveAssistantPlatformRegistry,
} from "./executiveAssistantPlatformFreezeTypes.ts";

export const ASS_PLATFORM_FREEZE_CONTRACT_VERSION = "ASS/9" as const;
export const ASS_PLATFORM_RELEASE_VERSION = "1.0.0-mvp" as const;
export const ASS_PLATFORM_FREEZE_VERSION = "ASS/9-freeze" as const;
export const ASS_PLATFORM_RELEASE_STAGE = "certified-frozen" as const;
export const ASS_PLATFORM_RELEASE_DECLARATION =
  "The Executive Assistant Platform is Certified, Frozen, and Released." as const;

export const ASS_PLATFORM_FREEZE_PUBLIC_API_REGISTRY = Object.freeze([
  "runExecutiveAssistantPlatformCertification",
  "runExecutiveAssistantPlatformRegression",
  "buildExecutiveAssistantPlatformManifest",
  "runExecutiveAssistantPlatformFreeze",
  "ExecutiveAssistantPlatform",
] as const);

export const ASS_PLATFORM_FREEZE_PRINCIPLES = Object.freeze([
  "metadata_only_no_runtime_behavior",
  "consumes_ass_1_through_ass_8_only",
  "never_modifies_certified_phases",
  "regression_read_only",
  "freeze_mvp_contracts_immutably",
  "future_ass_extensions_additive_only",
] as const);

export const ASS_CERTIFIED_MVP_PHASE_KEYS = Object.freeze([
  "ASS/1",
  "ASS/2",
  "ASS/3",
  "ASS/4",
  "ASS/5",
  "ASS/6",
  "ASS/7",
  "ASS/8",
] as const);

export const ASS_EXTENSION_POLICY = Object.freeze([
  "future_phases_extend_ass_9_additively",
  "no_breaking_changes_to_certified_phases",
  "runtime_engines_consume_frozen_contracts_only",
  "assistant_execution_chat_llm_out_of_scope",
  "ass_10_plus_reserved_for_runtime_engines",
] as const);

const PHASE_DEFINITIONS = Object.freeze([
  Object.freeze({
    phaseId: "ASS/1",
    contractVersion: ASS_PLATFORM_CONTRACT_VERSION,
    platformId: ASS_PLATFORM_ID,
    title: "Platform Foundation",
    publicApis: ASS_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["executiveAssistantPlatformContracts.ts", "executiveAssistantPlatformExports.ts"]),
    buildLayerApi: "buildExecutiveAssistantPlatformFoundation",
  }),
  Object.freeze({
    phaseId: "ASS/2",
    contractVersion: ASS_CONVERSATION_CONTRACT_VERSION,
    platformId: ASS_CONVERSATION_PLATFORM_ID,
    title: "Conversation Contracts",
    publicApis: ASS_CONVERSATION_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["executiveAssistantConversationContracts.ts", "executiveAssistantConversationExports.ts"]),
    buildLayerApi: "buildExecutiveAssistantConversationContracts",
  }),
  Object.freeze({
    phaseId: "ASS/3",
    contractVersion: ASS_CONVERSATION_STATE_VERSION,
    platformId: ASS_CONVERSATION_STATE_PLATFORM_ID,
    title: "Conversation State Architecture",
    publicApis: ASS_CONVERSATION_STATE_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["executiveAssistantConversationStateContracts.ts", "executiveAssistantConversationStateExports.ts"]),
    buildLayerApi: "buildExecutiveAssistantConversationStateArchitecture",
  }),
  Object.freeze({
    phaseId: "ASS/4",
    contractVersion: ASS_ROUTING_VERSION,
    platformId: ASS_ROUTING_PLATFORM_ID,
    title: "Routing Architecture",
    publicApis: ASS_ROUTING_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["executiveAssistantRoutingContracts.ts", "executiveAssistantRoutingExports.ts"]),
    buildLayerApi: "buildExecutiveAssistantRoutingArchitecture",
  }),
  Object.freeze({
    phaseId: "ASS/5",
    contractVersion: ASS_INTENT_VERSION,
    platformId: ASS_INTENT_PLATFORM_ID,
    title: "Intent Interpretation Contract",
    publicApis: ASS_INTENT_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["executiveAssistantIntentContracts.ts", "executiveAssistantIntentExports.ts"]),
    buildLayerApi: "buildExecutiveAssistantIntentInterpretationContracts",
  }),
  Object.freeze({
    phaseId: "ASS/6",
    contractVersion: ASS_RESPONSE_VERSION,
    platformId: ASS_RESPONSE_PLATFORM_ID,
    title: "Response Contract Architecture",
    publicApis: ASS_RESPONSE_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["executiveAssistantResponseContracts.ts", "executiveAssistantResponseExports.ts"]),
    buildLayerApi: "buildExecutiveAssistantResponseContractArchitecture",
  }),
  Object.freeze({
    phaseId: "ASS/7",
    contractVersion: ASS_CLARIFICATION_VERSION,
    platformId: ASS_CLARIFICATION_PLATFORM_ID,
    title: "Clarification Architecture",
    publicApis: ASS_CLARIFICATION_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["executiveAssistantClarificationContracts.ts", "executiveAssistantClarificationExports.ts"]),
    buildLayerApi: "buildExecutiveAssistantClarificationArchitecture",
  }),
  Object.freeze({
    phaseId: "ASS/8",
    contractVersion: ASS_COORDINATION_VERSION,
    platformId: ASS_COORDINATION_PLATFORM_ID,
    title: "Coordination Manifest",
    publicApis: ASS_COORDINATION_PUBLIC_API_REGISTRY,
    requiredFiles: Object.freeze(["executiveAssistantCoordinationContracts.ts", "executiveAssistantCoordinationExports.ts"]),
    buildLayerApi: "buildExecutiveAssistantCoordinationManifest",
  }),
] as const);

const CERTIFIED_EXTENSION_STATUS = Object.freeze({
  conversation_engine: "certified",
  capability_router: "certified",
  integration_adapter: "certified",
  query_facade: "reserved",
  governance_facade: "reserved",
  platform_certification: "certified",
} as const);

export function getExecutiveAssistantCertifiedPhaseRegistrations(): readonly ExecutiveAssistantPlatformPhaseRegistration[] {
  return Object.freeze(
    PHASE_DEFINITIONS.map((phase) =>
      Object.freeze({
        ...phase,
        readOnly: true as const,
      })
    )
  );
}

export function getExecutiveAssistantPlatformExtensionRegistry(): readonly ExecutiveAssistantPlatformExtensionRegistration[] {
  return Object.freeze(
    ASS_EXTENSION_POINT_KEYS.map((extensionKey) =>
      Object.freeze({
        extensionId: `ass-extension-${extensionKey}`,
        label: extensionKey.replace(/_/g, " "),
        extensionKey,
        status: CERTIFIED_EXTENSION_STATUS[extensionKey as keyof typeof CERTIFIED_EXTENSION_STATUS] ?? "reserved",
        readOnly: true as const,
      })
    )
  );
}

export function getExecutiveAssistantPlatformPublicApiRegistry(): readonly string[] {
  const apis = PHASE_DEFINITIONS.flatMap((phase) => [...phase.publicApis]);
  return Object.freeze([...new Set(apis)]);
}

export function getExecutiveAssistantPlatformRegistry(): ExecutiveAssistantPlatformRegistry {
  const certifiedPhases = getExecutiveAssistantCertifiedPhaseRegistrations();
  return Object.freeze({
    platformId: ASS_PLATFORM_ID,
    platformName: ASS_PLATFORM_NAME,
    contractVersion: ASS_PLATFORM_FREEZE_CONTRACT_VERSION,
    releaseVersion: ASS_PLATFORM_RELEASE_VERSION,
    freezeVersion: ASS_PLATFORM_FREEZE_VERSION,
    releaseStage: ASS_PLATFORM_RELEASE_STAGE,
    certifiedPhases,
    phaseCount: certifiedPhases.length,
    publicApis: getExecutiveAssistantPlatformPublicApiRegistry(),
    extensionPoints: getExecutiveAssistantPlatformExtensionRegistry(),
    readOnly: true as const,
  });
}

export function getExecutiveAssistantCertifiedPhaseById(phaseId: string): ExecutiveAssistantPlatformPhaseRegistration | null {
  return getExecutiveAssistantCertifiedPhaseRegistrations().find((phase) => phase.phaseId === phaseId) ?? null;
}
