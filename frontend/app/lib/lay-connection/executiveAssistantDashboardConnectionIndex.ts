export type {
  ExecutiveAssistantDashboardCategory,
  ExecutiveAssistantDashboardCertification,
  ExecutiveAssistantDashboardCompatibility,
  ExecutiveAssistantDashboardConnectionApi as ExecutiveAssistantDashboardConnectionApiContract,
  ExecutiveAssistantDashboardConsumer,
  ExecutiveAssistantDashboardContext,
  ExecutiveAssistantDashboardDependency,
  ExecutiveAssistantDashboardIdentity,
  ExecutiveAssistantDashboardManifest,
  ExecutiveAssistantDashboardMetadata,
  ExecutiveAssistantDashboardPolicy,
  ExecutiveAssistantDashboardProvider,
  ExecutiveAssistantDashboardReference,
  ExecutiveAssistantDashboardRegistry,
  ExecutiveAssistantDashboardRequest,
  ExecutiveAssistantDashboardResponse,
  ExecutiveAssistantDashboardResult,
  ExecutiveAssistantDashboardValidation,
} from "./executiveAssistantDashboardConnectionTypes.ts";

export {
  EXECUTIVE_ASSISTANT_DASHBOARD_API_TYPES,
  EXECUTIVE_ASSISTANT_DASHBOARD_CATEGORIES,
  EXECUTIVE_ASSISTANT_DASHBOARD_CONNECTION_API_ID,
  EXECUTIVE_ASSISTANT_DASHBOARD_CONNECTION_VERSION,
  EXECUTIVE_ASSISTANT_DASHBOARD_METADATA,
  EXECUTIVE_ASSISTANT_DASHBOARD_POLICY,
  ExecutiveAssistantDashboardConnectionApi,
} from "./executiveAssistantDashboardConnectionContracts.ts";
export { getExecutiveAssistantDashboardCompatibilityMatrix } from "./executiveAssistantDashboardConnectionCompatibility.ts";
export { buildExecutiveAssistantDashboardManifest } from "./executiveAssistantDashboardConnectionManifest.ts";
export {
  EXECUTIVE_ASSISTANT_DASHBOARD_PUBLIC_APIS,
  getExecutiveAssistantDashboardRegistry,
} from "./executiveAssistantDashboardConnectionRegistry.ts";
export {
  validateExecutiveAssistantDashboardConnectionApi,
  validateExecutiveAssistantDashboardManifest,
  validateExecutiveAssistantDashboardRegistry,
} from "./executiveAssistantDashboardConnectionValidation.ts";

import { ExecutiveAssistantDashboardConnectionApi } from "./executiveAssistantDashboardConnectionContracts.ts";
import { getExecutiveAssistantDashboardCompatibilityMatrix } from "./executiveAssistantDashboardConnectionCompatibility.ts";
import { buildExecutiveAssistantDashboardManifest } from "./executiveAssistantDashboardConnectionManifest.ts";
import { getExecutiveAssistantDashboardRegistry } from "./executiveAssistantDashboardConnectionRegistry.ts";
import {
  validateExecutiveAssistantDashboardConnectionApi,
  validateExecutiveAssistantDashboardManifest,
  validateExecutiveAssistantDashboardRegistry,
} from "./executiveAssistantDashboardConnectionValidation.ts";

export const ExecutiveAssistantDashboardConnectionPlatform = Object.freeze({
  ExecutiveAssistantDashboardConnectionApi,
  buildExecutiveAssistantDashboardManifest,
  validateExecutiveAssistantDashboardConnectionApi,
  validateExecutiveAssistantDashboardManifest,
  validateExecutiveAssistantDashboardRegistry,
  getExecutiveAssistantDashboardRegistry,
  getExecutiveAssistantDashboardCompatibilityMatrix,
});
