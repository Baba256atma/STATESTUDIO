import type { KpiDefJson, LoopTemplateJson } from "./config/customerConfig";

export type ObjectTypeEntry = { label?: string } & Record<string, unknown>;

export type ObjectInstanceEntry = { id: string; label: string } & Record<string, unknown>;

export type LoopTemplate = LoopTemplateJson;

export type KpiDefinition = KpiDefJson;

export type CompanyConfigLoopsSection = {
  loop_templates?: LoopTemplate[];
};

export type CompanyConfigKpisSection = {
  kpis?: KpiDefinition[];
};

export type CompanyConfigPayload = {
  company_id?: string;
  types?: Record<string, ObjectTypeEntry>;
  instances?: ObjectInstanceEntry[];
  loops?: CompanyConfigLoopsSection | Record<string, unknown>;
  kpis?: CompanyConfigKpisSection | Record<string, unknown>;
  display?: { name?: string };
  theme?: {
    hud?: {
      bg?: string;
      border?: string;
      text?: string;
      accent?: string;
      panelBg?: string;
      mutedText?: string;
    };
  };
  scene_preset?: {
    backgroundMode?: "day" | "night" | "stars";
    starCount?: number;
    cameraMode?: "orbit" | "fixed";
    showAxes?: boolean;
    showGrid?: boolean;
    showCameraHelper?: boolean;
  };
};
