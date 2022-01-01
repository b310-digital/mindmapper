export interface IMmpClientColor {
  name: string;
  background: string;
  branch: string;
}

export interface IMmpClientCoordinates {
  x: number;
  y: number;
}

export interface IMmpClientFont {
  style: string;
  size: number;
  weight: string;
}

export interface IMmpClientMap {
  uuid: string;
  lastModified: Date;
  deleteAfterDays: number;
  deletedAt: Date;
  data: IMmpClientNode[];
}

export interface IMmpClientMapWithAdminId {
  map: IMmpClientMap;
  adminId: string;
}

export interface IMmpClientMapRequest {
  map: IMmpClientMap;
}

export interface IMmpClientNode {
  colors: IMmpClientColor;
  coordinates: IMmpClientCoordinates;
  font: IMmpClientFont;
  id: string;
  image: { src: string; size: number };
  k: number;
  locked: boolean;
  name: string;
  parent: string;
  isRoot: boolean;
}

export interface IMmpClientNodeRequest {
  mapId: string;
  node: IMmpClientNode;
  updatedProperty: string;
}

export interface IMmpClientJoinRequest {
  mapId: string;
  color: string;
}

export interface IMmpClientDeleteRequest {
  adminId: string;
}

export interface IMmpClientNodeSelectionRequest {
  mapId: string;
  nodeId: string;
  selected: boolean;
}

export interface IClientCache {
  [clientId: string]: string;
}
