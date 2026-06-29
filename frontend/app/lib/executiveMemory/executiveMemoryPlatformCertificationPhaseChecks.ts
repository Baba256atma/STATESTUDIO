/**
 * APP-4:13 — Executive Memory Platform phase certification checks.
 * Read-only validation and smoke certification for APP-4:1 through APP-4:12.
 */

import {
  resolveScenarioIdentityExample,
  validateScenarioIdentityShape,
} from "../app-2-scenario-intelligence/scenarioIntelligenceContract.ts";
import {
  resolveExecutiveIntentExample,
  validateExecutiveIntentShape,
} from "../executiveIntent/executiveIntentContract.ts";
import { runExecutiveIntentPlatformRefresh } from "../executiveIntent/executiveIntentPlatformRefresh.ts";
import { evaluateStageFileBoundary, validateStageManifest } from "../stage/stageArchitectureGuards.ts";
import {
  initializeExecutiveAssistantMemoryIntegrationEngine,
  retrieveAssistantMemoryByWorkspace,
  resetExecutiveAssistantMemoryIntegrationEngineForTests,
} from "./executiveAssistantMemoryIntegrationContracts.ts";
import { ExecutiveAssistantMemoryIntegrationContracts } from "./executiveAssistantMemoryIntegrationContracts.ts";
import { buildExecutiveMemoryRecordExample } from "./executiveMemoryBuilder.ts";
import {
  EXECUTIVE_MEMORY_IDENTITY,
  EXECUTIVE_MEMORY_SELF_MANIFEST,
  ExecutiveMemoryContract,
  validateExecutiveMemoryShape,
} from "./executiveMemoryContracts.ts";
import { ExecutiveContextMemoryContracts } from "./executiveContextMemoryContracts.ts";
import {
  initializeExecutiveContextMemoryEngine,
  resetExecutiveContextMemoryEngineForTests,
} from "./executiveContextMemoryEngine.ts";
import { ExecutiveDecisionMemoryContracts } from "./executiveDecisionMemoryContracts.ts";
import {
  initializeExecutiveDecisionMemoryEngine,
  resetExecutiveDecisionMemoryEngineForTests,
} from "./executiveDecisionMemoryEngine.ts";
import {
  getExecutiveMemoryDashboard,
  initializeExecutiveMemoryDashboardEngine,
  resetExecutiveMemoryDashboardEngineForTests,
  ExecutiveMemoryDashboardContracts,
} from "./executiveMemoryDashboardContracts.ts";
import {
  initializeExecutiveMemoryPlatform,
  resetExecutiveMemoryPlatformForTests,
} from "./executiveMemoryPlatform.ts";
import { ExecutiveMemoryRecordContracts } from "./executiveMemoryRecordContracts.ts";
import { validateExecutiveMemoryRecordShape } from "./executiveMemoryRecordValidation.ts";
import {
  initializeExecutiveMemoryRetrievalEngine,
  getExecutiveMemoryById,
  findExecutiveMemories,
  resetExecutiveMemoryRetrievalEngineForTests,
} from "./executiveMemoryRetrievalEngine.ts";
import { ExecutiveMemoryRetrievalContracts } from "./executiveMemoryRetrievalContracts.ts";
import {
  initializeExecutiveMemoryLifecycleEngine,
  registerGovernedMemory,
  resetExecutiveMemoryLifecycleEngineForTests,
} from "./executiveMemoryLifecycleEngine.ts";
import { ExecutiveMemoryLifecycleContracts } from "./executiveMemoryLifecycleContracts.ts";
import { registerExecutiveMemoryProvider } from "./executiveMemoryRegistry.ts";
import {
  initializeExecutiveMemorySearchEngine,
  searchExecutiveMemories,
  resetExecutiveMemorySearchEngineForTests,
} from "./executiveMemorySearchEngine.ts";
import { ExecutiveMemorySearchRankingContracts } from "./executiveMemorySearchRankingContracts.ts";
import {
  createExecutiveMemory,
  initializeExecutiveMemoryStorageEngine,
  resetExecutiveMemoryStorageEngineForTests,
} from "./executiveMemoryStorageEngine.ts";
import { ExecutiveMemoryStorageContracts } from "./executiveMemoryStorageContracts.ts";
import { ExecutiveIntentMemoryLinkContracts } from "./executiveIntentMemoryLinkContracts.ts";
import {
  initializeExecutiveIntentMemoryLinkEngine,
  resetExecutiveIntentMemoryLinkEngineForTests,
} from "./executiveIntentMemoryLinkEngine.ts";
import { ExecutiveScenarioMemoryContracts } from "./executiveScenarioMemoryContracts.ts";
import {
  initializeExecutiveScenarioMemoryEngine,
  resetExecutiveScenarioMemoryEngineForTests,
} from "./executiveScenarioMemoryEngine.ts";
import type { ExecutiveMemoryPlatformPhaseCertificationResult } from "./executiveMemoryPlatformCertificationTypes.ts";

const FIXED_TIME = "2026-01-01T00:00:00.000Z";
const AUTHOR = "platform-certification";

export function resetExecutiveMemoryPlatformCertificationEnvironment(): void {
  resetExecutiveMemoryPlatformForTests();
  resetExecutiveMemoryStorageEngineForTests();
  resetExecutiveMemoryRetrievalEngineForTests();
  resetExecutiveIntentMemoryLinkEngineForTests();
  resetExecutiveScenarioMemoryEngineForTests();
  resetExecutiveDecisionMemoryEngineForTests();
  resetExecutiveContextMemoryEngineForTests();
  resetExecutiveMemorySearchEngineForTests();
  resetExecutiveMemoryLifecycleEngineForTests();
  resetExecutiveAssistantMemoryIntegrationEngineForTests();
  resetExecutiveMemoryDashboardEngineForTests();
}

function registerCertificationProvider() {
  registerExecutiveMemoryProvider(
    Object.freeze({
      providerId: "executive-memory-foundation-provider",
      label: "Foundation Provider",
      version: "1.0.0",
      supportedCategories: Object.freeze(["decision", "goal", "evidence"] as const),
    }),
    FIXED_TIME
  );
}

function initializeFullPlatform(timestamp: string = FIXED_TIME) {
  initializeExecutiveMemoryPlatform(timestamp);
  registerCertificationProvider();
  initializeExecutiveMemoryStorageEngine(timestamp);
  initializeExecutiveMemoryRetrievalEngine(timestamp);
  initializeExecutiveIntentMemoryLinkEngine(timestamp);
  initializeExecutiveScenarioMemoryEngine(timestamp);
  initializeExecutiveDecisionMemoryEngine(timestamp);
  initializeExecutiveContextMemoryEngine(timestamp);
  initializeExecutiveMemorySearchEngine(timestamp);
  initializeExecutiveMemoryLifecycleEngine(timestamp);
  initializeExecutiveAssistantMemoryIntegrationEngine(timestamp);
  initializeExecutiveMemoryDashboardEngine(timestamp);
}

function pass(phaseId: string, phaseName: string, summary: string): ExecutiveMemoryPlatformPhaseCertificationResult {
  return Object.freeze({ phaseId, phaseName, certified: true, status: "PASS", summary, readOnly: true as const });
}

function fail(phaseId: string, phaseName: string, summary: string): ExecutiveMemoryPlatformPhaseCertificationResult {
  return Object.freeze({ phaseId, phaseName, certified: false, status: "FAIL", summary, readOnly: true as const });
}

export function certifyExecutiveMemoryFoundationPhase(): ExecutiveMemoryPlatformPhaseCertificationResult {
  resetExecutiveMemoryPlatformCertificationEnvironment();
  const manifestValid = validateStageManifest(EXECUTIVE_MEMORY_SELF_MANIFEST).valid;
  const memoryValid = validateExecutiveMemoryShape(ExecutiveMemoryContract.resolveExecutiveMemoryExample(FIXED_TIME)).valid;
  const initialized = initializeExecutiveMemoryPlatform(FIXED_TIME).success;
  if (manifestValid && memoryValid && initialized && EXECUTIVE_MEMORY_IDENTITY.appId === "APP-4") {
    return pass("APP-4/1", "Executive Memory Foundation", "Foundation contracts and platform initialization certified.");
  }
  return fail("APP-4/1", "Executive Memory Foundation", "Foundation certification failed.");
}

export function certifyExecutiveMemoryRecordPhase(): ExecutiveMemoryPlatformPhaseCertificationResult {
  resetExecutiveMemoryPlatformCertificationEnvironment();
  const manifestValid = validateStageManifest(ExecutiveMemoryRecordContracts.manifest).valid;
  const recordValid = validateExecutiveMemoryRecordShape(buildExecutiveMemoryRecordExample(FIXED_TIME)).valid;
  if (manifestValid && recordValid && ExecutiveMemoryRecordContracts.version === "APP-4/2") {
    return pass("APP-4/2", "Executive Memory Record Contracts", "Record contracts and validation certified.");
  }
  return fail("APP-4/2", "Executive Memory Record Contracts", "Record contract certification failed.");
}

export function certifyExecutiveMemoryStoragePhase(): ExecutiveMemoryPlatformPhaseCertificationResult {
  resetExecutiveMemoryPlatformCertificationEnvironment();
  initializeExecutiveMemoryPlatform(FIXED_TIME);
  registerCertificationProvider();
  const initialized = initializeExecutiveMemoryStorageEngine(FIXED_TIME).success;
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  const stored = createExecutiveMemory(record, FIXED_TIME);
  const manifestValid = validateStageManifest(ExecutiveMemoryStorageContracts.manifest).valid;
  if (initialized && stored.success && manifestValid) {
    return pass("APP-4/3", "Executive Memory Storage", "Storage engine create operation certified.");
  }
  return fail("APP-4/3", "Executive Memory Storage", "Storage certification failed.");
}

export function certifyExecutiveMemoryRetrievalPhase(): ExecutiveMemoryPlatformPhaseCertificationResult {
  resetExecutiveMemoryPlatformCertificationEnvironment();
  initializeExecutiveMemoryPlatform(FIXED_TIME);
  registerCertificationProvider();
  initializeExecutiveMemoryStorageEngine(FIXED_TIME);
  initializeExecutiveMemoryRetrievalEngine(FIXED_TIME);
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  const retrieved = getExecutiveMemoryById(record.id);
  const queried = findExecutiveMemories(Object.freeze({ workspaceId: record.workspaceId }));
  const manifestValid = validateStageManifest(ExecutiveMemoryRetrievalContracts.manifest).valid;
  if (retrieved.success && queried.success && queried.records.length === 1 && manifestValid) {
    return pass("APP-4/4", "Executive Memory Retrieval", "Retrieval by id and query certified.");
  }
  return fail("APP-4/4", "Executive Memory Retrieval", "Retrieval certification failed.");
}

export function certifyExecutiveIntentMemoryLinkPhase(): ExecutiveMemoryPlatformPhaseCertificationResult {
  resetExecutiveMemoryPlatformCertificationEnvironment();
  initializeFullPlatform();
  const intentValid = validateExecutiveIntentShape(resolveExecutiveIntentExample()).valid;
  const manifestValid = validateStageManifest(ExecutiveIntentMemoryLinkContracts.manifest).valid;
  if (intentValid && manifestValid && ExecutiveIntentMemoryLinkContracts.version === "APP-4/5") {
    return pass("APP-4/5", "Executive Intent Memory Link", "APP-3 intent compatibility and link contracts certified.");
  }
  return fail("APP-4/5", "Executive Intent Memory Link", "Intent memory link certification failed.");
}

export function certifyExecutiveScenarioMemoryPhase(): ExecutiveMemoryPlatformPhaseCertificationResult {
  resetExecutiveMemoryPlatformCertificationEnvironment();
  initializeFullPlatform();
  const scenarioValid = validateScenarioIdentityShape(resolveScenarioIdentityExample()).valid;
  const manifestValid = validateStageManifest(ExecutiveScenarioMemoryContracts.manifest).valid;
  if (scenarioValid && manifestValid && ExecutiveScenarioMemoryContracts.version === "APP-4/6") {
    return pass("APP-4/6", "Executive Scenario Memory", "APP-2 scenario compatibility and scenario memory certified.");
  }
  return fail("APP-4/6", "Executive Scenario Memory", "Scenario memory certification failed.");
}

export function certifyExecutiveDecisionMemoryPhase(): ExecutiveMemoryPlatformPhaseCertificationResult {
  resetExecutiveMemoryPlatformCertificationEnvironment();
  initializeFullPlatform();
  const manifestValid = validateStageManifest(ExecutiveDecisionMemoryContracts.manifest).valid;
  if (manifestValid && ExecutiveDecisionMemoryContracts.version === "APP-4/7") {
    return pass("APP-4/7", "Executive Decision Memory", "Decision memory contracts certified.");
  }
  return fail("APP-4/7", "Executive Decision Memory", "Decision memory certification failed.");
}

export function certifyExecutiveContextMemoryPhase(): ExecutiveMemoryPlatformPhaseCertificationResult {
  resetExecutiveMemoryPlatformCertificationEnvironment();
  initializeFullPlatform();
  const manifestValid = validateStageManifest(ExecutiveContextMemoryContracts.manifest).valid;
  if (manifestValid && ExecutiveContextMemoryContracts.version === "APP-4/8") {
    return pass("APP-4/8", "Executive Context Memory", "Context memory contracts certified.");
  }
  return fail("APP-4/8", "Executive Context Memory", "Context memory certification failed.");
}

export function certifyExecutiveMemorySearchRankingPhase(): ExecutiveMemoryPlatformPhaseCertificationResult {
  resetExecutiveMemoryPlatformCertificationEnvironment();
  initializeFullPlatform();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  const search = searchExecutiveMemories(Object.freeze({ recordId: record.id }));
  const manifestValid = validateStageManifest(ExecutiveMemorySearchRankingContracts.manifest).valid;
  if (search.success && search.records.length === 1 && manifestValid) {
    return pass("APP-4/9", "Executive Memory Search & Ranking", "Search and ranking execution certified.");
  }
  return fail("APP-4/9", "Executive Memory Search & Ranking", "Search and ranking certification failed.");
}

export function certifyExecutiveMemoryLifecyclePhase(): ExecutiveMemoryPlatformPhaseCertificationResult {
  resetExecutiveMemoryPlatformCertificationEnvironment();
  initializeFullPlatform();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  const governed = registerGovernedMemory(record.id, AUTHOR, FIXED_TIME);
  const manifestValid = validateStageManifest(ExecutiveMemoryLifecycleContracts.manifest).valid;
  if (governed.success && manifestValid) {
    return pass("APP-4/10", "Executive Memory Lifecycle", "Lifecycle governance registration certified.");
  }
  return fail("APP-4/10", "Executive Memory Lifecycle", "Lifecycle certification failed.");
}

export function certifyExecutiveAssistantMemoryIntegrationPhase(): ExecutiveMemoryPlatformPhaseCertificationResult {
  resetExecutiveMemoryPlatformCertificationEnvironment();
  initializeFullPlatform();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  registerGovernedMemory(record.id, AUTHOR, FIXED_TIME);
  const response = retrieveAssistantMemoryByWorkspace(record.workspaceId);
  const manifestValid = validateStageManifest(ExecutiveAssistantMemoryIntegrationContracts.manifest).valid;
  if (response.success && response.selections.length >= 1 && manifestValid) {
    return pass("APP-4/11", "Executive Assistant Memory Integration", "Read-only assistant integration certified.");
  }
  return fail("APP-4/11", "Executive Assistant Memory Integration", "Assistant integration certification failed.");
}

export function certifyExecutiveMemoryDashboardPhase(): ExecutiveMemoryPlatformPhaseCertificationResult {
  resetExecutiveMemoryPlatformCertificationEnvironment();
  initializeFullPlatform();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  registerGovernedMemory(record.id, AUTHOR, FIXED_TIME);
  const dashboard = getExecutiveMemoryDashboard(FIXED_TIME);
  const manifestValid = validateStageManifest(ExecutiveMemoryDashboardContracts.manifest).valid;
  if (dashboard.success && dashboard.summary.totalMemories === 1 && manifestValid) {
    return pass("APP-4/12", "Executive Memory Dashboard", "Dashboard aggregation certified.");
  }
  return fail("APP-4/12", "Executive Memory Dashboard", "Dashboard certification failed.");
}

export function certifyExecutiveMemoryPlatformEndToEnd(): ExecutiveMemoryPlatformPhaseCertificationResult {
  resetExecutiveMemoryPlatformCertificationEnvironment();
  initializeFullPlatform();
  const record = buildExecutiveMemoryRecordExample(FIXED_TIME);
  createExecutiveMemory(record, FIXED_TIME);
  registerGovernedMemory(record.id, AUTHOR, FIXED_TIME);
  searchExecutiveMemories(Object.freeze({ workspaceId: record.workspaceId }));
  const assistant = retrieveAssistantMemoryByWorkspace(record.workspaceId);
  const dashboard = getExecutiveMemoryDashboard(FIXED_TIME);
  const app3Refresh = runExecutiveIntentPlatformRefresh(FIXED_TIME);
  const scenarioValid = validateScenarioIdentityShape(resolveScenarioIdentityExample()).valid;
  if (
    assistant.success &&
    dashboard.success &&
    app3Refresh.certified &&
    scenarioValid &&
    getExecutiveMemoryById(record.id).success
  ) {
    return pass("APP-4/E2E", "Executive Memory Platform End-to-End", "Full platform integration path certified.");
  }
  return fail("APP-4/E2E", "Executive Memory Platform End-to-End", "End-to-end platform certification failed.");
}

export function validateExecutiveMemoryPlatformArchitectureBoundaries(): boolean {
  const certificationFile = "frontend/app/lib/executiveMemory/executiveMemoryPlatformCertification.ts";
  return (
    evaluateStageFileBoundary({
      filePath: certificationFile,
      allowedFiles: Object.freeze([certificationFile]),
      forbiddenPatterns: Object.freeze(["components/", ".tsx", "dashboard/", "semanticSearch"]),
    }).allowed &&
    !evaluateStageFileBoundary({
      filePath: "frontend/app/components/scene/relationships/RelationshipRenderer.tsx",
      allowedFiles: Object.freeze([certificationFile]),
      forbiddenPatterns: Object.freeze(["components/", ".tsx"]),
    }).allowed
  );
}

export const ExecutiveMemoryPlatformCertificationPhaseChecks = Object.freeze({
  resetExecutiveMemoryPlatformCertificationEnvironment,
  certifyExecutiveMemoryFoundationPhase,
  certifyExecutiveMemoryRecordPhase,
  certifyExecutiveMemoryStoragePhase,
  certifyExecutiveMemoryRetrievalPhase,
  certifyExecutiveIntentMemoryLinkPhase,
  certifyExecutiveScenarioMemoryPhase,
  certifyExecutiveDecisionMemoryPhase,
  certifyExecutiveContextMemoryPhase,
  certifyExecutiveMemorySearchRankingPhase,
  certifyExecutiveMemoryLifecyclePhase,
  certifyExecutiveAssistantMemoryIntegrationPhase,
  certifyExecutiveMemoryDashboardPhase,
  certifyExecutiveMemoryPlatformEndToEnd,
  validateExecutiveMemoryPlatformArchitectureBoundaries,
});
