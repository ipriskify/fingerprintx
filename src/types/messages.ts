// Base dimensions interface
export interface BaseDimensionsMessage {
  width?: number;
  height?: number;
}

export interface DimensionsMessage extends BaseDimensionsMessage {
  width: number;
  height: number;
}

export interface FloatArrayMessage {
  values: number[];
}

export interface TouchCapabilityDetailsMessage {
  maxTouchPoints: number;
  touchEvent: boolean;
  touchStart: boolean;
  maxPoints?: number;
  touchApiSupported?: boolean;
  touchEventSupported?: boolean;
}

export interface PluginEntryMessage {
  name: string;
  filename: string;
  description: string;
}

export interface EMEIdentifierReport {
  identifier: string;
  clearKeyLicenseUrl: string;
  supportedSchemes?: string[];
}

export interface EMEKeySystemReport {
  keySystem: string;
  identifier: EMEIdentifierReport | null;
  identifierReports?: { [key: string]: EMEIdentifierReport };
}
