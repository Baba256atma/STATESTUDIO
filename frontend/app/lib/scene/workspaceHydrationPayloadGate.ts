/**
 * E2:78 — Ignore empty workspace hydration/fallback payloads before scene-clear pipeline.
 *
 * Source path (startup noise):
 *   HomeScreen.applyWorkspaceProjectState
 *     → evaluateWorkspaceHydrateScene / canonDecisionMissingSceneBlob
 *     → sceneJsonFromCanonDecision (null when reject/missing blob)
 *     → applySceneChangeUpstreamDedup(..., "workspace")
 *     → useSceneApplyController.applySceneChangeSafe
 */

export type WorkspaceHydrationPayloadGateInput = {
  source: string;
  objectCountBefore: number;
  objectCountAfter: number;
  hydrationCompleted?: boolean;
  explicitUserClear?: boolean;
  sceneAlreadyHasObjects?: boolean;
  reason?: string | null;
};

const ignoredStartupSignatures = new Set<string>();

function isDev(): boolean {
  return process.env.NODE_ENV !== "production";
}

function normalizeSource(source: string): string {
  return String(source ?? "").trim().toLowerCase();
}

function isWorkspaceHydrationSource(source: string): boolean {
  const normalized = normalizeSource(source);
  return normalized === "workspace" || normalized.includes("workspace_hydrate");
}

export function shouldIgnoreWorkspaceHydrationPayload(
  input: WorkspaceHydrationPayloadGateInput
): boolean {
  if (input.explicitUserClear === true) {
    return false;
  }

  if (!isWorkspaceHydrationSource(input.source)) {
    return false;
  }

  const objectCountBefore = input.objectCountBefore ?? 0;
  const objectCountAfter = input.objectCountAfter ?? 0;
  const hydrationCompleted = input.hydrationCompleted ?? objectCountBefore > 0;
  const sceneAlreadyHasObjects = input.sceneAlreadyHasObjects ?? objectCountBefore > 0;

  return (
    hydrationCompleted &&
    sceneAlreadyHasObjects &&
    objectCountBefore > 0 &&
    objectCountAfter === 0
  );
}

export function traceEmptyWorkspaceHydrationPayloadIgnored(
  input: WorkspaceHydrationPayloadGateInput
): void {
  if (!isDev()) return;
  if (!shouldIgnoreWorkspaceHydrationPayload(input)) return;

  const signature = JSON.stringify({
    source: normalizeSource(input.source),
    objectCountBefore: input.objectCountBefore,
    objectCountAfter: input.objectCountAfter,
    reason: input.reason ?? "workspace_empty_payload_after_hydration",
  });

  if (ignoredStartupSignatures.has(signature)) return;
  ignoredStartupSignatures.add(signature);

  globalThis.console?.debug?.("[Nexora][EmptyWorkspaceHydrationPayloadIgnored]", {
    signature,
    source: input.source,
    objectCountBefore: input.objectCountBefore,
    objectCountAfter: input.objectCountAfter,
    reason: input.reason ?? "workspace_empty_payload_after_hydration",
  });
}

export function resetWorkspaceHydrationPayloadGateForTests(): void {
  ignoredStartupSignatures.clear();
}

export function getIgnoredWorkspaceHydrationPayloadCountForTests(): number {
  return ignoredStartupSignatures.size;
}
