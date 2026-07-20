/**
 * NEA-1:1 — Executive Gateway Sources.
 *
 * Immutable source-family, channel-type, modality, and sender-kind vocabularies.
 * Architectural classifications only. No connectors.
 *
 * Ownership: owned exclusively by NEA-1:1.
 */

import type {
  ExecutiveGatewayChannelType,
  ExecutiveGatewayInteractionModality,
  ExecutiveGatewaySenderKind,
  ExecutiveGatewaySourceFamily,
  ExecutiveGatewayVocabularyEntry,
} from "./executiveGatewayFoundationTypes.ts";

const vocab = <T extends string>(
  id: T,
  label: string,
  description: string,
  order: number,
): ExecutiveGatewayVocabularyEntry<T> =>
  Object.freeze({
    id,
    label,
    description,
    connectorImplemented: false as const,
    metadataOnly: true as const,
    immutable: true as const,
    deterministicOrder: order,
  });

/** Canonical source-family vocabulary. */
export const ExecutiveGatewaySourceFamilies: readonly ExecutiveGatewayVocabularyEntry<ExecutiveGatewaySourceFamily>[] =
  Object.freeze([
    vocab(
      "Messaging",
      "Messaging",
      "Messaging-oriented external interaction sources.",
      1,
    ),
    vocab(
      "Collaboration",
      "Collaboration",
      "Collaboration-suite interaction sources.",
      2,
    ),
    vocab("Email", "Email", "Email-oriented external interaction sources.", 3),
    vocab("Voice", "Voice", "Voice-oriented external interaction sources.", 4),
    vocab("REST", "REST", "REST API interaction sources.", 5),
    vocab("MCP", "MCP", "MCP client interaction sources.", 6),
    vocab("SDK", "SDK", "SDK consumer interaction sources.", 7),
    vocab(
      "EnterpriseSystem",
      "Enterprise System",
      "Enterprise system interaction sources.",
      8,
    ),
    vocab(
      "ExternalApplication",
      "External Application",
      "External application interaction sources.",
      9,
    ),
    vocab(
      "HumanOperator",
      "Human Operator",
      "Human operator interaction sources.",
      10,
    ),
    vocab(
      "ApprovedAgent",
      "Approved Agent",
      "Approved software agent interaction sources.",
      11,
    ),
    vocab(
      "UnknownExternalSource",
      "Unknown External Source",
      "Unclassified external interaction sources.",
      12,
    ),
  ]);

/** Canonical channel-type vocabulary — no clients or handlers. */
export const ExecutiveGatewayChannelTypes: readonly ExecutiveGatewayVocabularyEntry<ExecutiveGatewayChannelType>[] =
  Object.freeze([
    vocab("Telegram", "Telegram", "Telegram channel classification.", 1),
    vocab("WhatsApp", "WhatsApp", "WhatsApp channel classification.", 2),
    vocab(
      "MicrosoftTeams",
      "Microsoft Teams",
      "Microsoft Teams channel classification.",
      3,
    ),
    vocab("Slack", "Slack", "Slack channel classification.", 4),
    vocab("Email", "Email", "Email channel classification.", 5),
    vocab("Voice", "Voice", "Voice channel classification.", 6),
    vocab("RestApi", "REST API", "REST API channel classification.", 7),
    vocab("MCP", "MCP", "MCP channel classification.", 8),
    vocab("SDK", "SDK", "SDK channel classification.", 9),
    vocab("Webhook", "Webhook", "Webhook channel classification.", 10),
    vocab(
      "EnterpriseConnector",
      "Enterprise Connector",
      "Enterprise connector channel classification.",
      11,
    ),
    vocab(
      "ExternalApplication",
      "External Application",
      "External application channel classification.",
      12,
    ),
    vocab(
      "CustomApprovedChannel",
      "Custom Approved Channel",
      "Custom approved channel classification.",
      13,
    ),
  ]);

/** Canonical interaction-modality vocabulary — no parsers. */
export const ExecutiveGatewayModalities: readonly ExecutiveGatewayVocabularyEntry<ExecutiveGatewayInteractionModality>[] =
  Object.freeze([
    vocab("Text", "Text", "Text modality classification.", 1),
    vocab(
      "StructuredData",
      "Structured Data",
      "Structured data modality classification.",
      2,
    ),
    vocab("Command", "Command", "Command modality classification.", 3),
    vocab("Event", "Event", "Event modality classification.", 4),
    vocab("File", "File", "File modality classification.", 5),
    vocab("Document", "Document", "Document modality classification.", 6),
    vocab("Audio", "Audio", "Audio modality classification.", 7),
    vocab(
      "TranscribedVoice",
      "Transcribed Voice",
      "Transcribed voice modality classification.",
      8,
    ),
    vocab(
      "ImageReference",
      "Image Reference",
      "Image reference modality classification.",
      9,
    ),
    vocab(
      "FormSubmission",
      "Form Submission",
      "Form submission modality classification.",
      10,
    ),
    vocab("APIRequest", "API Request", "API request modality classification.", 11),
    vocab(
      "AgentRequest",
      "Agent Request",
      "Agent request modality classification.",
      12,
    ),
    vocab(
      "SystemNotification",
      "System Notification",
      "System notification modality classification.",
      13,
    ),
  ]);

/** Canonical sender-kind vocabulary — no identity resolution. */
export const ExecutiveGatewaySenderKinds: readonly ExecutiveGatewayVocabularyEntry<ExecutiveGatewaySenderKind>[] =
  Object.freeze([
    vocab("Person", "Person", "Person sender kind.", 1),
    vocab("Employee", "Employee", "Employee sender kind.", 2),
    vocab("Manager", "Manager", "Manager sender kind.", 3),
    vocab("Customer", "Customer", "Customer sender kind.", 4),
    vocab("Supplier", "Supplier", "Supplier sender kind.", 5),
    vocab("Partner", "Partner", "Partner sender kind.", 6),
    vocab(
      "ExternalApplication",
      "External Application",
      "External application sender kind.",
      7,
    ),
    vocab(
      "EnterpriseSystem",
      "Enterprise System",
      "Enterprise system sender kind.",
      8,
    ),
    vocab("ApprovedAgent", "Approved Agent", "Approved agent sender kind.", 9),
    vocab("UnknownSender", "Unknown Sender", "Unknown sender kind.", 10),
  ]);
