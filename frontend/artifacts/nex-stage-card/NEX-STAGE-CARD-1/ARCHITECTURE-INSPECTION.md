# NEX-STAGE-CARD:1 — Architecture inspection

Inspection date: 2026-09-06.

## 1. Exact bad NEXORA card transcript

```
NEXORA
Close
NEXORA is a object.
Current state: stable.
Organizes the current scene.
Nexora does not yet have enough evidence to determine this.
No supported relationships are shown for this object.
Nexora does not yet have enough evidence to determine this.
```

## 2. Click → composer chain

1. `ExecutiveObjectGeometryRenderer` / HTML `nexora-stage-object-control-${id}` `onClick`
2. `NexoraExecutiveShell.onSelectSubject`
3. `selectNexoraMVPInteractionSubject` (generic Stage selection)
4. `projectNexoraDecisionTheatreFoundation` (`nexoraDecisionTheatreStageCompatibility.ts`)
5. `mapObject` → `resolveCanonicalExecutiveObjectType` → `"object"`; `lifecycleStatus` from catalog `status`
6. Scene script `pushActor(..., "ANCHOR", "Organizes the current scene.")`
7. `projectNexoraDecisionTheatreObjectInvestigation` (DTH:6)
8. `NexoraDecisionTheatreInvestigationSurface`

Stage click remains generic. Role is resolved only in the investigation composer.

## 3. Source of `stable`

Entrance education catalog in `nexoraEntranceExperience.ts`: fixture `status: "stable"` on the educational product actor.

`mapObject` copied that into `lifecycleStatus`.

DTH:6 glance: `` `Current state: ${currentState}.` ``

Catalog metadata was treated as manager-facing business current state.

`stable` remains legitimate catalog/status metadata. It is no longer projected as NEXORA business Current state (`statusSource: not-applicable`).

## 4. Generic evidence fallback

`nexoraDecisionTheatreObjectInvestigationComposer.ts`: when `hasEvidence` is false, both `uncertainty` and `advisorReadable.evidence` used:

`Nexora does not yet have enough evidence to determine this.`

Glance/understand/investigate therefore repeated the same UNKNOWN copy for inapplicable evidence.

## 5. Generic relationship fallback

Same composer: `advisorReadable.related` when `relationships.length === 0`:

`No supported relationships are shown for this object.`

## 6. Role metadata available before the fix

- Visual family: DTH:2 `EXECUTIVE_OBJECT | ICONIC_OBJECT | DATA_OBJECT`
- Canonical type: `resolveCanonicalExecutiveObjectType` (NEXORA → `"object"`)
- Educational ENT:3 prefix `obj-nex-ent3-` / `isNexoraEducationalObjectId`
- Entrance catalog identity (no `catalogProvenance` field yet)
- Scene actor role `ANCHOR`
- FIX3 `resolveExecutiveExperienceContext`

Educational catalog provenance was discarded: DTH:6 always composed a business-object investigation.

## 7. Where semantic role was lost

After Stage selection, DTH:6 normalized every selected executive mesh into `visualFamily: EXECUTIVE_OBJECT` investigation content (status, evidence UNKNOWN, empty relationships). Educational actor metadata never reached section applicability.

## 8. Authority matrix

| Concern | Authority |
| --- | --- |
| Entity identity | Stage/catalog id |
| Business object family | canonical object type / MO |
| Educational identity | NEX-ENT catalog `catalogProvenance` + ENT:3 prefix |
| Data object family | DTH:2 `DATA_OBJECT` / `data-source:` |
| Iconic role | DTH:2/3 iconic prefix and registry |
| Experience context | FIX3 `resolveExecutiveExperienceContext` |
| Presentation role | `resolveStageEntityPresentationRole` (read-only) |
| Business status | existing object/domain lifecycle |
| Evidence | EI / Data Reality / iconic sources |
| Relationships | MO / Theatre relationships |
| Card projection | DTH:6 composer + `NexoraDecisionTheatreInvestigationSurface` |
| Stage placement | Director/Stage |
| Advisor | existing Advisor/CONV |
| Decision writes | CC:10/10R |
| Execution writes | CC:11 |

## 9. Chosen role-resolution approach

Read-only `resolveStageEntityPresentationRole` from:

- DTH visual family
- catalog `catalogProvenance` (`entrance-education` | `object-education`)
- ENT:3 educational id prefix as object-education fallback

Not from label, DOM, CSS, or `obj-nexora-entrance` in the resolver.

## 10. Why no per-NEXORA patch

The composer asks the resolver for applicable sections. Any `entrance-education` catalog actor gets `EDUCATIONAL_ACTOR`. Tests prove a different id without that provenance stays `EXECUTIVE_OBJECT`.

## 11. UNKNOWN vs NOT_APPLICABLE

- `APPLICABLE` + missing evidence → existing UNKNOWN copy (executive Problem).
- `NOT_APPLICABLE` → section omitted; no UNKNOWN fallback.

Applicability is projection logic, not a persisted N/A store.

## 12. Duplicate taxonomy audit

Reused DTH:2 families, ENT catalog provenance, ENT:3 prefix. New enum is presentation-role only (`EXECUTIVE_OBJECT`, `DATA_OBJECT`, `EDUCATIONAL_ACTOR`, `ICONIC_ENTITY`) — not a second object ontology.

## 13. Duplicate card audit

One shell: `NexoraDecisionTheatreInvestigationSurface`. Data Objects remain on the existing DATA-UX inspection path. No `ObjectCardV2`.

## 14. Duplicate product knowledge audit

NEXORA identity/purpose reuse `NEXORA_GUIDED_ENTRANCE_WHAT_IS_COPY` and `CAPABILITY_INTRODUCTORY_COPY`. Role sentence labels existing ANCHOR `Organizes the current scene.` No second capability registry.

## 15. Safety

Card projection does not write Goal/Decision/Execution/Data/BCA. Close is `RETURN_TO_SCENE`. Selection ≠ priority. Relationship ≠ cause. Educational examples keep provenance copy and do not become manager Goal truth.
