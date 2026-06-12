"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { logNexoraPanelMount, logNexoraRenderCount } from "../../lib/debug/nexoraFeedbackLoopDiagnostics";
import { devLogThrottled } from "../../lib/runtime/diagnosticThrottle";
import type { ExecutiveObjectPanelData } from "../../lib/panels/executiveObjectPanelData";
import { fallbackExecutiveData } from "../../lib/panels/executiveObjectPanelData";
import type { ExecutiveActionPanelModel } from "../../lib/object-panel/executiveActionPanelContract";
import {
  getExecutiveFocusModeServerSnapshot,
  getExecutiveFocusModeSnapshot,
  subscribeExecutiveFocusMode,
} from "../../lib/workspace/executiveFocusModeRuntime";
import ExecutiveActionPanel from "./ExecutiveActionPanel";
import { buildObjectPanelExecutiveViewModel } from "../../lib/object-panel/objectPanelExecutiveViewModel";
import { nx, softCardStyle } from "../ui/nexoraTheme";

type Props = {
  data: ExecutiveObjectPanelData | null;
  selectedObjectId: string | null;
};

function buildPanelModel(data: ExecutiveObjectPanelData): ExecutiveActionPanelModel {
  return {
    objectId: data.objectId,
    objectName: data.objectName ?? data.objectId,
    objectType: data.objectType ?? "Object",
    status: data.status ?? "Active",
    riskLevel: data.riskLevel ?? "unknown",
    connections: data.connectionCount ?? 0,
    dependencies: data.dependencyCount ?? data.affectedObjects?.length ?? 0,
    scenarios: data.scenarioCount ?? 0,
    lastUpdated: data.lastUpdated ?? "Runtime",
  };
}

export default function ExecutiveObjectPanel({ data, selectedObjectId }: Props) {
  const renderCountRef = useRef(0);
  renderCountRef.current += 1;
  const oid = String(selectedObjectId ?? "").trim();
  const focusModeActive = useSyncExternalStore(
    subscribeExecutiveFocusMode,
    () => getExecutiveFocusModeSnapshot().enabled,
    () => getExecutiveFocusModeServerSnapshot().enabled
  );

  useEffect(() => {
    logNexoraPanelMount({
      source: "ExecutiveObjectPanel",
      objectId: oid || null,
      view: "executive_object",
      contextId: oid || null,
    });
  }, [oid]);
  useEffect(() => {
    devLogThrottled({
      key: `exec-obj-panel:${oid || "none"}`,
      label: "[NEXORA_RENDER_COUNT]",
      scope: "panel",
      intervalMs: 1000,
      payload: {
        component: "ExecutiveObjectPanel",
        renderCount: renderCountRef.current,
        objectId: oid || null,
      },
    });
    logNexoraRenderCount("ExecutiveObjectPanel", renderCountRef.current, { objectId: oid || null });
  }, [oid]);

  const merged: ExecutiveObjectPanelData | null = oid
    ? {
        objectId: oid,
        objectName: data?.objectName,
        ...fallbackExecutiveData,
        ...(data && data.objectId === oid ? data : {}),
      }
    : null;

  if (!oid || !merged) {
    return (
      <div style={{ ...softCardStyle, padding: 14, color: nx.muted, fontSize: 12, lineHeight: 1.45 }}>
        Select an object to open the executive action panel.
      </div>
    );
  }

  const panelModel = buildPanelModel(merged);
  return (
    <ExecutiveActionPanel
      model={panelModel}
      focusModeActive={focusModeActive}
      view={buildObjectPanelExecutiveViewModel({ data: merged, model: panelModel })}
    />
  );
}
