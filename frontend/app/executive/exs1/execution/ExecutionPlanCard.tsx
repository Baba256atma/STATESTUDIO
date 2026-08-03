"use client";

import type { ExecutionPlan } from "./ExecutionConfig";
import { overallProgress } from "./ExecutionConfig";
import { ExecutionProgressRing } from "./ExecutionProgressRing";
import { cockpit } from "../shell/executiveCockpitTheme";

type Props = {
  readonly plan: ExecutionPlan;
};

/**
 * ExecutionPlanCard — parent plan for all execution tasks.
 */
export function ExecutionPlanCard({ plan }: Props) {
  const progress = overallProgress(plan.tasks);

  return (
    <article
      data-testid="execution-plan-card"
      data-status={plan.status}
      style={{
        padding: "0.7rem 0.75rem",
        borderRadius: "0.5rem",
        border: "1px solid rgba(18, 183, 106, 0.45)",
        background: "rgba(18, 183, 106, 0.08)",
        display: "flex",
        gap: "0.65rem",
        alignItems: "center",
      }}
    >
      <ExecutionProgressRing progress={progress} color="#12B76A" size={42} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontSize: "0.56rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: cockpit.lowMuted,
          }}
        >
          Execution Plan
        </p>
        <strong
          data-testid="execution-plan-name"
          style={{
            display: "block",
            marginTop: "0.2rem",
            fontSize: "0.9rem",
            color: "#12B76A",
          }}
        >
          {plan.name}
        </strong>
        <p
          style={{
            margin: "0.25rem 0 0",
            fontSize: "0.68rem",
            color: cockpit.muted,
          }}
        >
          From Decision · {plan.decisionName} · {plan.status}
        </p>
      </div>
    </article>
  );
}
