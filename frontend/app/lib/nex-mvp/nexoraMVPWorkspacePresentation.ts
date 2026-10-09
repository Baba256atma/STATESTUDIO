/**
 * NEX-MVP:5 — Workspace Dial & Scene State presentation coordinator.
 *
 * Thin, pure mapping from canonical workspace (NEX-MVP:1) to Dial state,
 * scene environment visual tokens, and workspace relevance emphasis.
 * Does not own workspace authority or invent domain engines.
 */

import {
  getNexoraMVPSceneEnvironmentIntent,
  getNexoraMVPWorkspaceOrder,
  getNexoraMVPWorkspaceRegistry,
  isNexoraMVPWorkspaceKind,
  NEXORA_MVP_WORKSPACE_LABELS,
  type NexoraMVPPresentationState,
  type NexoraMVPSceneEnvironmentIntent,
  type NexoraMVPWorkspaceKind,
} from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import type {
  NexoraMVPContextNodePresentation,
  NexoraMVPObjectInteractionState,
  NexoraMVPStageInteractionPresentation,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import {
  selectNexoraMVPInteractionSubject,
  syncNexoraMVPObjectInteractionShellContext,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexoraMVPWorkspaceDialSceneStateIdentity =
  "NEX-MVP:5/NexoraWorkspaceDialSceneState" as const;

export const nexoraMVPWorkspaceDialSceneStateVersion = "1.5.0" as const;

export const nexoraMVPWorkspaceDialSceneStateNamespace =
  "nexora.mvp.workspace-dial-scene-state" as const;

export const nexoraMVPWorkspaceDialSceneStatePhase =
  "WorkspaceDialAndSceneState" as const;

export const nexoraMVPWorkspaceDialSceneStateArchitecturalRole =
  "MVPWorkspaceTransitionAndSceneEnvironmentCoordinator" as const;

export const nexoraMVPWorkspaceDialSceneStateReadiness =
  "ReadyForPresentationStates" as const;

export const nexoraMVPWorkspaceDialSceneStateUpstreamInteractionIdentity =
  "NEX-MVP:4/NexoraObjectInteraction" as const;

export type NexoraMVPWorkspaceDialSceneStateIdentity = {
  readonly id: typeof nexoraMVPWorkspaceDialSceneStateIdentity;
  readonly version: typeof nexoraMVPWorkspaceDialSceneStateVersion;
  readonly namespace: typeof nexoraMVPWorkspaceDialSceneStateNamespace;
  readonly phase: typeof nexoraMVPWorkspaceDialSceneStatePhase;
  readonly architecturalRole: typeof nexoraMVPWorkspaceDialSceneStateArchitecturalRole;
};

const IDENTITY: NexoraMVPWorkspaceDialSceneStateIdentity = Object.freeze({
  id: nexoraMVPWorkspaceDialSceneStateIdentity,
  version: nexoraMVPWorkspaceDialSceneStateVersion,
  namespace: nexoraMVPWorkspaceDialSceneStateNamespace,
  phase: nexoraMVPWorkspaceDialSceneStatePhase,
  architecturalRole: nexoraMVPWorkspaceDialSceneStateArchitecturalRole,
});

export function getNexoraMVPWorkspaceDialSceneStateIdentity(): NexoraMVPWorkspaceDialSceneStateIdentity {
  return IDENTITY;
}

/** Edge policy: stop at Overview / Execution (no wrap). */
export const NEXORA_MVP_WORKSPACE_DIAL_EDGE_POLICY = "stop-at-ends" as const;

export const NEXORA_MVP_WORKSPACE_TRANSITION_MS = 450 as const;
export const NEXORA_MVP_WORKSPACE_TRANSITION_MS_REDUCED = 80 as const;

/**
 * VISUAL-SYSTEM:3 — Stage field under the existing environment owner.
 * Shadow-receiving plane replaces the visible radius-9 disc; no new Scene.
 */
export const NEXORA_MVP_STAGE_ATMOSPHERE_FIELD = Object.freeze({
  geometry: "plane" as const,
  extent: 48,
  circleRadius9Retired: true as const,
  visibleCircularBoundary: false as const,
  mergesIntoBackground: true as const,
  /** Below the executive composition band so the floor cannot hide Objects. */
  positionY: -2.4,
  encodesObjectFamily: false as const,
  encodesObjectState: false as const,
});

export const NEXORA_MVP_WORKSPACE_PRESENTATION_BOUNDARY = Object.freeze({
  architecturalRole: nexoraMVPWorkspaceDialSceneStateArchitecturalRole,
  ownsWorkspaceAuthority: false as const,
  duplicatesWorkspaceRegistry: false as const,
  inventsDomainEngines: false as const,
  edgePolicy: NEXORA_MVP_WORKSPACE_DIAL_EDGE_POLICY,
  themeCoupledToEnvironment: false as const,
  encodesObjectFamily: false as const,
  encodesObjectState: false as const,
  /** Day/Night tints the room; workspace intent remains the atmosphere owner. */
  dayNightReplacesWorkspaceIntent: false as const,
});

type SceneAtmosphereHazeStops = {
  readonly center: string;
  readonly mid: string;
  readonly edge: string;
  readonly rim: string;
};

type SceneAtmosphereTokens = {
  readonly background: string;
  readonly fogNear: number;
  readonly fogFar: number;
  readonly ambientIntensity: number;
  readonly keyLightIntensity: number;
  readonly keyLightColor: string;
  readonly fillLightIntensity: number;
  readonly fillLightColor: string;
  readonly groundColor: string;
  readonly groundOpacity: number;
  readonly connectionEmphasis: number;
  readonly objectSurfaceTreatment:
    | "balanced"
    | "investigative"
    | "simulative"
    | "committal"
    | "executive";
  /** Radial Stage field only — not a second theme registry. */
  readonly atmosphereHaze: SceneAtmosphereHazeStops;
};

const NIGHT_STAGE_HAZE = Object.freeze({
  center: "rgba(118, 158, 196, 0.42)",
  mid: "rgba(46, 78, 112, 0.2)",
  edge: "rgba(8, 14, 24, 0.46)",
  rim: "rgba(2, 5, 10, 0.84)",
});

const DAY_STAGE_HAZE = Object.freeze({
  center: "rgba(228, 244, 255, 0.22)",
  mid: "rgba(150, 200, 236, 0.1)",
  edge: "rgba(72, 132, 188, 0.16)",
  rim: "rgba(46, 96, 150, 0.22)",
});

/**
 * Restrained Stage-field palettes. Context changes the room, not Object truth.
 * Fill/key remain desaturated so SP:3.1 mix cannot gold/green-wash bodies.
 */
export const NEXORA_MVP_SCENE_ENVIRONMENT_ATMOSPHERE = Object.freeze({
  neutral: Object.freeze({
    background: "#152033",
    fogNear: 14,
    fogFar: 28,
    ambientIntensity: 0.55,
    keyLightIntensity: 0.85,
    keyLightColor: "#f3f5f7",
    fillLightIntensity: 0.28,
    fillLightColor: "#8aa0b4",
    groundColor: "#223446",
    groundOpacity: 0.88,
    connectionEmphasis: 1,
    objectSurfaceTreatment: "balanced",
    atmosphereHaze: NIGHT_STAGE_HAZE,
  }),
  investigate: Object.freeze({
    background: "#070d16",
    fogNear: 13.5,
    fogFar: 27,
    ambientIntensity: 0.52,
    keyLightIntensity: 0.86,
    keyLightColor: "#f3f5f7",
    fillLightIntensity: 0.28,
    fillLightColor: "#7a93b0",
    groundColor: "#121924",
    groundOpacity: 0.72,
    connectionEmphasis: 1.15,
    objectSurfaceTreatment: "investigative",
    atmosphereHaze: NIGHT_STAGE_HAZE,
  }),
  simulate: Object.freeze({
    background: "#090c16",
    fogNear: 14,
    fogFar: 28,
    ambientIntensity: 0.53,
    keyLightIntensity: 0.84,
    keyLightColor: "#f3f5f7",
    fillLightIntensity: 0.28,
    fillLightColor: "#7d86a6",
    groundColor: "#151824",
    groundOpacity: 0.72,
    connectionEmphasis: 1.08,
    objectSurfaceTreatment: "simulative",
    atmosphereHaze: NIGHT_STAGE_HAZE,
  }),
  commit: Object.freeze({
    background: "#080c16",
    fogNear: 14,
    fogFar: 27.5,
    ambientIntensity: 0.52,
    keyLightIntensity: 0.86,
    keyLightColor: "#f3f5f7",
    fillLightIntensity: 0.28,
    fillLightColor: "#6d82a8",
    groundColor: "#131a28",
    groundOpacity: 0.72,
    connectionEmphasis: 1.2,
    objectSurfaceTreatment: "committal",
    atmosphereHaze: NIGHT_STAGE_HAZE,
  }),
  execute: Object.freeze({
    background: "#080e10",
    fogNear: 14,
    fogFar: 28,
    ambientIntensity: 0.54,
    keyLightIntensity: 0.85,
    keyLightColor: "#f3f5f7",
    fillLightIntensity: 0.28,
    fillLightColor: "#6d8a86",
    groundColor: "#121c1c",
    groundOpacity: 0.72,
    connectionEmphasis: 1.05,
    objectSurfaceTreatment: "executive",
    atmosphereHaze: NIGHT_STAGE_HAZE,
  }),
} as const satisfies Record<NexoraMVPSceneEnvironmentIntent, SceneAtmosphereTokens>);

/**
 * THEME-WIRING:1 — Day presentation overlay of the same workspace intents.
 * Preserves relative hue/occupation of each intent; does not encode object state.
 */
export const NEXORA_MVP_SCENE_ENVIRONMENT_ATMOSPHERE_DAY = Object.freeze({
  neutral: Object.freeze({
    background: "#8ec4ea",
    fogNear: 36,
    fogFar: 68,
    ambientIntensity: 0.9,
    keyLightIntensity: 1.14,
    keyLightColor: "#fbfeff",
    fillLightIntensity: 0.44,
    fillLightColor: "#8ec8ee",
    groundColor: "#8ec4ea",
    groundOpacity: 0.94,
    connectionEmphasis: 1,
    objectSurfaceTreatment: "balanced",
    atmosphereHaze: DAY_STAGE_HAZE,
  }),
  investigate: Object.freeze({
    background: "#82b6e2",
    fogNear: 34,
    fogFar: 66,
    ambientIntensity: 0.88,
    keyLightIntensity: 1.12,
    keyLightColor: "#fbfeff",
    fillLightIntensity: 0.44,
    fillLightColor: "#82bce8",
    groundColor: "#82b6e2",
    groundOpacity: 0.94,
    connectionEmphasis: 1.15,
    objectSurfaceTreatment: "investigative",
    atmosphereHaze: DAY_STAGE_HAZE,
  }),
  simulate: Object.freeze({
    background: "#8ab6e6",
    fogNear: 36,
    fogFar: 68,
    ambientIntensity: 0.88,
    keyLightIntensity: 1.12,
    keyLightColor: "#fbfeff",
    fillLightIntensity: 0.42,
    fillLightColor: "#96b8ea",
    groundColor: "#8ab6e6",
    groundOpacity: 0.94,
    connectionEmphasis: 1.08,
    objectSurfaceTreatment: "simulative",
    atmosphereHaze: DAY_STAGE_HAZE,
  }),
  commit: Object.freeze({
    background: "#82b2e2",
    fogNear: 36,
    fogFar: 67,
    ambientIntensity: 0.88,
    keyLightIntensity: 1.13,
    keyLightColor: "#fbfeff",
    fillLightIntensity: 0.42,
    fillLightColor: "#86b4e4",
    groundColor: "#82b2e2",
    groundOpacity: 0.94,
    connectionEmphasis: 1.2,
    objectSurfaceTreatment: "committal",
    atmosphereHaze: DAY_STAGE_HAZE,
  }),
  execute: Object.freeze({
    background: "#7ec4d4",
    fogNear: 36,
    fogFar: 68,
    ambientIntensity: 0.89,
    keyLightIntensity: 1.13,
    keyLightColor: "#fbfeff",
    fillLightIntensity: 0.42,
    fillLightColor: "#7ec8d4",
    groundColor: "#7ec4d4",
    groundOpacity: 0.94,
    connectionEmphasis: 1.05,
    objectSurfaceTreatment: "executive",
    atmosphereHaze: DAY_STAGE_HAZE,
  }),
} as const satisfies Record<NexoraMVPSceneEnvironmentIntent, SceneAtmosphereTokens>);

// ─── Dial state ─────────────────────────────────────────────────────────────

export type NexoraMVPWorkspaceDialTransitionState = "idle" | "transitioning";

export type NexoraMVPWorkspaceDialState = {
  readonly activeWorkspace: NexoraMVPWorkspaceKind;
  readonly activeIndex: number;
  readonly previousWorkspace: NexoraMVPWorkspaceKind | null;
  readonly nextWorkspace: NexoraMVPWorkspaceKind | null;
  readonly label: string;
  readonly canGoPrevious: boolean;
  readonly canGoNext: boolean;
  readonly transitionState: NexoraMVPWorkspaceDialTransitionState;
  readonly rotationDegrees: number;
  readonly workspaces: readonly {
    readonly kind: NexoraMVPWorkspaceKind;
    readonly label: string;
    readonly index: number;
  }[];
};

export type NexoraMVPWorkspaceChangeRequest = {
  readonly targetWorkspace: unknown;
  readonly currentWorkspace: NexoraMVPWorkspaceKind;
  readonly presentationState: NexoraMVPPresentationState;
};

export type NexoraMVPWorkspaceChangeResult =
  | {
      readonly ok: true;
      readonly workspace: NexoraMVPWorkspaceKind;
      readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
      readonly presentationState: NexoraMVPPresentationState;
      readonly changed: boolean;
    }
  | {
      readonly ok: false;
      readonly reason: "invalid-workspace";
    };

export type NexoraMVPContextRelevanceTier =
  | "primary"
  | "supporting"
  | "secondary";

export type NexoraMVPSceneEnvironmentVisualState = {
  readonly intent: NexoraMVPSceneEnvironmentIntent;
  readonly background: string;
  readonly fogNear: number;
  readonly fogFar: number;
  readonly ambientIntensity: number;
  readonly keyLightIntensity: number;
  readonly keyLightColor: string;
  readonly fillLightIntensity: number;
  readonly fillLightColor: string;
  readonly groundColor: string;
  readonly groundOpacity: number;
  readonly connectionEmphasis: number;
  readonly atmosphereHaze: SceneAtmosphereHazeStops;
  readonly objectSurfaceTreatment:
    | "balanced"
    | "investigative"
    | "simulative"
    | "committal"
    | "executive";
  readonly transitionMs: number;
};

type ContextKind = "problem" | "scenario" | "decision" | "execution";

const CONTEXT_KIND_PRIORITY = {
  overview: [] as const satisfies readonly ContextKind[],
  problem: ["problem"] as const satisfies readonly ContextKind[],
  scenario: ["scenario"] as const satisfies readonly ContextKind[],
  decision: ["decision"] as const satisfies readonly ContextKind[],
  execution: ["execution"] as const satisfies readonly ContextKind[],
} as const satisfies Record<NexoraMVPWorkspaceKind, readonly ContextKind[]>;

const SUPPORTING_CONTEXT = {
  overview: [
    "problem",
    "scenario",
    "decision",
    "execution",
  ] as const satisfies readonly ContextKind[],
  problem: ["scenario", "decision"] as const satisfies readonly ContextKind[],
  scenario: ["problem", "decision"] as const satisfies readonly ContextKind[],
  decision: ["scenario", "execution"] as const satisfies readonly ContextKind[],
  execution: ["decision", "problem"] as const satisfies readonly ContextKind[],
} as const satisfies Record<NexoraMVPWorkspaceKind, readonly ContextKind[]>;

export function getNexoraMVPWorkspaceIndex(
  workspace: NexoraMVPWorkspaceKind,
): number {
  return getNexoraMVPWorkspaceOrder().indexOf(workspace);
}

export function resolveNexoraMVPPreviousWorkspace(
  workspace: NexoraMVPWorkspaceKind,
): NexoraMVPWorkspaceKind | null {
  const order = getNexoraMVPWorkspaceOrder();
  const index = order.indexOf(workspace);
  if (index <= 0) return null;
  return order[index - 1] ?? null;
}

export function resolveNexoraMVPNextWorkspace(
  workspace: NexoraMVPWorkspaceKind,
): NexoraMVPWorkspaceKind | null {
  const order = getNexoraMVPWorkspaceOrder();
  const index = order.indexOf(workspace);
  if (index < 0 || index >= order.length - 1) return null;
  return order[index + 1] ?? null;
}

/**
 * Derive Dial UI state from the canonical application workspace.
 * Local animation may interpolate; authority remains the snapshot workspace.
 */
export function deriveNexoraMVPWorkspaceDialState(input: {
  readonly activeWorkspace: NexoraMVPWorkspaceKind;
  readonly transitionState?: NexoraMVPWorkspaceDialTransitionState;
}): NexoraMVPWorkspaceDialState {
  const order = getNexoraMVPWorkspaceOrder();
  const registry = getNexoraMVPWorkspaceRegistry();
  const activeIndex = Math.max(0, order.indexOf(input.activeWorkspace));
  const previousWorkspace = resolveNexoraMVPPreviousWorkspace(
    input.activeWorkspace,
  );
  const nextWorkspace = resolveNexoraMVPNextWorkspace(input.activeWorkspace);
  const sector = 270 / Math.max(1, order.length - 1);
  const rotationDegrees = -135 + activeIndex * sector;

  return Object.freeze({
    activeWorkspace: input.activeWorkspace,
    activeIndex,
    previousWorkspace,
    nextWorkspace,
    label: NEXORA_MVP_WORKSPACE_LABELS[input.activeWorkspace],
    canGoPrevious: previousWorkspace != null,
    canGoNext: nextWorkspace != null,
    transitionState: input.transitionState ?? "idle",
    rotationDegrees,
    workspaces: Object.freeze(
      registry.map((entry) =>
        Object.freeze({
          kind: entry.kind,
          label: entry.label,
          index: entry.order,
        }),
      ),
    ),
  });
}

/**
 * Validate and resolve a workspace-change intent.
 * Presentation state is preserved; environment intent comes from NEX-MVP:1.
 */
export function resolveNexoraMVPWorkspaceChange(
  request: NexoraMVPWorkspaceChangeRequest,
): NexoraMVPWorkspaceChangeResult {
  if (!isNexoraMVPWorkspaceKind(request.targetWorkspace)) {
    return Object.freeze({ ok: false, reason: "invalid-workspace" });
  }
  const workspace = request.targetWorkspace;
  return Object.freeze({
    ok: true,
    workspace,
    environmentIntent: getNexoraMVPSceneEnvironmentIntent(workspace),
    presentationState: request.presentationState,
    changed: workspace !== request.currentWorkspace,
  });
}

export function getNexoraMVPWorkspacePrimaryContextKinds(
  workspace: NexoraMVPWorkspaceKind,
): readonly ContextKind[] {
  return CONTEXT_KIND_PRIORITY[workspace];
}

export function resolveNexoraMVPContextRelevanceTier(
  workspace: NexoraMVPWorkspaceKind,
  kind: string,
): NexoraMVPContextRelevanceTier {
  if (
    (CONTEXT_KIND_PRIORITY[workspace] as readonly string[]).includes(kind)
  ) {
    return "primary";
  }
  if ((SUPPORTING_CONTEXT[workspace] as readonly string[]).includes(kind)) {
    return "supporting";
  }
  return "secondary";
}

/**
 * Focus preservation policy on workspace change:
 * - Object focus always retained
 * - Context focus retained when kind is primary for the target workspace
 * - Otherwise clear contextual depth back to the source object (if any)
 * - Presentation state preserved; environment intent updated from foundation
 */
export function applyNexoraMVPWorkspaceChangeToInteraction(
  state: NexoraMVPObjectInteractionState,
  targetWorkspace: unknown,
): NexoraMVPObjectInteractionState {
  const resolved = resolveNexoraMVPWorkspaceChange({
    targetWorkspace,
    currentWorkspace: state.workspace,
    presentationState: state.presentationState,
  });
  if (!resolved.ok) return state;

  const originalFocused = state.focusedSubject;
  const sourceObject =
    originalFocused?.kind === "object"
      ? originalFocused
      : (state.trail.find((entry) => entry.kind === "object") ?? null);
  // Scope sync keys off object-kind focus. Context-focus must not be treated
  // as "no object" or the workspace change resets to Overview and drops trail.
  const stateForSync =
    sourceObject != null && originalFocused?.kind !== "object"
      ? Object.freeze({
          ...state,
          focusedSubject: sourceObject,
          selectedSubject: sourceObject,
        })
      : state;

  let next = syncNexoraMVPObjectInteractionShellContext(stateForSync, {
    workspace: resolved.workspace,
    presentationState: resolved.presentationState,
    environmentIntent: resolved.environmentIntent,
  });

  // SP:4.1B — entering an executive-work workspace expands the thread explicitly.
  if (
    resolved.workspace === "problem" ||
    resolved.workspace === "scenario" ||
    resolved.workspace === "decision" ||
    resolved.workspace === "execution"
  ) {
    next = Object.freeze({
      ...next,
      expandExecutiveThread: true,
    });
  } else if (resolved.workspace === "overview") {
    next = Object.freeze({
      ...next,
      expandExecutiveThread: false,
    });
  }

  if (originalFocused && originalFocused.kind !== "object") {
    const primary = getNexoraMVPWorkspacePrimaryContextKinds(resolved.workspace);
    const useful =
      resolved.workspace !== "overview" &&
      (primary as readonly string[]).includes(originalFocused.kind);
    const restoreId = useful ? originalFocused.id : sourceObject?.id ?? null;
    if (restoreId) {
      next = selectNexoraMVPInteractionSubject(next, restoreId);
      next = syncNexoraMVPObjectInteractionShellContext(next, {
        workspace: resolved.workspace,
        presentationState: resolved.presentationState,
        environmentIntent: resolved.environmentIntent,
      });
      if (
        resolved.workspace === "problem" ||
        resolved.workspace === "scenario" ||
        resolved.workspace === "decision" ||
        resolved.workspace === "execution"
      ) {
        next = Object.freeze({
          ...next,
          expandExecutiveThread: true,
        });
      }
    }
  }

  return next;
}

const TIER_SCALE: Record<NexoraMVPContextRelevanceTier, number> = {
  primary: 1,
  supporting: 0.9,
  secondary: 0.78,
};

const TIER_OPACITY: Record<NexoraMVPContextRelevanceTier, number> = {
  primary: 1,
  supporting: 0.78,
  secondary: 0.55,
};

/**
 * Apply workspace relevance hierarchy to context nodes (no fabrication).
 */
export function applyNexoraMVPWorkspaceContextEmphasis(
  nodes: readonly NexoraMVPContextNodePresentation[],
  workspace: NexoraMVPWorkspaceKind,
): readonly NexoraMVPContextNodePresentation[] {
  return Object.freeze(
    nodes.map((node) => {
      if (node.role === "focused" || node.role === "source-anchor") {
        return node;
      }
      const tier = resolveNexoraMVPContextRelevanceTier(workspace, node.kind);
      return Object.freeze({
        ...node,
        scale: node.scale * TIER_SCALE[tier],
        opacity: Math.min(1, node.opacity * TIER_OPACITY[tier]),
      });
    }),
  );
}

export function deriveNexoraMVPWorkspacePresentation(
  presentation: NexoraMVPStageInteractionPresentation,
  workspace: NexoraMVPWorkspaceKind,
): NexoraMVPStageInteractionPresentation {
  return Object.freeze({
    ...presentation,
    contextNodes: applyNexoraMVPWorkspaceContextEmphasis(
      presentation.contextNodes,
      workspace,
    ),
  });
}

/**
 * Visual tokens for scene environment intents.
 * HEX/lighting values live here (presentation), not in NEX-MVP:1 contracts.
 */
export function deriveNexoraMVPSceneEnvironmentVisualState(
  intent: NexoraMVPSceneEnvironmentIntent,
  options?: {
    readonly reducedMotion?: boolean;
    readonly uiTheme?: "day" | "night";
  },
): NexoraMVPSceneEnvironmentVisualState {
  const transitionMs = options?.reducedMotion
    ? NEXORA_MVP_WORKSPACE_TRANSITION_MS_REDUCED
    : NEXORA_MVP_WORKSPACE_TRANSITION_MS;
  const resolvedIntent: NexoraMVPSceneEnvironmentIntent =
    intent in NEXORA_MVP_SCENE_ENVIRONMENT_ATMOSPHERE ? intent : "neutral";
  const palette =
    options?.uiTheme === "day"
      ? NEXORA_MVP_SCENE_ENVIRONMENT_ATMOSPHERE_DAY
      : NEXORA_MVP_SCENE_ENVIRONMENT_ATMOSPHERE;
  const tokens = palette[resolvedIntent];
  return Object.freeze({
    intent: resolvedIntent,
    ...tokens,
    transitionMs,
  });
}

export function verifyNexoraMVPWorkspaceDialSceneState(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly orderValid: boolean;
  readonly environmentMapValid: boolean;
  readonly edgePolicyValid: boolean;
  readonly determinismValid: boolean;
}> {
  const identity = getNexoraMVPWorkspaceDialSceneStateIdentity();
  const order = getNexoraMVPWorkspaceOrder();
  const identityValid =
    identity.id === "NEX-MVP:5/NexoraWorkspaceDialSceneState" &&
    identity.version === "1.5.0" &&
    identity.namespace === "nexora.mvp.workspace-dial-scene-state";

  const orderValid =
    order.join(",") === "overview,problem,scenario,decision,execution";

  const environmentMapValid =
    getNexoraMVPSceneEnvironmentIntent("overview") === "neutral" &&
    getNexoraMVPSceneEnvironmentIntent("problem") === "investigate" &&
    getNexoraMVPSceneEnvironmentIntent("scenario") === "simulate" &&
    getNexoraMVPSceneEnvironmentIntent("decision") === "commit" &&
    getNexoraMVPSceneEnvironmentIntent("execution") === "execute";

  const edgePolicyValid =
    resolveNexoraMVPPreviousWorkspace("overview") === null &&
    resolveNexoraMVPNextWorkspace("execution") === null &&
    NEXORA_MVP_WORKSPACE_DIAL_EDGE_POLICY === "stop-at-ends";

  const a = deriveNexoraMVPSceneEnvironmentVisualState("simulate");
  const b = deriveNexoraMVPSceneEnvironmentVisualState("simulate");
  const determinismValid = JSON.stringify(a) === JSON.stringify(b);

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    orderValid &&
    environmentMapValid &&
    edgePolicyValid &&
    determinismValid;

  return Object.freeze({
    ok,
    identityValid,
    orderValid,
    environmentMapValid,
    edgePolicyValid,
    determinismValid,
  });
}
