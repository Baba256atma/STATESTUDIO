import { ExecutiveAssistantDashboardConnectionApi } from "./executiveAssistantDashboardConnectionContracts.ts";
import { getExecutiveAssistantDashboardRegistry } from "./executiveAssistantDashboardConnectionRegistry.ts";
import type {
  ExecutiveAssistantDashboardConnectionApi as ExecutiveAssistantDashboardConnectionApiContract,
  ExecutiveAssistantDashboardManifest,
  ExecutiveAssistantDashboardRegistry,
  ExecutiveAssistantDashboardValidation,
} from "./executiveAssistantDashboardConnectionTypes.ts";

function validation(errors: readonly string[], warnings: readonly string[] = Object.freeze([])): ExecutiveAssistantDashboardValidation {
  return Object.freeze({ valid: errors.length === 0, errors: Object.freeze([...errors]), warnings: Object.freeze([...warnings]) });
}

function duplicateValues(values: readonly string[]): readonly string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return Object.freeze([...duplicates].sort());
}

function policyViolatesBoundary(policy: ExecutiveAssistantDashboardRegistry["extensionPolicy"]): boolean {
  return (
    policy.assistantRuntimeAllowed ||
    policy.dashboardRuntimeAllowed ||
    policy.messageTransportAllowed ||
    policy.panelNavigationAllowed ||
    policy.coordinationAllowed ||
    policy.stateChangeAllowed
  );
}

export function validateExecutiveAssistantDashboardConnectionApi(
  connectionApi: ExecutiveAssistantDashboardConnectionApiContract = ExecutiveAssistantDashboardConnectionApi,
  registry: ExecutiveAssistantDashboardRegistry = getExecutiveAssistantDashboardRegistry()
): ExecutiveAssistantDashboardValidation {
  const errors: string[] = [];
  const providerIds = new Set(registry.providers.map((provider) => provider.providerId));
  const categories = new Set(registry.categories);
  const apiTypes = new Set(registry.apiTypes);

  if (!connectionApi.apiId) errors.push("missing-api-id");
  if (!connectionApi.metadata.metadataOnly || !connectionApi.metadata.immutable) errors.push("invalid-metadata");
  if (policyViolatesBoundary(connectionApi.policy)) errors.push("boundary-violation");
  if (!categories.has(connectionApi.identity.category)) errors.push(`invalid-api-category:${connectionApi.identity.category}`);
  if (!apiTypes.has(connectionApi.identity.apiType)) errors.push(`invalid-api-type:${connectionApi.identity.apiType}`);
  if (connectionApi.requests.length === 0) errors.push("missing-requests");
  if (connectionApi.responses.length === 0) errors.push("missing-responses");
  if (connectionApi.references.length === 0) errors.push("missing-references");

  for (const request of connectionApi.requests) {
    if (!categories.has(request.category)) errors.push(`invalid-api-category:${request.category}`);
    if (!apiTypes.has(request.apiType)) errors.push(`invalid-api-type:${request.apiType}`);
    if (request.references.length === 0) errors.push(`missing-request-references:${request.requestId}`);
    if (!request.metadata.metadataOnly || !request.metadata.immutable) errors.push(`invalid-metadata:${request.requestId}`);
  }

  for (const reference of connectionApi.references) {
    if (!reference.referenceId || !reference.sourceId) errors.push("invalid-reference");
    if (!reference.metadata.metadataOnly || !reference.metadata.immutable) errors.push(`invalid-metadata:${reference.referenceId}`);
  }

  if (!providerIds.has("assistant-provider")) errors.push("invalid-provider:assistant-provider");
  if (!providerIds.has("dashboard-provider")) errors.push("invalid-provider:dashboard-provider");
  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");

  return validation(errors);
}

export function validateExecutiveAssistantDashboardRegistry(
  registry: ExecutiveAssistantDashboardRegistry = getExecutiveAssistantDashboardRegistry()
): ExecutiveAssistantDashboardValidation {
  const errors: string[] = [];

  errors.push(...duplicateValues(registry.providers.map((provider) => provider.providerId)).map((id) => `duplicate-provider:${id}`));
  errors.push(...duplicateValues(registry.consumers.map((consumer) => consumer.consumerId)).map((id) => `duplicate-consumer:${id}`));
  errors.push(...duplicateValues(registry.apiTypes).map((id) => `duplicate-api-type:${id}`));
  errors.push(...duplicateValues(registry.dependencies.map((dependency) => dependency.dependencyId)).map((id) => `duplicate-dependency:${id}`));
  errors.push(...duplicateValues(registry.publicApis).map((id) => `duplicate-public-api:${id}`));

  if (registry.providers.length === 0) errors.push("missing-providers");
  if (registry.consumers.length === 0) errors.push("missing-consumers");
  if (registry.apiTypes.length === 0) errors.push("missing-api-types");
  if (registry.consumers.some((consumer) => !consumer.metadataOnly)) errors.push("invalid-consumer");
  if (registry.dependencies.some((dependency) => dependency.required && dependency.mode !== "certified")) errors.push("invalid-dependencies");
  if (registry.compatibilityMatrix.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (!registry.versionMetadata.metadataOnly || !registry.versionMetadata.immutable) errors.push("invalid-metadata");
  if (policyViolatesBoundary(registry.extensionPolicy)) errors.push("boundary-violation");

  return validation(errors);
}

export function validateExecutiveAssistantDashboardManifest(manifest: ExecutiveAssistantDashboardManifest): ExecutiveAssistantDashboardValidation {
  const errors: string[] = [];

  if (manifest.platformId !== "executive-assistant-dashboard-connection-api") errors.push("invalid-manifest-platform");
  if (manifest.platformVersion !== "LAY-CONN-9") errors.push("invalid-manifest-version");
  if (manifest.supportedCategories.length === 0) errors.push("missing-categories");
  if (manifest.supportedApiTypes.length === 0) errors.push("missing-api-types");
  if (manifest.registeredProviders.length === 0) errors.push("missing-providers");
  if (manifest.registeredConsumers.length === 0) errors.push("missing-consumers");
  if (manifest.dependencies.some((dependency) => dependency.required && dependency.mode !== "certified")) errors.push("invalid-dependencies");
  if (manifest.compatibility.some((entry) => entry.required && !entry.compatible)) errors.push("compatibility-violation");
  if (policyViolatesBoundary(manifest.extensionPolicy)) errors.push("boundary-violation");
  if (!manifest.releaseMetadata.metadataOnly || !manifest.releaseMetadata.immutable) errors.push("invalid-metadata");
  if (!manifest.deterministicFingerprint) errors.push("missing-fingerprint");

  return validation(errors);
}
