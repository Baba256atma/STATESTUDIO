/**
 * SVIE:4:1 — Scenario visual link runtime (read-only).
 *
 * Connects Scenario Engine and Simulation Engine outputs to SVIE scene object
 * references without visual, routing, workspace, or lifecycle mutations.
 */

import {
  DEFAULT_SVIE_SCENARIO_LINK_SNAPSHOT,
  SVIE_SCENARIO_LINK_FOUNDATION_TAG,
  SVIE_SCENARIO_LINK_RUNTIME_LOG,
  SVIE_SCENARIO_LINK_FOUNDATION_VERSION,
  type SvieScenarioLinkBuildInput,
  type SvieScenarioLinkSnapshot,
} from "./svieScenarioLinkFoundationContract.ts";
import {
  readScenariosFromSceneJson,
  resolveSvieScenarioLinkSnapshot,
} from "./svieScenarioLinkResolver.ts";
import {
  guardSvieRouteWrite,
  guardSvieWorkspaceWrite,
  initializeSvieRuntime,
} from "./svieRuntimeFoundation.ts";

let runtimeInitialized = false;
let lastSignature: string | null = null;
let snapshot: SvieScenarioLinkSnapshot = DEFAULT_SVIE_SCENARIO_LINK_SNAPSHOT;
const loggedSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logScenarioLinkOnce(next: SvieScenarioLinkSnapshot): void {
  if (!isDev()) return;
  if (loggedSignatures.has(next.signature)) return;
  loggedSignatures.add(next.signature);
  globalThis.console?.debug?.(SVIE_SCENARIO_LINK_RUNTIME_LOG, {
    tag: SVIE_SCENARIO_LINK_FOUNDATION_TAG,
    version: SVIE_SCENARIO_LINK_FOUNDATION_VERSION,
    linkCount: next.links.length,
  });
}

export function initializeSvieScenarioLinkRuntime(): Readonly<{
  initialized: true;
  version: typeof SVIE_SCENARIO_LINK_FOUNDATION_VERSION;
  readOnly: true;
}> {
  initializeSvieRuntime();
  runtimeInitialized = true;
  return Object.freeze({
    initialized: true,
    version: SVIE_SCENARIO_LINK_FOUNDATION_VERSION,
    readOnly: true,
  });
}

export function isSvieScenarioLinkRuntimeInitialized(): boolean {
  return runtimeInitialized;
}

export function getSvieScenarioLinkSnapshot(): SvieScenarioLinkSnapshot {
  if (!runtimeInitialized) {
    initializeSvieScenarioLinkRuntime();
  }
  return snapshot;
}

export function buildSvieScenarioLinkSnapshot(input: SvieScenarioLinkBuildInput = {}): SvieScenarioLinkSnapshot {
  if (!runtimeInitialized) {
    initializeSvieScenarioLinkRuntime();
  }
  const scenarios = input.scenarios ?? readScenariosFromSceneJson(input.sceneJson);
  const next = resolveSvieScenarioLinkSnapshot({ scenarios, sceneJson: input.sceneJson }, Date.now());
  snapshot = Object.freeze({
    links: next.links,
    linkByScenarioId: next.linkByScenarioId,
    contexts: next.contexts,
    contextByScenarioId: next.contextByScenarioId,
    generatedAt: next.generatedAt,
    signature: next.signature,
  });
  lastSignature = next.signature;
  logScenarioLinkOnce(snapshot);
  return snapshot;
}

export function syncSvieScenarioLinks(input: SvieScenarioLinkBuildInput = {}): SvieScenarioLinkSnapshot {
  if (!runtimeInitialized) {
    initializeSvieScenarioLinkRuntime();
  }
  const scenarios = input.scenarios ?? readScenariosFromSceneJson(input.sceneJson);
  const signature = resolveSvieScenarioLinkSnapshot({ scenarios, sceneJson: input.sceneJson }, 0).signature;
  if (signature === lastSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }
  return buildSvieScenarioLinkSnapshot(input);
}

export function guardSvieScenarioLinkRouteWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieRouteWrite(attempt);
}

export function guardSvieScenarioLinkWorkspaceWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieWorkspaceWrite(attempt);
}

export function resetSvieScenarioLinkRuntimeForTests(): void {
  runtimeInitialized = false;
  lastSignature = null;
  snapshot = DEFAULT_SVIE_SCENARIO_LINK_SNAPSHOT;
  loggedSignatures.clear();
}
