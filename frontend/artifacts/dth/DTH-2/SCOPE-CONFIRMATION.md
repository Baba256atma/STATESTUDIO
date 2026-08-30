# DTH:2 scope confirmation (certification pass)

Inspected 2026-08-28 before re-running gates.

## Confirmed

- Visual families `EXECUTIVE_OBJECT` | `ICONIC_OBJECT` are semantic (`nexoraDecisionTheatreVisualFamily.ts`), not CSS/color/size.
- Executive actors keep catalog IDs; Theatre does not duplicate the registry.
- Iconic IDs use `dth2-iconic:` and are rejected if they collide with catalog/visible Executive IDs.
- Projection requires a visible owner; invalid `relationshipId` is rejected; empty `sourceAuthority` is rejected; unregistered roles are rejected.
- Queue/collection/trail/topology IDs are not written by Theatre (`writes.queueMembership|navigationTrail|topology|canonicalObjects = false`).
- Canonical Risk `obj-risk` remains Executive; Capacity KPI is not replaced by a Capacity Iconic.
- Unknown/missing values cannot flatten to zero.
- Renderer satellites are smaller, attached, identity-only click; no DTH:3 magnitude/color/motion/distance/line semantics.
- DTH:3 reserved capabilities remain unsupported.

## Honest live gap (not hidden)

Live `/executive` has no authoritative Cost/Time/Evidence Iconic sources. Projection emits zero Iconics (`data-theatre-iconic-count="0"`). Positive Iconic rendering is proved by fixtures + `NexoraDecisionTheatreIconicSatellite` HTML, not by fabricated live values.

## Not DTH:2 / not started

NexoGraph visual grammar, War Room, Scene Intent/Script, Cards/Charts, NexoLens/Select/Compare/Time.
