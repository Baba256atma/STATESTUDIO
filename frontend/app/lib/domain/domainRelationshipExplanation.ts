import { normalizeDomainId } from "./domainHelpers.ts";
import type { DomainRelationshipMeta } from "./domainRelationshipTypes.ts";

function cleanLabel(value: unknown, fallback: string): string {
  const label = String(value ?? "").replace(/[_-]+/g, " ").trim();
  return label.length > 0 ? label : fallback;
}

export function explainDomainRelationship(params: {
  sourceLabel?: unknown;
  targetLabel?: unknown;
  meta: DomainRelationshipMeta;
  domainId?: unknown;
}): string {
  const source = cleanLabel(params.sourceLabel, "Source object");
  const target = cleanLabel(params.targetLabel, "Target object");
  const domainId = normalizeDomainId(params.domainId);

  switch (params.meta.semantic) {
    case "dependency":
      return `${target} depends on ${source} stability.`;
    case "flow":
      return `${source} feeds operational flow into ${target}.`;
    case "risk":
      return `${source} can increase risk exposure around ${target}.`;
    case "ownership":
      return `${source} owns accountability for ${target}.`;
    case "communication":
      return `${source} communicates operating context to ${target}.`;
    case "financial":
      return domainId === "finance"
        ? `${target} is financially exposed to movement in ${source}.`
        : `${source} creates financial exposure for ${target}.`;
    case "control":
      return `${source} provides a control path for ${target}.`;
    case "support":
      return `${source} supports ${target} resilience.`;
    case "monitoring":
      return `${source} monitors ${target} conditions for executive awareness.`;
  }
}
