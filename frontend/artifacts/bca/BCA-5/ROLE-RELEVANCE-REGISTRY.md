# BCA:5 role-relevance registry

`MANAGER_ROLE_RELEVANCE_REGISTRY` in `managerRoleRelevanceRegistry.ts`.

Frozen, exact-title only. No permission, approval, or Decision-authority fields.

## Families registered

| Family | Example exact titles | Responsibility areas (relevance) | Decision-context areas |
| --- | --- | --- | --- |
| OPERATIONS | operations manager, coo | Operations, Delivery, Capacity, Quality, Throughput | DELIVERY, CAPACITY, FULFILLMENT |
| FINANCE | cfo, finance manager | Cost, Margin, Budget, Financial Exposure | FINANCE, COST |
| EXECUTIVE | ceo, chief executive officer | Goal Impact, Strategic Consequence, Major Risk, Trade-Off | GOAL, RISK, TRADE_OFF |
| GENERAL_MANAGEMENT | general manager | Goal Alignment, Operations, Trade-Offs | GOAL, TRADE_OFF |
| PROJECT | project manager, project sponsor | Schedule, Milestones, Resources, Dependencies, Cost, Project Risks | SCHEDULE, COST, RESOURCE |
| SUPPLY_CHAIN | supply chain manager | Supplier, Lead Time, Inventory, Supply Risk | SUPPLY, PROCUREMENT |
| PROCUREMENT | procurement manager | Procurement, Supplier, Cost | PROCUREMENT |
| QUALITY | quality manager | Quality | QUALITY |

Unregistered families (`SALES`, `MARKETING`, `CUSTOMER_SERVICE`, `PEOPLE_HR`, `TECHNOLOGY`, `UNKNOWN`) remain valid on the contract without a relevance row.

## Ambiguous titles

`AMBIGUOUS_RAW_TITLES` includes `delivery manager`. Classification is not forced to OPERATIONS or PROJECT.

## Extensibility

Add a `definition({ family, exactTitles, ... })` row. Do not add substring rules. Do not add authorize/approve flags.
