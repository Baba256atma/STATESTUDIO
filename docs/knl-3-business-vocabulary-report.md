# KNL-3 — Business Vocabulary

## Purpose

KNL-3 defines the **canonical metadata-only business vocabulary** for Nexora — the standardized language all future platforms must use. This phase defines terms and their metadata only. It is not a dictionary engine, NLP system, translation engine, or semantic search platform.

KNL-3 consumes **KNL-1** and **KNL-2** only. No certified files are modified.

## Vocabulary philosophy

- **Canonical language** — one shared vocabulary for all Nexora platforms
- **Structure, not linguistics** — terms, aliases, and acronyms are declarative metadata
- **Ontology-aligned** — terms may reference KNL-2 ontology entities and relationships
- **Deterministic** — every registration is explainable and reproducible
- **Governance-first** — unique canonical names, unique aliases, validated ontology references

## Architecture position

```
CORE
  ↓
KNL-1 Knowledge Foundation ✅
  ↓
KNL-2 Business Ontology ✅
  ↓
KNL-3 Business Vocabulary ← this phase
  ↓
APP → LAY → INT → OPS (consumers only)
```

## Relationship with ontology

| KNL-2 (Ontology) | KNL-3 (Vocabulary) |
| --- | --- |
| Defines business concept structure | Defines human-readable terms for concepts |
| Entity and relationship types | Canonical names, labels, aliases, acronyms |
| Structural registry | Linguistic metadata registry |

Vocabulary terms may include `ontologyReference` and `relationshipReference` pointing to registered KNL-2 entities. References are validated at registration time — no graph traversal.

## Vocabulary contracts

| Contract | Role |
| --- | --- |
| VocabularyTerm | Primary registrable term |
| CanonicalName | Normalized snake_case identifier |
| DisplayName | Human-readable display value |
| PreferredLabel | Preferred UI label |
| VocabularyAlias | Alternative term label |
| VocabularyAcronym | Abbreviation with expanded form |
| BusinessDefinition | Formal business definition |
| VocabularyDescription | Descriptive metadata |
| VocabularyCategory | Term category classification |
| VocabularyDomain | Business domain scope |
| EntityReference | Optional entity link |
| OntologyReference | Link to KNL-2 ontology entity |
| RelationshipReference | Link to KNL-2 relationship |
| VocabularyTag | Tag metadata |
| VocabularyMetadata | Immutable metadata envelope |
| VocabularyLanguage | Supported language declaration |
| VocabularySource | Term provenance source |
| VocabularyExtensionPoint | Reserved future hook |

## Naming conventions

- **Canonical names:** lowercase snake_case (`strategic_goal`, `revenue_kpi`)
- **Display names:** Title Case human-readable labels
- **Aliases:** case-insensitive uniqueness enforced
- **Acronyms:** uppercase normalized (`SG`, `KPI`)
- **Language codes:** ISO-style (`en`, `en-US`, `nb`, `nb-NO`)

## Public API

- `registerBusinessTerm()`
- `registerBusinessAlias()`
- `registerBusinessAcronym()`
- `getBusinessVocabulary()`
- `validateBusinessVocabulary()`
- `getBusinessVocabularyManifest()`

## Created files

| File | Role |
| --- | --- |
| `businessVocabularyCatalog.ts` | Constants, governance, limits |
| `businessVocabularyTypes.ts` | Immutable vocabulary contracts |
| `businessVocabularyContracts.ts` | Manifest, examples, validation |
| `businessVocabularyRegistry.ts` | In-memory metadata registry |
| `businessVocabularyValidation.ts` | Lightweight validation gates |
| `businessVocabulary.ts` | Public facade |
| `businessVocabulary.test.ts` | Certification tests |
| `docs/knl-3-business-vocabulary-report.md` | This report |

## Dependency model

- **KNL/1 required** — foundation initialized via `initializeBusinessOntology`
- **KNL/2 required** — ontology initialized before vocabulary seeding
- **Version:** KNL/3
- **Namespace:** `knowledge-business-vocabulary`

## Governance rules

1. Canonical names must be unique (case-insensitive)
2. Aliases must be unique within vocabulary
3. Ontology references must resolve to registered KNL-2 entities
4. KNL/1 and KNL/2 are mandatory prerequisites

## Extension strategy

Future KNL phases extend vocabulary via reserved extension points. KNL-3 contracts are extend-only. Breaking changes require a new KNL phase.

## Future roadmap

| Phase | Focus |
| --- | --- |
| KNL-4 | Knowledge Graph |
| KNL-5+ | Retrieval, Policy, Framework Library, Industry Models |

## Architectural boundaries

**Implemented:** contracts, registry, validation, catalog seeding, ontology reference validation, manifest

**Not implemented:** translation, NLP, semantic search, embeddings, retrieval, knowledge graph, ML, LLM, AI, APP/LAY/INT/OPS integration, persistence, cache, external APIs
