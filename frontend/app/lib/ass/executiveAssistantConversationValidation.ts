/**
 * ASS-2 — Executive Conversation Contract validation.
 */

import { ASS_CONVERSATION_SCOPE_KEYS } from "./executiveAssistantPlatformContracts.ts";
import {
  ASS_CONVERSATION_COMPATIBLE_VERSIONS,
  ASS_CONVERSATION_CONTRACT_VERSION,
  ASS_CONVERSATION_IDENTITY_MANDATORY_FIELDS,
  ASS_CONVERSATION_MUST_NOT_OWN,
  ASS_CONVERSATION_PRINCIPLES,
  ASS_CONVERSATION_REGISTRY_KEYS,
  ASS_MESSAGE_KIND_KEYS,
  ASS_MESSAGE_MANDATORY_FIELDS,
  ASS_PARTICIPANT_ROLE_KEYS,
  ASS_SESSION_MANDATORY_FIELDS,
  ASS_TURN_MANDATORY_FIELDS,
} from "./executiveAssistantConversationContracts.ts";
import type {
  ExecutiveAssistantConversationIdentityRecord,
  ExecutiveAssistantConversationManifest,
  ExecutiveAssistantConversationRegistryBundle,
  ExecutiveAssistantConversationValidationIssue,
  ExecutiveAssistantConversationValidationReport,
  ExecutiveAssistantMessageContractRecord,
  ExecutiveAssistantTurnContractRecord,
} from "./executiveAssistantConversationTypes.ts";

function issue(code: string, message: string, field?: string): ExecutiveAssistantConversationValidationIssue {
  return Object.freeze({ code, message, field, readOnly: true as const });
}

function report(issues: ExecutiveAssistantConversationValidationIssue[]): ExecutiveAssistantConversationValidationReport {
  return Object.freeze({ valid: issues.length === 0, issues: Object.freeze(issues), readOnly: true as const });
}

export function validateExecutiveAssistantConversationIdentityRecord(
  record: ExecutiveAssistantConversationIdentityRecord
): ExecutiveAssistantConversationValidationReport {
  const issues: ExecutiveAssistantConversationValidationIssue[] = [];
  for (const field of ASS_CONVERSATION_IDENTITY_MANDATORY_FIELDS) {
    if (!(field in record)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}`, field));
    }
  }
  if (!(ASS_CONVERSATION_SCOPE_KEYS as readonly string[]).includes(record.scopeKey)) {
    issues.push(issue("invalid_scope", "Invalid conversation scope key.", "scopeKey"));
  }
  return report(issues);
}

export function validateExecutiveAssistantMessageContractRecord(
  record: ExecutiveAssistantMessageContractRecord
): ExecutiveAssistantConversationValidationReport {
  const issues: ExecutiveAssistantConversationValidationIssue[] = [];
  for (const field of ASS_MESSAGE_MANDATORY_FIELDS) {
    if (!(field in record)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}`, field));
    }
  }
  if (!(ASS_MESSAGE_KIND_KEYS as readonly string[]).includes(record.messageKind)) {
    issues.push(issue("invalid_message_kind", "Invalid message kind.", "messageKind"));
  }
  if (!(ASS_PARTICIPANT_ROLE_KEYS as readonly string[]).includes(record.participantRole)) {
    issues.push(issue("invalid_role", "Invalid participant role.", "participantRole"));
  }
  return report(issues);
}

export function validateExecutiveAssistantTurnContractRecord(
  record: ExecutiveAssistantTurnContractRecord
): ExecutiveAssistantConversationValidationReport {
  const issues: ExecutiveAssistantConversationValidationIssue[] = [];
  for (const field of ASS_TURN_MANDATORY_FIELDS) {
    if (!(field in record)) {
      issues.push(issue("missing_field", `Missing mandatory field: ${field}`, field));
    }
  }
  if (!Object.isFrozen(record.intentMetadata)) {
    issues.push(issue("mutable_intent_metadata", "Intent metadata must be frozen."));
  }
  if (!Object.isFrozen(record.responseMetadata)) {
    issues.push(issue("mutable_response_metadata", "Response metadata must be frozen."));
  }
  if (!Object.isFrozen(record.routingMetadata)) {
    issues.push(issue("mutable_routing_metadata", "Routing metadata must be frozen."));
  }
  return report(issues);
}

export function validateConversationContractsComplete(
  registry: ExecutiveAssistantConversationRegistryBundle
): ExecutiveAssistantConversationValidationReport {
  const issues: ExecutiveAssistantConversationValidationIssue[] = [];
  if (registry.roleCount < ASS_PARTICIPANT_ROLE_KEYS.length) {
    issues.push(issue("roles_incomplete", "Participant role registry is incomplete."));
  }
  if (registry.identityCount === 0) {
    issues.push(issue("empty_identity_registry", "Conversation identity registry is empty."));
  }
  if (registry.sessionCount === 0) {
    issues.push(issue("empty_session_registry", "Session contract registry is empty."));
  }
  if (registry.turnCount === 0) {
    issues.push(issue("empty_turn_registry", "Turn contract registry is empty."));
  }
  if (registry.messageCount === 0) {
    issues.push(issue("empty_message_registry", "Message contract registry is empty."));
  }
  if (registry.scopeBindingCount === 0) {
    issues.push(issue("empty_scope_binding_registry", "Scope binding registry is empty."));
  }
  return report(issues);
}

export function validateParticipantRoles(
  registry: ExecutiveAssistantConversationRegistryBundle
): ExecutiveAssistantConversationValidationReport {
  const issues: ExecutiveAssistantConversationValidationIssue[] = [];
  const roleKeys = new Set(registry.participantRoleRegistry.map((entry) => entry.roleKey));
  for (const roleKey of ASS_PARTICIPANT_ROLE_KEYS) {
    if (!roleKeys.has(roleKey)) {
      issues.push(issue("missing_role", `Missing participant role: ${roleKey}.`));
    }
  }
  for (const identity of registry.conversationIdentityRegistry) {
    for (const role of identity.participantRoleKeys) {
      if (!roleKeys.has(role)) {
        issues.push(issue("invalid_role", `Identity ${identity.conversationId} references unknown role ${role}.`));
      }
    }
  }
  return report(issues);
}

export function validateConversationScopes(
  registry: ExecutiveAssistantConversationRegistryBundle
): ExecutiveAssistantConversationValidationReport {
  const issues: ExecutiveAssistantConversationValidationIssue[] = [];
  for (const identity of registry.conversationIdentityRegistry) {
    if (!(ASS_CONVERSATION_SCOPE_KEYS as readonly string[]).includes(identity.scopeKey)) {
      issues.push(issue("invalid_scope", `Identity ${identity.conversationId} has invalid scope.`));
    }
  }
  for (const binding of registry.scopeBindingRegistry) {
    if (!(ASS_CONVERSATION_SCOPE_KEYS as readonly string[]).includes(binding.scopeKey)) {
      issues.push(issue("invalid_scope", `Binding ${binding.bindingId} has invalid scope.`));
    }
    if (!registry.conversationIdentityRegistry.some((entry) => entry.conversationId === binding.conversationId)) {
      issues.push(issue("orphan_scope_binding", `Binding ${binding.bindingId} references unknown conversation.`));
    }
  }
  for (const session of registry.sessionContractRegistry) {
    const binding = registry.scopeBindingRegistry.find((entry) => entry.bindingId === session.scopeBindingRef);
    if (!binding) {
      issues.push(issue("invalid_scope_binding", `Session ${session.sessionId} has invalid scope binding reference.`));
    }
  }
  return report(issues);
}

export function validateMessageTurnImmutability(
  registry: ExecutiveAssistantConversationRegistryBundle
): ExecutiveAssistantConversationValidationReport {
  const issues: ExecutiveAssistantConversationValidationIssue[] = [];
  for (const message of registry.messageContractRegistry) {
    if (!Object.isFrozen(message)) {
      issues.push(issue("mutable_message", `Message ${message.messageId} is not immutable.`));
    }
  }
  for (const turn of registry.turnContractRegistry) {
    if (!Object.isFrozen(turn)) {
      issues.push(issue("mutable_turn", `Turn ${turn.turnId} is not immutable.`));
    }
  }
  return report(issues);
}

export function validateNoRuntimeOwnership(): ExecutiveAssistantConversationValidationReport {
  const issues: ExecutiveAssistantConversationValidationIssue[] = [];
  for (const principle of [
    "no_chat_runtime_no_message_execution",
    "intent_response_routing_placeholders_only",
  ] as const) {
    if (!(ASS_CONVERSATION_PRINCIPLES as readonly string[]).includes(principle)) {
      issues.push(issue("runtime_principle_missing", `Missing principle: ${principle}.`));
    }
  }
  if (!ASS_CONVERSATION_MUST_NOT_OWN.includes("chat_runtime")) {
    issues.push(issue("runtime_boundary_missing", "Chat runtime must be excluded from ownership."));
  }
  return report(issues);
}

export function validateExecutiveAssistantConversationManifestRecord(
  manifest: ExecutiveAssistantConversationManifest
): ExecutiveAssistantConversationValidationReport {
  const issues: ExecutiveAssistantConversationValidationIssue[] = [];
  if (manifest.version !== ASS_CONVERSATION_CONTRACT_VERSION) {
    issues.push(issue("manifest_version_mismatch", "Manifest version must be ASS/2."));
  }
  if (manifest.registryKeys.length !== ASS_CONVERSATION_REGISTRY_KEYS.length) {
    issues.push(issue("manifest_registry_keys", "Manifest registry keys are incomplete."));
  }
  for (const version of ASS_CONVERSATION_COMPATIBLE_VERSIONS) {
    if (!(manifest.compatibility as readonly string[]).includes(version)) {
      issues.push(issue("manifest_compatibility", `Manifest missing compatibility for ${version}.`));
    }
  }
  return report(issues);
}

export function validateExecutiveAssistantConversationRegistry(
  registry: ExecutiveAssistantConversationRegistryBundle
): ExecutiveAssistantConversationValidationReport {
  const issues: ExecutiveAssistantConversationValidationIssue[] = [];
  for (const validation of [
    validateConversationContractsComplete(registry),
    validateParticipantRoles(registry),
    validateConversationScopes(registry),
    validateMessageTurnImmutability(registry),
    validateNoRuntimeOwnership(),
  ]) {
    issues.push(...validation.issues);
  }
  for (const identity of registry.conversationIdentityRegistry) {
    issues.push(...validateExecutiveAssistantConversationIdentityRecord(identity).issues);
  }
  for (const session of registry.sessionContractRegistry) {
    for (const field of ASS_SESSION_MANDATORY_FIELDS) {
      if (!(field in session)) {
        issues.push(issue("missing_field", `Session missing field: ${field}`, field));
      }
    }
  }
  for (const message of registry.messageContractRegistry) {
    issues.push(...validateExecutiveAssistantMessageContractRecord(message).issues);
  }
  for (const turn of registry.turnContractRegistry) {
    issues.push(...validateExecutiveAssistantTurnContractRecord(turn).issues);
  }
  return report(issues);
}

export function getDefaultConversationCompatibility(): readonly string[] {
  return Object.freeze([...ASS_CONVERSATION_COMPATIBLE_VERSIONS, ASS_CONVERSATION_CONTRACT_VERSION]);
}
