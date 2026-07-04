export type {
  ExecutiveTypeCRuntimeBoundary,
  ExecutiveTypeCRuntimeCapability,
  ExecutiveTypeCRuntimeCertification,
  ExecutiveTypeCRuntimeCompatibility,
  ExecutiveTypeCRuntimeConsumer,
  ExecutiveTypeCRuntimeContext,
  ExecutiveTypeCRuntimeDependency,
  ExecutiveTypeCRuntimeIntegrationPlatform as ExecutiveTypeCRuntimeIntegrationPlatformContract,
  ExecutiveTypeCRuntimeLifecycle,
  ExecutiveTypeCRuntimeManifest,
  ExecutiveTypeCRuntimeMetadata,
  ExecutiveTypeCRuntimeParticipant,
  ExecutiveTypeCRuntimeParticipantId,
  ExecutiveTypeCRuntimePolicy,
  ExecutiveTypeCRuntimeProvider,
  ExecutiveTypeCRuntimeRegistry,
  ExecutiveTypeCRuntimeResult,
  ExecutiveTypeCRuntimeValidation,
} from "./executiveTypeCRuntimeIntegrationTypes.ts";

export {
  EXECUTIVE_TYPE_C_RUNTIME_INTEGRATION_PLATFORM_ID,
  EXECUTIVE_TYPE_C_RUNTIME_INTEGRATION_VERSION,
  EXECUTIVE_TYPE_C_RUNTIME_METADATA,
  EXECUTIVE_TYPE_C_RUNTIME_PARTICIPANTS,
  EXECUTIVE_TYPE_C_RUNTIME_PARTICIPANT_IDS,
  EXECUTIVE_TYPE_C_RUNTIME_POLICY,
  ExecutiveTypeCRuntimeIntegrationPlatform,
} from "./executiveTypeCRuntimeIntegrationContracts.ts";
export { getExecutiveTypeCRuntimeCompatibilityMatrix } from "./executiveTypeCRuntimeIntegrationCompatibility.ts";
export { buildExecutiveTypeCRuntimeManifest } from "./executiveTypeCRuntimeIntegrationManifest.ts";
export {
  EXECUTIVE_TYPE_C_RUNTIME_PUBLIC_APIS,
  getExecutiveTypeCRuntimeRegistry,
} from "./executiveTypeCRuntimeIntegrationRegistry.ts";
export {
  validateExecutiveTypeCRuntimeIntegrationPlatform,
  validateExecutiveTypeCRuntimeManifest,
  validateExecutiveTypeCRuntimeRegistry,
} from "./executiveTypeCRuntimeIntegrationValidation.ts";

import { ExecutiveTypeCRuntimeIntegrationPlatform } from "./executiveTypeCRuntimeIntegrationContracts.ts";
import { getExecutiveTypeCRuntimeCompatibilityMatrix } from "./executiveTypeCRuntimeIntegrationCompatibility.ts";
import { buildExecutiveTypeCRuntimeManifest } from "./executiveTypeCRuntimeIntegrationManifest.ts";
import { getExecutiveTypeCRuntimeRegistry } from "./executiveTypeCRuntimeIntegrationRegistry.ts";
import {
  validateExecutiveTypeCRuntimeIntegrationPlatform,
  validateExecutiveTypeCRuntimeManifest,
  validateExecutiveTypeCRuntimeRegistry,
} from "./executiveTypeCRuntimeIntegrationValidation.ts";

export const ExecutiveTypeCRuntimeIntegrationPlatformFacade = Object.freeze({
  ExecutiveTypeCRuntimeIntegrationPlatform,
  buildExecutiveTypeCRuntimeManifest,
  validateExecutiveTypeCRuntimeIntegrationPlatform,
  validateExecutiveTypeCRuntimeManifest,
  validateExecutiveTypeCRuntimeRegistry,
  getExecutiveTypeCRuntimeRegistry,
  getExecutiveTypeCRuntimeCompatibilityMatrix,
});
