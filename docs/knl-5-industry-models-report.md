# KNL-5 — Industry Models

## Purpose

KNL-5 defines the **canonical metadata-only Industry Models Platform** for Nexora. It provides reusable industry templates describing business structures — without business logic, simulations, calculations, AI, or recommendations.

KNL-5 consumes **KNL-1** through **KNL-4** only. No certified files are modified.

## Platform philosophy

- **Templates, not logic** — industry models are declarative metadata structures
- **Reusable across platforms** — one canonical catalog for all Nexora consumers
- **Ontology-aligned** — models reference KNL-2 entities where applicable
- **Graph-ready** — optional links to KNL-4 nodes
- **Deterministic** — every registration is explainable and reproducible

## Architecture position

```
CORE
  ↓
KNL-1 → KNL-2 → KNL-3 → KNL-4 ✅
  ↓
KNL-5 Industry Models ← this phase
  ↓
APP → LAY → INT → OPS (consumers only)
```

## Model hierarchy

```
Industry Models Platform
├── Business Sectors (12 seeded)
├── Industry Models (one per sector)
├── Industry Templates (process + KPI per sector)
├── Industry Categories
├── Industry Capabilities
└── Industry Namespaces
```

## Template architecture

| Contract | Role |
| --- | --- |
| IndustryModel | Sector-level model registration |
| IndustryTemplate | Typed template (process, kpi, risk, resource, relationship, profile) |
| IndustryCategory | Category classification |
| BusinessSector | Sector metadata |
| IndustryProfile | Model profile contract |
| IndustryProcessTemplate | Process template contract |
| IndustryKpiTemplate | KPI template contract |
| IndustryRiskTemplate | Risk template contract |
| IndustryResourceTemplate | Resource template contract |
| IndustryRelationshipTemplate | Relationship template contract |
| IndustryMetadata | Immutable metadata envelope |
| IndustryManifest | Platform manifest |

## Seeded industries (12)

Manufacturing, Retail, Healthcare, Banking, Insurance, Logistics, Energy, Government, Education, Construction, Technology, Telecommunications

Each sector receives:
- One industry model
- One process template
- One KPI template

## Public API

- `registerIndustryModel()`
- `registerIndustryTemplate()`
- `registerIndustryCategory()`
- `getIndustryModels()`
- `validateIndustryModels()`
- `getIndustryModelsManifest()`

## Dependency strategy

- **KNL/1** — foundation
- **KNL/2** — ontology reference validation
- **KNL/3** — vocabulary reference validation
- **KNL/4** — graph node reference validation
- **Version:** KNL/5

## Governance rules

1. Industry model identifiers must be unique
2. Template identifiers must be unique
3. Category keys must be unique
4. KNL/1 through KNL/4 are mandatory prerequisites

## Extension strategy

Future KNL phases extend via reserved extension points. KNL-5 contracts are extend-only.

## Future roadmap

| Phase | Focus |
| --- | --- |
| KNL-6 | Framework Library |
| KNL-7+ | Retrieval, Policy, Best Practices |

## Architectural boundaries

**Implemented:** contracts, registry, validation, sector catalog seeding, manifest

**Not implemented:** business calculations, simulation, scenario execution, ML, LLM, AI, retrieval, graph traversal, APP/LAY/INT/OPS integration, persistence, cache, external APIs
