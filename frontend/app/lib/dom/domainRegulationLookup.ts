import type { DomainId } from "./domainFoundationIndex.ts";
import type {
  DomainControlId,
  DomainEvidenceId,
  DomainObligationId,
  DomainRegulationId,
  DomainRegulationRegistry,
  RegisteredDomainRegulationPackage,
} from "./domainRegulationIndex.ts";
import type {
  DomainControlLookupResult,
  DomainEvidenceLookupResult,
  DomainObligationLookupResult,
  DomainRegulationLookupResult,
} from "./domainRegulationQueryTypes.ts";

function regulationLookupResult(
  regulationPackage: RegisteredDomainRegulationPackage | null,
  regulation: DomainRegulationLookupResult["regulation"]
): DomainRegulationLookupResult {
  return Object.freeze({ found: Boolean(regulationPackage && regulation), regulationPackage, regulation });
}

function obligationLookupResult(
  regulationPackage: RegisteredDomainRegulationPackage | null,
  obligation: DomainObligationLookupResult["obligation"]
): DomainObligationLookupResult {
  return Object.freeze({ found: Boolean(regulationPackage && obligation), regulationPackage, obligation });
}

function controlLookupResult(
  regulationPackage: RegisteredDomainRegulationPackage | null,
  control: DomainControlLookupResult["control"]
): DomainControlLookupResult {
  return Object.freeze({ found: Boolean(regulationPackage && control), regulationPackage, control });
}

function evidenceLookupResult(
  regulationPackage: RegisteredDomainRegulationPackage | null,
  evidence: DomainEvidenceLookupResult["evidence"]
): DomainEvidenceLookupResult {
  return Object.freeze({ found: Boolean(regulationPackage && evidence), regulationPackage, evidence });
}

export function findDomainRegulation(
  registry: DomainRegulationRegistry,
  regulationId: DomainRegulationId
): DomainRegulationLookupResult {
  for (const regulationPackage of registry.packages) {
    const regulation =
      regulationPackage.package.regulations.find((entry) => entry.regulationId === regulationId) ?? null;
    if (regulation) return regulationLookupResult(regulationPackage, regulation);
  }
  return regulationLookupResult(null, null);
}

export function findDomainObligation(
  registry: DomainRegulationRegistry,
  obligationId: DomainObligationId
): DomainObligationLookupResult {
  for (const regulationPackage of registry.packages) {
    const obligation =
      regulationPackage.package.obligations.find((entry) => entry.obligationId === obligationId) ?? null;
    if (obligation) return obligationLookupResult(regulationPackage, obligation);
  }
  return obligationLookupResult(null, null);
}

export function findDomainControl(
  registry: DomainRegulationRegistry,
  controlId: DomainControlId
): DomainControlLookupResult {
  for (const regulationPackage of registry.packages) {
    const control = regulationPackage.package.controls.find((entry) => entry.controlId === controlId) ?? null;
    if (control) return controlLookupResult(regulationPackage, control);
  }
  return controlLookupResult(null, null);
}

export function findDomainEvidence(
  registry: DomainRegulationRegistry,
  evidenceId: DomainEvidenceId
): DomainEvidenceLookupResult {
  for (const regulationPackage of registry.packages) {
    const evidence = regulationPackage.package.evidence.find((entry) => entry.evidenceId === evidenceId) ?? null;
    if (evidence) return evidenceLookupResult(regulationPackage, evidence);
  }
  return evidenceLookupResult(null, null);
}

export function findRegulationsByDomain(
  registry: DomainRegulationRegistry,
  domainId: DomainId
): readonly DomainRegulationLookupResult[] {
  const results: DomainRegulationLookupResult[] = [];
  for (const regulationPackage of registry.packages) {
    if (regulationPackage.package.domainId !== domainId) continue;
    for (const regulation of regulationPackage.package.regulations) {
      results.push(regulationLookupResult(regulationPackage, regulation));
    }
  }
  return Object.freeze(results);
}

export function findObligationsByRegulation(
  registry: DomainRegulationRegistry,
  regulationId: DomainRegulationId
): readonly DomainObligationLookupResult[] {
  const results: DomainObligationLookupResult[] = [];
  for (const regulationPackage of registry.packages) {
    for (const obligation of regulationPackage.package.obligations) {
      if (obligation.regulationId === regulationId) results.push(obligationLookupResult(regulationPackage, obligation));
    }
  }
  return Object.freeze(results);
}

export function findControlsByObligation(
  registry: DomainRegulationRegistry,
  obligationId: DomainObligationId
): readonly DomainControlLookupResult[] {
  const obligation = findDomainObligation(registry, obligationId);
  if (!obligation.found || !obligation.regulationPackage || !obligation.obligation) return Object.freeze([]);
  const controlIds = new Set(obligation.obligation.controlIds);
  return Object.freeze(
    obligation.regulationPackage.package.controls
      .filter((control) => controlIds.has(control.controlId))
      .map((control) => controlLookupResult(obligation.regulationPackage, control))
  );
}

export function findEvidenceByControl(
  registry: DomainRegulationRegistry,
  controlId: DomainControlId
): readonly DomainEvidenceLookupResult[] {
  const control = findDomainControl(registry, controlId);
  if (!control.found || !control.regulationPackage || !control.control) return Object.freeze([]);
  const evidenceIds = new Set(control.control.evidenceIds);
  return Object.freeze(
    control.regulationPackage.package.evidence
      .filter((evidence) => evidenceIds.has(evidence.evidenceId))
      .map((evidence) => evidenceLookupResult(control.regulationPackage, evidence))
  );
}
