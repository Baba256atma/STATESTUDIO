export type FragilityZoneType =
  | "isolated"
  | "clustered"
  | "amplifying"
  | "systemic"
  | "critical_corridor";

export interface EnterpriseFragilityZone {
  id: string;
  title: string;
  summary: string;
  zoneType: FragilityZoneType;
  relatedObjectIds: string[];
  relatedEdgeIds?: string[];
  propagationIntensity: number;
  fragilityScore: number;
  systemicReach?: number;
  confidence?: number;
  executiveImpact?: string;
  domainIds?: string[];
  createdAt: number;
}

export type FragilityCorridor = {
  id: string;
  objectPath: string[];
  relatedEdgeIds: string[];
  propagationIntensity: number;
  fragilityScore: number;
  domainIds: string[];
};

export type EnterpriseFragilityMapOverlayState = {
  topZoneId?: string;
  headline: string;
  executiveSummary: string;
  zoneType: FragilityZoneType;
  relatedObjectIds: string[];
  systemicReach: number;
};
