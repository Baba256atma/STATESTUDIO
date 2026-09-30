# Root-cause analysis

## Earliest divergence A — observation expectation scope

Actual scenario contracts correctly disable irrelevant source families. Logistics enables ERP, Inventory, and CRM—not Production. Service enables CRM, HR, and ERP—not Production, PMO, or Project Control.

The Operator correctly applied `observationPolicyForSources(enabledSources)`. The Observer did not: it iterated the full default policy and classified missing records from disabled sources as Operator defects. The first divergent authority was RMS Observer measurement.

## Earliest divergence B — publication eligibility scope

The SIM-TEST:2 CSV contract is intentionally narrower than each RMS scenario's observable source set:

- Manufacturing: ERP, Production, Inventory, Maintenance; not CRM.
- Logistics: ERP, Inventory; not CRM.
- Service: CRM, HR; not ERP.

The CSV projection, Gate, and Data Reality behaved correctly. The Observer compared every AVAILABLE numeric observation with published metric keys, even when that observation's source was outside the journey's CSV contract. The first divergence was again Observer expectation construction, before Data Reality.

## Earliest divergence C — causal negation

The actual turn stated:

> Revenue is a candidate explanation for Margin Pressure, not a confirmed cause. … There is not enough evidence to treat this as a confirmed cause.

This is consistent with VAI's `UNCONFIRMED`/`INSUFFICIENT` safety boundary. The Observer checked uncertainty phrases first, but its list did not include “not a confirmed cause”; its later affirmative regex then matched the nested phrase “confirmed cause.” Advisor and VAI were correct. The Observer phrase classifier was the first divergence.

No evidence supported changing Operator publication rights, RDI:2, RDI:1, Data Reality, Advisor, VAI, MLEVEL, Stage, or the CSV schemas.
