# KNL-6 — Framework Library

## Purpose

KNL-6 defines the **canonical metadata-only Framework Library Platform** for Nexora. It catalogs well-known business frameworks as descriptive templates — without execution, scoring, evaluation, AI, or recommendations.

KNL-6 consumes **KNL-1** through **KNL-5** only. No certified files are modified.

## Framework philosophy

- **Descriptive, not executable** — frameworks are metadata templates, not engines
- **Executive vocabulary** — standard business frameworks shared across Nexora
- **Cross-layer references** — optional links to ontology, vocabulary, and industry models
- **Deterministic** — every registration is explainable and reproducible

## Architecture position

```
CORE → KNL-1 → KNL-2 → KNL-3 → KNL-4 → KNL-5 ✅ → KNL-6 Framework Library → APP → LAY → INT → OPS
```

## Library hierarchy

```
Framework Library Platform
├── Framework Categories (6)
├── Frameworks (15 seeded)
├── Framework Templates (one per framework)
├── Framework Components (core per framework)
├── Framework Capabilities
└── Framework Namespaces
```

## Framework catalog (15 seeded)

| Framework | Category |
| --- | --- |
| SWOT Analysis | strategic_analysis |
| PESTEL Analysis | strategic_analysis |
| Porter's Five Forces | strategic_analysis |
| Business Model Canvas | strategic_analysis |
| Balanced Scorecard | performance_management |
| OKR | goal_setting |
| KPI Framework | performance_management |
| Value Chain Analysis | operational_excellence |
| McKinsey 7S Framework | organizational_design |
| BCG Matrix | strategic_analysis |
| Ansoff Matrix | strategic_analysis |
| VRIO Framework | strategic_analysis |
| RACI Matrix | organizational_design |
| SMART Goals | goal_setting |
| PDCA | operational_excellence |

## Contracts

Framework, FrameworkCategory, FrameworkTemplate, FrameworkDimension, FrameworkComponent, FrameworkStep, FrameworkPhase, FrameworkInput, FrameworkOutput, FrameworkKpi, FrameworkRisk, FrameworkCapability, FrameworkMetadata, FrameworkNamespace, FrameworkManifest, FrameworkExtensionPoint

## Public API

- `registerFramework()`
- `registerFrameworkTemplate()`
- `registerFrameworkCategory()`
- `getFrameworkLibrary()`
- `validateFrameworkLibrary()`
- `getFrameworkLibraryManifest()`

## Dependency model

- **KNL/1** — foundation
- **KNL/2** — ontology reference validation
- **KNL/3** — vocabulary reference validation
- **KNL/4** — graph initialization chain
- **KNL/5** — industry model reference validation
- **Version:** KNL/6

## Governance rules

1. Framework identifiers must be unique
2. Framework canonical names must be unique
3. Category keys must be unique
4. KNL/1 through KNL/5 are mandatory prerequisites

## Extension strategy

Future KNL phases extend via reserved extension points. KNL-6 contracts are extend-only.

## Future roadmap

| Phase | Focus |
| --- | --- |
| KNL-7 | Policy & Rule Base |
| KNL-8+ | Retrieval, Best Practices, Platform Certification |

## Architectural boundaries

**Implemented:** contracts, registry, validation, 15-framework catalog seeding, manifest

**Not implemented:** framework execution, scoring, recommendations, decision engines, ML, LLM, AI, retrieval, graph traversal, APP/LAY/INT/OPS integration, persistence, cache, external APIs
