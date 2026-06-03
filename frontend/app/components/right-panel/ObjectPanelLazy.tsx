"use client";

import React from "react";

import FocusInsightCard from "../panels/FocusInsightCard";
import ExecutiveObjectPanel from "../panels/ExecutiveObjectPanel";
import { DomainObjectCatalogPanel } from "../domain/DomainObjectCatalogPanel";
import { RightPanelFallback } from "./RightPanelFallback";
import type { ExecutiveObjectPanelData } from "../../lib/panels/executiveObjectPanelData";
import type { AddObjectMenuItem } from "../../lib/domain/domainAddObjectAdapter";
import type { RightPanelView } from "../../lib/ui/right-panel/rightPanelTypes";

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

function ObjectPanelLazyComponent(props: ObjectPanelLazyProps): React.ReactElement {
  if (props.view === "executive_object") {
    const execObjectId = String(
      props.contextId ?? props.activeExecutiveObjectId ?? props.selectedObjectId ?? ""
    ).trim();
    return (
      <ExecutiveObjectPanel
        data={props.executiveObjectPanelData ?? null}
        selectedObjectId={execObjectId || null}
      />
    );
  }

  const objectListForPanel = props.hasVisibleSceneObjects ? props.visibleSceneObjects : [];
  if (objectListForPanel.length === 0) {
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

  const visibleIds = new Set(
    objectListForPanel
      .map((obj) => String(obj?.id ?? "").trim())
      .filter(Boolean)
  );
  const focusObjectId = String(
    props.activeExecutiveObjectId ?? props.selectedObjectId ?? props.focusedId ?? props.contextId ?? ""
  ).trim();

  if (focusObjectId && !visibleIds.has(focusObjectId)) {
    return (
      <RightPanelFallback
        title="Object Context"
        message="Selected object is not visible in the current scene. Choose a visible object or describe your system again."
      />
    );
  }

  if (!focusObjectId) {
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

  return (
    <FocusInsightCard
      selectedObjectId={focusObjectId}
      selectedObjectLabel={props.selectedObjectLabel ?? null}
      responseData={props.responseData ?? props.sceneJson ?? null}
      sceneJson={props.sceneJson ?? null}
      riskPropagation={props.riskPropagation ?? null}
    />
  );
}

export const ObjectPanelLazy = React.memo(ObjectPanelLazyComponent);
