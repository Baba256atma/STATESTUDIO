import corePlans from "../../config/plans/plans.core.json";
import demoPlan from "../../config/customers/demo/plan.json";

export type FeatureKey =
  | "kpi_core"
  | "loops_core"
  | "kpi_custom"
  | "loops_custom"
  | "kpi_explain"
  | "kpi_triggers"
  | "decision_compare";

type PlanKey = "free" | "pro";

type CorePlansJson = {
  plans?: Record<
    string,
    {
      label?: string;
      features?: Partial<Record<FeatureKey, boolean>>;
    }
  >;
};

type DemoPlanJson = { plan?: string };

const envPlan = (process.env.NEXT_PUBLIC_PLAN || "").toLowerCase();

const getCustomerKey = () => (process.env.NEXT_PUBLIC_CUSTOMER || "demo").toLowerCase();

const getConfiguredPlan = (): string => {
  const customerKey = getCustomerKey();
  if (customerKey === "demo") {
    const plan = (demoPlan as DemoPlanJson).plan;
    if (typeof plan === "string" && plan.trim()) return plan.toLowerCase();
  }
  if (envPlan) return envPlan;
  return "free";
};

const resolvePlanKey = (): PlanKey => {
  const configured = getConfiguredPlan();
  const plans = (corePlans as CorePlansJson).plans ?? {};
  if (configured in plans) return configured as PlanKey;
  return "free";
};

export function getActivePlanKey(): PlanKey {
  return resolvePlanKey();
}

export function getActivePlanLabel(): string {
  const plans = (corePlans as CorePlansJson).plans ?? {};
  const plan = plans[getActivePlanKey()];
  if (plan?.label) return plan.label;
  return getActivePlanKey().toUpperCase();
}

export function hasFeature(feature: FeatureKey): boolean {
  const plans = (corePlans as CorePlansJson).plans ?? {};
  const plan = plans[getActivePlanKey()];
  return Boolean(plan?.features?.[feature]);
}
