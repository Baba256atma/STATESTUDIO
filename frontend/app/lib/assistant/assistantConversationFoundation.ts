/** ASSISTANT-1:1 — Immutable Assistant Conversation Foundation aggregate. */
import { AssistantConversationFoundationBoundaries } from "./assistantConversationFoundation.boundaries.ts";
import { AssistantConversationFoundationCapabilities } from "./assistantConversationFoundation.capabilities.ts";
import {
  AssistantConversationFoundationConstants,
  AssistantConversationResponsibilities,
} from "./assistantConversationFoundation.constants.ts";
import { AssistantConversationFoundationContracts } from "./assistantConversationFoundation.contracts.ts";
import { AssistantConversationFoundationIdentity } from "./assistantConversationFoundation.identity.ts";

export const AssistantConversationFoundation = Object.freeze({
  identity: AssistantConversationFoundationIdentity,
  constants: AssistantConversationFoundationConstants,
  architecturalPosition: Object.freeze([
    "Manager",
    "Nexora Assistant",
    "Assistant Conversation Foundation",
  ]),
  responsibilities: AssistantConversationResponsibilities,
  contracts: AssistantConversationFoundationContracts,
  capabilities: AssistantConversationFoundationCapabilities,
  boundaries: AssistantConversationFoundationBoundaries,
  inventory: Object.freeze({
    responsibilityCount: AssistantConversationResponsibilities.length,
    contractCount: AssistantConversationFoundationContracts.length,
    capabilityCount: AssistantConversationFoundationCapabilities.length,
    boundaryCount: AssistantConversationFoundationBoundaries.length,
  }),
  upstreamDependencies: Object.freeze([]),
  publicApiSurface: Object.freeze(["AssistantConversationFoundation"]),
  status: "Foundation",
  readiness: "ReadyForRegistry",
  nextPhase: "ASSISTANT-1:2 — Conversation Registry",
  metadataOnly: true,
  immutable: true,
  deterministic: true,
  runtime: false,
  conversationEngine: false,
  llmImplementation: false,
  promptExecution: false,
  memoryStorage: false,
  orchestration: false,
  networking: false,
  persistence: false,
  uiRendering: false,
  sdk: false,
  workflowExecution: false,
  aiReasoning: false,
  stateMutation: false,
} as const);
