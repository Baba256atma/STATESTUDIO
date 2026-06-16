/**
 * SVIE:3:1 — Advisory visual link runtime (read-only).
 *
 * Maps Advisory findings to scene object references without visual, routing,
 * workspace, or lifecycle mutations.
 */

import {
  DEFAULT_SVIE_ADVISORY_LINK_SNAPSHOT,
  SVIE_ADVISORY_LINK_FOUNDATION_TAG,
  SVIE_ADVISORY_LINK_RUNTIME_LOG,
  SVIE_ADVISORY_LINK_FOUNDATION_VERSION,
  type SvieAdvisoryLinkBuildInput,
  type SvieAdvisoryLinkSnapshot,
} from "./svieAdvisoryLinkFoundationContract.ts";
import { resolveSvieAdvisoryLinkSnapshot } from "./svieAdvisoryLinkResolver.ts";
import {
  guardSvieRouteWrite,
  guardSvieWorkspaceWrite,
  initializeSvieRuntime,
} from "./svieRuntimeFoundation.ts";

let runtimeInitialized = false;
let lastSignature: string | null = null;
let snapshot: SvieAdvisoryLinkSnapshot = DEFAULT_SVIE_ADVISORY_LINK_SNAPSHOT;
const loggedSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logAdvisoryLinkOnce(next: SvieAdvisoryLinkSnapshot): void {
  if (!isDev()) return;
  if (loggedSignatures.has(next.signature)) return;
  loggedSignatures.add(next.signature);
  globalThis.console?.debug?.(SVIE_ADVISORY_LINK_RUNTIME_LOG, {
    tag: SVIE_ADVISORY_LINK_FOUNDATION_TAG,
    version: SVIE_ADVISORY_LINK_FOUNDATION_VERSION,
    linkCount: next.links.length,
  });
}

export function initializeSvieAdvisoryLinkRuntime(): Readonly<{
  initialized: true;
  version: typeof SVIE_ADVISORY_LINK_FOUNDATION_VERSION;
  readOnly: true;
}> {
  initializeSvieRuntime();
  runtimeInitialized = true;
  return Object.freeze({
    initialized: true,
    version: SVIE_ADVISORY_LINK_FOUNDATION_VERSION,
    readOnly: true,
  });
}

export function isSvieAdvisoryLinkRuntimeInitialized(): boolean {
  return runtimeInitialized;
}

export function getSvieAdvisoryLinkSnapshot(): SvieAdvisoryLinkSnapshot {
  if (!runtimeInitialized) {
    initializeSvieAdvisoryLinkRuntime();
  }
  return snapshot;
}

export function buildSvieAdvisoryLinkSnapshot(input: SvieAdvisoryLinkBuildInput = {}): SvieAdvisoryLinkSnapshot {
  if (!runtimeInitialized) {
    initializeSvieAdvisoryLinkRuntime();
  }
  const next = resolveSvieAdvisoryLinkSnapshot(input, Date.now());
  snapshot = Object.freeze({
    links: next.links,
    linkByRecommendationId: next.linkByRecommendationId,
    generatedAt: next.generatedAt,
    signature: next.signature,
  });
  lastSignature = next.signature;
  logAdvisoryLinkOnce(snapshot);
  return snapshot;
}

export function syncSvieAdvisoryLinkSnapshot(input: SvieAdvisoryLinkBuildInput = {}): SvieAdvisoryLinkSnapshot {
  if (!runtimeInitialized) {
    initializeSvieAdvisoryLinkRuntime();
  }
  const signature = resolveSvieAdvisoryLinkSnapshot(input, 0).signature;
  if (signature === lastSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }
  return buildSvieAdvisoryLinkSnapshot(input);
}

export function guardSvieAdvisoryLinkRouteWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieRouteWrite(attempt);
}

export function guardSvieAdvisoryLinkWorkspaceWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieWorkspaceWrite(attempt);
}

export function resetSvieAdvisoryLinkRuntimeForTests(): void {
  runtimeInitialized = false;
  lastSignature = null;
  snapshot = DEFAULT_SVIE_ADVISORY_LINK_SNAPSHOT;
  loggedSignatures.clear();
}
