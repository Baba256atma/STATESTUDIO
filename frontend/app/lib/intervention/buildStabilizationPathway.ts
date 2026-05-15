import type {
  StabilizationPathwayStep,
  StrategicIntervention,
} from "./strategicInterventionTypes.ts";

const CATEGORY_ORDER: Record<StrategicIntervention["category"], number> = {
  contain_propagation: 1,
  reduce_coupling: 2,
  reduce_dependency: 3,
  diversify: 4,
  rebalance_resources: 5,
  increase_visibility: 6,
  strengthen_monitoring: 7,
  stabilize: 8,
};

export function buildStabilizationPathway(params: {
  interventions: StrategicIntervention[];
}): StabilizationPathwayStep[] {
  const interventions = Array.isArray(params.interventions) ? params.interventions : [];
  return interventions
    .slice()
    .sort((left, right) => {
      if (CATEGORY_ORDER[left.category] !== CATEGORY_ORDER[right.category]) return CATEGORY_ORDER[left.category] - CATEGORY_ORDER[right.category];
      if ((right.propagationReductionPotential ?? 0) !== (left.propagationReductionPotential ?? 0)) {
        return (right.propagationReductionPotential ?? 0) - (left.propagationReductionPotential ?? 0);
      }
      return left.id.localeCompare(right.id);
    })
    .slice(0, 3)
    .map((intervention, index) => ({
      id: `stabilization_step_${index + 1}_${intervention.id}`,
      order: index + 1,
      interventionId: intervention.id,
      title: intervention.title,
      ...(intervention.expectedImpact ? { expectedImpact: intervention.expectedImpact } : {}),
    }));
}
