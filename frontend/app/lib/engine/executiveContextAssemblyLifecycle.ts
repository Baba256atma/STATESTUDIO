const stage = (id: string, name: string, description: string, order: number) => Object.freeze({
  id, name, description, order, status: "Defined", metadataOnly: true, immutable: true,
} as const);

export const ExecutiveContextAssemblyLifecycle = Object.freeze([
  stage("eng-4-lifecycle-defined", "Defined", "Context assembly artifact identity is architecturally declared.", 1),
  stage("eng-4-lifecycle-discovered", "Discovered", "Eligible context participants are identified at the metadata level.", 2),
  stage("eng-4-lifecycle-collected", "Collected", "Approved context references are collected as declarative metadata.", 3),
  stage("eng-4-lifecycle-normalized", "Normalized", "Collected context references are normalized into canonical vocabulary.", 4),
  stage("eng-4-lifecycle-assembled", "Assembled", "Normalized references are described as an assembled context structure.", 5),
  stage("eng-4-lifecycle-validated", "Validated", "Assembled context metadata satisfies declared validation requirements.", 6),
  stage("eng-4-lifecycle-published", "Published", "Validated context metadata is eligible for public architectural publication.", 7),
  stage("eng-4-lifecycle-archived", "Archived", "Published context metadata is retained as an immutable historical record.", 8),
] as const);
