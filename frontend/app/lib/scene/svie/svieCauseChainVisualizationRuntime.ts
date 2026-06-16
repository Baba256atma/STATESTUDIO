/**
 * SVIE:3:2 — Cause chain visualization runtime (read-only).
 */

import { syncSvieAdvisoryLinkSnapshot } from "./svieAdvisoryLinkRuntime.ts";
import type { SvieAdvisoryFindingInput } from "./svieAdvisoryLinkFoundationContract.ts";
import { deriveCauseChains, buildSvieCauseChainSignature } from "./svieCauseChainDerivation.ts";
import {
  DEFAULT_SVIE_CAUSE_CHAIN_VISUALIZATION_SNAPSHOT,
  SVIE_CAUSE_CHAIN_COMPUTED_LOG,
  SVIE_CAUSE_CHAIN_VISUALIZATION_TAG,
  SVIE_CAUSE_CHAIN_VISUALIZATION_VERSION,
  type SvieCauseChainVisualizationBuildInput,
  type SvieCauseChainVisualizationSnapshot,
} from "./svieCauseChainVisualizationContract.ts";
import {
  mergeVisualCauseChains,
  resolveVisualCauseChain,
} from "./svieCauseChainVisualizationResolver.ts";
import {
  guardSvieAdvisoryLinkRouteWrite,
  guardSvieAdvisoryLinkWorkspaceWrite,
  initializeSvieAdvisoryLinkRuntime,
} from "./svieAdvisoryLinkRuntime.ts";

let lastSignature: string | null = null;
let snapshot: SvieCauseChainVisualizationSnapshot = DEFAULT_SVIE_CAUSE_CHAIN_VISUALIZATION_SNAPSHOT;
const loggedSignatures = new Set<string>();

function isDev(): boolean {
  return typeof process === "undefined" || process.env.NODE_ENV !== "production";
}

function logCauseChainOnce(next: SvieCauseChainVisualizationSnapshot): void {
  if (!isDev()) return;
  if (loggedSignatures.has(next.signature)) return;
  loggedSignatures.add(next.signature);
  globalThis.console?.debug?.(SVIE_CAUSE_CHAIN_COMPUTED_LOG, {
    tag: SVIE_CAUSE_CHAIN_VISUALIZATION_TAG,
    version: SVIE_CAUSE_CHAIN_VISUALIZATION_VERSION,
    chainCount: next.chains.length,
    connectionCount: next.connectionVisuals.length,
  });
}

export function readAdvisoryFindingsFromSceneJson(sceneJson: unknown): readonly SvieAdvisoryFindingInput[] {
  const payload = sceneJson as
    | {
        svie?: { advisoryFindings?: readonly SvieAdvisoryFindingInput[] };
        advisory_findings?: readonly SvieAdvisoryFindingInput[];
      }
    | null
    | undefined;
  const findings = payload?.svie?.advisoryFindings ?? payload?.advisory_findings;
  return Array.isArray(findings) ? Object.freeze([...findings]) : Object.freeze([]);
}

export function applyCauseChainVisualization(
  input: SvieCauseChainVisualizationBuildInput = {}
): SvieCauseChainVisualizationSnapshot {
  initializeSvieAdvisoryLinkRuntime();
  const findings = input.findings ?? readAdvisoryFindingsFromSceneJson(input.sceneJson);
  const linkSnapshot = syncSvieAdvisoryLinkSnapshot({ findings, sceneJson: input.sceneJson });
  const chains = deriveCauseChains({
    links: linkSnapshot.links,
    findings,
    sceneJson: input.sceneJson,
  });
  const visualChains = Object.freeze(chains.map((chain) => resolveVisualCauseChain(chain)));
  const merged = mergeVisualCauseChains(visualChains);
  const generatedAt = Date.now();
  const signature = buildSvieCauseChainSignature({
    links: linkSnapshot.links,
    findings,
    sceneJson: input.sceneJson,
  });

  snapshot = Object.freeze({
    chains,
    visualChains,
    nodeVisualByObjectId: merged.nodeVisualByObjectId,
    connectionVisuals: merged.connectionVisuals,
    generatedAt,
    signature,
  });
  lastSignature = signature;
  logCauseChainOnce(snapshot);
  return snapshot;
}

export function syncSvieCauseChainVisualization(
  input: SvieCauseChainVisualizationBuildInput = {}
): SvieCauseChainVisualizationSnapshot {
  initializeSvieAdvisoryLinkRuntime();
  const findings = input.findings ?? readAdvisoryFindingsFromSceneJson(input.sceneJson);
  const linkSnapshot = syncSvieAdvisoryLinkSnapshot({ findings, sceneJson: input.sceneJson });
  const signature = buildSvieCauseChainSignature({
    links: linkSnapshot.links,
    findings,
    sceneJson: input.sceneJson,
  });
  if (signature === lastSignature && snapshot.generatedAt > 0) {
    return snapshot;
  }
  return applyCauseChainVisualization(input);
}

export function getSvieCauseChainVisualizationSnapshot(): SvieCauseChainVisualizationSnapshot {
  return snapshot;
}

export function guardSvieCauseChainRouteWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieAdvisoryLinkRouteWrite(attempt);
}

export function guardSvieCauseChainWorkspaceWrite(
  attempt: Readonly<{ action?: string | null; source?: string | null }> = {}
) {
  return guardSvieAdvisoryLinkWorkspaceWrite(attempt);
}

export function resetSvieCauseChainVisualizationRuntimeForTests(): void {
  lastSignature = null;
  snapshot = DEFAULT_SVIE_CAUSE_CHAIN_VISUALIZATION_SNAPSHOT;
  loggedSignatures.clear();
}
