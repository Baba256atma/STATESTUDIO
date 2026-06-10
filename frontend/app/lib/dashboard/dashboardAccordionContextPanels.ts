/**
 * Context-aware accordion panel generation.
 * Dashboard Context Router activation may open multiple coordinated panels.
 */

import type { DashboardContext } from "../ui/mainRightPanelContract.ts";
import type { NormalizedDashboardContext } from "./dashboardContextTypes.ts";
import type {
  DashboardAccordionExpansionState,
  DashboardAccordionPanelContract,
  DashboardAccordionPanelType,
} from "./dashboardAccordionPanelContract.ts";
import {
  getDashboardAccordionRegistryEntry,
  resolveAccordionPanelTitle,
} from "./dashboardAccordionRegistry.ts";
import { reportAccordionPanel, reportPanelPriority } from "./dashboardAccordionLogging.ts";
import { measureDashboardOperation } from "./dashboardPerformanceMetrics.ts";
import { resolveDashboardSurfaceVisualBundle } from "./dashboardVisualSignalResolver.ts";

const accordionPanelStructureCache = new Map<string, readonly DashboardAccordionPanelContract[]>();

export type DashboardAccordionContextPreset = Readonly<{
  panelTypes: readonly DashboardAccordionPanelType[];
  defaultExpanded: readonly DashboardAccordionPanelType[];
}>;

/** Context presets — a single executive action may activate multiple panels. */
export const DASHBOARD_ACCORDION_CONTEXT_PRESETS = Object.freeze({
  overview: Object.freeze({
    panelTypes: ["executive_summary", "operational", "risk"] as const satisfies readonly DashboardAccordionPanelType[],
    defaultExpanded: ["executive_summary"] as const satisfies readonly DashboardAccordionPanelType[],
  }),
  sources: Object.freeze({
    panelTypes: ["operational", "executive_summary", "risk"] as const satisfies readonly DashboardAccordionPanelType[],
    defaultExpanded: ["operational"] as const satisfies readonly DashboardAccordionPanelType[],
  }),
  scenario: Object.freeze({
    panelTypes: ["scenario", "risk", "executive_summary"] as const satisfies readonly DashboardAccordionPanelType[],
    defaultExpanded: ["scenario"] as const satisfies readonly DashboardAccordionPanelType[],
  }),
  risk: Object.freeze({
    panelTypes: ["risk", "operational", "executive_summary"] as const satisfies readonly DashboardAccordionPanelType[],
    defaultExpanded: ["risk"] as const satisfies readonly DashboardAccordionPanelType[],
  }),
  war_room: Object.freeze({
    panelTypes: ["war_room", "decision_guidance", "governance", "strategic_alignment", "policy_constraint", "stakeholder_intelligence", "consensus_intelligence", "institutional_alignment", "decision", "operational", "risk", "timeline", "scenario", "executive_summary"] as const satisfies readonly DashboardAccordionPanelType[],
    defaultExpanded: ["war_room", "decision_guidance", "governance", "strategic_alignment", "policy_constraint", "stakeholder_intelligence", "operational"] as const satisfies readonly DashboardAccordionPanelType[],
  }),
  timeline: Object.freeze({
    panelTypes: ["timeline", "decision_guidance", "governance", "strategic_alignment", "policy_constraint", "stakeholder_intelligence", "consensus_intelligence", "institutional_alignment", "decision", "executive_summary"] as const satisfies readonly DashboardAccordionPanelType[],
    defaultExpanded: ["timeline", "decision_guidance", "governance", "strategic_alignment"] as const satisfies readonly DashboardAccordionPanelType[],
  }),
  settings: Object.freeze({
    panelTypes: ["operational", "executive_summary"] as const satisfies readonly DashboardAccordionPanelType[],
    defaultExpanded: ["operational"] as const satisfies readonly DashboardAccordionPanelType[],
  }),
}) satisfies Readonly<Record<DashboardContext, DashboardAccordionContextPreset>>;

function resolveExpansionState(
  panelType: DashboardAccordionPanelType,
  panelId: string,
  preset: DashboardAccordionContextPreset,
  persisted: Readonly<Record<string, DashboardAccordionExpansionState>>
): DashboardAccordionExpansionState {
  if (persisted[panelId]) return persisted[panelId];
  return preset.defaultExpanded.includes(panelType) ? "expanded" : "collapsed";
}

function resolveBodySlot(panelType: DashboardAccordionPanelType): DashboardAccordionPanelContract["bodySlot"] {
  if (panelType === "executive_summary") return "executive_delegate";
  if (panelType === "operational") return "operational_intelligence";
  if (panelType === "risk") return "risk_intelligence";
  if (panelType === "timeline") return "timeline_intelligence";
  if (panelType === "scenario") return "scenario_intelligence";
  if (panelType === "war_room") return "war_room_intelligence";
  if (panelType === "decision") return "executive_advisory";
  if (panelType === "decision_guidance") return "decision_guidance";
  if (panelType === "governance") return "governance_intelligence";
  if (panelType === "strategic_alignment") return "strategic_alignment_intelligence";
  if (panelType === "policy_constraint") return "policy_constraint_intelligence";
  if (panelType === "stakeholder_intelligence") return "stakeholder_intelligence";
  if (panelType === "consensus_intelligence") return "consensus_intelligence";
  if (panelType === "institutional_alignment") return "institutional_alignment";
  return "visual_signal";
}

function buildAccordionPanelStructureCacheKey(input: {
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  contextSignature: string;
}): string {
  return `${input.contextSignature}:${input.dashboardContext}:${input.normalizedContext?.id ?? "none"}:${input.normalizedContext?.surfaceId ?? "none"}`;
}

function applyExpansionToPanels(
  panels: readonly DashboardAccordionPanelContract[],
  persistedExpansion: Readonly<Record<string, DashboardAccordionExpansionState>>,
  preset: DashboardAccordionContextPreset
): DashboardAccordionPanelContract[] {
  return panels.map((panel) => {
    const expansionState = persistedExpansion[panel.panelId]
      ? persistedExpansion[panel.panelId]
      : preset.defaultExpanded.includes(panel.panelType)
        ? "expanded"
        : "collapsed";
    if (expansionState === panel.expansionState) return panel;
    return Object.freeze({ ...panel, expansionState });
  });
}

export function buildAccordionPanelsFromContext(input: {
  dashboardContext: DashboardContext;
  normalizedContext: NormalizedDashboardContext | null;
  persistedExpansion: Readonly<Record<string, DashboardAccordionExpansionState>>;
  contextSignature: string;
}): DashboardAccordionPanelContract[] {
  return measureDashboardOperation(
    "accordionUpdate",
    () => {
      const structureCacheKey = buildAccordionPanelStructureCacheKey(input);
      const cachedStructure = accordionPanelStructureCache.get(structureCacheKey);
      if (cachedStructure) {
        const preset =
          DASHBOARD_ACCORDION_CONTEXT_PRESETS[input.dashboardContext] ?? DASHBOARD_ACCORDION_CONTEXT_PRESETS.overview;
        return applyExpansionToPanels(cachedStructure, input.persistedExpansion, preset);
      }

      const preset =
        DASHBOARD_ACCORDION_CONTEXT_PRESETS[input.dashboardContext] ?? DASHBOARD_ACCORDION_CONTEXT_PRESETS.overview;
      const normalized = input.normalizedContext;

      const panels = preset.panelTypes.map((panelType) => {
    const registryEntry = getDashboardAccordionRegistryEntry(panelType);
    const panelId = `accordion:${panelType}:${input.contextSignature}`;
    const expansionState = resolveExpansionState(panelType, panelId, preset, input.persistedExpansion);

    let priority = registryEntry.defaultPriority;
    if (normalized?.surfaceId === panelType) priority += 5;
    if (normalized?.category === panelType) priority += 3;

    const visualBundle = resolveDashboardSurfaceVisualBundle({
      panelType,
      dashboardContext: input.dashboardContext,
      normalizedContext: normalized,
    });

    const panel: DashboardAccordionPanelContract = Object.freeze({
      panelId,
      panelType,
      priority,
      header: Object.freeze({
        title: resolveAccordionPanelTitle(panelType),
        status: visualBundle.statusIndicator,
        summary: visualBundle.impactCard.headline,
        indicators: registryEntry.defaultIndicators,
        iconKey: registryEntry.iconKey,
      }),
      visualBundle,
      panelContext: Object.freeze({
        dashboardContext: input.dashboardContext,
        normalizedContextId: normalized?.id ?? null,
        objectId: normalized?.objectId ?? null,
        scenarioId: normalized?.scenarioId ?? null,
        reason: normalized?.reason ?? null,
      }),
      expansionState,
      bodySlot: resolveBodySlot(panelType),
    });

        return panel;
      });

      const ordered = [...panels].sort((left, right) => right.priority - left.priority);
      accordionPanelStructureCache.set(structureCacheKey, Object.freeze(ordered));

      ordered.forEach((panel, orderIndex) => {
        reportAccordionPanel({
          panelId: panel.panelId,
          panelType: panel.panelType,
          priority: panel.priority,
          expansionState: panel.expansionState,
          contextSignature: input.contextSignature,
        });
        reportPanelPriority({
          panelId: panel.panelId,
          panelType: panel.panelType,
          priority: panel.priority,
          orderIndex,
          contextSignature: input.contextSignature,
        });
      });

      return applyExpansionToPanels(ordered, input.persistedExpansion, preset);
    },
    { phase: "build_accordion_panels", contextSignature: input.contextSignature }
  );
}

export function resetDashboardAccordionPanelCacheForTests(): void {
  accordionPanelStructureCache.clear();
}

export function listAccordionPanelTypesForContext(dashboardContext: DashboardContext): readonly DashboardAccordionPanelType[] {
  return DASHBOARD_ACCORDION_CONTEXT_PRESETS[dashboardContext]?.panelTypes ?? DASHBOARD_ACCORDION_CONTEXT_PRESETS.overview.panelTypes;
}
