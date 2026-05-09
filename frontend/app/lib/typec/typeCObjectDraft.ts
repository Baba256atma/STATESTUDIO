export type TypeCObjectDraft = {
  id?: string;
  label: string;
  role?: string;
  prompt?: string;
};

export function buildTypeCObjectDraft(input: {
  label: string;
  role?: string;
  prompt?: string;
}): TypeCObjectDraft {
  return {
    label: String(input.label ?? "").trim(),
    role: input.role?.trim(),
    prompt: input.prompt?.slice(0, 240),
  };
}
