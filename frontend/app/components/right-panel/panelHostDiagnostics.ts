type PayloadSourceFlags = {
  usedResolved: boolean;
  usedCanonical: boolean;
  usedRaw: boolean;
};

type ConflictPayloadSourceFlags = PayloadSourceFlags & {
  usedResponseConflict: boolean;
  usedResponseConflicts: boolean;
  usedLegacy: boolean;
};
type ConflictPayloadLogFlags = {
  usedResolved: boolean;
  usedCanonical: boolean;
  usedResponseConflict: boolean;
  usedResponseConflicts: boolean;
  usedLegacy: boolean;
};

function isDev() {
  return (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env?.NODE_ENV !== "production";
}

// Render lifecycle
export function logPanelRender(args: {
  view: string | null;
  isOpen: boolean;
  componentMatched: boolean;
  contextId: string | null;
  timestamp: number;
  hasData: boolean;
}) {
  if (!isDev()) return;
  console.log("[Nexora][PanelRender]", args);
}

export function logRiskFlowRunSimulation(requestedView: string | null) {
  if (!isDev()) return;
  console.log("[Nexora][RiskFlowRunSimulation]", {
    requestedView,
  });
}

export function logPanelActionIntent(action: string, sourceView: string | null, targetView: unknown) {
  if (!isDev()) return;
  console.log("[Nexora][PanelActionIntent]", {
    action,
    sourceView,
    targetView,
  });
}

// Payload source / resolver
export function logPanelPayloadSource(
  panel: "dashboard" | "war_room" | "advice" | "timeline" | "conflict",
  view: string | null,
  flags: PayloadSourceFlags
) {
  if (!isDev()) return;
  console.log("[Nexora][PanelPayloadSource]", {
    panel,
    view,
    ...flags,
  });
}

export function logConflictPayloadSource(view: string | null, flags: ConflictPayloadLogFlags) {
  if (!isDev()) return;
  console.log("[Nexora][ConflictPayloadSource]", {
    view,
    ...flags,
  });

  if (flags.usedLegacy) {
    console.warn("[Nexora][ConflictLegacyFallback]", {
      view,
      reason: "canonical_conflict_payload_missing",
    });
  }
}

// Fallback / registry
export function logPanelFallback(args: {
  panel?: string | null;
  canonicalView?: string | null;
  reason?: string | null;
  fallbackReason?: string | null;
}) {
  if (!isDev()) return;
  console.warn("[Nexora][PanelFallback]", {
    panel: args.panel,
    canonicalView: args.canonicalView,
    reason: args.reason,
    fallbackReason: args.fallbackReason,
  });
}

export function logPanelDataUnderfed(panel: string | null, availableKeys: string[]) {
  if (!isDev()) return;
  console.warn("[Nexora][PanelDataUnderfed]", {
    panel,
    availableKeys,
  });
}

export function logPanelResolver(panel: string | null, status: string | null, missingFields: string[]) {
  if (!isDev()) return;
  console.log("[Nexora][PanelResolver]", {
    panel,
    status,
    missingFields,
  });
}

export function logRightPanelSafeRender(args: {
  view: string | null;
  fixType: string | null | undefined;
  prioritizedBlocks: string[];
  cognitiveStep: string | null | undefined;
}) {
  if (!isDev()) return;
  console.log("[Nexora][RightPanelSafeRender]", args);
}

export function logRegistryMiss(canonicalView: string | null, reason: string) {
  if (!isDev()) return;
  console.warn("[Nexora][AutoFixPanelRegistryMiss]", {
    canonicalView,
    reason,
  });
}

export function logUnsupportedViewFallback(view: string | null) {
  if (!isDev()) return;
  console.warn("[Nexora] RightPanelHost fell back for unsupported view:", view);
}

// CTA / action traces
