/**
 * NEX-MVP:6 — Minimum / Report / Operation presentation-state coordinator.
 *
 * Thin, pure mapping from canonical presentation state (NEX-MVP:1) into
 * executive information/action depth. Does not invent KPI/KOI/action engines.
 */

import {
  getNexoraMVPPresentationStates,
  isNexoraMVPPresentationState,
  NEXORA_MVP_PRESENTATION_STATES,
  type NexoraMVPPresentationState,
  type NexoraMVPWorkspaceKind,
  type NexoraMVPSceneEnvironmentIntent,
} from "@/app/lib/nex-mvp/nexoraMVPApplicationFoundation";
import type {
  NexoraMVPObjectInteractionState,
  NexoraMVPStageInteractionPresentation,
} from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import { syncNexoraMVPObjectInteractionShellContext } from "@/app/lib/nex-mvp/nexoraMVPObjectInteraction";
import {
  getNexoraMVPSubjectPresentationFixture,
  type NexoraMVPPresentationActionFixture,
  type NexoraMVPPresentationKoiFixture,
  type NexoraMVPPresentationKpiFixture,
  type NexoraMVPSubjectPresentationFixture,
} from "@/app/lib/nex-mvp/nexoraMVPPresentationFixtures";

// ─── Identity ───────────────────────────────────────────────────────────────

export const nexoraMVPPresentationStatesIdentity =
  "NEX-MVP:6/NexoraPresentationStates" as const;

export const nexoraMVPPresentationStatesVersion = "1.6.0" as const;

export const nexoraMVPPresentationStatesNamespace =
  "nexora.mvp.presentation-states" as const;

export const nexoraMVPPresentationStatesPhase = "PresentationStates" as const;

export const nexoraMVPPresentationStatesArchitecturalRole =
  "MVPExecutiveInformationAndActionDepthCoordinator" as const;

export const nexoraMVPPresentationStatesReadiness =
  "ReadyForAdvisorAndInsightExperience" as const;

export const nexoraMVPPresentationStatesUpstreamWorkspaceIdentity =
  "NEX-MVP:5/NexoraWorkspaceDialSceneState" as const;

export type NexoraMVPPresentationStatesIdentity = {
  readonly id: typeof nexoraMVPPresentationStatesIdentity;
  readonly version: typeof nexoraMVPPresentationStatesVersion;
  readonly namespace: typeof nexoraMVPPresentationStatesNamespace;
  readonly phase: typeof nexoraMVPPresentationStatesPhase;
  readonly architecturalRole: typeof nexoraMVPPresentationStatesArchitecturalRole;
};

const IDENTITY: NexoraMVPPresentationStatesIdentity = Object.freeze({
  id: nexoraMVPPresentationStatesIdentity,
  version: nexoraMVPPresentationStatesVersion,
  namespace: nexoraMVPPresentationStatesNamespace,
  phase: nexoraMVPPresentationStatesPhase,
  architecturalRole: nexoraMVPPresentationStatesArchitecturalRole,
});

export function getNexoraMVPPresentationStatesIdentity(): NexoraMVPPresentationStatesIdentity {
  return IDENTITY;
}

export const NEXORA_MVP_PRESENTATION_TRANSITION_MS = 320 as const;
export const NEXORA_MVP_PRESENTATION_TRANSITION_MS_REDUCED = 60 as const;

export const NEXORA_MVP_PRESENTATION_STATE_BOUNDARY = Object.freeze({
  architecturalRole: nexoraMVPPresentationStatesArchitecturalRole,
  ownsPresentationAuthority: false as const,
  duplicatesPresentationResolver: false as const,
  inventsKpiEngine: false as const,
  inventsKoiEngine: false as const,
  inventsDomainActions: false as const,
  workspaceCoupledToPresentation: false as const,
});

// ─── Capabilities & view model ──────────────────────────────────────────────

export type NexoraMVPPresentationCapability = {
  readonly minimum: true;
  readonly report: boolean;
  readonly operation: boolean;
};

export type NexoraMVPPresentationAvailableAction = {
  readonly id: string;
  readonly label: string;
  readonly kind: NexoraMVPPresentationActionFixture["kind"];
  readonly available: boolean;
  readonly disabledReason?: string;
  readonly targetSubjectId?: string;
  readonly panelKind?: NexoraMVPPresentationActionFixture["panelKind"];
};

export type NexoraMVPPresentationViewModel = {
  readonly state: NexoraMVPPresentationState;
  readonly subjectId: string | null;
  readonly subjectKind: string | null;
  readonly subjectLabel: string | null;
  readonly essentialStatus: string | null;
  readonly showEssentialStatus: boolean;
  readonly showKPIs: boolean;
  readonly showKOI: boolean;
  readonly showRelationships: boolean;
  readonly showExecutiveSummary: boolean;
  readonly showActions: boolean;
  readonly showReportSurface: boolean;
  readonly showOperationSurface: boolean;
  readonly primaryKpi: NexoraMVPPresentationKpiFixture | null;
  readonly secondaryKpis: readonly NexoraMVPPresentationKpiFixture[];
  readonly koi: NexoraMVPPresentationKoiFixture | null;
  readonly summary: string | null;
  readonly relationships: readonly {
    readonly id: string;
    readonly label: string;
    readonly relation: string;
  }[];
  readonly availableActions: readonly NexoraMVPPresentationAvailableAction[];
  readonly capability: NexoraMVPPresentationCapability;
  readonly workspace: NexoraMVPWorkspaceKind;
  readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
};

export type NexoraMVPPresentationStateChangeResult =
  | {
      readonly ok: true;
      readonly presentationState: NexoraMVPPresentationState;
      readonly changed: boolean;
      readonly workspace: NexoraMVPWorkspaceKind;
      readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
    }
  | {
      readonly ok: false;
      readonly reason: "invalid-presentation-state" | "unsupported-for-subject";
    };

export function getNexoraMVPPresentationStateOrder(): readonly NexoraMVPPresentationState[] {
  return getNexoraMVPPresentationStates();
}

export function resolveNexoraMVPPresentationCapability(
  subjectId: string | null,
): NexoraMVPPresentationCapability {
  const fixture = getNexoraMVPSubjectPresentationFixture(subjectId);
  if (fixture == null) {
    return Object.freeze({
      minimum: true,
      report: subjectId != null,
      operation: false,
    });
  }
  return Object.freeze({
    minimum: true,
    report: fixture.supportsReport,
    operation:
      fixture.supportsOperation &&
      fixture.actions.some((action) => action.available),
  });
}

/**
 * Resolve presentation-state change intent.
 * Preserves workspace and environment; rejects invalid literals.
 * If Operation is unsupported for the subject, falls back to Report when possible.
 */
export function resolveNexoraMVPPresentationStateChange(input: {
  readonly targetPresentationState: unknown;
  readonly currentPresentationState: NexoraMVPPresentationState;
  readonly workspace: NexoraMVPWorkspaceKind;
  readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
  readonly subjectId: string | null;
}): NexoraMVPPresentationStateChangeResult {
  if (!isNexoraMVPPresentationState(input.targetPresentationState)) {
    return Object.freeze({
      ok: false,
      reason: "invalid-presentation-state",
    });
  }

  let nextState = input.targetPresentationState;
  const capability = resolveNexoraMVPPresentationCapability(input.subjectId);

  if (nextState === "operation" && !capability.operation) {
    if (capability.report) {
      nextState = "report";
    } else {
      return Object.freeze({
        ok: false,
        reason: "unsupported-for-subject",
      });
    }
  }

  if (nextState === "report" && !capability.report && input.subjectId != null) {
    nextState = "minimum";
  }

  return Object.freeze({
    ok: true,
    presentationState: nextState,
    changed: nextState !== input.currentPresentationState,
    workspace: input.workspace,
    environmentIntent: input.environmentIntent,
  });
}

export function applyNexoraMVPPresentationStateChange(
  state: NexoraMVPObjectInteractionState,
  targetPresentationState: unknown,
): NexoraMVPObjectInteractionState {
  const resolved = resolveNexoraMVPPresentationStateChange({
    targetPresentationState,
    currentPresentationState: state.presentationState,
    workspace: state.workspace,
    environmentIntent: state.environmentIntent,
    subjectId: state.focusedSubject?.id ?? state.selectedSubject?.id ?? null,
  });
  if (!resolved.ok) return state;

  return syncNexoraMVPObjectInteractionShellContext(state, {
    workspace: resolved.workspace,
    presentationState: resolved.presentationState,
    environmentIntent: resolved.environmentIntent,
  });
}

function deriveActions(
  fixture: NexoraMVPSubjectPresentationFixture | null,
  state: NexoraMVPPresentationState,
): readonly NexoraMVPPresentationAvailableAction[] {
  if (state !== "operation" || fixture == null) return Object.freeze([]);
  return Object.freeze(
    fixture.actions.map((action) =>
      Object.freeze({
        id: action.id,
        label: action.label,
        kind: action.kind,
        available: action.available,
        disabledReason: action.disabledReason,
        targetSubjectId: action.targetSubjectId,
        panelKind: action.panelKind,
      }),
    ),
  );
}

/**
 * Derive presentation view model for DOM Report/Operation surfaces.
 */
export function deriveNexoraMVPPresentationViewModel(input: {
  readonly presentationState: NexoraMVPPresentationState;
  readonly workspace: NexoraMVPWorkspaceKind;
  readonly environmentIntent: NexoraMVPSceneEnvironmentIntent;
  readonly subjectId: string | null;
  readonly subjectKind: string | null;
  readonly subjectLabel: string | null;
}): NexoraMVPPresentationViewModel {
  const fixture = getNexoraMVPSubjectPresentationFixture(input.subjectId);
  const capability = resolveNexoraMVPPresentationCapability(input.subjectId);
  const state = input.presentationState;

  const showReportSurface =
    state === "report" &&
    input.subjectId != null &&
    capability.report;

  const showOperationSurface =
    state === "operation" &&
    input.subjectId != null &&
    capability.operation;

  const primaryKpi = fixture?.primaryKpi ?? null;
  const koi = fixture?.koi ?? null;
  const relationships = fixture?.relationships ?? Object.freeze([]);
  const summary = fixture?.summary ?? null;

  return Object.freeze({
    state,
    subjectId: input.subjectId,
    subjectKind: input.subjectKind ?? fixture?.subjectKind ?? null,
    subjectLabel: input.subjectLabel,
    essentialStatus: fixture?.essentialStatus ?? null,
    showEssentialStatus: state !== "minimum" || input.subjectId != null,
    showKPIs:
      (state === "minimum" && primaryKpi != null && input.subjectId != null) ||
      ((state === "report" || state === "operation") && primaryKpi != null),
    showKOI: (state === "report" || state === "operation") && koi != null,
    showRelationships:
      (state === "report" || state === "operation") &&
      relationships.length > 0,
    showExecutiveSummary:
      (state === "report" || state === "operation") && summary != null,
    showActions: showOperationSurface,
    showReportSurface: showReportSurface || showOperationSurface,
    showOperationSurface,
    primaryKpi: state === "minimum" ? primaryKpi : primaryKpi,
    secondaryKpis:
      state === "minimum"
        ? Object.freeze([])
        : Object.freeze(fixture?.secondaryKpis ?? []),
    koi: state === "minimum" ? null : koi,
    summary: state === "minimum" ? null : summary,
    relationships: state === "minimum" ? Object.freeze([]) : relationships,
    availableActions: deriveActions(fixture, state),
    capability,
    workspace: input.workspace,
    environmentIntent: input.environmentIntent,
  });
}

/**
 * Apply presentation-depth density to Stage presentation (labels / subordination).
 * Does not remount or rebuild geometry identities.
 */
export function applyNexoraMVPPresentationDensity(
  presentation: NexoraMVPStageInteractionPresentation,
  presentationState: NexoraMVPPresentationState,
): NexoraMVPStageInteractionPresentation {
  const objects = Object.freeze(
    presentation.scene.objects.map((object) => {
      // SP:4.1B — density must not resurrect disclosure-hidden subjects.
      if (object.disclosureState === "hidden") {
        return Object.freeze({
          ...object,
          opacity: 0,
          labelProminence: "minimal" as const,
          labelVisible: false,
          interactive: false,
        });
      }
      if (object.disclosureState === "background-discoverable") {
        return Object.freeze({
          ...object,
          labelProminence: "minimal" as const,
          opacity: Math.min(object.opacity, 0.48),
        });
      }

      if (presentationState === "minimum") {
        if (object.role === "focused") {
          return Object.freeze({
            ...object,
            labelProminence: "full" as const,
            scale: object.scale,
          });
        }
        if (object.role === "related") {
          return Object.freeze({
            ...object,
            labelProminence: "minimal" as const,
            opacity: Math.min(object.opacity, 0.85),
          });
        }
        if (object.role === "unrelated") {
          return Object.freeze({
            ...object,
            labelProminence: "minimal" as const,
            opacity: Math.min(object.opacity, 0.22),
          });
        }
        return Object.freeze({
          ...object,
          labelProminence: "reduced" as const,
        });
      }

      if (presentationState === "report") {
        if (object.role === "focused" || object.role === "related") {
          return Object.freeze({
            ...object,
            labelProminence:
              object.role === "focused"
                ? ("full" as const)
                : ("reduced" as const),
          });
        }
        return object;
      }

      // operation — emphasize actionable focus; soften non-actionable clutter
      if (object.role === "focused") {
        return Object.freeze({
          ...object,
          labelProminence: "full" as const,
          scale: object.scale * 1.02,
        });
      }
      if (object.role === "related") {
        return Object.freeze({
          ...object,
          labelProminence: "reduced" as const,
          opacity: Math.max(object.opacity, 0.8),
        });
      }
      if (object.role === "unrelated") {
        return Object.freeze({
          ...object,
          labelProminence: "minimal" as const,
          opacity: Math.min(object.opacity, 0.16),
          scale: object.scale * 0.96,
        });
      }
      return object;
    }),
  );

  const contextNodes = Object.freeze(
    presentation.contextNodes
      .filter((node) => node.disclosureState !== "hidden")
      .map((node) => {
        if (presentationState === "minimum") {
          return Object.freeze({
            ...node,
            opacity: Math.min(
              node.opacity,
              node.role === "focused" || node.role === "collapsed-thread"
                ? 1
                : 0.7,
            ),
            scale:
              node.role === "focused" || node.role === "collapsed-thread"
                ? node.scale
                : node.scale * 0.92,
          });
        }
        if (presentationState === "operation" && node.role === "context") {
          return Object.freeze({
            ...node,
            opacity: Math.min(node.opacity, 0.85),
          });
        }
        return node;
      }),
  );

  return Object.freeze({
    ...presentation,
    scene: Object.freeze({
      ...presentation.scene,
      presentationState,
      objects,
    }),
    contextNodes,
  });
}

export function verifyNexoraMVPPresentationStates(options?: {
  readonly forceFailure?: boolean;
}): Readonly<{
  readonly ok: boolean;
  readonly identityValid: boolean;
  readonly orderValid: boolean;
  readonly defaultMinimumValid: boolean;
  readonly determinismValid: boolean;
}> {
  const identity = getNexoraMVPPresentationStatesIdentity();
  const identityValid =
    identity.id === "NEX-MVP:6/NexoraPresentationStates" &&
    identity.version === "1.6.0" &&
    identity.namespace === "nexora.mvp.presentation-states";

  const order = getNexoraMVPPresentationStateOrder();
  const orderValid =
    order.join(",") === "minimum,report,operation" &&
    NEXORA_MVP_PRESENTATION_STATES[0] === "minimum";

  const defaultMinimumValid = order[0] === "minimum";

  const a = deriveNexoraMVPPresentationViewModel({
    presentationState: "report",
    workspace: "scenario",
    environmentIntent: "simulate",
    subjectId: "obj-capacity",
    subjectKind: "object",
    subjectLabel: "Capacity",
  });
  const b = deriveNexoraMVPPresentationViewModel({
    presentationState: "report",
    workspace: "scenario",
    environmentIntent: "simulate",
    subjectId: "obj-capacity",
    subjectKind: "object",
    subjectLabel: "Capacity",
  });
  const determinismValid = JSON.stringify(a) === JSON.stringify(b);

  const ok =
    options?.forceFailure !== true &&
    identityValid &&
    orderValid &&
    defaultMinimumValid &&
    determinismValid;

  return Object.freeze({
    ok,
    identityValid,
    orderValid,
    defaultMinimumValid,
    determinismValid,
  });
}
