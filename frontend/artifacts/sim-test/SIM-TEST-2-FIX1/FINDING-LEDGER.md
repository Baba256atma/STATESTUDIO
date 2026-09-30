# Six-finding ledger

The original dynamic finding IDs include their run IDs. Stable trace references below preserve the original six identities across deterministic reruns.

| Finding | Scenario / journey | Tick / turn | Observable condition | CSV / Gate / Data Reality | Original report | Reproducible |
| --- | --- | --- | --- | --- | --- | --- |
| S1-01 · `m:bc:requested_quantity` | Manufacturing / `ingestion-manager-investigation-manufacturing` | 21 / 4 | CRM `requested_quantity` AVAILABLE | CRM is outside Manufacturing's four-file contract; no CRM CSV or Gate attempt; ERP/Production/Inventory publications present | DATA_REALITY publication gap | Yes, original `fnv1a32:0dd20b11` |
| S1-02 · `m:ab:CAP_AV`, `m:ab:produced_quantity` | Logistics / `ingestion-parity-logistics` | 4 / 1 | Ground Truth has capacity; PRODUCTION is disabled | Logistics contract is ERP + Inventory; no Production CSV/Gate/Data Reality state | OPERATOR observation gap | Yes, original `fnv1a32:7c296aef` |
| S1-03 · `m:bc:requested_quantity` | Logistics / `ingestion-parity-logistics` | 4 / 1 | CRM `requested_quantity` AVAILABLE | CRM is outside Logistics's ERP + Inventory CSV contract; ERP committed | DATA_REALITY publication gap | Yes, original `fnv1a32:7c296aef` |
| S1-04 · `m:ab:produced_quantity`, `m:ab:actual_progress`, `m:ab:resource_usage` | Service / `ingestion-parity-service` | 4 / 1 | Ground Truth contains demand/project-capacity variables; PRODUCTION/PMO/PROJECT_CONTROL are disabled | Service contract is CRM + HR; no Production/Project CSV/Gate/Data Reality state | OPERATOR observation gap | Yes, original `fnv1a32:dc5d17f5` |
| S1-05 · `m:bc:orders_received` | Service / `ingestion-parity-service` | 4 / 1 | ERP `orders_received` AVAILABLE | ERP is outside Service's CRM + HR CSV contract; CRM committed | DATA_REALITY publication gap | Yes, original `fnv1a32:dc5d17f5` |
| S1-06 · `m:causal:3` | Manufacturing / `ingestion-manager-investigation-manufacturing` | 21 / reported at turn 4 | Turn 3 said “candidate explanation,” “not a confirmed cause,” and “not enough evidence” | Legitimate RDI publications were visible; VAI causal safety remained unconfirmed | ADVISOR causal overclaim | Yes, original `fnv1a32:0dd20b11` |

## Final disposition table

| Finding | Original Owner | Root Cause | Final Owner | Classification | Action | Result |
| --- | --- | --- | --- | --- | --- | --- |
| S1-01 | DATA_REALITY | Observer treated an out-of-scope CRM record as publication-required | OBSERVER | `OBSERVER_CLASSIFICATION_ERROR` | Apply explicit publication-eligibility scope | `OBSERVER_CLASSIFICATION_CORRECTED` |
| S1-02 | OPERATOR | Observer evaluated disabled Production rules | OBSERVER | `OBSERVER_CLASSIFICATION_ERROR` | Apply enabled observation-policy fields | `OBSERVER_CLASSIFICATION_CORRECTED` |
| S1-03 | DATA_REALITY | Observer treated out-of-scope CRM as Logistics CSV scope | OBSERVER | `OBSERVER_CLASSIFICATION_ERROR` | Apply explicit publication-eligibility scope | `OBSERVER_CLASSIFICATION_CORRECTED` |
| S1-04 | OPERATOR | Observer evaluated disabled Production/Project rules | OBSERVER | `OBSERVER_CLASSIFICATION_ERROR` | Apply enabled observation-policy fields | `OBSERVER_CLASSIFICATION_CORRECTED` |
| S1-05 | DATA_REALITY | Observer treated out-of-scope ERP as Service CSV scope | OBSERVER | `OBSERVER_CLASSIFICATION_ERROR` | Apply explicit publication-eligibility scope | `OBSERVER_CLASSIFICATION_CORRECTED` |
| S1-06 | ADVISOR | Phrase matcher ignored explicit negation around “confirmed cause” | OBSERVER | `OBSERVER_CLASSIFICATION_ERROR` | Recognize causal negation/insufficient-evidence phrases | `OBSERVER_CLASSIFICATION_CORRECTED` |
