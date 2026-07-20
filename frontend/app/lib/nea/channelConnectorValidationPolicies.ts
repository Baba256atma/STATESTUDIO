/**
 * NEA-2:4 — Channel Connectors Validation Policies.
 *
 * Immutable validation policy declarations. No policy execution.
 *
 * Ownership: owned exclusively by NEA-2:4.
 */

import type { ChannelConnectorValidationPolicy } from "./channelConnectorValidationTypes.ts";

/** Declarative validation policies. */
export const ChannelConnectorValidationPolicies: readonly ChannelConnectorValidationPolicy[] =
  Object.freeze([
    Object.freeze({
      policyId: "NEA-2:4/Policy/ModelOnlyConsumption",
      policyName: "Model-Only Consumption",
      statement:
        "Validation consumes only NEA-2:3 Channel Connectors Model public surface.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 1,
    }),
    Object.freeze({
      policyId: "NEA-2:4/Policy/NoValidationEngine",
      policyName: "No Validation Engine",
      statement:
        "Validation definitions are declarative metadata only; no validation engine is implemented.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 2,
    }),
    Object.freeze({
      policyId: "NEA-2:4/Policy/PreserveCanonicalReferences",
      policyName: "Preserve Canonical References",
      statement:
        "Validation rules preserve canonical Model and Registry references without duplication.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 3,
    }),
    Object.freeze({
      policyId: "NEA-2:4/Policy/NoConnectorExecution",
      policyName: "No Connector Execution",
      statement:
        "Validation must not implement or invoke Telegram, WhatsApp, Slack, Teams, email, voice, REST, MCP, or SDK runtimes.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 4,
    }),
    Object.freeze({
      policyId: "NEA-2:4/Policy/NoSecurityExecution",
      policyName: "No Security Execution",
      statement:
        "Authentication validation declares metadata only and never executes OAuth, tokens, or credentials.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 5,
    }),
    Object.freeze({
      policyId: "NEA-2:4/Policy/NoNetworkCommunication",
      policyName: "No Network Communication",
      statement:
        "Endpoint and protocol validation declare structure only and never open HTTP or WebSocket connections.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 6,
    }),
    Object.freeze({
      policyId: "NEA-2:4/Policy/DeterministicInventory",
      policyName: "Deterministic Inventory",
      statement:
        "Validation counts are derived exclusively from canonical validation collections.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 7,
    }),
    Object.freeze({
      policyId: "NEA-2:4/Policy/ReadyForManifestOnly",
      policyName: "Ready For Manifest Only",
      statement:
        "Validation readiness is ReadyForManifest and must not claim runtime readiness.",
      executes: false as const,
      metadataOnly: true as const,
      immutable: true as const,
      deterministicOrder: 8,
    }),
  ]);

/** Canonical immutable validation policy catalog. */
export const ChannelConnectorValidationPolicyCatalog = Object.freeze({
  catalogId: "NEA-2:4/ValidationPolicyCatalog",
  sourcePhase: "NEA-2:4" as const,
  policies: ChannelConnectorValidationPolicies,
  policyCount: ChannelConnectorValidationPolicies.length,
  executesPolicies: false as const,
  metadataOnly: true as const,
  immutable: true as const,
  deterministic: true as const,
});
