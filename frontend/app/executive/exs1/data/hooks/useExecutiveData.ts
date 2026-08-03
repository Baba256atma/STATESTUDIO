"use client";

import { useContext, useMemo } from "react";
import { filterSources } from "../ExecutiveDataConfig";
import { ExecutiveDataContext } from "../ExecutiveDataProvider";

/**
 * Executive Data hook — active when Left Nav → Data opens the catalog.
 */
export function useExecutiveData() {
  const ctx = useContext(ExecutiveDataContext);
  if (!ctx) {
    throw new Error(
      "useExecutiveData must be used within ExecutiveDataProvider",
    );
  }

  const visibleSources = useMemo(
    () => filterSources(ctx.sources, ctx.filter, ctx.query),
    [ctx.sources, ctx.filter, ctx.query],
  );

  const selectedMappings = useMemo(
    () =>
      ctx.mappings.filter((m) =>
        ctx.selectedSourceId ? m.sourceId === ctx.selectedSourceId : true,
      ),
    [ctx.mappings, ctx.selectedSourceId],
  );

  const connectedCount = ctx.sources.filter(
    (s) => s.status === "Connected",
  ).length;
  const warningCount = ctx.sources.filter(
    (s) => s.status === "Warning" || s.health === "Warning",
  ).length;

  return {
    ...ctx,
    isActive: ctx.experienceActive,
    visibleSources,
    selectedMappings,
    connectedCount,
    warningCount,
  };
}
