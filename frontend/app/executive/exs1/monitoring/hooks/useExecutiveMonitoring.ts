"use client";

import { useContext, useMemo } from "react";
import { useExecutiveMode } from "../../mode/hooks/useExecutiveMode";
import {
  filterObjectHealth,
  HEALTH_COLOR,
} from "../ExecutiveMonitoringConfig";
import { ExecutiveMonitoringContext } from "../ExecutiveMonitoringProvider";

/**
 * Executive Monitoring hook — active only when Executive Mode = Monitoring.
 */
export function useExecutiveMonitoring() {
  const ctx = useContext(ExecutiveMonitoringContext);
  if (!ctx) {
    throw new Error(
      "useExecutiveMonitoring must be used within ExecutiveMonitoringProvider",
    );
  }
  const { activeMode } = useExecutiveMode();
  const isActive = activeMode === "Monitoring";

  const visibleObjectHealth = useMemo(
    () => filterObjectHealth(ctx.objectHealth, ctx.filter, ctx.alerts),
    [ctx.objectHealth, ctx.filter, ctx.alerts],
  );

  const attentionObjects = useMemo(
    () => ctx.objectHealth.filter((o) => o.needsAttention),
    [ctx.objectHealth],
  );

  const healthByObjectId = useMemo(() => {
    const map = new Map(
      ctx.objectHealth.map((o) => [o.objectId, o] as const),
    );
    return map;
  }, [ctx.objectHealth]);

  const healthAccent = HEALTH_COLOR[ctx.executiveHealth];

  return {
    ...ctx,
    isActive,
    activeMode,
    visibleObjectHealth,
    attentionObjects,
    healthByObjectId,
    healthAccent,
  };
}
