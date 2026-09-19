# DTH-EXP:2 — Architecture inspection

## Smallest extension point

Resolve an existing canonical Nexora Object into a Theatre Actor with a **contextual** visual role and scene attention. Reuse DTH-EXP:1 visual-role vocabulary. Describe visual-role transitions without animation.

Stop. Do not start DTH-EXP:3. Do not implement Nexo families, live `/executive` wiring, or Advisor scene control.

## Canonical Object identity (inspected, not replaced)

| Concern | Owner | How Stage/Theatre references it |
|---|---|---|
| Catalog ID | NEX-MVP:4 `objects[].id` / context subjects | `obj-*` identifiers |
| DTH executive actor | DTH:1 `visibleExecutiveObjects[].id` | Copied from Stage presentation |
| Scene script actor | DTH:5 `canonicalId` | Must match a visible executive |
| NMI node | NMI canonical ref | Distinct composer; not an Object registry |
| VAI variable | VAI:1 `variableId` | Analytical, not a Theatre actor |

Display labels are presentation. Identity is the canonical ID.

## Flow

Canonical Object (MO / NEX-MVP:4)
→ `resolveDthExpTheatreActor`
→ Theatre Actor (scene-scoped visual role + attention + referent)
→ optional `describeDthExpVisualRoleTransition` (flow-node → bubble, etc.)

DIR:1 remains the only presentation planner. NEX-MVP:3 remains the Stage host.

## Not created

Object registry, Stage store, scene store, `object.visualType` field, VAI role rewrite, Nexo scene families, animation, automatic layout, Advisor scene-control, DTH-EXP:3.
