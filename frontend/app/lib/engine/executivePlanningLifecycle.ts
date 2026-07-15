const stage = (id: string, name: string, description: string, order: number) => Object.freeze({
  id,
  name,
  description,
  order,
  status: "Defined",
  metadataOnly: true,
  immutable: true,
} as const);

export const ExecutivePlanningLifecycle = Object.freeze([
  stage(
    "eng-5-lifecycle-created",
    "Created",
    "Planning artifact identity is architecturally declared.",
    1,
  ),
  stage(
    "eng-5-lifecycle-validated",
    "Validated",
    "Planning metadata satisfies declared validation requirements without runtime validation engines.",
    2,
  ),
  stage(
    "eng-5-lifecycle-prepared",
    "Prepared",
    "Validated planning metadata is prepared for freeze eligibility.",
    3,
  ),
  stage(
    "eng-5-lifecycle-frozen",
    "Frozen",
    "Prepared planning metadata is frozen as an immutable architectural surface.",
    4,
  ),
  stage(
    "eng-5-lifecycle-released",
    "Released",
    "Frozen planning metadata is eligible for public architectural release.",
    5,
  ),
] as const);
