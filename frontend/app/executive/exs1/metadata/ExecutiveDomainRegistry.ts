/**
 * Phase A — Executive Domain Registry (metadata only).
 */

export type ExecutiveDomainId =
  | "finance"
  | "supply-chain"
  | "manufacturing"
  | "sales"
  | "hr"
  | "projects"
  | "quality"
  | "strategy";

export type ExecutiveDomain = {
  readonly id: ExecutiveDomainId;
  readonly name: string;
  readonly description: string;
};

export const EXECUTIVE_DOMAINS: readonly ExecutiveDomain[] = Object.freeze([
  {
    id: "finance",
    name: "Finance",
    description: "Revenue, cost, and capital posture.",
  },
  {
    id: "supply-chain",
    name: "Supply Chain",
    description: "Inbound, inventory, and fulfillment flow.",
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    description: "Factory capacity and production throughput.",
  },
  {
    id: "sales",
    name: "Sales",
    description: "Customer demand and commercial performance.",
  },
  {
    id: "hr",
    name: "HR",
    description: "Workforce capacity and capability.",
  },
  {
    id: "projects",
    name: "Projects",
    description: "Initiatives and transformation programs.",
  },
  {
    id: "quality",
    name: "Quality",
    description: "Defect, reliability, and compliance signals.",
  },
  {
    id: "strategy",
    name: "Strategy",
    description: "Executive direction and decision framing.",
  },
]);

export function getDomain(id: ExecutiveDomainId): ExecutiveDomain | undefined {
  return EXECUTIVE_DOMAINS.find((d) => d.id === id);
}
