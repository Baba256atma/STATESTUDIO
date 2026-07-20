/**
 * NEA-2:4 — Channel Connectors Validation Rules.
 *
 * Immutable declarative validation rules for NEA-2:3 domain models.
 * Metadata only. No validation engine.
 *
 * Ownership: owned exclusively by NEA-2:4.
 */

import {
  ChannelConnectorModelId,
  ChannelConnectorModelPlatform,
} from "./channelConnectorModel.ts";
import type {
  ChannelConnectorValidationCategory,
  ChannelConnectorValidationCategoryId,
  ChannelConnectorValidationRule,
  ChannelConnectorValidationSeverity,
  ChannelConnectorValidationTarget,
} from "./channelConnectorValidationTypes.ts";

const model = ChannelConnectorModelPlatform;

const category = (
  categoryId: ChannelConnectorValidationCategoryId,
  categoryName: string,
  description: string,
  targetModelKind: ChannelConnectorValidationTarget,
  order: number,
): ChannelConnectorValidationCategory =>
  Object.freeze({
    categoryId,
    categoryName,
    description,
    targetModelKind,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Exactly twenty-two validation categories. */
export const ChannelConnectorValidationCategories: readonly ChannelConnectorValidationCategory[] =
  Object.freeze([
    category("Identity", "Identity Validation", "Validate connector identity completeness and uniqueness.", "ConnectorIdentity", 1),
    category("Definition", "Definition Validation", "Validate connector definition composition and required references.", "ConnectorDefinition", 2),
    category("Family", "Family Validation", "Validate canonical family references.", "ConnectorFamily", 3),
    category("Type", "Type Validation", "Validate canonical type references.", "ConnectorType", 4),
    category("Protocol", "Protocol Validation", "Validate protocol declaration only — no protocol implementation.", "ConnectorProtocol", 5),
    category("Direction", "Direction Validation", "Validate inbound, outbound, and bidirectional declarations.", "ConnectorDirection", 6),
    category("Capability", "Capability Validation", "Validate capability references — no capability execution.", "ConnectorCapability", 7),
    category("Authentication", "Authentication Validation", "Validate authentication metadata — no OAuth or token validation.", "ConnectorAuthentication", 8),
    category("Health", "Health Validation", "Validate health model completeness.", "ConnectorHealth", 9),
    category("Status", "Status Validation", "Validate lifecycle status declarations.", "ConnectorStatus", 10),
    category("Event", "Event Validation", "Validate event declarations — no event processing.", "ConnectorEvent", 11),
    category("Payload", "Payload Validation", "Validate payload model structure — no payload parsing.", "ConnectorPayload", 12),
    category("Policy", "Policy Validation", "Validate policy declarations — no policy execution.", "ConnectorPolicy", 13),
    category("Endpoint", "Endpoint Validation", "Validate endpoint metadata — no network communication.", "ConnectorEndpoint", 14),
    category("Session", "Session Validation", "Validate session metadata — no runtime session handling.", "ConnectorSession", 15),
    category("Metadata", "Metadata Validation", "Validate connector metadata completeness.", "ConnectorMetadata", 16),
    category("Configuration", "Configuration Validation", "Validate configuration completeness — no executable configuration.", "ConnectorConfiguration", 17),
    category("Diagnostics", "Diagnostics Validation", "Validate diagnostics metadata.", "ConnectorDiagnostics", 18),
    category("Result", "Result Validation", "Validate processing result structure — no execution.", "ConnectorResult", 19),
    category("Summary", "Summary Validation", "Validate summary composition.", "ConnectorSummary", 20),
    category("CrossModel", "Cross-Model Validation", "Declarative relationship validation across connector models.", "CrossModel", 21),
    category("PlatformIntegrity", "Platform Integrity Validation", "Validate canonical references, ownership, and immutable composition.", "Platform", 22),
  ]);

const rule = (
  key: string,
  ruleName: string,
  categoryId: ChannelConnectorValidationCategoryId,
  targetModelKind: ChannelConnectorValidationTarget,
  description: string,
  severity: ChannelConnectorValidationSeverity,
  order: number,
): ChannelConnectorValidationRule =>
  Object.freeze({
    ruleId: `NEA-2:4/Rule/${key}`,
    ruleName,
    categoryId,
    targetModelKind,
    description,
    severity,
    modelReference: `${ChannelConnectorModelId}/domainModels/${targetModelKind}`,
    executesValidation: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/**
 * Canonical declarative validation rules.
 * One or more rules per category; all reference Model kinds.
 */
export const ChannelConnectorValidationRules: readonly ChannelConnectorValidationRule[] =
  Object.freeze([
    rule("Identity-Completeness", "Identity Completeness", "Identity", "ConnectorIdentity", "Identity fields must be declared completely.", "Error", 1),
    rule("Identity-Canonical", "Identity Canonical Reference", "Identity", "ConnectorIdentity", "Identity must preserve canonical Registry identity references.", "Error", 2),
    rule("Identity-Unique", "Unique Connector Identity", "Identity", "ConnectorIdentity", "Connector identity ids must be unique.", "Error", 3),
    rule("Identity-Version", "Identity Version Consistency", "Identity", "ConnectorIdentity", "Connector version must be consistent with declared identity version.", "Error", 4),

    rule("Definition-Composition", "Definition Composition", "Definition", "ConnectorDefinition", "Definition must compose required child models.", "Error", 5),
    rule("Definition-RequiredRefs", "Definition Required References", "Definition", "ConnectorDefinition", "Definition must declare required Registry and Model references.", "Error", 6),
    rule("Definition-Completeness", "Definition Model Completeness", "Definition", "ConnectorDefinition", "Definition structure must match Connector Definition Model.", "Error", 7),

    rule("Family-Canonical", "Family Canonical Reference", "Family", "ConnectorFamily", "Family must reference a canonical Registry family.", "Error", 8),
    rule("Type-Canonical", "Type Canonical Reference", "Type", "ConnectorType", "Type must reference a canonical Registry type.", "Error", 9),

    rule("Protocol-Declaration", "Protocol Declaration", "Protocol", "ConnectorProtocol", "Protocol declaration structure must be complete.", "Error", 10),
    rule("Protocol-NoImplementation", "Protocol Non-Implementation", "Protocol", "ConnectorProtocol", "Protocol validation must not implement protocols.", "Info", 11),

    rule("Direction-Values", "Direction Values", "Direction", "ConnectorDirection", "Direction must be Inbound, Outbound, or Bidirectional.", "Error", 12),
    rule("Direction-Canonical", "Direction Canonical Reference", "Direction", "ConnectorDirection", "Direction must reference Registry direction entries.", "Error", 13),

    rule("Capability-References", "Capability References", "Capability", "ConnectorCapability", "Capability references must be canonical.", "Error", 14),
    rule("Capability-NoExecution", "Capability Non-Execution", "Capability", "ConnectorCapability", "Capability validation must not execute capabilities.", "Info", 15),

    rule("Authn-Metadata", "Authentication Metadata", "Authentication", "ConnectorAuthentication", "Authentication metadata structure must be complete.", "Error", 16),
    rule("Authn-NoOAuth", "Authentication Non-Execution", "Authentication", "ConnectorAuthentication", "Authentication validation must not execute OAuth, tokens, or credentials.", "Info", 17),

    rule("Health-Completeness", "Health Completeness", "Health", "ConnectorHealth", "Health model fields must be complete.", "Error", 18),
    rule("Status-Lifecycle", "Status Lifecycle Declaration", "Status", "ConnectorStatus", "Status must declare a valid lifecycle status.", "Error", 19),

    rule("Event-Declaration", "Event Declaration", "Event", "ConnectorEvent", "Event declaration structure must be complete.", "Error", 20),
    rule("Event-NoProcessing", "Event Non-Processing", "Event", "ConnectorEvent", "Event validation must not process events.", "Info", 21),

    rule("Payload-Structure", "Payload Structure", "Payload", "ConnectorPayload", "Payload model structure must be complete.", "Error", 22),
    rule("Payload-NoParsing", "Payload Non-Parsing", "Payload", "ConnectorPayload", "Payload validation must not parse payloads.", "Info", 23),

    rule("Policy-Declaration", "Policy Declaration", "Policy", "ConnectorPolicy", "Policy declaration structure must be complete.", "Error", 24),
    rule("Policy-NoExecution", "Policy Non-Execution", "Policy", "ConnectorPolicy", "Policy validation must not execute policies.", "Info", 25),

    rule("Endpoint-Metadata", "Endpoint Metadata", "Endpoint", "ConnectorEndpoint", "Endpoint metadata structure must be complete.", "Error", 26),
    rule("Endpoint-NoNetwork", "Endpoint Non-Communication", "Endpoint", "ConnectorEndpoint", "Endpoint validation must not open network communication.", "Info", 27),

    rule("Session-Metadata", "Session Metadata", "Session", "ConnectorSession", "Session metadata structure must be complete.", "Error", 28),
    rule("Session-NoRuntime", "Session Non-Runtime", "Session", "ConnectorSession", "Session validation must not manage runtime sessions.", "Info", 29),

    rule("Metadata-Completeness", "Metadata Completeness", "Metadata", "ConnectorMetadata", "Connector metadata model must be complete.", "Error", 30),

    rule("Configuration-Completeness", "Configuration Completeness", "Configuration", "ConnectorConfiguration", "Configuration metadata must be complete.", "Error", 31),
    rule("Configuration-NoExecutable", "Configuration Non-Executable", "Configuration", "ConnectorConfiguration", "Configuration validation must not load executable configuration.", "Info", 32),

    rule("Diagnostics-Structure", "Diagnostics Structure", "Diagnostics", "ConnectorDiagnostics", "Diagnostics metadata structure must be complete.", "Error", 33),
    rule("Result-Structure", "Result Structure", "Result", "ConnectorResult", "Result structure must be complete.", "Error", 34),
    rule("Result-NoExecution", "Result Non-Execution", "Result", "ConnectorResult", "Result validation must not execute processing.", "Info", 35),

    rule("Summary-Composition", "Summary Composition", "Summary", "ConnectorSummary", "Summary must compose identity and definition references.", "Error", 36),

    rule("CrossModel-DefinitionIdentity", "Cross-Model Definition Identity", "CrossModel", "CrossModel", "Definition ↔ Identity relationship must remain consistent.", "Error", 37),
    rule("CrossModel-IdentityProtocol", "Cross-Model Identity Protocol", "CrossModel", "CrossModel", "Identity ↔ Protocol relationship must remain consistent.", "Error", 38),
    rule("CrossModel-EndpointProtocol", "Cross-Model Endpoint Protocol", "CrossModel", "CrossModel", "Endpoint ↔ Protocol relationship must remain consistent.", "Error", 39),
    rule("CrossModel-ConfigurationAuth", "Cross-Model Configuration Authentication", "CrossModel", "CrossModel", "Configuration ↔ Authentication relationship must remain consistent.", "Error", 40),
    rule("CrossModel-ResultDiagnostics", "Cross-Model Result Diagnostics", "CrossModel", "CrossModel", "Result ↔ Diagnostics relationship must remain consistent.", "Error", 41),
    rule("CrossModel-SummaryDefinition", "Cross-Model Summary Definition", "CrossModel", "CrossModel", "Summary ↔ Definition relationship must remain consistent.", "Error", 42),

    rule("Platform-RegistryRefs", "Platform Registry References", "PlatformIntegrity", "Platform", "Canonical Registry references must be preserved through Model.", "Error", 43),
    rule("Platform-ModelRefs", "Platform Model References", "PlatformIntegrity", "Platform", "Canonical Model references must be preserved.", "Error", 44),
    rule("Platform-Ownership", "Platform Ownership Consistency", "PlatformIntegrity", "Platform", "Ownership declarations must remain unique and immutable.", "Error", 45),
    rule("Platform-DuplicatePrevention", "Platform Duplicate Prevention", "PlatformIntegrity", "Platform", "Duplicate validation rules and model values are forbidden.", "Error", 46),
    rule("Platform-RelationshipIntegrity", "Platform Relationship Integrity", "PlatformIntegrity", "Platform", "Relationship integrity must be preserved.", "Error", 47),
    rule("Platform-ImmutableComposition", "Platform Immutable Composition", "PlatformIntegrity", "Platform", "Immutable composition of Validation over Model must be preserved.", "Error", 48),
  ]);

/** Model anchors proving rules target NEA-2:3 domain models. */
export const ChannelConnectorValidationModelAnchors = Object.freeze({
  modelId: ChannelConnectorModelId,
  sourcePhase: "NEA-2:4" as const,
  domainModelCount: model.domainModels.modelCount,
  identityModelCount: model.domainModels.identityModelCount,
  relationshipCount: model.relationships.relationshipCount,
  domainModelKinds: Object.freeze(
    model.domainModels.models.map((item) => item.modelKind),
  ),
  preservesCanonicalModelReferences: true as const,
  duplicatesModelValues: false as const,
  metadataOnly: true as const,
  immutable: true as const,
});

/** Canonical immutable rules catalog. */
export const ChannelConnectorValidationRuleCatalog = Object.freeze({
  catalogId: "NEA-2:4/ValidationRuleCatalog",
  sourcePhase: "NEA-2:4" as const,
  categories: ChannelConnectorValidationCategories,
  rules: ChannelConnectorValidationRules,
  categoryCount: ChannelConnectorValidationCategories.length,
  ruleCount: ChannelConnectorValidationRules.length,
  modelAnchors: ChannelConnectorValidationModelAnchors,
  executesValidation: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
