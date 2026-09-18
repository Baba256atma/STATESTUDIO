# NPA-T NMI:2 — Node model

`ManagementMapNode` is a management-position record, not an Object clone.

Fields:

- `nodeId` / `canonicalRef` (id, kind, authority, sourceRef)
- `kind` / `section`
- `title` (`null` when not annotated)
- `contextKind` (BCA kinds; UNKNOWN when HYBRID/UNKNOWN and no explicit annotation)
- `provenance`
- `knownStatus` (`null` unless canonically annotated)
- `relationshipIds` for existing map relationships only
- `analyticalRole` true only for `VARIABLE` nodes
- `copiesCanonicalEntity: false`

Titles and statuses are optional annotations on composition. They are never inferred from names or adjacent nodes.
