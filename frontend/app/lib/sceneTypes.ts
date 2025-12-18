export type SceneObject = {
  id: string;
  type:
    | "sphere"
    | "box"
    | "torus"
    | "cone"
    | "cylinder"
    | "icosahedron"
    | "points_cloud"
    | "line_path";
  transform: { pos: [number, number, number]; scale: [number, number, number] };
  material: {
    color: string;
    opacity: number;
    size?: number;
    emissive?: string;
    emissiveIntensity?: number;
  };
  tags?: string[];
  data?: any;
};

export type SceneJson = {
  meta: any;
  domain_model: any;
  state_vector: Record<string, number>;
  scene: {
    camera: { pos: [number, number, number]; lookAt: [number, number, number] };
    lights: any[];
    objects: SceneObject[];
    animations: { target: string; type: "pulse" | "wobble" | "spin"; intensity: number }[];
  };
};
