"use client";

import React from "react";

import ExecutiveObjectPanel from "../panels/ExecutiveObjectPanel";
import { DomainObjectCatalogPanel } from "../domain/DomainObjectCatalogPanel";
import { RightPanelFallback } from "./RightPanelFallback";
import {
  buildExecutiveObjectPanelData,
  type ExecutiveObjectPanelData,
} from "../../lib/panels/executiveObjectPanelData";
import { devDiagnosticLog } from "../../lib/runtime/diagnosticSwitch.ts";
import type { AddObjectMenuItem } from "../../lib/domain/domainAddObjectAdapter";
import type { RightPanelView } from "../../lib/ui/right-panel/rightPanelTypes";
import {
  CHECKPOINT1_OBJECT_PANEL_VISIBILITY_TAGS,
  NEXORA_OBJECT_PANEL_VISIBILITY_LOG_PREFIX,
  resolveObjectPanelLazyObjectId,
  resolveObjectPanelLazyState,
} from "./objectPanelLazyRuntime.ts";

/**
 * DEPRECATED ARCHITECTURE:
 * `object`, `object_focus`, and `executive_object` are legacy right-panel
 * compatibility views. The canonical MVP Object Panel is scene-native on the
 * right side of the Three.js scene and must not become an MRP tab.
 * See docs/nexora-object-panel-architecture.md.
 */
export {
  CHECKPOINT1_OBJECT_PANEL_VISIBILITY_TAGS,
  NEXORA_OBJECT_PANEL_VISIBILITY_LOG_PREFIX,
  resolveObjectPanelLazyObjectId,
  resolveObjectPanelLazyState,
} from "./objectPanelLazyRuntime.ts";
export type {
  ObjectPanelLazyRenderKind,
  ObjectPanelLazyResolutionInput,
  ObjectPanelLazyResolvedState,
} from "./objectPanelLazyRuntime.ts";

export type ObjectPanelLazyProps = {
  view: RightPanelView;
  contextId?: string | null;
  selectedObjectId?: string | null;
  activeExecutiveObjectId?: string | null;
  focusedId?: string | null;
  selectedObjectLabel?: string | null;
  executiveObjectPanelData?: ExecutiveObjectPanelData | null;
  visibleSceneObjects: readonly { id?: string; name?: string }[];
  hasVisibleSceneObjects: boolean;
  domainCatalogDomainId?: unknown;
  sceneJson?: unknown;
  responseData?: unknown;
  riskPropagation?: unknown;
  onAddDomainObject?: ((item: AddObjectMenuItem) => void) | null;
};

const loggedReadonlySelectionPanels = new Set<string>();

function buildExecutivePanelData(
  objectId: string,
  props: ObjectPanelLazyProps
): ExecutiveObjectPanelData {
  return props.executiveObjectPanelData?.objectId === objectId
    ? props.executiveObjectPanelData
    : buildExecutiveObjectPanelData({
        objectId,
        objectName: props.selectedObjectLabel ?? null,
        responseData: props.responseData ?? null,
        sceneJson: props.sceneJson ?? null,
        riskPropagation: props.riskPropagation ?? null,
        canonicalRecommendation: null,
      });
}

function logReadonlySelectionObjectPanelOpen(input: {
  objectId: string;
  view: RightPanelView;
}): void {
  if (process.env.NODE_ENV === "production") return;
  const key = `${input.view ?? "none"}:${input.objectId}`;
  if (loggedReadonlySelectionPanels.has(key)) return;
  loggedReadonlySelectionPanels.add(key);
  devDiagnosticLog("objectPanelVisibility", NEXORA_OBJECT_PANEL_VISIBILITY_LOG_PREFIX, {
    reason: "readonly_selection_object_panel_open",
    objectId: input.objectId,
    view: input.view ?? null,
    tags: CHECKPOINT1_OBJECT_PANEL_VISIBILITY_TAGS,
  });
}

function ObjectPanelLazyComponent(props: ObjectPanelLazyProps): React.ReactElement {
  if (props.view === "executive_object") {
    const execObjectId = resolveObjectPanelLazyObjectId(props);
    return (
      <ExecutiveObjectPanel
        data={props.executiveObjectPanelData ?? null}
        selectedObjectId={execObjectId}
      />
    );
  }

  const panelState = resolveObjectPanelLazyState(props);

  if (panelState.renderKind === "object_context_fallback") {
    return (
      <RightPanelFallback
        title="Object Context"
        message="Selected object is not visible in the current scene. Choose a visible object or describe your system again."
      />
    );
  }

  if (panelState.renderKind === "executive_panel" && panelState.resolvedObjectId) {
    if (panelState.readonlySelectionPanelOpen) {
      logReadonlySelectionObjectPanelOpen({
        objectId: panelState.resolvedObjectId,
        view: props.view,
      });
    }
    return (
      <ExecutiveObjectPanel
        data={buildExecutivePanelData(panelState.resolvedObjectId, props)}
        selectedObjectId={panelState.resolvedObjectId}
      />
    );
  }

  if (panelState.renderKind === "no_visible_objects_fallback") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <RightPanelFallback
          title="Objects"
          message="No visible objects yet. Describe your system in chat to create the first model."
        />
        <DomainObjectCatalogPanel
          domainId={props.domainCatalogDomainId ?? "general"}
          onSelectObject={props.onAddDomainObject ?? undefined}
        />
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <RightPanelFallback
        title="Object Focus"
        message="Select a visible object to inspect focus insight."
      />
      <DomainObjectCatalogPanel
        domainId={props.domainCatalogDomainId ?? "general"}
        onSelectObject={props.onAddDomainObject ?? undefined}
      />
    </div>
  );
}

export const ObjectPanelLazy = React.memo(ObjectPanelLazyComponent);

export function resetObjectPanelLazyDiagnosticsForTests(): void {
  loggedReadonlySelectionPanels.clear();
}
