"use client";

import React from "react";

import type { MrpWorkspaceMountPlan } from "./mrpWorkspaceLoaderContract.ts";
import {
  mountMrpWorkspace,
  unmountMrpWorkspace,
} from "./mrpWorkspaceLoaderRuntime.ts";

export function useMrpWorkspaceMountLifecycle(plan: MrpWorkspaceMountPlan): void {
  React.useEffect(() => {
    mountMrpWorkspace({
      workspaceId: plan.workspaceId,
      mountKey: plan.mountKey,
    });

    return () => {
      unmountMrpWorkspace(plan.mountKey);
    };
  }, [plan.mountKey, plan.workspaceId]);
}

export default useMrpWorkspaceMountLifecycle;
