/**
 * Domain-bucketed demo actions for the left-nav Demo menu.
 * Reuses chat ingestion + scenario reload + panel routing (no new contracts).
 */

export type NexoraDomainDemoBucket = "retail" | "cyber" | "finance" | "general";

export function getNexoraDomainDemoBucket(domainId: string | null | undefined): NexoraDomainDemoBucket {
  const d = String(domainId ?? "").toLowerCase();
  if (d.includes("cyber") || d.includes("security") || d.includes("sec_ops")) return "cyber";
  if (d.includes("finance")) return "finance";
  if (
    d.includes("retail") ||
    d.includes("commerce") ||
    d.includes("supply") ||
    d === "business" ||
    d.includes("business")
  ) {
    return "retail";
  }
  return "general";
}

export type NexoraDomainDemoAction = { id: string; label: string; run: () => void };

type NexoraDomainDemoApi = {
  reloadScenario: () => void;
  submitAnalystPrompt: (text: string) => void;
  openFragility: () => void;
};

export function createNexoraDomainDemoActions(
  bucket: NexoraDomainDemoBucket,
  api: NexoraDomainDemoApi
): NexoraDomainDemoAction[] {
  const common: NexoraDomainDemoAction[] = [
    { id: "reload", label: "Reload demo scenario", run: api.reloadScenario },
  ];

  switch (bucket) {
    case "retail":
      return [
        ...common,
        {
          id: "delay",
          label: "Inject supplier delay",
          run: () =>
            api.submitAnalystPrompt(
              "A key supplier just delayed shipment by two weeks. Model impact on delivery and inventory."
            ),
        },
        {
          id: "inventory",
          label: "Simulate inventory shortage",
          run: () =>
            api.submitAnalystPrompt("Simulate a sudden inventory shortage at the main distribution center."),
        },
        { id: "fragility", label: "Open fragility scan", run: api.openFragility },
      ];
    case "cyber":
      return [
        ...common,
        {
          id: "attack",
          label: "Simulate attack",
          run: () =>
            api.submitAnalystPrompt(
              "Simulate an active lateral movement attempt in the production environment."
            ),
        },
        {
          id: "breach",
          label: "Trigger breach signal",
          run: () =>
            api.submitAnalystPrompt(
              "Trigger breach readiness and executive escalation for suspected data exfiltration."
            ),
        },
      ];
    case "finance":
      return [
        ...common,
        {
          id: "liquidity",
          label: "Stress liquidity",
          run: () =>
            api.submitAnalystPrompt(
              "Stress short-term liquidity under a sudden covenant tightening scenario."
            ),
        },
      ];
    default:
      return [
        ...common,
        {
          id: "pressure",
          label: "Frame system pressure",
          run: () =>
            api.submitAnalystPrompt(
              "Where is the system most fragile right now and what should we watch next?"
            ),
        },
      ];
  }
}
