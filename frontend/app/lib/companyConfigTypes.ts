export type ObjectTypeEntry = { label?: string; [key: string]: any };

export type ObjectInstanceEntry = { id: string; label: string; [key: string]: any };

export type LoopTemplate = Record<string, any>;

export type KpiDefinition = Record<string, any>;

export type CompanyConfigPayload = {
  company_id?: string;
  types?: Record<string, ObjectTypeEntry>;
  instances?: ObjectInstanceEntry[];
  loops?: { loop_templates?: LoopTemplate[] } | any;
  kpis?: { kpis?: KpiDefinition[] } | any;
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
