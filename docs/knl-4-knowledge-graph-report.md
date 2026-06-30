# KNL-4 — Knowledge Graph

## Purpose

KNL-4 defines the **canonical metadata-only Knowledge Graph** for Nexora. It registers nodes, edges, types, and namespaces as declarative graph structure — without graph traversal, algorithms, path finding, or runtime intelligence.

KNL-4 consumes **KNL-1**, **KNL-2**, and **KNL-3** only. No certified files are modified.

## Graph philosophy

- **Structure, not traversal** — nodes and edges are metadata registrations
- **Canonical graph** — one shared graph vocabulary for all Nexora platforms
- **Ontology-aligned** — nodes may reference KNL-2 ontology entities
- **Vocabulary-linked** — nodes and edges may reference KNL-3 terms
- **Deterministic** — every registration is explainable and reproducible

## Architecture position

```
CORE
  ↓
KNL-1 Knowledge Foundation ✅
  ↓
KNL-2 Business Ontology ✅
  ↓
KNL-3 Business Vocabulary ✅
  ↓
KNL-4 Knowledge Graph ← this phase
  ↓
APP → LAY → INT → OPS (consumers only)
```

## Relationship with ontology and vocabulary

| Layer | Role in graph |
| --- | --- |
| KNL-2 Ontology | Entity and relationship type references on nodes/edges |
| KNL-3 Vocabulary | Optional term references for human-readable labels |
| KNL-4 Graph | Node/edge structure connecting ontology concepts |

References are validated at registration time. No graph traversal is performed.

## Node model

| Contract | Role |
| --- | --- |
| KnowledgeGraphNode | Registrable graph node |
| NodeIdentifier | Unique node ID |
| GraphNodeType | Node type classification |
| SourceNode / TargetNode | Edge endpoint references |
| GraphNamespace | Namespace boundary |
| GraphMetadata | Immutable metadata envelope |

### Node types (12)

`entity`, `concept`, `process`, `resource`, `event`, `decision`, `goal`, `kpi`, `risk`, `stakeholder`, `policy`, `extension`

## Edge model

| Contract | Role |
| --- | --- |
| KnowledgeGraphEdge | Registrable directed edge |
| EdgeIdentifier | Unique edge ID |
| GraphEdgeType | Edge type classification |
| RelationshipMetadata | Label, description, ontology/vocabulary links |

### Edge types (13)

`owns`, `depends_on`, `measures`, `affects`, `contains`, `produces`, `consumes`, `reports_to`, `belongs_to`, `supports`, `blocks`, `mitigates`, `references`

## Public API

- `registerKnowledgeNode()`
- `registerKnowledgeEdge()`
- `registerKnowledgeNodeType()`
- `getKnowledgeGraph()`
- `validateKnowledgeGraph()`
- `getKnowledgeGraphManifest()`

## Created files

| File | Role |
| --- | --- |
| `knowledgeGraphCatalog.ts` | Constants, governance, limits |
| `knowledgeGraphTypes.ts` | Immutable graph contracts |
| `knowledgeGraphContracts.ts` | Manifest, examples, validation |
| `knowledgeGraphRegistry.ts` | In-memory metadata registry |
| `knowledgeGraphValidation.ts` | Lightweight validation gates |
| `knowledgeGraph.ts` | Public facade |
| `knowledgeGraph.test.ts` | Certification tests |
| `docs/knl-4-knowledge-graph-report.md` | This report |

## Dependency model

- **KNL/1 required** — foundation via vocabulary init chain
- **KNL/2 required** — ontology entity reference validation
- **KNL/3 required** — vocabulary term reference validation
- **Version:** KNL/4
- **Namespace:** `knowledge-graph-core`

## Governance rules

1. Node identifiers must be unique
2. Edge identifiers must be unique
3. Edge source and target must reference registered nodes
4. KNL/1, KNL/2, and KNL/3 are mandatory prerequisites

## Extension strategy

Future KNL phases extend graph via reserved extension points. KNL-4 contracts are extend-only.

## Future roadmap

| Phase | Focus |
| --- | --- |
| KNL-5 | Industry Models |
| KNL-6+ | Retrieval, Policy, Framework Library, Best Practices |

## Architectural boundaries

**Implemented:** node/edge contracts, registry, validation, catalog seeding, manifest

**Not implemented:** graph traversal, algorithms, shortest path, semantic search, embeddings, retrieval, ML, LLM, AI, APP/LAY/INT/OPS integration, persistence, cache, external APIs

## Architectural decisions

1. **Registry owns lifecycle** — initialization chains through KNL-3 → KNL-2 → KNL-1
2. **Edge validation uses registered node IDs** — no traversal, only existence checks
3. **Auto-init on validate** — `validateKnowledgeGraph()` seeds catalog when needed
4. **No path finding** — graph structure is metadata-only by design
