export interface NetworkInformation extends EventTarget {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
  type?: string;
}

export interface BatteryManager extends EventTarget {
  charging?: boolean;
  chargingTime?: number;
  dischargingTime?: number;
  level?: number;
}

export interface UserAgentBrandVersion {
  brand: string;
  version: string;
}

export interface UserAgentData {
  brands: UserAgentBrandVersion[];
  mobile: boolean;
  platform: string;
  getHighEntropyValues?: (hints: string[]) => Promise<UADataValues>;
}

export interface UADataValues {
  platform?: string;
  platformVersion?: string;
  architecture?: string;
  model?: string;
  uaFullVersion?: string;
  brands?: UserAgentBrandVersion[];
  fullVersionList?: UserAgentBrandVersion[];
  wow64?: boolean;
}

export interface GPU {
  requestAdapter?: (
    options?: GPURequestAdapterOptions,
  ) => Promise<GPUAdapter | null>;
}

export interface GPURequestAdapterOptions {
  powerPreference?: GPUPowerPreference;
  forceFallbackAdapter?: boolean;
}

export type GPUPowerPreference = "low-power" | "high-performance";

export interface GPUAdapter {
  info?: GPUAdapterInfo;
  features?: GPUSupportedFeatures;
  limits?: GPUSupportedLimits;
}

export interface GPUAdapterInfo {
  vendor?: string;
  architecture?: string;
  device?: string;
  description?: string;
}

export interface GPUSupportedFeatures extends ReadonlySet<string> {}

export interface GPUSupportedLimits extends Record<string, number> {}
