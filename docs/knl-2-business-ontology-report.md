# KNL-2 — Business Ontology

## Purpose

KNL-2 defines the **canonical metadata-only business ontology** for Nexora. It describes business concepts and their structural relationships without AI, reasoning, graph traversal, retrieval, or runtime intelligence.

KNL-2 consumes **KNL-1 only** and does not modify any certified KNL-1 files.

## Ontology philosophy

- **Structure, not intelligence** — definitions and relationships are declarative metadata
- **Canonical vocabulary** — one shared ontology for all future Nexora platforms
- **Deterministic** — every registration is explainable and reproducible
- **Consumer-only downstream** — APP, LAY, INT, and OPS consume ontology; they do not own it
- **Extend-only** — future KNL phases extend contracts without breaking KNL-2

## Architecture position

```
CORE
  ↓
KNL-1 Knowledge Foundation ✅
  ↓
KNL-2 Business Ontology ← this phase
  ↓
APP → LAY → INT → OPS (consumers only)
```

## Entity model

Twenty-one contract types define the ontology vocabulary:

| Contract | Role |
| --- | --- |
| BusinessDomain | Top-level business domain boundary |
| BusinessEntity | Registrable canonical entity (typed) |
| BusinessObject | Object attached to an entity |
| BusinessProcess | Process definition |
| BusinessFunction | Function definition |
| BusinessCapability | Ontology capability declaration |
| BusinessGoal | Strategic goal |
| BusinessKpi | Performance indicator |
| BusinessRisk | Risk definition |
| BusinessResource | Resource definition |
| BusinessStakeholder | Stakeholder definition |
| BusinessPolicy | Policy definition |
| BusinessRule | Rule definition |
| BusinessEvent | Event definition |
| BusinessScenario | Scenario definition |
| BusinessDecision | Decision definition |
| BusinessRelationship | Typed relationship between entities |
| BusinessDependency | Dependency between entities |
| BusinessConstraint | Constraint definition |
| BusinessOpportunity | Opportunity definition |
| BusinessMetadata | Metadata envelope |

### Entity types (19)

`domain`, `entity`, `object`, `process`, `function`, `capability`, `goal`, `kpi`, `risk`, `resource`, `stakeholder`, `policy`, `rule`, `event`, `scenario`, `decision`, `dependency`, `constraint`, `opportunity`

### Categories (6)

`structural`, `operational`, `governance`, `performance`, `risk_compliance`, `strategy`

## Relationship model

Twelve canonical relationship types are defined (metadata only, no execution engine):

| Type | Label |
| --- | --- |
| `owns` | Owns |
| `depends_on` | Depends On |
| `measures` | Measures |
| `affects` | Affects |
| `contains` | Contains |
| `produces` | Produces |
| `consumes` | Consumes |
| `reports_to` | Reports To |
| `belongs_to` | Belongs To |
| `supports` | Supports |
| `blocks` | Blocks |
| `mitigates` | Mitigates |

Relationships are registered via `registerBusinessRelationship()` with source/target entity IDs and a relationship type. No graph traversal is performed.

## Public API

- `registerBusinessEntity()`
- `registerBusinessRelationship()`
- `registerBusinessCapability()`
- `getBusinessOntology()`
- `validateBusinessOntology()`
- `getBusinessOntologyManifest()`

## Created files

| File | Role |
| --- | --- |
| `businessOntologyCatalog.ts` | Constants, relationship types, principles, limits |
| `businessOntologyTypes.ts` | Immutable ontology contracts |
| `businessOntologyContracts.ts` | Manifest, examples, validation |
| `businessOntologyRegistry.ts` | In-memory metadata registry |
| `businessOntologyValidation.ts` | Lightweight validation gates |
| `businessOntology.ts` | Public facade |
| `businessOntology.test.ts` | Certification tests |
| `docs/knl-2-business-ontology-report.md` | This report |

## Dependency strategy

- **Required:** KNL/1 (`buildKnowledgeFoundation` on init)
- **Forbidden:** Direct modification of APP, LAY, INT, OPS, or KNL-1 files
- **Version:** KNL/2 with foundation dependency `KNL/1`

## Extension strategy

Future phases register against KNL-2 contracts:

| Phase | Focus |
| --- | --- |
| KNL-3 | Business Vocabulary |
| KNL-4+ | Knowledge Graph, Retrieval, Policy, Framework Library |

KNL-2 contracts are extend-only. Breaking changes require a new KNL phase with explicit migration.

## Architectural boundaries

**Implemented:** contracts, registry, validation, catalog seeding, manifest

**Not implemented:** knowledge graph, graph traversal, semantic search, embeddings, retrieval, ML, LLM, AI, learning, reasoning, APP/LAY/INT/OPS integration, persistence, cache, external APIs

## Architectural decisions

1. **Registry owns lifecycle** — initialization and KNL/1 dependency live in registry to avoid circular imports
2. **Relationship types as seeded entities** — canonical types registered as structural entities for integrity checks
3. **Duplicate name prevention** — entity names are unique within the registry (case-insensitive)
4. **Auto-init on validate** — `validateBusinessOntology()` initializes foundation and catalog when needed
