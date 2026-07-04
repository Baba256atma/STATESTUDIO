import {
  EXECUTIVE_ASSISTANT_DASHBOARD_API_TYPES,
  EXECUTIVE_ASSISTANT_DASHBOARD_CATEGORIES,
  EXECUTIVE_ASSISTANT_DASHBOARD_CONNECTION_API_ID,
  EXECUTIVE_ASSISTANT_DASHBOARD_METADATA,
  EXECUTIVE_ASSISTANT_DASHBOARD_POLICY,
} from "./executiveAssistantDashboardConnectionContracts.ts";
import { getExecutiveAssistantDashboardCompatibilityMatrix } from "./executiveAssistantDashboardConnectionCompatibility.ts";
import type { ExecutiveAssistantDashboardRegistry } from "./executiveAssistantDashboardConnectionTypes.ts";

export const EXECUTIVE_ASSISTANT_DASHBOARD_PUBLIC_APIS: readonly string[] = Object.freeze([
  "ExecutiveAssistantDashboardConnectionApi",
  "ExecutiveAssistantDashboardConnectionPlatform",
  "buildExecutiveAssistantDashboardManifest",
  "validateExecutiveAssistantDashboardConnectionApi",
  "validateExecutiveAssistantDashboardManifest",
  "validateExecutiveAssistantDashboardRegistry",
  "getExecutiveAssistantDashboardRegistry",
  "getExecutiveAssistantDashboardCompatibilityMatrix",
] as const);

export function getExecutiveAssistantDashboardRegistry(): ExecutiveAssistantDashboardRegistry {
  return Object.freeze({
    apiId: EXECUTIVE_ASSISTANT_DASHBOARD_CONNECTION_API_ID,
    providers: Object.freeze([
      Object.freeze({ providerId: "lay-connection-provider", platformId: "LAY-CONN-1", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "reasoning-judgment-provider", platformId: "LAY-CONN-2", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "judgment-recommendation-provider", platformId: "LAY-CONN-3", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "judgment-explanation-provider", platformId: "LAY-CONN-4", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "awareness-context-provider", platformId: "LAY-CONN-5", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "attention-signal-provider", platformId: "LAY-CONN-6", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "priority-signal-provider", platformId: "LAY-CONN-7", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "blind-spot-provider", platformId: "LAY-CONN-8", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "app-reason-provider", platformId: "APP-REASON", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "app-judge-provider", platformId: "APP-JUDGE", certified: true, futureCompatible: false }),
      Object.freeze({ providerId: "assistant-provider", platformId: "ASS", certified: false, futureCompatible: true }),
      Object.freeze({ providerId: "dashboard-provider", platformId: "DASHBOARD", certified: false, futureCompatible: true }),
    ] as const),
    consumers: Object.freeze([
      Object.freeze({ consumerId: "assistant-connection-consumer", name: "Assistant Connection Consumer", metadataOnly: true }),
      Object.freeze({ consumerId: "dashboard-connection-consumer", name: "Dashboard Connection Consumer", metadataOnly: true }),
      Object.freeze({ consumerId: "shared-executive-context-consumer", name: "Shared Executive Context Consumer", metadataOnly: true }),
    ] as const),
    categories: EXECUTIVE_ASSISTANT_DASHBOARD_CATEGORIES,
    apiTypes: EXECUTIVE_ASSISTANT_DASHBOARD_API_TYPES,
    dependencies: Object.freeze([
      Object.freeze({ dependencyId: "LAY-CONN-1", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-2", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-3", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-4", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-5", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-6", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-7", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "LAY-CONN-8", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "APP-REASON", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "APP-JUDGE", required: true, mode: "certified" }),
      Object.freeze({ dependencyId: "ASS", required: false, mode: "future-compatible" }),
      Object.freeze({ dependencyId: "DASHBOARD", required: false, mode: "future-compatible" }),
    ] as const),
    compatibilityMatrix: getExecutiveAssistantDashboardCompatibilityMatrix(),
    versionMetadata: EXECUTIVE_ASSISTANT_DASHBOARD_METADATA,
    extensionPolicy: EXECUTIVE_ASSISTANT_DASHBOARD_POLICY,
    publicApis: EXECUTIVE_ASSISTANT_DASHBOARD_PUBLIC_APIS,
  });
}
