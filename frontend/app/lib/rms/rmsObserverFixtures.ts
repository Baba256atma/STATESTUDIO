/**
 * NPA-T RMS:5 — test-only Observer fixtures. Do not mutate production authorities.
 */

export const RMS_OBSERVER_FIXTURE_OPERATOR_GAP = Object.freeze({
  omitFields: Object.freeze(["orders_received"]),
});

export const RMS_OBSERVER_FIXTURE_REFERENT_MISMATCH = Object.freeze({
  active: "Capacity Gap",
  nexoraSubject: "Margin Pressure",
});

export const RMS_OBSERVER_FIXTURE_GROUND_TRUTH_LEAK = Object.freeze({
  path: "unauthorized-nexora-injection",
  fact: "availableCapacity=85",
});

export const RMS_OBSERVER_FIXTURE_CAUSAL_OVERCLAIM = "Machine A definitely caused the delivery problem.";
export const RMS_OBSERVER_FIXTURE_BOUNDED_UNCERTAINTY = "The cause is not yet confirmed.";
export const RMS_OBSERVER_FIXTURE_MANAGER_LEAK_TURN = "Why did Machine A cause the delivery failure?";
